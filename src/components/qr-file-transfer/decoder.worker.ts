// QR decode worker: zxing-cpp compiled to WASM. (Safari has never shipped
// BarcodeDetector — WebKit bug 281848 — so WASM is the only portable way.)
// One frame in flight per worker; the main thread drops frames when all
// workers are busy. Frames are disposable — the fountain doesn't care.
//
// Ported from decimen-optical-transfer v0.3.0 (MIT License) receive/worker.ts.

import { prepareZXingModule, readBarcodes } from "zxing-wasm/reader";

// WASM bytes are fetched on the MAIN thread (relative URLs fail inside this
// worker: Turbopack creates it from a Blob/no-base context, so fetch("/…") and
// XHR both throw "Invalid URL"). The main thread transfers the bytes here and
// we hand them to Emscripten as `wasmBinary`, bypassing URL loading entirely.
let wasmReady = false;
const pendingFrames: MessageEvent[] = [];

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent) => void) | null;
  postMessage(msg: unknown, transfer?: Transferable[]): void;
};

const handleFrame = async (e: MessageEvent) => {
  const { id, buf, w, h } = e.data as { id: number; buf: ArrayBuffer; w: number; h: number };
  try {
    const img = new ImageData(new Uint8ClampedArray(buf), w, h);
    const results = await readBarcodes(img, { formats: ["QRCode"], maxNumberOfSymbols: 1 });
    const r = results.find((x) => x.isValid && x.bytes.length > 0);
    ctx.postMessage({ id, bytes: r ? r.bytes : null });
  } catch (err) {
    ctx.postMessage({ id, bytes: null });
  }
};

ctx.onmessage = (e: MessageEvent) => {
  const data = e.data as { type?: string; wasm?: ArrayBuffer };
  if (data.type === "init" && data.wasm) {
    prepareZXingModule({
      overrides: {
        locateFile: () => "zxing_reader.wasm",
        wasmBinary: data.wasm,
      },
    });
    wasmReady = true;
    for (const p of pendingFrames) void handleFrame(p);
    pendingFrames.length = 0;
    // warm the WASM so the first real frame doesn't pay instantiation
    void readBarcodes(new ImageData(8, 8), { formats: ["QRCode"] }).catch(() => undefined);
    return;
  }
  if (!wasmReady) {
    pendingFrames.push(e);
    return;
  }
  void handleFrame(e);
};
