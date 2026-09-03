/**
 * spike-sam-hq / encoder.worker.js —— SAM image encoder 推理 Worker
 * 把 ViT-B 编码放到独立线程，避免编码期间冻结页面主线程。
 * ORT 从 CDN importScripts 加载（与主线程同版本 1.21.0）。
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
          ort.env.wasm.numThreads = Math.min(navigator.hardwareConcurrency || 4, 4);
          ort.env.wasm.simd = true;
          ort.env.logLevel = "warning";
          console.log(`[sam-worker] ORT ready from ${base}`);
          return ort;
        }
      } catch (e) {
        console.warn("[sam-worker] CDN 加载失败:", base, e);
      }
    }
    throw new Error("encoder worker 无法加载 onnxruntime-web");
  }

  self.onmessage = async (e) => {
    const m = e.data;
    try {
      if (m.type === "init") {
        const ortLib = loadOrt();
        const epList =
          m.ep === "webgpu" && ortLib.env.webgpu
            ? [{ name: "webgpu" }, "wasm"]
            : ["wasm"];
        const t0 = performance.now();
        session = await ortLib.InferenceSession.create(m.bytes, {
          executionProviders: epList,
        });
        console.log(
          `[sam-worker] encoder session built in ${Math.round(performance.now() - t0)}ms, ep=${m.ep}`
        );
        self.postMessage({ type: "ready" });
      } else if (m.type === "encode") {
        if (!session) throw new Error("encoder session 未初始化");
        const inName = session.inputNames[0];
        const feeds = {};
        feeds[inName] = new ort.Tensor("float32", m.input, [1, 3, 1024, 1024]);
        const t0 = performance.now();
        const out = await session.run(feeds);
        const ms = Math.round(performance.now() - t0);
        const emb = out[session.outputNames[0]];
        // 把 embedding 数据 transfer 回主线程，避免拷贝
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
