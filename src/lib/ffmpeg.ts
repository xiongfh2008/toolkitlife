import type { FFmpeg } from "@ffmpeg/ffmpeg";

let cached: FFmpeg | null = null;
let loading: Promise<FFmpeg> | null = null;

/**
 * Loads the FFmpeg WebAssembly engine on demand (lazy, client-side only).
 * The core is served from the site's own /ffmpeg assets (hosted in `public/`),
 * so it loads fast and reliably on any network — no external CDN dependency.
 *
 * The engine instance is cached and reused across conversions so repeated
 * operations don't pay the ~30MB download + instantiation cost again. If any
 * caller terminated the shared instance, a fresh one is created automatically.
 */
export async function loadFFmpeg(onProgress: (p: number) => void): Promise<FFmpeg> {
  // Load the engine only when there is no usable cached instance (e.g. after
  // a caller terminated the shared worker). Once loaded, `loading` keeps the
  // resolved promise so later calls short-circuit and reuse the instance.
  if (!cached || !cached.loaded) {
    cached = null;
    loading = null;
    loading = (async () => {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");

      const ffmpeg = new FFmpeg();
      await ffmpeg.load({
        coreURL: await toBlobURL("/ffmpeg/ffmpeg-core.js", "text/javascript"),
        wasmURL: await toBlobURL("/ffmpeg/ffmpeg-core.wasm", "application/wasm"),
      });
      return ffmpeg;
    })().then((ffmpeg) => {
      cached = ffmpeg;
      return ffmpeg;
    });
  }

  const ffmpeg = (await loading)!;
  ffmpeg.on("progress", ({ progress }) => {
    // Stream-copy operations can emit non-finite progress values; clamp them
    // so the UI never renders a broken percentage.
    const p = Number.isFinite(progress) ? Math.max(0, Math.min(progress, 0.999)) : 0;
    onProgress(p);
  });
  return ffmpeg;
}

/** Copies an output file out of the FFmpeg virtual FS as a Blob. */
export async function readFFmpegOutput(
  ffmpeg: FFmpeg,
  outputName: string,
  type: string
): Promise<Blob> {
  const data = await ffmpeg.readFile(outputName);
  const raw = data as Uint8Array;
  const buf = new ArrayBuffer(raw.byteLength);
  new Uint8Array(buf).set(raw);
  return new Blob([buf], { type });
}
