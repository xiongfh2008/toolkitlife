import { ArrayBufferTarget, Muxer } from "mp4-muxer";
import {
  buildScene,
  createRenderer,
  estimateBitrate,
  type SceneKind,
} from "./live-wallpaper-scenes";

/**
 * Export pipeline for the live wallpaper generator.
 * Primary path: WebCodecs VideoEncoder + mp4-muxer → deterministic offline
 * frame-by-frame H.264 MP4 (faster than realtime, exact loop). Fallback:
 * realtime MediaRecorder → WebM (or MP4 on Safari). mp4-muxer usage is
 * intentionally isolated here (library is deprecated in favor of Mediabunny).
 */

export interface ExportOptions {
  kind: SceneKind;
  seed: string;
  colors: string[];
  width: number;
  height: number;
  seconds: number;
  fps: number;
}

export interface ExportCallbacks {
  onProgress?: (frac: number) => void;
  /** Fires once the concrete output format is known. */
  onMode?: (mode: "mp4" | "webm") => void;
  signal?: AbortSignal;
}

export interface ExportResult {
  blob: Blob;
  ext: "mp4" | "webm";
}

const H264_CANDIDATES = [
  "avc1.640033", // High@L5.1 — covers up to 4K (max ~9.44 MP)
  "avc1.640064", // High@L6.0 — covers 8K custom sizes
  "avc1.4d0033", // Main@L5.1
  "avc1.42003e", // Baseline
];

/** Returns the first supported H.264 codec string, or null when WebCodecs/H.264 is unavailable. */
export async function pickH264Codec(
  w: number,
  h: number,
  bitrate: number,
  fps: number
): Promise<string | null> {
  if (typeof VideoEncoder === "undefined" || typeof VideoFrame === "undefined") return null;
  for (const codec of H264_CANDIDATES) {
    try {
      const support = await VideoEncoder.isConfigSupported({
        codec,
        width: w,
        height: h,
        bitrate,
        framerate: fps,
      });
      if (support.supported) return codec;
    } catch {
      // try next candidate
    }
  }
  return null;
}

function cleanupRenderer(live: ReturnType<typeof buildScene>, renderer: ReturnType<typeof createRenderer>) {
  live.dispose();
  renderer.dispose();
  renderer.forceContextLoss();
}

// ---------- Primary: WebCodecs → MP4 ----------
async function exportWithWebCodecs(
  opts: ExportOptions,
  cb: ExportCallbacks,
  bitrate: number,
  codec: string
): Promise<ExportResult> {
  const { width: W, height: H, fps, seconds: T } = opts;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const renderer = createRenderer(canvas, W, H);
  const live = buildScene(opts.kind, {
    seed: opts.seed,
    colors: opts.colors,
    loopSeconds: T,
    aspect: W / H,
  });
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: { codec: "avc", width: W, height: H, frameRate: fps },
    fastStart: "in-memory",
  });

  let encoder: VideoEncoder | null = null;
  let encodeError: Error | null = null;
  let aborted = false;
  try {
    encoder = new VideoEncoder({
      output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
      error: (e) => {
        encodeError = new Error(String((e as DOMException)?.message ?? e));
      },
    });
    // Safari may pass isConfigSupported but still throw on configure.
    encoder.configure({ codec, width: W, height: H, bitrate, framerate: fps, latencyMode: "quality" });

    const totalFrames = Math.round(T * fps);
    const kfInterval = 2 * fps;

    for (let i = 0; i < totalFrames; i++) {
      if (cb.signal?.aborted) {
        aborted = true;
        throw new DOMException("Aborted", "AbortError");
      }
      if (encodeError) throw encodeError;

      live.update(i / fps);
      renderer.render(live.scene, live.camera);
      const frame = new VideoFrame(canvas, {
        timestamp: Math.round((i * 1e6) / fps),
        duration: Math.round(1e6 / fps),
      });
      encoder.encode(frame, { keyFrame: i % kfInterval === 0 });
      frame.close(); // mandatory: a 4K frame holds ~33 MB

      if (encoder.encodeQueueSize > 4) {
        const enc = encoder;
        await new Promise<void>((resolve) => {
          const handler = () => {
            if (enc.encodeQueueSize <= 4) {
              enc.removeEventListener("dequeue", handler);
              resolve();
            }
          };
          enc.addEventListener("dequeue", handler);
        });
      } else if (i % 3 === 0) {
        await new Promise((r) => setTimeout(r, 0)); // keep UI responsive
      }
      cb.onProgress?.((i + 1) / totalFrames);
    }

    if (encodeError) throw encodeError;
    await encoder.flush();
    encoder.close();
    encoder = null;
    muxer.finalize();
    cb.onMode?.("mp4");
    return {
      blob: new Blob([muxer.target.buffer], { type: "video/mp4" }),
      ext: "mp4",
    };
  } finally {
    if (encoder && encoder.state !== "closed") encoder.close();
    cleanupRenderer(live, renderer);
    if (aborted) {
      // Nothing was finalized; let the caller surface the abort.
    }
  }
}

// ---------- Fallback: realtime MediaRecorder ----------
async function exportWithMediaRecorder(
  opts: ExportOptions,
  cb: ExportCallbacks,
  bitrate: number
): Promise<ExportResult> {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("This browser cannot export video (no WebCodecs, no MediaRecorder).");
  }
  const { width: W, height: H, fps, seconds: T } = opts;
  const mimeType =
    ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"].find((m) =>
      MediaRecorder.isTypeSupported(m)
    ) ?? "video/webm";
  cb.onMode?.(mimeType.startsWith("video/mp4") ? "mp4" : "webm");

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const renderer = createRenderer(canvas, W, H);
  const live = buildScene(opts.kind, {
    seed: opts.seed,
    colors: opts.colors,
    loopSeconds: T,
    aspect: W / H,
  });
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: bitrate });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };

  try {
    const stopped = new Promise<void>((resolve, reject) => {
      recorder.onstop = () => resolve();
      recorder.onerror = () => reject(new Error("MediaRecorder failed"));
    });

    // Prime the first frame so captureStream has content from the start.
    live.update(0);
    renderer.render(live.scene, live.camera);
    recorder.start(250);
    const t0 = performance.now();
    await new Promise<void>((resolve) => {
      renderer.setAnimationLoop(() => {
        const elapsed = (performance.now() - t0) / 1000;
        if (cb.signal?.aborted || elapsed >= T) {
          renderer.setAnimationLoop(null);
          resolve();
          return;
        }
        live.update(elapsed % T); // scene periodicity ⇒ clean start/end seam
        renderer.render(live.scene, live.camera);
        cb.onProgress?.(Math.min(1, elapsed / T));
      });
    });
    recorder.stop();
    await stopped;
  } finally {
    stream.getTracks().forEach((track) => track.stop());
    cleanupRenderer(live, renderer);
  }

  if (cb.signal?.aborted) throw new DOMException("Aborted", "AbortError");
  return { blob: new Blob(chunks, { type: mimeType }), ext: mimeType.startsWith("video/mp4") ? "mp4" : "webm" };
}

// ---------- Public API ----------
export async function exportVideo(opts: ExportOptions, cb: ExportCallbacks = {}): Promise<ExportResult> {
  const bitrate = estimateBitrate(opts.width, opts.height, opts.fps);
  const codec = await pickH264Codec(opts.width, opts.height, bitrate, opts.fps);
  if (codec) {
    try {
      return await exportWithWebCodecs(opts, cb, bitrate, codec);
    } catch (err) {
      if (cb.signal?.aborted || (err instanceof DOMException && err.name === "AbortError")) throw err;
      // Codec/encoder failure mid-run → degrade to realtime recording.
      cb.onProgress?.(0);
    }
  }
  return exportWithMediaRecorder(opts, cb, bitrate);
}

/** Full-resolution still at t=0 (the loop's first frame). */
export async function renderPoster(opts: ExportOptions): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = opts.width;
  canvas.height = opts.height;
  const renderer = createRenderer(canvas, opts.width, opts.height);
  const live = buildScene(opts.kind, {
    seed: opts.seed,
    colors: opts.colors,
    loopSeconds: opts.seconds,
    aspect: opts.width / opts.height,
  });
  try {
    live.update(0);
    renderer.render(live.scene, live.camera);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
    if (!blob) throw new Error("PNG encoding failed");
    return blob;
  } finally {
    cleanupRenderer(live, renderer);
  }
}
