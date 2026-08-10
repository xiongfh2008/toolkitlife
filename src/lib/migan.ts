/**
 * MI-GAN (Picsart Research, ICCV 2023) inpainting engine, running 100% in the browser.
 *
 * - Model: migan.onnx (~29 MB) hosted by lxfater/inpaint-web on Hugging Face.
 * - Runtime: ONNX Runtime Web loaded from CDN (WebGPU → WebGL → WASM fallback).
 * - Input:  [1, 4, 512, 512] float32 — channels [mask-0.5, R·mask, G·mask, B·mask],
 *           image normalized to [-1, 1], mask: 1 = keep, 0 = inpaint (Picsart spec).
 * - Output: [1, 3, 512, 512] float32 in [-1, 1] → RGB.
 *
 * Pipeline reference: github.com/IamRamgarhia/free-ai-watermark-remover (MIT)
 */

const ORT_VERSION = '1.20.1'
const ORT_CDN_LIST = [
  `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`,
  `https://unpkg.com/onnxruntime-web@${ORT_VERSION}/dist/`,
]
const MODEL_URL = 'https://huggingface.co/lxfater/inpaint-web/resolve/main/migan.onnx'
const MODEL_SIZE = 512
const DB_NAME = 'toolkitlife-models'
const DB_VERSION = 1
const STORE = 'models'
const MODEL_KEY = 'migan_v1'

// ─────────────────────────── ONNX Runtime (CDN) ───────────────────────────

interface OrtTensor {
  data: Float32Array
  dims: number[]
  type: string
}
interface OrtSession {
  inputNames: string[]
  outputNames: string[]
  run: (feeds: Record<string, OrtTensor>) => Promise<Record<string, OrtTensor>>
}
interface OrtNamespace {
  env: {
    wasm: { wasmPaths: string; numThreads: number; simd: boolean; proxy: boolean }
    logLevel: string
  }
  InferenceSession: {
    create: (
      data: Uint8Array | ArrayBuffer,
      opts: { executionProviders: string[]; graphOptimizationLevel: string }
    ) => Promise<OrtSession>
  }
  Tensor: new (type: 'float32', data: Float32Array, dims: number[]) => OrtTensor
}

let ortPromise: Promise<OrtNamespace> | null = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

function getOrt(): Promise<OrtNamespace> {
  if (!ortPromise) {
    ortPromise = (async () => {
      const w = window as unknown as { ort?: OrtNamespace }
      if (w.ort) return w.ort
      for (const base of ORT_CDN_LIST) {
        try {
          await loadScript(`${base}ort.min.js`)
          const ort = w.ort as OrtNamespace | undefined
          if (ort) {
            ort.env.wasm.wasmPaths = base
            ort.env.wasm.numThreads = Math.min(navigator.hardwareConcurrency || 4, 4)
            ort.env.wasm.simd = true
            ort.env.wasm.proxy = false
            ort.env.logLevel = 'warning'
            return ort
          }
        } catch (e) {
          console.warn('[migan] ONNX Runtime CDN failed:', base, e)
        }
      }
      throw new Error('Failed to load ONNX Runtime from CDN')
    })()
  }
  return ortPromise
}

// ─────────────────────────── Model cache (IndexedDB) ───────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idbGet(key: string): Promise<ArrayBuffer | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(key)
    req.onsuccess = () => resolve((req.result as ArrayBuffer) || null)
    req.onerror = () => reject(req.error)
  })
}

async function idbSet(key: string, value: ArrayBuffer): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const req = tx.objectStore(STORE).put(value, key)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

async function loadModelBytes(
  onProgress: (done: number, total: number) => void
): Promise<Uint8Array> {
  try {
    const cached = await idbGet(MODEL_KEY)
    if (cached && cached.byteLength > 1_000_000) {
      return new Uint8Array(cached)
    }
  } catch {
    // ignore cache errors, re-download
  }

  const res = await fetch(MODEL_URL)
  if (!res.ok) throw new Error(`Could not download AI model (HTTP ${res.status})`)
  const total = parseInt(res.headers.get('content-length') || '0', 10)

  if (!res.body) {
    const buf = await res.arrayBuffer()
    return new Uint8Array(buf)
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

  try {
    await idbSet(MODEL_KEY, out.buffer.slice(0))
  } catch {
    // cache write is best-effort
  }
  return out
}

// ─────────────────────────── Session ───────────────────────────

type ProgressFn = (stage: 'model' | 'inpaint', pct: number) => void

let sessionPromise: Promise<OrtSession> | null = null
let session: OrtSession | null = null

export async function ensureSession(onProgress?: ProgressFn): Promise<OrtSession> {
  if (session) return session
  if (!sessionPromise) {
    sessionPromise = (async () => {
      try {
        onProgress?.('model', 0.02)
        const bytes = await loadModelBytes((done, total) => {
          onProgress?.('model', total > 0 ? Math.min(0.02 + (done / total) * 0.85, 0.87) : 0.1)
        })
        onProgress?.('model', 0.9)
        const ort = await getOrt()
        const providers = ['webgpu', 'webgl', 'wasm']
        let lastErr: unknown = null
        for (const ep of providers) {
          try {
            const s = await ort.InferenceSession.create(bytes, {
              executionProviders: [ep],
              graphOptimizationLevel: 'all',
            })
            session = s
            onProgress?.('model', 1)
            return s
          } catch (e) {
            console.warn(`[migan] backend ${ep} unavailable:`, e)
            lastErr = e
          }
        }
        throw new Error(
          `No usable ONNX backend (WebGPU/WebGL/WASM all failed). Last error: ${
            lastErr instanceof Error ? lastErr.message : String(lastErr)
          }`
        )
      } catch (e) {
        sessionPromise = null // allow retry
        throw e
      }
    })()
  }
  return sessionPromise
}

export async function isMiganReady(): Promise<boolean> {
  return session !== null
}

// ─────────────────────────── Image helpers ───────────────────────────

function cropImageData(img: ImageData, x: number, y: number, w: number, h: number): ImageData {
  const out = new ImageData(w, h)
  for (let j = 0; j < h; j++) {
    const src = (y + j) * img.width + x
    const dst = j * w
    out.data.set(img.data.subarray(src * 4, (src + w) * 4), dst * 4)
  }
  return out
}

function resizeImageData(src: ImageData, dw: number, dh: number): ImageData {
  if (src.width === dw && src.height === dh) return src
  // Use canvas drawImage for resampling: the browser picks a high-quality
  // filter (bicubic-class) that keeps upscaled crops sharp, unlike a naive
  // bilinear loop which visibly blurs 2-4x upscales of the 512px model output.
  const sc = document.createElement('canvas')
  sc.width = src.width
  sc.height = src.height
  sc.getContext('2d')!.putImageData(src, 0, 0)
  const c = document.createElement('canvas')
  c.width = dw
  c.height = dh
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(sc, 0, 0, dw, dh)
  return ctx.getImageData(0, 0, dw, dh)
}

/** Bounding box of non-transparent pixels (alpha > 16). */
function findMaskBbox(maskData: ImageData): { x: number; y: number; w: number; h: number } | null {
  const { width, height, data } = maskData
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 16) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return null
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 }
}

/**
 * MI-GAN 4-channel input (matches Picsart's official preprocess()):
 *   x = concat([mask - 0.5, img_norm * mask], axis=1)
 * with img in [-1, 1] and mask 1 = keep / 0 = inpaint.
 */
function buildMIGANInput(imageData: ImageData, maskData: ImageData): Float32Array {
  const { width, height, data: img } = imageData
  const maskBytes = maskData.data
  const size = width * height
  const out = new Float32Array(4 * size)
  for (let i = 0; i < size; i++) {
    const isInpaint = maskBytes[i * 4 + 3] > 64
    const mask = isInpaint ? 0 : 1
    const r = (img[i * 4] / 255) * 2 - 1
    const g = (img[i * 4 + 1] / 255) * 2 - 1
    const b = (img[i * 4 + 2] / 255) * 2 - 1
    out[i] = mask - 0.5
    out[i + size] = r * mask
    out[i + size * 2] = g * mask
    out[i + size * 3] = b * mask
  }
  return out
}

/** Convert [-1, 1] CHW float output → RGBA ImageData. */
function miganOutputToImageData(chw: Float32Array, w: number, h: number): ImageData {
  const out = new Uint8ClampedArray(w * h * 4)
  const size = w * h
  for (let i = 0; i < size; i++) {
    out[i * 4] = Math.max(0, Math.min(1, chw[i] * 0.5 + 0.5)) * 255
    out[i * 4 + 1] = Math.max(0, Math.min(1, chw[i + size] * 0.5 + 0.5)) * 255
    out[i * 4 + 2] = Math.max(0, Math.min(1, chw[i + size * 2] * 0.5 + 0.5)) * 255
    out[i * 4 + 3] = 255
  }
  return new ImageData(out, w, h)
}

/** Binarize a mask (alpha > 64 → 255) then gaussian-feather it. Returns blurred ImageData. */
function featherMaskBinary(maskData: ImageData, radius: number): ImageData {
  const w = maskData.width
  const h = maskData.height
  const binary = new ImageData(w, h)
  for (let i = 0; i < w * h; i++) {
    const v = maskData.data[i * 4 + 3] > 64 ? 255 : 0
    binary.data[i * 4] = v
    binary.data[i * 4 + 1] = v
    binary.data[i * 4 + 2] = v
    binary.data[i * 4 + 3] = v
  }
  const src = document.createElement('canvas')
  src.width = w
  src.height = h
  const sctx = src.getContext('2d')!
  sctx.putImageData(binary, 0, 0)

  const dst = document.createElement('canvas')
  dst.width = w
  dst.height = h
  const dctx = dst.getContext('2d')!
  if (radius > 0) dctx.filter = `blur(${radius}px)`
  dctx.drawImage(src, 0, 0)
  return dctx.getImageData(0, 0, w, h)
}

/** Blend an inpainted crop back into the original with a binarized + feathered mask. */
function pasteCropWithMask(
  original: ImageData,
  cropResult: ImageData,
  cropMask: ImageData,
  offsetX: number,
  offsetY: number,
  featherRadius: number
): ImageData {
  const W = original.width
  const H = original.height
  const cw = cropResult.width
  const ch = cropResult.height
  const feather = featherMaskBinary(cropMask, featherRadius)
  const result = new ImageData(new Uint8ClampedArray(original.data), W, H)
  for (let j = 0; j < ch; j++) {
    const ty = offsetY + j
    if (ty < 0 || ty >= H) continue
    for (let i = 0; i < cw; i++) {
      const tx = offsetX + i
      if (tx < 0 || tx >= W) continue
      const a = feather.data[(j * cw + i) * 4 + 3] / 255
      if (a <= 0.003) continue
      const di = (ty * W + tx) * 4
      const si = (j * cw + i) * 4
      result.data[di] = cropResult.data[si] * a + original.data[di] * (1 - a)
      result.data[di + 1] = cropResult.data[si + 1] * a + original.data[di + 1] * (1 - a)
      result.data[di + 2] = cropResult.data[si + 2] * a + original.data[di + 2] * (1 - a)
    }
  }
  return result
}

// ─────────────────────────── Public API ───────────────────────────

export interface MiganOptions {
  featherRadius?: number
}

/**
 * Inpaint the masked area of an image with MI-GAN.
 * Mask convention: alpha > 64 in `maskData` = region to remove.
 */
export async function inpaintWithMigan(
  imageData: ImageData,
  maskData: ImageData,
  onProgress?: ProgressFn,
  opts: MiganOptions = {}
): Promise<ImageData> {
  const session = await ensureSession(onProgress)
  const { width: W, height: H } = imageData

  const bbox = findMaskBbox(maskData)
  if (!bbox) return imageData

  const maskDim = Math.max(bbox.w, bbox.h)
  const desiredSize = Math.max(MODEL_SIZE, maskDim * 3)
  const cropSize = Math.min(desiredSize, Math.min(W, H))
  const centerX = bbox.x + bbox.w / 2
  const centerY = bbox.y + bbox.h / 2
  let cropX = Math.round(centerX - cropSize / 2)
  let cropY = Math.round(centerY - cropSize / 2)
  cropX = Math.max(0, Math.min(W - cropSize, cropX))
  cropY = Math.max(0, Math.min(H - cropSize, cropY))

  const cropImage = cropImageData(imageData, cropX, cropY, cropSize, cropSize)
  const cropMask = cropImageData(maskData, cropX, cropY, cropSize, cropSize)
  const inferImage = resizeImageData(cropImage, MODEL_SIZE, MODEL_SIZE)
  const inferMask = resizeImageData(cropMask, MODEL_SIZE, MODEL_SIZE)

  onProgress?.('inpaint', 0.1)
  const ort = await getOrt()
  const input = buildMIGANInput(inferImage, inferMask)
  const feeds: Record<string, OrtTensor> = {}
  feeds[session.inputNames[0]] = new ort.Tensor('float32', input, [1, 4, MODEL_SIZE, MODEL_SIZE])

  const output = await session.run(feeds)
  const outName = session.outputNames[0] || Object.keys(output)[0]
  const out = output[outName]
  const outH = out.dims[2] || MODEL_SIZE
  const outW = out.dims[3] || MODEL_SIZE
  const inferResult = miganOutputToImageData(out.data, outW, outH)
  onProgress?.('inpaint', 0.7)

  const cropResult = resizeImageData(inferResult, cropSize, cropSize)
  onProgress?.('inpaint', 0.9)

  return pasteCropWithMask(
    imageData,
    cropResult,
    cropMask,
    cropX,
    cropY,
    opts.featherRadius ?? 6
  )
}

export interface MiganPatch {
  blob: Blob
  x: number
  y: number
  w: number
  h: number
}

/**
 * Run MI-GAN once on a frame and produce a transparent PNG patch (inpainted
 * content inside the masked area, feathered alpha edges, transparent elsewhere).
 * Used by the video tool to overlay the patch on every frame via FFmpeg.
 */
export async function makeMiganPatch(
  imageData: ImageData,
  maskData: ImageData,
  onProgress?: ProgressFn,
  opts: MiganOptions = {}
): Promise<MiganPatch> {
  const session = await ensureSession(onProgress)
  const { width: W, height: H } = imageData

  const bbox = findMaskBbox(maskData)
  if (!bbox) throw new Error('Mask is empty')

  const maskDim = Math.max(bbox.w, bbox.h)
  const desiredSize = Math.max(MODEL_SIZE, maskDim * 3)
  const cropSize = Math.min(desiredSize, Math.min(W, H))
  const centerX = bbox.x + bbox.w / 2
  const centerY = bbox.y + bbox.h / 2
  let cropX = Math.round(centerX - cropSize / 2)
  let cropY = Math.round(centerY - cropSize / 2)
  cropX = Math.max(0, Math.min(W - cropSize, cropX))
  cropY = Math.max(0, Math.min(H - cropSize, cropY))

  const cropImage = cropImageData(imageData, cropX, cropY, cropSize, cropSize)
  const cropMask = cropImageData(maskData, cropX, cropY, cropSize, cropSize)
  const inferImage = resizeImageData(cropImage, MODEL_SIZE, MODEL_SIZE)
  const inferMask = resizeImageData(cropMask, MODEL_SIZE, MODEL_SIZE)

  onProgress?.('inpaint', 0.1)
  const ort = await getOrt()
  const input = buildMIGANInput(inferImage, inferMask)
  const feeds: Record<string, OrtTensor> = {}
  feeds[session.inputNames[0]] = new ort.Tensor('float32', input, [1, 4, MODEL_SIZE, MODEL_SIZE])

  const output = await session.run(feeds)
  const outName = session.outputNames[0] || Object.keys(output)[0]
  const out = output[outName]
  const outH = out.dims[2] || MODEL_SIZE
  const outW = out.dims[3] || MODEL_SIZE
  const inferResult = miganOutputToImageData(out.data, outW, outH)
  onProgress?.('inpaint', 0.7)

  const cropResult = resizeImageData(inferResult, cropSize, cropSize)
  const feather = featherMaskBinary(cropMask, opts.featherRadius ?? 6)

  // RGBA patch: RGB from AI result, alpha = feathered mask
  const patch = new ImageData(cropSize, cropSize)
  for (let i = 0; i < cropSize * cropSize; i++) {
    patch.data[i * 4] = cropResult.data[i * 4]
    patch.data[i * 4 + 1] = cropResult.data[i * 4 + 1]
    patch.data[i * 4 + 2] = cropResult.data[i * 4 + 2]
    patch.data[i * 4 + 3] = feather.data[i * 4 + 3]
  }

  const canvas = document.createElement('canvas')
  canvas.width = cropSize
  canvas.height = cropSize
  const ctx = canvas.getContext('2d')!
  ctx.putImageData(patch, 0, 0)
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Failed to create patch PNG'))), 'image/png')
  })
  onProgress?.('inpaint', 1)

  return { blob, x: cropX, y: cropY, w: cropSize, h: cropSize }
}
