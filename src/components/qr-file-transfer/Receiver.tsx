"use client";

// Receiver: camera → WASM QR decode in workers → fountain decoder → file.
// React port of decimen-optical-transfer v0.3.0 receive/main.ts (MIT License).
//
// Field lessons baked in (kept from the upstream implementation):
// - iOS treats `frameRate: {ideal: 60}` as a suggestion and delivers 30.
//   Demand `exact` first, fall back to `ideal`.
// - requestVideoFrameCallback chains survive a stopped stream and resume on
//   the next one — a generation counter prevents zombie capture loops.
// - Progress tracks frames COLLECTED: LT peeling back-loads its solve cascade.

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LTDecoder } from "@/lib/qr-transfer/fountain";
import {
  estimateTransferProgress,
  expectedFountainOverhead,
  formatDuration,
} from "@/lib/qr-transfer/progress";
import { DecodeWorkerPool, type PoolWorker } from "@/lib/qr-transfer/worker-pool";
import { NoSignalHintTimer } from "@/lib/qr-transfer/no-signal";
import { isSnippet, snippetText } from "@/lib/qr-transfer/snippet";
import {
  fnv1a,
  parseFrame,
  streamIdentity,
  unpackFile,
  verifyFile,
  type OpticalFile,
} from "@/lib/qr-transfer/protocol";
import { requestScreenWakeLock } from "@/lib/qr-transfer/wake-lock";
import {
  applyAdvancedConstraint,
  probeCameraCapabilities,
} from "@/lib/qr-transfer/platform";

const NO_SIGNAL_FIRST_MS = 8_000;
const NO_SIGNAL_DISMISSED_MS = 15_000;

// The decode worker cannot fetch "/zxing_reader.wasm" itself — Turbopack
// spawns it from a Blob/no-base context where relative URLs throw "Invalid
// URL". Fetch the bytes here (relative URLs work fine on the main thread),
// cache them, and hand each worker its own copy as Emscripten's wasmBinary.
let cachedWasm: ArrayBuffer | null = null;
let wasmPromise: Promise<ArrayBuffer> | null = null;
function ensureWasm(): Promise<ArrayBuffer> {
  if (cachedWasm) return Promise.resolve(cachedWasm);
  wasmPromise ??= fetch("/zxing_reader.wasm")
    .then((r) => r.arrayBuffer())
    .then((b) => {
      cachedWasm = b;
      return b;
    });
  return wasmPromise;
}

function createDecodeWorker(): PoolWorker {
  const worker = new Worker(new URL("./decoder.worker", import.meta.url));
  void ensureWasm().then((b) => {
    const copy = b.slice(0);
    worker.postMessage({ type: "init", wasm: copy }, [copy]);
  });
  return worker as unknown as PoolWorker;
}

type VideoRVFC = HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number };

interface ProgressState {
  percent: number;
  label: string;
  eta: string;
}

type CameraState = "idle" | "starting" | "live" | "done";

type ReceiveResult =
  | { kind: "file"; file: OpticalFile; summary: string; blobUrl: string }
  | { kind: "snippet"; text: string; summary: string };

export default function Receiver() {
  const t = useTranslations("tools.qr-file-transfer.receive");

  // ── UI state ──
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [status, setStatus] = useState<{ text: string; error: boolean }>(() => ({
    text: t("statusReady"),
    error: false,
  }));
  const [cameraInfo, setCameraInfo] = useState("");
  const [noSignalToast, setNoSignalToast] = useState(false);
  const [showNoSignalHelp, setShowNoSignalHelp] = useState(false);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [result, setResult] = useState<ReceiveResult | null>(null);
  const [failed, setFailed] = useState("");
  const [width, setWidth] = useState(1280);
  const [capFps, setCapFps] = useState(60);
  const [workers, setWorkers] = useState(2);
  const [copied, setCopied] = useState(false);

  // ── Imperative refs (read from decode callbacks, never cause re-renders) ──
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const decoderRef = useRef<LTDecoder | null>(null);
  const streamKeyRef = useRef("");
  const startTsRef = useRef(0);
  const captureGenRef = useRef(0);
  const doneRef = useRef(false);
  const frameIdRef = useRef(0);
  const grabRef = useRef<HTMLCanvasElement | null>(null);
  const statsTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const noSignalRef = useRef(new NoSignalHintTimer(NO_SIGNAL_FIRST_MS, NO_SIGNAL_DISMISSED_MS));
  const poolRef = useRef<DecodeWorkerPool | null>(null);
  const blobUrlRef = useRef("");

  /** Payload KB/s, discounting the frames the fountain spends on overhead. */
  const goodputKbs = useCallback((elapsed: number): number => {
    const decoder = decoderRef.current;
    if (!decoder) return 0;
    return (
      (decoder.framesNew * decoder.blockLen) /
      expectedFountainOverhead(decoder.k) /
      1024 /
      Math.max(0.1, elapsed)
    );
  }, []);

  const updateProgress = useCallback(() => {
    const decoder = decoderRef.current;
    if (!decoder) return;
    const elapsed = Math.max(0, (performance.now() - startTsRef.current) / 1000);
    const estimate = estimateTransferProgress(
      decoder.k,
      decoder.framesNew,
      elapsed,
      decoder.solvedCount,
    );
    const percent = estimate.fraction * 100;
    const shownPercent = percent < 10 ? percent.toFixed(1) : percent.toFixed(0);
    const rate = decoder.framesNew >= 4 ? ` · ${goodputKbs(elapsed).toFixed(1)} KB/s` : "";
    const eta =
      estimate.etaSeconds === undefined
        ? estimate.phase === "decoding"
          ? `${decoder.framesNew} ${t("progress.frames")} · ${t("progress.decoding")}`
          : t("progress.estimating")
        : `${t("progress.about")} ${formatDuration(estimate.etaSeconds)} · ${decoder.framesNew} ${t("progress.frames")}`;
    setProgress({
      percent,
      label: `${shownPercent}% · ${decoder.solvedCount}/${decoder.k} ${t("progress.blocks")}`,
      eta: eta + rate,
    });
  }, [goodputKbs, t]);

  const finish = useCallback(
    async (container: Uint8Array, hashOk: boolean, seconds: number) => {
      doneRef.current = true;
      captureGenRef.current++;
      // Tear the whole capture pipeline down — each worker holds its own
      // ~940 KB zxing WASM instance, worth reclaiming on a phone.
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (statsTimerRef.current) clearInterval(statsTimerRef.current);
      statsTimerRef.current = undefined;
      poolRef.current?.resize(0);
      setCameraState("done");
      setProgress((prev) =>
        prev
          ? { ...prev, percent: 100, label: `100% · ${t("progress.done")}` }
          : { percent: 100, label: `100% · ${t("progress.done")}`, eta: "" },
      );
      try {
        if (!hashOk) throw new Error(t("errors.checksum"));
        const file = await unpackFile(container);
        if (!(await verifyFile(file))) throw new Error(t("errors.sha256"));

        const rate = (container.length / 1024 / seconds).toFixed(1);
        const gzipNote = file.compression === "gzip" ? `${t("result.gzipDecompressed")} · ` : "";
        if (isSnippet(file)) {
          setResult({
            kind: "snippet",
            text: snippetText(file),
            summary: `${t("result.textIn", { seconds: seconds.toFixed(1) })} · ${rate} KB/s · ${gzipNote}${t("result.verified")}`,
          });
          return;
        }
        const url = URL.createObjectURL(new Blob([file.bytes as BlobPart], { type: file.type }));
        blobUrlRef.current = url;
        const kb = Math.round(file.bytes.length / 1024);
        setResult({
          kind: "file",
          file,
          blobUrl: url,
          summary: `${kb} KB · ${t("result.inSeconds", { seconds: seconds.toFixed(1) })} · ${rate} KB/s · ${gzipNote}${t("result.verified")}`,
        });
      } catch (error) {
        setFailed(error instanceof Error ? error.message : String(error));
      }
    },
    [t],
  );

  const onDecoded = useCallback(
    (bytes: Uint8Array) => {
      const parsed = parseFrame(bytes);
      if (!parsed || doneRef.current) return;
      const { header, block } = parsed;
      if (noSignalRef.current.frameDecoded()) {
        setNoSignalToast(false);
        setShowNoSignalHelp(false);
      }
      // streamIdentity() covers every header field that has to hold constant,
      // not just the session id.
      const identity = streamIdentity(header);
      if (!decoderRef.current || streamKeyRef.current !== identity) {
        decoderRef.current = new LTDecoder(
          header.k,
          header.blockLen,
          header.sessionId,
          header.totalLen,
        );
        streamKeyRef.current = identity;
        startTsRef.current = performance.now();
      }
      decoderRef.current.addFrame(header.seq, block);
      updateProgress();

      if (decoderRef.current.isComplete) {
        const payload = decoderRef.current.assemble()!;
        const seconds = (performance.now() - startTsRef.current) / 1000;
        const ok = fnv1a(payload) === header.payloadFnv;
        void finish(payload, ok, seconds);
      }
    },
    [finish, updateProgress],
  );

  const onTick = useCallback(() => {
    if (doneRef.current) return;
    const now = performance.now();
    if (noSignalRef.current.tick(now)) setNoSignalToast(true);
    updateProgress();
  }, [updateProgress]);

  // The pool and stats timer hold callbacks that outlive renders; keep the
  // latest handlers behind a ref so they never go stale.
  const handlersRef = useRef({ onDecoded, onTick });
  useEffect(() => {
    handlersRef.current = { onDecoded, onTick };
  });

  const scheduleFrameRef = useRef<(gen: number) => void>(() => undefined);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const pool = poolRef.current;
    if (!video || !pool) return;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;
    if (pool.busyCount === pool.size) return; // all busy — drop it, no harm done
    if (!grabRef.current) grabRef.current = document.createElement("canvas");
    const grab = grabRef.current;
    if (grab.width !== vw || grab.height !== vh) {
      grab.width = vw;
      grab.height = vh;
    }
    const ctx = grab.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(video, 0, 0);
    const img = ctx.getImageData(0, 0, vw, vh);
    pool.submit(
      { id: frameIdRef.current++, buf: img.data.buffer, w: vw, h: vh },
      [img.data.buffer],
    );
  }, []);

  const scheduleFrame = useCallback(
    (gen: number) => {
      if (doneRef.current || gen !== captureGenRef.current) return;
      const video = videoRef.current as VideoRVFC | null;
      if (!video) return;
      const next = () => {
        if (doneRef.current || gen !== captureGenRef.current) return;
        captureFrame();
        scheduleFrameRef.current(gen);
      };
      if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(next);
      else requestAnimationFrame(next);
    },
    [captureFrame],
  );
  // Sync the ref after every render so the loop always recurses through the
  // latest `scheduleFrame` without a self-referencing callback initializer.
  useEffect(() => {
    scheduleFrameRef.current = scheduleFrame;
  });

  const reportCameraSettings = useCallback(
    (askedFps: number, workerCount: number) => {
      const track = streamRef.current?.getVideoTracks()[0];
      if (!track) return;
      const s = track.getSettings();
      const gotFps = Math.round(s.frameRate ?? 0);
      const fpsNote = gotFps && gotFps !== askedFps ? ` (${t("camera.asked", { fps: askedFps })})` : "";
      setCameraInfo(
        `${t("camera.actual", {
          w: s.width ?? 0,
          h: s.height ?? 0,
          fps: gotFps,
        })}${fpsNote} · ${workerCount} ${t("camera.workers")} · ${t("camera.live")}`,
      );
    },
    [t],
  );

  const applyCameraExtras = useCallback(async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    const caps = probeCameraCapabilities(track);
    if (caps.continuousFocus) {
      await applyAdvancedConstraint(track, { focusMode: "continuous" });
    }
  }, []);

  const applyReceiveSettings = useCallback(
    (nextWidth: number, nextFps: number, nextWorkers: number) => {
      if (doneRef.current) return; // finish() already tore the pool down
      poolRef.current?.resize(nextWorkers);
      const track = streamRef.current?.getVideoTracks()[0];
      if (!track) return;
      void track
        .applyConstraints({
          width: { ideal: nextWidth },
          height: { ideal: Math.round((nextWidth * 3) / 4) },
          frameRate: { ideal: nextFps },
        })
        .then(() => reportCameraSettings(nextFps, nextWorkers))
        .catch(() => setCameraInfo(t("camera.refused")));
    },
    [reportCameraSettings, t],
  );

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus({ text: t("errors.secureContext"), error: true });
      return;
    }
    setStatus({ text: t("statusStarting"), error: false });
    const base: MediaTrackConstraints = {
      facingMode: "environment",
      width: { ideal: width },
      height: { ideal: Math.round((width * 3) / 4) },
    };
    let stream: MediaStream;
    try {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { ...base, frameRate: { exact: capFps } },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { ...base, frameRate: { ideal: capFps } },
        });
      }
    } catch (err) {
      const denied = err instanceof DOMException && err.name === "NotAllowedError";
      setCameraState("idle");
      setStatus({
        text: denied ? t("errors.permissionDenied") : `${t("errors.camera")} ${err instanceof Error ? err.message : String(err)}`,
        error: true,
      });
      return;
    }

    streamRef.current = stream;
    doneRef.current = false;
    setCameraState("live");
    setResult(null);
    setFailed("");
    setProgress(null);
    const settings = stream.getVideoTracks()[0]?.getSettings();
    setStatus({
      text: t("statusSearching", {
        w: settings?.width ?? 0,
        h: settings?.height ?? 0,
        fps: Math.round(settings?.frameRate ?? 0),
      }),
      error: false,
    });

    if (!poolRef.current) {
      poolRef.current = new DecodeWorkerPool(
        createDecodeWorker,
        (bytes) => handlersRef.current.onDecoded(bytes),
      );
    }
    poolRef.current.resize(workers);
    reportCameraSettings(capFps, workers);
    void applyCameraExtras();

    noSignalRef.current.cameraStarted(performance.now());
    captureGenRef.current++;
    scheduleFrame(captureGenRef.current);
    statsTimerRef.current = setInterval(() => handlersRef.current.onTick(), 500);
    void requestScreenWakeLock();
  }, [applyCameraExtras, capFps, reportCameraSettings, scheduleFrame, t, width, workers]);

  // Attach the stream once <video> is actually mounted: `cameraState` gates the
  // element's render, so reading videoRef right after setCameraState("live") in
  // start() would hit a null ref (React batches state). Running here guarantees
  // the element exists, otherwise srcObject is never set and no frame is ever
  // captured — the classic "camera shows nothing" symptom.
  useEffect(() => {
    if (cameraState !== "live") return;
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;
    video.srcObject = stream;
    void video.play().catch(() => undefined);
    // Kick the capture loop here too: start() calls scheduleFrame() right after
    // setCameraState("live"), but React batches state so the <video> is still
    // unmounted at that point and scheduleFrame() bails on the null ref. With
    // the element mounted, re-arming the loop is safe — the generation counter
    // guards against double-arming from a stray re-render.
    scheduleFrameRef.current(captureGenRef.current);
  }, [cameraState, scheduleFrameRef]);

  // Unmount: stop camera, workers, timers; release any object URL.
  useEffect(() => {
    return () => {
      doneRef.current = true; // halts the rVFC/rAF capture loop
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (statsTimerRef.current) clearInterval(statsTimerRef.current);
      poolRef.current?.resize(0);
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  const dismissNoSignal = useCallback(() => {
    setNoSignalToast(false);
    noSignalRef.current.dismiss(performance.now());
  }, []);

  const copySnippet = useCallback(async () => {
    if (result?.kind !== "snippet") return;
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }, [result]);

  const restart = useCallback(() => {
    window.location.reload();
  }, []);

  const tR = t;

  return (
    <div className="space-y-5">
      {/* Status line */}
      <p className={`text-sm ${status.error ? "text-red-500" : "text-zinc-400"}`} role="status">
        {status.text}
      </p>

      {cameraState === "idle" && (
        <button
          type="button"
          onClick={() => void start()}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
        >
          {tR("startCamera")}
        </button>
      )}

      {cameraState === "starting" && (
        <p className="text-sm text-zinc-400">{tR("statusStarting")}…</p>
      )}

      {(cameraState === "live" || cameraState === "starting") && (
        <div className="relative">
          {noSignalToast && (
            <div
              role="status"
              className="absolute left-1/2 top-3 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 shadow-lg"
            >
              <span>{tR("noSignal.title")}</span>
              <button
                type="button"
                onClick={() => setShowNoSignalHelp(true)}
                className="text-blue-400 hover:underline"
              >
                {tR("noSignal.help")}
              </button>
              <button
                type="button"
                onClick={dismissNoSignal}
                className="text-zinc-400 hover:text-zinc-200"
              >
                {tR("noSignal.dismiss")}
              </button>
            </div>
          )}
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black">
            <video ref={videoRef} muted playsInline className="block max-h-[70vh] w-full" />
            {progress && (
              <div className="p-4">
                <div className="flex items-baseline justify-between text-sm">
                  <strong className="text-zinc-100">{progress.label}</strong>
                  <span className="text-xs text-zinc-400">{progress.eta}</span>
                </div>
                <div
                  className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.floor(progress.percent)}
                >
                  <div
                    className="h-full rounded-full bg-blue-600 transition-[width] duration-300"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showNoSignalHelp && cameraState === "live" && (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
          <h3 className="mb-2 text-sm font-medium text-zinc-100">{tR("noSignal.title")}</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
            {tR.raw("noSignal.tips") as string[]}
          </ul>
          <button
            type="button"
            onClick={() => setShowNoSignalHelp(false)}
            className="mt-3 rounded-lg border border-zinc-700 px-4 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            {tR("noSignal.gotIt")}
          </button>
        </div>
      )}

      {cameraState === "live" && (
        <>
          {/* Receive settings */}
          <details className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <summary className="cursor-pointer text-sm font-medium text-zinc-200">
              {tR("settings.title")}
            </summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <label className="block text-sm text-zinc-400">
                {tR("settings.captureWidth")}
                <select
                  value={width}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setWidth(v);
                    applyReceiveSettings(v, capFps, workers);
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  {[960, 1280, 1920].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-zinc-400">
                {tR("settings.captureFps")}
                <select
                  value={capFps}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setCapFps(v);
                    applyReceiveSettings(width, v, workers);
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  {[30, 60].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-zinc-400">
                {tR("settings.workers")}
                <select
                  value={workers}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setWorkers(v);
                    applyReceiveSettings(width, capFps, v);
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  {[1, 2, 3].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {cameraInfo && <p className="mt-3 text-xs text-zinc-500">{cameraInfo}</p>}
          </details>
        </>
      )}

      {/* Result */}
      {failed && (
        <div className="space-y-3 rounded-xl border border-red-800 bg-red-950/30 p-4">
          <p className="text-sm font-medium text-red-400">{tR("result.failed")}</p>
          <p className="text-sm text-zinc-300">{failed}</p>
          <p className="text-sm text-zinc-400">{tR("result.failedHint")}</p>
          <button
            type="button"
            onClick={restart}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            {tR("result.tryAgain")}
          </button>
        </div>
      )}

      {result?.kind === "file" && (
        <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="text-sm font-medium text-emerald-400">{tR("result.fileDone")}</p>
          <p className="text-sm text-zinc-400">{result.summary}</p>
          {result.file.type.startsWith("image/") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.blobUrl}
              alt={result.file.name}
              className="max-h-96 rounded-lg border border-zinc-800"
            />
          ) : result.file.type.startsWith("video/") || result.file.type.startsWith("audio/") ? (
            result.file.type.startsWith("video/") ? (
              <video
                src={result.blobUrl}
                controls
                playsInline
                className="max-h-96 w-full rounded-lg border border-zinc-800"
              />
            ) : (
              <audio src={result.blobUrl} controls className="w-full" />
            )
          ) : null}
          <div className="flex flex-wrap gap-2">
            <a
              href={result.blobUrl}
              download={result.file.name}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              {tR("result.save", { name: result.file.name })}
            </a>
            <button
              type="button"
              onClick={restart}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              {tR("result.receiveAnother")}
            </button>
          </div>
        </div>
      )}

      {result?.kind === "snippet" && (
        <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="text-sm font-medium text-emerald-400">{tR("result.textDone")}</p>
          <p className="text-sm text-zinc-400">{result.summary}</p>
          <p className="max-h-64 overflow-auto break-words whitespace-pre-wrap rounded-lg border border-zinc-700 bg-zinc-950 p-3 font-mono text-sm text-zinc-100">
            {result.text}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copySnippet()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              {copied ? tR("result.copied") : tR("result.copy")}
            </button>
            <button
              type="button"
              onClick={restart}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              {tR("result.receiveAnother")}
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-zinc-500">{tR("privacyNote")}</p>
    </div>
  );
}
