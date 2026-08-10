/// <reference lib="webworker" />
import type { CompressOption, ImageInfo, ProcessOutput } from "@/lib/imgcompress/ImageBase";

// The vendored emscripten glue modules detect the environment with
// `typeof window === "object"`. In a Web Worker there is no `window`, so we
// alias the worker global to keep the glue on the "web" code path (fetch
// based wasm loading). This must run before any dynamic import of the glue.
(globalThis as unknown as { window: unknown }).window = globalThis;

export interface CompressRequest {
  id: number;
  info: ImageInfo;
  option: CompressOption;
}

export interface CompressResponse {
  id: number;
  result?: ProcessOutput;
  error?: string;
}

const ctx = globalThis as unknown as Worker;

ctx.onmessage = async (e: MessageEvent<CompressRequest>) => {
  const { id, info, option } = e.data;
  try {
    const { convert } = await import("@/lib/imgcompress/handler");
    const out = await convert({ info, option }, "compress");
    const payload: CompressResponse = {
      id,
      result: out?.compress ?? undefined,
    };
    ctx.postMessage(payload);
  } catch (err) {
    const payload: CompressResponse = { id, error: String(err) };
    ctx.postMessage(payload);
  }
};
