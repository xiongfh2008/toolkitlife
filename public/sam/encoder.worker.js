/**
 * toolkitlife / sam encoder worker (static, un-bundled).
 *
 * SAM image encoder (ViT-B) session + inference run off the main thread so a
 * ~8-10 s encoding never freezes the tool page. ORT is importScripts-ed from
 * the same CDNs migan.ts uses (CORS-enabled, passes the site's COEP
 * credentialless policy). Loaded by src/lib/sam.ts via "/sam/encoder.worker.js".
 */
(() => {
  "use strict";

  const CDN_LIST = [
    "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/",
    "https://unpkg.com/onnxruntime-web@1.21.0/dist/",
  ];

  let ort = null;
  let session = null;

  function loadOrt() {
    if (ort) return ort;
    for (const base of CDN_LIST) {
      try {
        importScripts(base + "ort.min.js");
        if (self.ort) {
          ort = self.ort;
          ort.env.wasm.wasmPaths = base;
          ort.env.wasm.numThreads = crossOriginIsolated
            ? Math.min(navigator.hardwareConcurrency || 4, 4)
            : 1;
          ort.env.wasm.simd = true;
          ort.env.logLevel = "warning";
          return ort;
        }
      } catch (e) {
        console.warn("[sam-worker] CDN load failed:", base, e);
      }
    }
    throw new Error("encoder worker: onnxruntime-web failed to load");
  }

  self.onmessage = async (e) => {
    const m = e.data;
    try {
      if (m.type === "init") {
        const ortLib = loadOrt();
        const t0 = performance.now();
        session = await ortLib.InferenceSession.create(m.bytes, {
          executionProviders: ["wasm"],
        });
        self.postMessage({ type: "ready" });
      } else if (m.type === "encode") {
        if (!session) throw new Error("encoder session not initialized");
        const inName = session.inputNames[0];
        const feeds = {};
        feeds[inName] = new ort.Tensor("float32", m.input, [1, 3, 1024, 1024]);
        const t0 = performance.now();
        const out = await session.run(feeds);
        const ms = Math.round(performance.now() - t0);
        const emb = out[session.outputNames[0]];
        // Transfer the embedding buffer back instead of copying it.
        self.postMessage(
          { type: "encoded", ms, data: emb.data, dims: emb.dims },
          [emb.data.buffer]
        );
      }
    } catch (err) {
      console.error("[sam-worker]", err);
      self.postMessage({ type: "error", message: (err && err.message) || String(err) });
    }
  };
})();
