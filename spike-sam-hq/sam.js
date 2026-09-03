/**
 * spike-sam-hq / sam.js —— 浏览器端 SAM 双段管线加载器（复刻 migan.ts 的既有范式）
 *
 * 职责：
 *  - 从 CDN 懒加载 onnxruntime-web（WASM）
 *  - 用 IndexedDB 缓存 encoder / decoder 两个 ONNX 模型（避免每次重复下载）
 *  - encoder：输入 1×3×1024×1024 → 输出 image_embeddings（每张图只跑一次）
 *  - decoder：prompt（点/框）+ embeddings → 高分辨率 mask（每次点选毫秒级）
 *
 * 模型说明：
 *  - 默认使用 SAM ViT-B int8（robgonsalves/segment-anything-8bit-onnx，MIT）
 *  - 后续替换成真正的 HQ-SAM vit-b 时：用 sam-hq 官方 scripts/export_onnx_model.py
 *    导出 vit_b 的 image_encoder / mask_decoder 并量化，再改下面的 MODEL_URLS 即可，
 *    本文件其余逻辑不变（I/O 契约一致）。
 */
(() => {
  "use strict";

  // 模型源：优先本机 models/（同源，免 CORS、免下载）；远程源保留作后备
  const ENCODER_URLS = [
    { url: "./models/sam_encoder.onnx", label: "SAM ViT-B int8 encoder (本地, 108.8MB)" },
    {
      url: "https://hf-mirror.com/robgonsalves/segment-anything-8bit-onnx/resolve/main/sam_encoder.onnx",
      label: "SAM ViT-B int8 encoder (hf-mirror)",
    },
    {
      url: "https://huggingface.co/robgonsalves/segment-anything-8bit-onnx/resolve/main/sam_encoder.onnx",
      label: "SAM ViT-B int8 encoder (HF 官方)",
    },
  ];
  const DECODER_URLS = [
    { url: "./models/sam_decoder.onnx", label: "SAM decoder int8 (本地, 8.8MB)" },
    {
      url: "https://hf-mirror.com/robgonsalves/segment-anything-8bit-onnx/resolve/main/sam_decoder.onnx",
      label: "SAM decoder int8 (hf-mirror)",
    },
    {
      url: "https://huggingface.co/robgonsalves/segment-anything-8bit-onnx/resolve/main/sam_decoder.onnx",
      label: "SAM decoder int8 (HF 官方)",
    },
  ];
  // 本地导出的 HQ-SAM 文件放置示例（存在时优先，配合 python 导出流程）：
  // const ENCODER_URLS = [{ url: "./models/sam_hq_vit_b_encoder_int8.onnx", label: "HQ-SAM ViT-B int8 (local)" }];

  const CACHE_PREFIX = "sam_hq_spike";
  const ORT_CDN_LIST = [
    "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/",
    "https://unpkg.com/onnxruntime-web@1.21.0/dist/",
  ];

  let ortPromise = null;
  let ort = null;

  // ───────────────────────── ORT 加载 ─────────────────────────
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("script load fail: " + src));
      document.head.appendChild(s);
    });
  }

  async function getOrt() {
    if (ort) return ort;
    if (!ortPromise) {
      ortPromise = (async () => {
        const w = window;
        if (w.ort) return (ort = w.ort);
        for (const base of ORT_CDN_LIST) {
          try {
            await loadScript(base + "ort.min.js");
            const o = w.ort;
            if (o) {
              o.env.wasm.wasmPaths = base;
              // 服务器已带 COOP/COEP 头，crossOriginIsolated=true 时可启用多线程
              const nThreads = crossOriginIsolated
                ? Math.min(navigator.hardwareConcurrency || 4, 4)
                : 1;
              o.env.wasm.numThreads = nThreads;
              o.env.wasm.simd = true;
              o.env.logLevel = "warning";
              console.log(`[sam-spike] ORT loaded, threads=${nThreads}, isolated=${crossOriginIsolated}`);
              return (ort = o);
            }
          } catch (e) {
            console.warn("[sam-spike] ORT CDN fail:", base, e);
          }
        }
        throw new Error("onnxruntime-web 加载失败（请检查网络）");
      })();
    }
    return ortPromise;
  }

  // ───────────────────────── IndexedDB 缓存 ─────────────────────────
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(CACHE_PREFIX, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains("models"))
          req.result.createObjectStore("models");
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async function idbGet(key) {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction("models", "readonly");
      const req = tx.objectStore("models").get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  }
  async function idbSet(key, buf) {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction("models", "readwrite");
      tx.objectStore("models").put(buf, key);
      tx.oncomplete = resolve;
      tx.onerror = () => resolve();
    });
  }

  // ───────────────────────── 模型字节获取（缓存优先） ─────────────────────────
  async function loadModelBytes(key, url, onProgress) {
    const cached = await idbGet(key);
    if (cached && cached.byteLength > 1_000_000) {
      return { bytes: new Uint8Array(cached), fromCache: true };
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`模型下载失败 HTTP ${res.status}: ${url}`);
    const total = parseInt(res.headers.get("content-length") || "0", 10);
    const reader = res.body.getReader();
    const chunks = [];
    let done = 0;
    while (true) {
      const { value, done: finished } = await reader.read();
      if (finished) break;
      chunks.push(value);
      done += value.byteLength;
      onProgress(done, total);
    }
    const out = new Uint8Array(done);
    let offset = 0;
    for (const c of chunks) {
      out.set(c, offset);
      offset += c.byteLength;
    }
    idbSet(key, out.buffer.slice(0)).catch(() => {});
    return { bytes: out, fromCache: false };
  }

  // ───────────────────────── Session 管理 ─────────────────────────
  // decoder（轻量）session 建在主线程；encoder（ViT-B，重量级）建在 Web Worker，
  // 避免编码期间冻结页面 —— 也是正式集成必须采用的架构。
  let sessions = null; // { decoder, ort, ep }
  let encWorker = null;
  let encInitResolve = null;
  let encInitReject = null;
  let encPending = null; // { resolve, reject }
  let currentEp = "wasm";

  // 依次尝试候选模型源，取第一个成功下载的
  async function loadFirstBytes(candidates, kind, key, onProgress) {
    let lastErr = null;
    for (const c of candidates) {
      try {
        return await loadModelBytes(key, c.url, (a, b) => onProgress(kind, a, b, c.label));
      } catch (e) {
        lastErr = e;
        console.warn(`[sam-spike] ${kind} 源失败:`, c.url, e);
      }
    }
    throw lastErr || new Error(kind + " 无可用模型源");
  }

  function startEncoderWorker(bytes) {
    const w = new Worker("./encoder.worker.js");
    w.onerror = (e) => {
      const p = encPending;
      encPending = null;
      if (encInitReject) encInitReject(new Error("encoder worker error: " + e.message));
      if (p) p.reject(new Error("encoder worker error: " + e.message));
    };
    w.onmessage = (e) => {
      const m = e.data;
      if (m.type === "ready") {
        encInitResolve && encInitResolve();
      } else if (m.type === "encoded") {
        const p = encPending;
        encPending = null;
        p && p.resolve(m);
      } else if (m.type === "error") {
        const p = encPending;
        encPending = null;
        if (encInitReject) encInitReject(new Error(m.message));
        if (p) p.reject(new Error(m.message));
      }
    };
    w.postMessage({ type: "init", bytes, ep: currentEp }, [bytes]);
    return w;
  }

  async function ensureSessions(ep, onProgress) {
    if (sessions && encWorker) return sessions;
    currentEp = ep || "wasm";
    onProgress = onProgress || (() => {});
    const ortLib = await getOrt();

    // 1) encoder：下载字节 + 交给 worker 建 session（主线程不阻塞）
    const encBytes = await loadFirstBytes(ENCODER_URLS, "encoder", "enc_int8_v1", onProgress);
    if (!encWorker) {
      const initP = new Promise((res, rej) => {
        encInitResolve = res;
        encInitReject = rej;
      });
      encWorker = startEncoderWorker(encBytes.bytes.buffer);
      await Promise.race([
        initP,
        new Promise((_, rej) => setTimeout(() => rej(new Error("encoder worker 初始化超时")), 90_000)),
      ]);
    }

    // 2) decoder：主线程建 session
    const decBytes = await loadFirstBytes(DECODER_URLS, "decoder", "dec_int8_v1", onProgress);
    const epList =
      currentEp === "webgpu" && ortLib.env.webgpu ? [{ name: "webgpu" }, "wasm"] : ["wasm"];
    const t0 = performance.now();
    const decoder = await ortLib.InferenceSession.create(decBytes.bytes, {
      executionProviders: epList,
    });
    console.log(
      `[sam-spike] decoder session built in ${Math.round(performance.now() - t0)}ms, fromCache=${decBytes.fromCache}`
    );
    sessions = { decoder, ort: ortLib, ep: currentEp };
    return sessions;
  }

  // ───────────────────────── 预处理：拉伸到 1024×1024 + 归一化 ─────────────────────────
  // 与 Meta SAM ONNX 官方 demo 相同的简化预处理（坐标空间自洽，见 index.html 提示）
  function prepareEncoderInput(canvas) {
    const S = 1024;
    const tmp = document.createElement("canvas");
    tmp.width = S;
    tmp.height = S;
    const tctx = tmp.getContext("2d", { willReadFrequently: true });
    tctx.drawImage(canvas, 0, 0, S, S);
    const px = tctx.getImageData(0, 0, S, S).data;
    const MEAN = [123.675, 116.28, 103.53]; // RGB
    const STD = [58.395, 57.12, 57.375];
    const out = new Float32Array(3 * S * S);
    for (let i = 0; i < S * S; i++) {
      out[i] = (px[i * 4] - MEAN[0]) / STD[0];
      out[S * S + i] = (px[i * 4 + 1] - MEAN[1]) / STD[1];
      out[2 * S * S + i] = (px[i * 4 + 2] - MEAN[2]) / STD[2];
    }
    return out;
  }

  // ───────────────────────── 编码（每张图一次，Worker 内执行） ─────────────────────────
  async function encodeImage(canvas, ep) {
    await ensureSessions(ep, () => {});
    const input = prepareEncoderInput(canvas);
    const t0 = performance.now();
    const res = await new Promise((resolve, reject) => {
      encPending = { resolve, reject };
      encWorker.postMessage({ type: "encode", input }, [input.buffer]);
    });
    const ms = Math.round(performance.now() - t0);
    const ortLib = await getOrt();
    const embedding = new ortLib.Tensor("float32", res.data, res.dims);
    console.log(
      `[sam-spike] encode ${ms}ms (worker内 ${res.ms}ms), embedding ${res.dims.join("x")}`
    );
    return { embedding, ms, workerMs: res.ms };
  }

  // ───────────────────────── Decoder 输入名解析 ─────────────────────────
  // 第三方导出的输入名可能与官方命名不同；优先按官方名取，取不到时报出真实名便于修正
  const DEC_IN_NAMES = {
    embedding: "image_embeddings",
    coords: "point_coords",
    labels: "point_labels",
    maskInput: "mask_input",
    hasMask: "has_mask_input",
    origSize: "orig_im_size",
  };
  function resolveDecoderInputs(session) {
    const names = session.inputNames;
    const mapping = {};
    for (const [key, canon] of Object.entries(DEC_IN_NAMES)) {
      if (names.includes(canon)) mapping[key] = canon;
    }
    const missing = Object.keys(DEC_IN_NAMES).filter((k) => !mapping[k]);
    if (missing.length) {
      throw new Error(
        `decoder 输入名与预期不符。实际 inputs=[${names.join(", ")}] outputs=[${session.outputNames.join(
          ", "
        )}] 缺少 ${missing.join(",")}，请修改 sam.js 中 DEC_IN_NAMES`
      );
    }
    return mapping;
  }

  /**
   * 解码一次：给定全部前景/背景点，输出与 canvas 等大的概率 mask
   * @param {object} embedding encodeImage 返回的 image_embeddings 张量
   * @param {{x:number,y:number,label:number}[]} points
   * @param {number} W canvas 宽
   * @param {number} H canvas 高
   * @param {boolean} refine 是否做一次迭代精化（第 2 轮 decoder）
   */
  async function decodeMask(embedding, points, W, H, refine) {
    const { decoder, ort } = await ensureSessions("", () => {});
    const inMap = resolveDecoderInputs(decoder);
    const n = points.length;

    const coordsArr = new Float32Array(n * 2);
    const labelsArr = new Float32Array(n);
    points.forEach((p, i) => {
      coordsArr[i * 2] = p.x;
      coordsArr[i * 2 + 1] = p.y;
      labelsArr[i] = p.label; // 1 前景 / 0 背景
    });

    const zeroMask = new Float32Array(256 * 256);
    const feeds = {
      [inMap.embedding]: embedding,
      [inMap.coords]: new ort.Tensor("float32", coordsArr, [1, n, 2]),
      [inMap.labels]: new ort.Tensor("float32", labelsArr, [1, n]),
      [inMap.maskInput]: new ort.Tensor("float32", zeroMask, [1, 1, 256, 256]),
      [inMap.hasMask]: new ort.Tensor("float32", [0], [1]),
      [inMap.origSize]: new ort.Tensor("float32", [H, W], [2]),
    };

    const pickBest = (out) => {
      // 输出名优先官方名，其次按顺序（masks / iou / low_res）
      const find = (prefer) =>
        prefer ? (prefer in out ? prefer : null) : null;
      const nameOf = (prefer, idx) => find(prefer) || decoder.outputNames[idx];
      const masksName = nameOf("masks", 0);
      const iouName = nameOf("iou_predictions", 1);
      const lowName = nameOf("low_res_masks", 2);
      const masks = out[masksName];
      const iou = out[iouName].data;
      const low = out[lowName];
      let best = 0;
      for (let i = 1; i < iou.length; i++) if (iou[i] > iou[best]) best = i;
      return { masks, low, best, iou: iou[best] };
    };

    const t0 = performance.now();
    const pass1 = await decoder.run(feeds);
    const ms1 = Math.round(performance.now() - t0);
    let r1 = pickBest(pass1);

    let ms2 = 0;
    if (refine) {
      // 第 2 轮：把上一轮 low_res（logits）作为 mask 提示做一次精化
      const lowData = new Float32Array(r1.low.data);
      const feeds2 = {
        ...feeds,
        [inMap.maskInput]: new ort.Tensor("float32", lowData, [1, 1, 256, 256]),
        [inMap.hasMask]: new ort.Tensor("float32", [1], [1]),
      };
      const t1 = performance.now();
      const pass2 = await decoder.run(feeds2);
      ms2 = Math.round(performance.now() - t1);
      const r2 = pickBest(pass2);
      if (r2.iou >= r1.iou) r1 = r2; // 精化结果更好才采纳
    }

    // 取 best 的 mask（概率，0~1），维度可能是 [1,3,H,W] 或 [1,3,256,256]，统一按原始值返回
    const mDims = r1.masks.dims;
    const mH = mDims[mDims.length - 2];
    const mW = mDims[mDims.length - 1];
    const stride = mW * mH;
    const slice = new Float32Array(r1.masks.data.buffer, r1.masks.data.byteOffset + r1.best * stride * 4, stride);

    return { mask: slice, mW, mH, ms1, ms2, iou: r1.iou };
  }

  window.SamSpike = {
    ENCODER_URLS,
    DECODER_URLS,
    getOrt,
    ensureSessions,
    encodeImage,
    decodeMask,
  };
})();
