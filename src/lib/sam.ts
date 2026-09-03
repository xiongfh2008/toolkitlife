/**
 * Browser-side SAM (Segment Anything) two-stage pipeline for the AI Object
 * Eraser tool. Mirrors the proven spike architecture (see spike-sam-hq/) and
 * the MI-GAN loader conventions in migan.ts:
 *
 *  - ONNX Runtime Web is lazy-loaded from CDN (WASM, multi-thread when the
 *    site's COOP/COEP headers make `crossOriginIsolated` true).
 *  - Encoder + decoder ONNX models are cached in IndexedDB (toolkitlife-models,
 *    same DB/store as migan) so the ~118 MB download happens only once.
 *  - The heavy encoder (ViT-B) session is built and run inside a dedicated
 *    Web Worker (/sam/encoder.worker.js) so encoding never freezes the page.
 *  - The lightweight decoder session lives on the main thread (few ms/click).
 *
 * Models: SAM ViT-B int8 (robgonsalves/segment-anything-8bit-onnx, MIT) —
 * the I/O contract matches HQ-SAM vit-b, so swapping to real HQ-SAM weights
 * later only means changing MODEL_URLS below.
 */

export interface SamPoint {
  x: number
  y: number
  label: 0 | 1 // 1 = foreground, 0 = background
}

export interface SamTensor {
  data: Float32Array
  dims: number[]
}

export interface EncodeResult {
  embedding: SamTensor
  ms: number
  workerMs: number
}

export interface DecodeResult {
  /** Probability (0~1) map of the best mask, resampled to the requested size. */
  mask: Float32Array
  ms1: number
  ms2: number
  iou: number
}

export type SamProgress = (kind: "encoder" | "decoder", done: number, total: number) => void

const ORT_VERSION = "1.21.0"
const ORT_CDN_LIST = [
  `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`,
  `https://unpkg.com/onnxruntime-web@${ORT_VERSION}/dist/`,
]
// huggingface.co sends CORS headers that satisfy the site-wide COEP
// (credentialless), so the same fetch path that migan.ts uses works here.
// hf-mirror.com is a keep-it-running fallback for regions where
// huggingface.co is unreachable (the fetch below tries sources in order).
const MODEL_URLS: Record<"encoder" | "decoder", string[]> = {
  encoder: [
    "https://huggingface.co/robgonsalves/segment-anything-8bit-onnx/resolve/main/sam_encoder.onnx",
    "https://hf-mirror.com/robgonsalves/segment-anything-8bit-onnx/resolve/main/sam_encoder.onnx",
  ],
  decoder: [
    "https://huggingface.co/robgonsalves/segment-anything-8bit-onnx/resolve/main/sam_decoder.onnx",
    "https://hf-mirror.com/robgonsalves/segment-anything-8bit-onnx/resolve/main/sam_decoder.onnx",
  ],
}
const ENCODER_KEY = "sam_enc_int8_v1"
const DECODER_KEY = "sam_dec_int8_v1"
const DB_NAME = "toolkitlife-models"
const STORE = "models"
const ENCODER_WORKER_URL = "/sam/encoder.worker.js"
const MIN_CACHE_BYTES = 1_000_000

// ─────────────────────────── ONNX Runtime (CDN) ───────────────────────────

interface OrtSession {
  inputNames: string[]
  outputNames: string[]
  run: (feeds: Record<string, SamTensor>) => Promise<Record<string, SamTensor>>
}
interface OrtLib {
  env: {
    wasm: { wasmPaths: string; numThreads: number; simd: boolean }
    logLevel: string
  }
  InferenceSession: {
    create: (
      data: Uint8Array | ArrayBuffer,
      opts?: { executionProviders?: (string | { name: string })[] }
    ) => Promise<OrtSession>
  }
  Tensor: new (
    type: "float32",
    data: Float32Array | number[],
    dims: number[]
  ) => SamTensor
}

let ortPromise: Promise<OrtLib> | null = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script")
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

async function getOrt(): Promise<OrtLib> {
  if (!ortPromise) {
    ortPromise = (async () => {
      const w = window as unknown as { ort?: OrtLib }
      if (w.ort) return w.ort
      for (const base of ORT_CDN_LIST) {
        try {
          await loadScript(`${base}ort.min.js`)
          const ort = w.ort as OrtLib | undefined
          if (ort) {
            ort.env.wasm.wasmPaths = base
            ort.env.wasm.numThreads = crossOriginIsolated
              ? Math.min(navigator.hardwareConcurrency || 4, 4)
              : 1
            ort.env.wasm.simd = true
            ort.env.logLevel = "warning"
            return ort
          }
        } catch (e) {
          console.warn("[sam] ONNX Runtime CDN failed:", base, e)
        }
      }
      throw new Error("Failed to load ONNX Runtime from CDN")
    })()
  }
  return ortPromise
}

// ─────────────────────────── IndexedDB cache ───────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idbGet(key: string): Promise<ArrayBuffer | null> {
  try {
    const db = await openDB()
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE, "readonly")
      const req = tx.objectStore(STORE).get(key)
      req.onsuccess = () => resolve((req.result as ArrayBuffer) || null)
      req.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

async function idbSet(key: string, buf: ArrayBuffer): Promise<void> {
  try {
    const db = await openDB()
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readwrite")
      tx.objectStore(STORE).put(buf, key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  } catch {
    // cache write is best-effort
  }
}

async function loadModelBytes(
  key: string,
  urls: string[],
  onProgress: (done: number, total: number) => void
): Promise<{ bytes: Uint8Array; fromCache: boolean }> {
  const cached = await idbGet(key)
  if (cached && cached.byteLength > MIN_CACHE_BYTES) {
    return { bytes: new Uint8Array(cached), fromCache: true }
  }
  let lastError: unknown = null
  for (const url of urls) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const total = parseInt(res.headers.get("content-length") || "0", 10)
      if (!res.body) {
        const buf = await res.arrayBuffer()
        void idbSet(key, buf.slice(0))
        return { bytes: new Uint8Array(buf), fromCache: false }
      }
      const reader = res.body.getReader()
      const chunks: Uint8Array[] = []
      let done = 0
      while (true) {
        const { value, done: finished } = await reader.read()
        if (finished) break
        chunks.push(value)
        done += value.byteLength
        onProgress(done, total)
      }
      const out = new Uint8Array(done)
      let offset = 0
      for (const c of chunks) {
        out.set(c, offset)
        offset += c.byteLength
      }
      void idbSet(key, out.buffer.slice(0))
      return { bytes: out, fromCache: false }
    } catch (e) {
      lastError = e
      console.warn("[sam] model download failed, trying next source:", url, e)
    }
  }
  throw new Error(`Model download failed: ${String(lastError)}`)
}

// ─────────────────────────── Encoder worker ───────────────────────────

interface EncWorker {
  worker: Worker
  ready: Promise<void>
  pending:
    | { resolve: (m: { ms: number; data: Float32Array; dims: number[] }) => void; reject: (e: Error) => void }
    | null
}

let enc: EncWorker | null = null
let decSessions: { decoder: OrtSession; ort: OrtLib } | null = null

function startEncoderWorker(bytes: ArrayBuffer): EncWorker {
  const worker = new Worker(ENCODER_WORKER_URL)
  let encInit: { resolve: () => void; reject: (e: Error) => void } | null = null
  const encWorker: EncWorker = {
    worker,
    ready: new Promise((resolve, reject) => {
      encInit = { resolve, reject }
    }),
    pending: null,
  }
  worker.onerror = (e) => {
    encInit?.reject(new Error(`Encoder worker error: ${e.message}`))
    encWorker.pending?.reject(new Error(`Encoder worker error: ${e.message}`))
    encWorker.pending = null
  }
  worker.onmessage = (e: MessageEvent) => {
    const m = e.data
    if (m.type === "ready") {
      encInit?.resolve()
    } else if (m.type === "encoded") {
      encWorker.pending?.resolve(m)
      encWorker.pending = null
    } else if (m.type === "error") {
      const err = new Error(m.message || "Encoder worker error")
      encInit?.reject(err)
      encWorker.pending?.reject(err)
      encWorker.pending = null
    }
  }
  worker.postMessage({ type: "init", bytes, ep: "wasm" }, [bytes])
  return encWorker
}

async function ensureEncoderWorker(bytes: Uint8Array): Promise<EncWorker> {
  if (enc) return enc
  enc = startEncoderWorker(bytes.buffer.slice(0) as ArrayBuffer)
  await Promise.race([
    enc.ready,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Encoder worker init timed out")), 90_000)
    ),
  ])
  return enc
}

async function loadDecoderSession(bytes: Uint8Array, ort: OrtLib): Promise<OrtSession> {
  const decoder = await ort.InferenceSession.create(bytes, {
    executionProviders: ["wasm"],
  })
  return decoder
}

/**
 * Ensure both SAM sessions are ready: encoder session in the worker,
 * decoder session on the main thread. Downloads are streamed with progress
 * and cached in IndexedDB.
 */
export async function ensureSamSessions(onProgress?: SamProgress): Promise<void> {
  if (enc && decSessions) return
  onProgress = onProgress ?? (() => {})

  const ort = await getOrt()

  if (!enc) {
    const encBytes = await loadModelBytes(ENCODER_KEY, MODEL_URLS.encoder, (done, total) =>
      onProgress!("encoder", done, total)
    )
    await ensureEncoderWorker(encBytes.bytes)
  }

  if (!decSessions) {
    const decBytes = await loadModelBytes(DECODER_KEY, MODEL_URLS.decoder, (done, total) =>
      onProgress!("decoder", done, total)
    )
    const decoder = await loadDecoderSession(decBytes.bytes, ort)
    decSessions = { decoder, ort }
  }
}

export async function isSamReady(): Promise<boolean> {
  return enc !== null && decSessions !== null
}

// ─────────────────────────── Preprocess & encode ───────────────────────────

/**
 * Preprocess: stretch the (already ≤1024) source canvas to 1024×1024 and
 * normalize RGB with ImageNet stats — same simplified preprocessing as the
 * spike / Meta ONNX demo. Coordinate space stays self-consistent.
 */
function prepareEncoderInput(canvas: HTMLCanvasElement): Float32Array {
  const S = 1024
  const tmp = document.createElement("canvas")
  tmp.width = S
  tmp.height = S
  const tctx = tmp.getContext("2d", { willReadFrequently: true })!
  tctx.drawImage(canvas, 0, 0, S, S)
  const px = tctx.getImageData(0, 0, S, S).data
  const MEAN = [123.675, 116.28, 103.53]
  const STD = [58.395, 57.12, 57.375]
  const out = new Float32Array(3 * S * S)
  for (let i = 0; i < S * S; i++) {
    out[i] = (px[i * 4] - MEAN[0]) / STD[0]
    out[S * S + i] = (px[i * 4 + 1] - MEAN[1]) / STD[1]
    out[2 * S * S + i] = (px[i * 4 + 2] - MEAN[2]) / STD[2]
  }
  return out
}

/**
 * Run the image encoder once for the given (already ≤1024 longest edge)
 * canvas. Returns the image_embeddings tensor. Runs inside the worker.
 */
export async function encodeImage(canvas: HTMLCanvasElement): Promise<EncodeResult> {
  await ensureSamSessions()
  const encWorker = enc!
  const input = prepareEncoderInput(canvas)
  const t0 = performance.now()
  const res = await new Promise<{ ms: number; data: Float32Array; dims: number[] }>(
    (resolve, reject) => {
      encWorker.pending = { resolve, reject }
      encWorker.worker.postMessage({ type: "encode", input }, [input.buffer])
    }
  )
  const ort = await getOrt()
  const embedding = new ort.Tensor("float32", res.data, res.dims)
  return { embedding, ms: Math.round(performance.now() - t0), workerMs: res.ms }
}

// ─────────────────────────── Decoder ───────────────────────────

const DEC_IN = {
  embedding: "image_embeddings",
  coords: "point_coords",
  labels: "point_labels",
  maskInput: "mask_input",
  hasMask: "has_mask_input",
  origSize: "orig_im_size",
}

function resolveDecoderInputs(session: OrtSession): Record<string, string> {
  const names = session.inputNames
  const mapping: Record<string, string> = {}
  for (const [key, canon] of Object.entries(DEC_IN)) {
    if (names.includes(canon)) mapping[key] = canon
  }
  const missing = Object.keys(DEC_IN).filter((k) => !mapping[k])
  if (missing.length) {
    throw new Error(
      `SAM decoder input names mismatch. inputs=[${names.join(", ")}] missing ${missing.join(", ")}`
    )
  }
  return mapping
}

/**
 * Decode once with the current prompt points and return the best mask as a
 * probability map of the given display size (nearest-neighbour resample).
 * `refine` runs a second decoder pass feeding back low_res_masks (kept only
 * when it improves predicted IoU).
 *
 * Coordinate space: the encoder input is the display canvas STRETCHED to
 * 1024×1024 (see prepareEncoderInput), so prompt points must be mapped into
 * that same 1024 grid and orig_im_size must be [1024, 1024] — otherwise the
 * prompt lands on the wrong image location and SAM selects the wrong region.
 */
export async function decodeMask(
  embedding: SamTensor,
  points: SamPoint[],
  dispW: number,
  dispH: number,
  refine = true
): Promise<DecodeResult> {
  await ensureSamSessions()
  const { decoder, ort } = decSessions!
  const inMap = resolveDecoderInputs(decoder)
  const n = points.length
  if (!n) throw new Error("No points")

  const S = 1024 // encoder input grid
  const coordsArr = new Float32Array(n * 2)
  const labelsArr = new Float32Array(n)
  points.forEach((p, i) => {
    coordsArr[i * 2] = p.x * (S / dispW)
    coordsArr[i * 2 + 1] = p.y * (S / dispH)
    labelsArr[i] = p.label
  })

  const zeroMask = new Float32Array(256 * 256)
  const feeds: Record<string, SamTensor> = {
    [inMap.embedding]: embedding,
    [inMap.coords]: new ort.Tensor("float32", coordsArr, [1, n, 2]),
    [inMap.labels]: new ort.Tensor("float32", labelsArr, [1, n]),
    [inMap.maskInput]: new ort.Tensor("float32", zeroMask, [1, 1, 256, 256]),
    [inMap.hasMask]: new ort.Tensor("float32", [0], [1]),
    [inMap.origSize]: new ort.Tensor("float32", [S, S], [2]),
  }

  const pickBest = (out: Record<string, SamTensor>) => {
    const masksName = "masks" in out ? "masks" : decoder.outputNames[0]
    const iouName = "iou_predictions" in out ? "iou_predictions" : decoder.outputNames[1]
    const lowName = "low_res_masks" in out ? "low_res_masks" : decoder.outputNames[2]
    const iou = out[iouName].data
    let best = 0
    for (let i = 1; i < iou.length; i++) if (iou[i] > iou[best]) best = i
    return {
      masks: out[masksName],
      low: out[lowName],
      best,
      iou: iou[best],
    }
  }

  const t0 = performance.now()
  const pass1 = await decoder.run(feeds)
  const ms1 = Math.round(performance.now() - t0)
  let r1 = pickBest(pass1)

  let ms2 = 0
  if (refine && r1.low) {
    const feeds2: Record<string, SamTensor> = {
      ...feeds,
      [inMap.maskInput]: new ort.Tensor("float32", new Float32Array(r1.low.data), [1, 1, 256, 256]),
      [inMap.hasMask]: new ort.Tensor("float32", [1], [1]),
    }
    const t1 = performance.now()
    const pass2 = await decoder.run(feeds2)
    ms2 = Math.round(performance.now() - t1)
    const r2 = pickBest(pass2)
    if (r2.iou >= r1.iou) r1 = r2
  }

  const mDims = r1.masks.dims
  const mH = mDims[mDims.length - 2]
  const mW = mDims[mDims.length - 1]
  const stride = mW * mH
  const raw = new Float32Array(
    r1.masks.data.buffer,
    r1.masks.data.byteOffset + r1.best * stride * 4,
    stride
  )

  // Model output may be logits (any negative value) → map to 0~1 probability.
  let needsSigmoid = false
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] < 0) {
      needsSigmoid = true
      break
    }
  }
  const prob = needsSigmoid
    ? new Float32Array(raw.map((v) => 1 / (1 + Math.exp(-v))))
    : new Float32Array(raw)

  return {
    mask: resampleMask(prob, mW, mH, dispW, dispH),
    ms1,
    ms2,
    iou: r1.iou,
  }
}

/** Nearest-neighbour resample of a probability map (keeps selection crisp). */
function resampleMask(src: Float32Array, sW: number, sH: number, dW: number, dH: number): Float32Array {
  if (sW === dW && sH === dH) return src
  const out = new Float32Array(dW * dH)
  for (let y = 0; y < dH; y++) {
    const sy = Math.min(sH - 1, Math.floor((y * sH) / dH))
    const srcRow = sy * sW
    const dstRow = y * dW
    for (let x = 0; x < dW; x++) {
      const sx = Math.min(sW - 1, Math.floor((x * sW) / dW))
      out[dstRow + x] = src[srcRow + sx]
    }
  }
  return out
}
