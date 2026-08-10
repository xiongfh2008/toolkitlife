import type { FFmpeg } from "@ffmpeg/ffmpeg";

/**
 * Loads the FFmpeg WebAssembly engine on demand (lazy, client-side only).
 * The core is fetched from unpkg at runtime, matching the pattern used by
 * the video tools in this project. Nothing is bundled into the page bundle.
 */
export async function loadFFmpeg(onProgress: (p: number) => void): Promise<FFmpeg> {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const { toBlobURL } = await import("@ffmpeg/util");

  const ffmpeg = new FFmpeg();
  ffmpeg.on("progress", ({ progress }) => onProgress(Math.min(progress, 0.999)));

  await ffmpeg.load({
    coreURL: await toBlobURL(
      "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
      "text/javascript"
    ),
    wasmURL: await toBlobURL(
      "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm",
      "application/wasm"
    ),
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
