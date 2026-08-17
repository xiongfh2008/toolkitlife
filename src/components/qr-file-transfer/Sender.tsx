"use client";

// Sender: turn a file into an endless fountain-coded QR stream.
// React port of decimen-optical-transfer v0.3.0 send/main.ts (MIT License).

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import { fitQrDisplaySize } from "@/lib/qr-transfer/display";
import { rasterizeQr } from "@/lib/qr-transfer/qr-raster";
import { formatBytes } from "@/lib/qr-transfer/format";
import {
  MAX_SOURCE_BLOCKS,
  blockLength,
  fitsInOneStream,
  minimumFrameBytes,
  smallestSufficientFrameSize,
  sourceBlockCount,
} from "@/lib/qr-transfer/frame-capacity";
import { LTEncoder } from "@/lib/qr-transfer/fountain";
import { MAX_SNIPPET_BYTES, MAX_SNIPPET_LABEL, packSnippet } from "@/lib/qr-transfer/snippet";
import {
  MAX_FILE_BYTES,
  MAX_FILE_LABEL,
  fnv1a,
  packFile,
  packFrame,
  type FrameHeader,
  type PackedOpticalFile,
} from "@/lib/qr-transfer/protocol";
import { requestScreenWakeLock } from "@/lib/qr-transfer/wake-lock";
import {
  DEFAULT_FRAME_BYTES,
  DEFAULT_TX_FPS,
  FRAME_BYTES_OPTIONS,
  TX_FPS_OPTIONS,
} from "@/lib/qr-transfer/send-settings";

const MARGIN = 4; // quiet-zone modules
const LOOKAHEAD = 3;

type SendMode = "file" | "snippet";
type Ecc = "L" | "M" | "Q" | "H";

interface SelectedPayload {
  name: string;
  size: number;
  payload: Uint8Array;
  compression: "none" | "gzip";
  transmittedSize: number;
}

interface StreamSpecs {
  fps: number;
  frameBytes: number;
  version: number;
  ecc: Ecc;
  name: string;
  size: number;
  compression: string;
  k: number;
}

export default function Sender() {
  const t = useTranslations("tools.qr-file-transfer.send");

  // ── React state (what the user sees) ──
  const [mode, setMode] = useState<SendMode>("file");
  const [status, setStatus] = useState<{ text: string; error: boolean }>({
    text: "…",
    error: false,
  });
  const [selectedInfo, setSelectedInfo] = useState<{ name: string } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [specs, setSpecs] = useState<StreamSpecs | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [snippet, setSnippet] = useState("");
  const [fps, setFps] = useState(DEFAULT_TX_FPS);
  const [frameBytes, setFrameBytes] = useState(DEFAULT_FRAME_BYTES);
  const [ecc, setEcc] = useState<Ecc>("L");
  const [size, setSize] = useState(900);

  // ── Mutable values the stream loop reads without re-rendering ──
  const modeRef = useRef<SendMode>("file");
  const selectedRef = useRef<SelectedPayload | null>(null);
  const settingsRef = useRef({
    fps: DEFAULT_TX_FPS,
    frameBytes: DEFAULT_FRAME_BYTES,
    ecc: "L" as Ecc,
    size: 900,
  });
  const genRef = useRef(0); // bumped on every restart; stale loops see it and die
  const resizeRef = useRef<(() => void) | null>(null);
  const fullscreenRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const snippetRef = useRef("");

  function setStageFullscreenInner(on: boolean): void {
    if (on === fullscreenRef.current) return;
    fullscreenRef.current = on;
    setFullscreen(on);
    resizeRef.current?.();
  }

  /** Errors also hide the stage — a stale QR stream pulsing away under a
   *  rejection message reads as "still working". */
  const showError = useCallback((message: string) => {
    setStageFullscreenInner(false);
    setStreaming(false);
    setSpecs(null);
    setStatus({ text: message, error: true });
  }, []);

  /** Tap the code to fill the screen with it. Tap again (or Esc) to shrink back. */
  const setStageFullscreen = useCallback((on: boolean) => {
    setStageFullscreenInner(on);
  }, []);

  /** Scroll the stage into view, but only on a fresh pick — a settings change
   *  must not yank the page down. */
  const scrollStageIntoView = useCallback(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      stageRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  }, []);

  const startStream = useCallback(
    async (revealStage = false) => {
      const gen = ++genRef.current;
      resizeRef.current = null;
      // Stale until this stream's first frame locks its version and refills them.
      setSpecs(null);
      const selected = selectedRef.current;
      if (!selected) {
        setStatus({
          text: modeRef.current === "snippet" ? t("statusIdleSnippet") : t("statusIdleFile"),
          error: false,
        });
        return;
      }
      const { name, size: fileSize, payload, compression, transmittedSize } = selected;
      if (gen !== genRef.current) return; // superseded while fetching
      const { fps: txFps, frameBytes, ecc, size: displayPx } = settingsRef.current;

      const sessionId = (Math.floor(Math.random() * 0xffff) + 1) & 0xffff;
      const blockLen = blockLength(frameBytes);
      // Keep the selection on this path — raising bytes/frame back up is the fix.
      if (!fitsInOneStream(payload.length, frameBytes)) {
        const suggestion =
          smallestSufficientFrameSize(payload.length, FRAME_BYTES_OPTIONS) ??
          minimumFrameBytes(payload.length);
        showError(
          `${formatBytes(payload.length)} needs ` +
            `${sourceBlockCount(payload.length, frameBytes).toLocaleString()} blocks at ` +
            `${frameBytes} bytes per frame, and a frame can only number ` +
            `${MAX_SOURCE_BLOCKS.toLocaleString()} of them. ` +
            `${t("errors.raiseFrameBytes", { suggestion: suggestion.toLocaleString() })}`,
        );
        return;
      }
      const encoder = new LTEncoder(payload, blockLen, sessionId);
      const header: FrameHeader = {
        sessionId,
        seq: 0,
        k: encoder.k,
        blockLen,
        totalLen: payload.length,
        payloadFnv: fnv1a(payload),
      };

      const canvas = canvasRef.current;
      const stage = stageRef.current;
      if (!canvas || !stage) return;

      let version: number | undefined; // locked after the first frame
      let modules = 0;
      let scale = 1;
      const staging = document.createElement("canvas");
      const queue: ImageData[] = [];
      let nextSeq = 0;
      setStreaming(true);

      const sizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        const total = modules + 2 * MARGIN;
        let cssBudget: number;
        if (fullscreenRef.current) {
          // Tap-to-fullscreen: the whole short viewport edge.
          cssBudget = Math.min(window.innerWidth, window.innerHeight);
        } else {
          const containerWidth =
            stage.parentElement?.getBoundingClientRect().width ?? window.innerWidth;
          const stageStyle = getComputedStyle(stage);
          const horizontalChrome =
            Number.parseFloat(stageStyle.paddingLeft) +
            Number.parseFloat(stageStyle.paddingRight) +
            Number.parseFloat(stageStyle.borderLeftWidth) +
            Number.parseFloat(stageStyle.borderRightWidth);
          cssBudget = fitQrDisplaySize(
            window.innerWidth,
            window.innerHeight,
            containerWidth,
            displayPx,
            horizontalChrome,
          );
        }
        scale = Math.max(1, Math.floor((cssBudget * dpr) / total));
        staging.width = total;
        staging.height = total;
        canvas.width = total * scale;
        canvas.height = total * scale;
        canvas.style.width = `${(total * scale) / dpr}px`;
        canvas.style.height = `${(total * scale) / dpr}px`;
      };

      const makeFrame = (): ImageData => {
        const bytes = packFrame({ ...header, seq: nextSeq }, encoder.encode(nextSeq));
        nextSeq++;
        const qr = QRCode.create(
          [{ data: bytes, mode: "byte" } as unknown as QRCode.QRCodeSegment],
          {
            errorCorrectionLevel: ecc,
            version,
            maskPattern: 4,
          },
        );
        if (version === undefined) {
          version = qr.version;
          modules = qr.modules.size;
          sizeCanvas();
          resizeRef.current = sizeCanvas;
          // Scroll only now: before sizeCanvas() the canvas is still 16×16.
          if (revealStage) scrollStageIntoView();
          // The stream's parameters live under the stage.
          setSpecs({
            fps: txFps,
            frameBytes,
            version,
            ecc,
            name,
            size: fileSize,
            compression: compression === "gzip" ? `gzip → ${formatBytes(transmittedSize)}` : "none",
            k: encoder.k,
          });
          setStatus({ text: t("statusStreaming", { name }), error: false });
        }
        const raster = rasterizeQr(qr.modules.size, qr.modules.data, MARGIN);
        return new ImageData(new Uint8ClampedArray(raster.pixels.buffer), raster.size, raster.size);
      };

      /** Refill the lookahead, generating at most `max` frames per call. */
      let generatorFailed = false;
      const pump = (max = LOOKAHEAD) => {
        if (generatorFailed || gen !== genRef.current) return;
        try {
          for (let n = 0; n < max && queue.length < LOOKAHEAD; n++) queue.push(makeFrame());
        } catch (err) {
          // e.g. frame bytes over capacity for the chosen ECC level
          generatorFailed = true;
          showError(err instanceof Error ? err.message : String(err));
        }
      };
      pump();

      const interval = 1000 / txFps;
      let nextAt = performance.now();
      const tick = (now: number) => {
        if (gen !== genRef.current || generatorFailed) return;
        requestAnimationFrame(tick);
        if (now < nextAt) return;
        const img = queue.shift();
        pump(1);
        if (!img) {
          nextAt = now + interval;
          return;
        }
        staging.getContext("2d")!.putImageData(img, 0, 0);
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(staging, 0, 0, canvas.width, canvas.height);
        nextAt += interval;
        if (now - nextAt > 3 * interval) nextAt = now + interval; // fell behind — don't burst
      };
      requestAnimationFrame(tick);
    },
    [scrollStageIntoView, showError, t],
  );

  /** The one path from "user picked something" to a running stream. */
  const startSelection = useCallback(
    async (
      statusText: string,
      prepare: () => Promise<{ name: string; size: number; packed: PackedOpticalFile }>,
    ) => {
      const selectionGeneration = ++genRef.current;
      selectedRef.current = null;
      setSelectedInfo(null);
      setStreaming(false);
      setSpecs(null);
      setStatus({ text: statusText, error: false });
      try {
        const { name, size, packed } = await prepare();
        if (selectionGeneration !== genRef.current) return;
        selectedRef.current = {
          name,
          size,
          payload: packed.container,
          compression: packed.compression,
          transmittedSize: packed.transmittedSize,
        };
        setSelectedInfo({ name });
        await startStream(true);
      } catch (error) {
        showError(error instanceof Error ? error.message : String(error));
      }
    },
    [showError, startStream],
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      void startSelection(t("statusPreparingFile", { name: file.name }), async () => {
        // Checked here, off File.size, rather than after reading the bytes.
        if (file.size === 0) {
          throw new Error(t("errors.emptyFile", { name: file.name }));
        }
        if (file.size > MAX_FILE_BYTES) {
          throw new Error(
            t("errors.tooLarge", {
              name: file.name,
              size: formatBytes(file.size),
              max: MAX_FILE_LABEL,
            }),
          );
        }
        const bytes = new Uint8Array(await file.arrayBuffer());
        return { name: file.name, size: file.size, packed: await packFile(file.name, file.type, bytes) };
      });
    },
    [startSelection, t],
  );

  const sendSnippet = useCallback(() => {
    void startSelection(t("statusPreparingSnippet"), async () => {
      const packed = await packSnippet(snippetRef.current);
      return { name: t("snippetName"), size: packed.originalSize, packed };
    });
  }, [startSelection, t]);

  useEffect(() => {
    snippetRef.current = snippet;
  }, [snippet]);

  /** Switching what we're sending kills any stream in flight and clears the stage. */
  const switchMode = useCallback(
    (next: SendMode) => {
      if (next === modeRef.current) return;
      genRef.current++;
      selectedRef.current = null;
      setSelectedInfo(null);
      setStageFullscreenInner(false);
      setStreaming(false);
      setSpecs(null);
      modeRef.current = next;
      setMode(next);
      setStatus({
        text: next === "snippet" ? t("statusIdleSnippet") : t("statusIdleFile"),
        error: false,
      });
    },
    [t],
  );

  /** Settings change: restart the stream with the current selection armed. */
  const applySettings = useCallback(
    (next: Partial<{ fps: number; frameBytes: number; ecc: Ecc; size: number }>) => {
      settingsRef.current = { ...settingsRef.current, ...next };
      setFps(settingsRef.current.fps);
      setFrameBytes(settingsRef.current.frameBytes);
      setEcc(settingsRef.current.ecc);
      setSize(settingsRef.current.size);
      void startStream(false);
    },
    [startStream],
  );

  const stopTransfer = useCallback(() => {
    genRef.current++;
    selectedRef.current = null;
    setSelectedInfo(null);
    setStageFullscreenInner(false);
    setStreaming(false);
    setSpecs(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setStatus({ text: t("statusIdleFile"), error: false });
  }, [t]);

  // ── Mount / unmount ──
  useEffect(() => {
    void requestScreenWakeLock();
    const onResize = () => resizeRef.current?.();
    window.addEventListener("resize", onResize);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStageFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      genRef.current++; // kill any in-flight rAF loop
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [setStageFullscreen]);

  const armed = selectedInfo !== null;
  const tSend = t;

  return (
    <div className="space-y-5">
      {/* Mode: file or text snippet */}
      <div className="flex gap-2">
        {(["file", "snippet"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === m
                ? "bg-blue-600 text-white"
                : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            {m === "file" ? tSend("modeFile") : tSend("modeSnippet")}
          </button>
        ))}
      </div>

      {mode === "file" ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => (armed ? stopTransfer() : fileInputRef.current?.click())}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              {armed ? tSend("stopButton") : tSend("selectButton")}
            </button>
            <input ref={fileInputRef} type="file" className="hidden" onChange={onFileChange} />
            <span className="text-sm text-zinc-400">
              {armed && selectedInfo
                ? tSend("selectedLabel", { name: selectedInfo.name })
                : tSend("pickerLabel", { max: MAX_FILE_LABEL })}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <textarea
            value={snippet}
            onChange={(e) => setSnippet(e.target.value)}
            rows={6}
            maxLength={MAX_SNIPPET_BYTES}
            placeholder={tSend("snippetPlaceholder")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={sendSnippet}
              disabled={streaming}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {tSend("sendSnippetButton")}
            </button>
            <span className="text-xs text-zinc-500">
              {tSend("snippetLimit", { max: MAX_SNIPPET_LABEL })}
            </span>
          </div>
        </div>
      )}

      {/* Transfer settings */}
      <details className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4" open>
        <summary className="cursor-pointer text-sm font-medium text-zinc-200">
          {tSend("settings.title")}
        </summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm text-zinc-400">
            {tSend("settings.fps")}
            <select
              value={fps}
              onChange={(e) => applySettings({ fps: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
            >
              {TX_FPS_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v} fps
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-zinc-400">
            {tSend("settings.frameBytes")}
            <select
              value={frameBytes}
              onChange={(e) => applySettings({ frameBytes: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
            >
              {FRAME_BYTES_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-zinc-400">
            {tSend("settings.ecc")}
            <select
              value={ecc}
              onChange={(e) => applySettings({ ecc: e.target.value as Ecc })}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
            >
              {(["L", "M", "Q", "H"] as const).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-zinc-400">
            {tSend("settings.size")}
            <input
              type="range"
              min={300}
              max={1200}
              step={50}
              value={size}
              onChange={(e) => applySettings({ size: Number(e.target.value) })}
              className="mt-2 w-full accent-blue-600"
            />
            <span className="mt-1 block text-xs text-zinc-500">{size} px</span>
          </label>
        </div>
        {specs && (
          <dl className="mt-4 grid gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm sm:grid-cols-2 lg:grid-cols-6">
            {[
              [tSend("specs.fps"), `${specs.fps} fps`],
              [tSend("specs.frame"), `${specs.frameBytes} B`],
              [tSend("specs.qr"), `V${specs.version} · ECC ${specs.ecc}`],
              [tSend("specs.payload"), `${specs.name} · ${formatBytes(specs.size)}`],
              [tSend("specs.compression"), specs.compression],
              [tSend("specs.k"), `K = ${specs.k}`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-zinc-500">{k}</dt>
                <dd className="truncate text-zinc-200">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </details>

      {/* Status line */}
      <p className={`text-sm ${status.error ? "text-red-500" : "text-zinc-400"}`} role="status">
        {status.text}
      </p>

      {/* The stage: the animated QR stream. Tap to fill the screen. */}
      <div
        ref={stageRef}
        hidden={!streaming}
        onClick={() => setStageFullscreen(!fullscreenRef.current)}
        className={
          fullscreen
            ? "fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black"
            : "flex cursor-zoom-in justify-center rounded-xl border border-zinc-800 bg-white p-4"
        }
      >
        <canvas ref={canvasRef} className="block h-auto max-w-full" />
      </div>
      {streaming && <p className="text-center text-xs text-zinc-500">{tSend("tapHint")}</p>}
    </div>
  );
}
