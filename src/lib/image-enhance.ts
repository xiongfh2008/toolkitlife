/**
 * Browser-side image enhancement algorithms.
 * All functions are pure: they take an ImageData (RGBA) and return a new one.
 * Processing is synchronous — callers should downscale very large images first.
 */

export interface EnhanceParams {
  [key: string]: number;
}

const clamp = (v: number, min = 0, max = 255) =>
  v < min ? min : v > max ? max : v;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Build a Gaussian convolution kernel for a given radius (sigma = radius/2). */
function gaussianKernel(radius: number): { kernel: number[]; size: number } {
  const size = radius * 2 + 1;
  const sigma = Math.max(1, radius / 2);
  const kernel = new Array<number>(size * size);
  let sum = 0;
  const twoSigma2 = 2 * sigma * sigma;
  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      const w = Math.exp(-(x * x + y * y) / twoSigma2);
      kernel[(y + radius) * size + (x + radius)] = w;
      sum += w;
    }
  }
  for (let i = 0; i < kernel.length; i++) kernel[i] /= sum;
  return { kernel, size };
}

/** Apply a separable box blur (radius iterations) — fast approximation. */
export function boxBlur(src: ImageData, radius: number): ImageData {
  const { width, height, data } = src;
  const out = new ImageData(width, height);
  const tmp = new Uint8ClampedArray(data);
  const srcData = new Uint8ClampedArray(data);
  for (let pass = 0; pass < radius; pass++) {
    // Horizontal
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let n = 0;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = clamp(x + dx, 0, width - 1);
          const j = (y * width + xx) * 4;
          r += srcData[j];
          g += srcData[j + 1];
          b += srcData[j + 2];
          a += srcData[j + 3];
          n++;
        }
        tmp[i] = r / n;
        tmp[i + 1] = g / n;
        tmp[i + 2] = b / n;
        tmp[i + 3] = a / n;
      }
    }
    // Vertical
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = clamp(y + dy, 0, height - 1);
          const j = (yy * width + x) * 4;
          r += tmp[j];
          g += tmp[j + 1];
          b += tmp[j + 2];
          a += tmp[j + 3];
          n++;
        }
        out.data[i] = r / n;
        out.data[i + 1] = g / n;
        out.data[i + 2] = b / n;
        out.data[i + 3] = a / n;
      }
    }
    srcData.set(out.data);
  }
  return out;
}

/** 1. Image denoising — median filter (radius 1 or 2). */
export function denoise(
  src: ImageData,
  radius: number,
  strength: number
): ImageData {
  const { width, height, data } = src;
  const out = new ImageData(width, height);
  const r = Math.max(1, Math.min(2, Math.round(radius)));
  const winSize = (2 * r + 1) ** 2;
  const rArr = new Uint8ClampedArray(winSize);
  const gArr = new Uint8ClampedArray(winSize);
  const bArr = new Uint8ClampedArray(winSize);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let n = 0;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const xx = clamp(x + dx, 0, width - 1);
          const yy = clamp(y + dy, 0, height - 1);
          const i = (yy * width + xx) * 4;
          rArr[n] = data[i];
          gArr[n] = data[i + 1];
          bArr[n] = data[i + 2];
          n++;
        }
      }
      rArr.sort();
      gArr.sort();
      bArr.sort();
      const mid = n >> 1;
      const i = (y * width + x) * 4;
      out.data[i] = lerp(data[i], rArr[mid], strength);
      out.data[i + 1] = lerp(data[i + 1], gArr[mid], strength);
      out.data[i + 2] = lerp(data[i + 2], bArr[mid], strength);
      out.data[i + 3] = data[i + 3];
    }
  }
  return out;
}

/** 2. Deblurring — iterated unsharp (Laplacian) convolution. */
export function deblur(
  src: ImageData,
  strength: number,
  iterations: number
): ImageData {
  let current = src;
  const iters = clamp(Math.round(iterations), 1, 5);
  const s = strength / 100;
  for (let it = 0; it < iters; it++) {
    const { width, height, data } = current;
    const out = new ImageData(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const c = data[i];
        const cg = data[i + 1];
        const cb = data[i + 2];
        const t = data[(clamp(y - 1, 0, height - 1) * width + x) * 4];
        const b = data[(clamp(y + 1, 0, height - 1) * width + x) * 4];
        const l = data[(y * width + clamp(x - 1, 0, width - 1)) * 4];
        const r = data[(y * width + clamp(x + 1, 0, width - 1)) * 4];
        const lap = 4 * c - t - b - l - r;
        out.data[i] = clamp(c + s * lap);
        const tg = data[(clamp(y - 1, 0, height - 1) * width + x) * 4 + 1];
        const bg = data[(clamp(y + 1, 0, height - 1) * width + x) * 4 + 1];
        const lg = data[(y * width + clamp(x - 1, 0, width - 1)) * 4 + 1];
        const rg = data[(y * width + clamp(x + 1, 0, width - 1)) * 4 + 1];
        out.data[i + 1] = clamp(cg + s * (4 * cg - tg - bg - lg - rg));
        const tb = data[(clamp(y - 1, 0, height - 1) * width + x) * 4 + 2];
        const bb = data[(clamp(y + 1, 0, height - 1) * width + x) * 4 + 2];
        const lb = data[(y * width + clamp(x - 1, 0, width - 1)) * 4 + 2];
        const rb = data[(y * width + clamp(x + 1, 0, width - 1)) * 4 + 2];
        out.data[i + 2] = clamp(cb + s * (4 * cb - tb - bb - lb - rb));
        out.data[i + 3] = data[i + 3];
      }
    }
    current = out;
  }
  return current;
}

/** 3. Unsharp mask — original + amount * (original − blur). */
export function unsharpMask(
  src: ImageData,
  amount: number,
  radius: number
): ImageData {
  const { width, height, data } = src;
  const a = amount / 100;
  const blurred = gaussianBlur(src, Math.max(1, Math.round(radius)));
  const out = new ImageData(width, height);
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const diff = data[i + c] - blurred.data[i + c];
      out.data[i + c] = clamp(data[i + c] + a * diff);
    }
    out.data[i + 3] = data[i + 3];
  }
  return out;
}

/** Gaussian blur (used by unsharp mask and others). */
export function gaussianBlur(src: ImageData, radius: number): ImageData {
  const { kernel, size } = gaussianKernel(radius);
  const { width, height, data } = src;
  const out = new ImageData(width, height);
  const half = size >> 1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let ky = 0; ky < size; ky++) {
        const yy = clamp(y + ky - half, 0, height - 1);
        for (let kx = 0; kx < size; kx++) {
          const xx = clamp(x + kx - half, 0, width - 1);
          const i = (yy * width + xx) * 4;
          const w = kernel[ky * size + kx];
          r += data[i] * w;
          g += data[i + 1] * w;
          b += data[i + 2] * w;
          a += data[i + 3] * w;
        }
      }
      const i = (y * width + x) * 4;
      out.data[i] = r;
      out.data[i + 1] = g;
      out.data[i + 2] = b;
      out.data[i + 3] = a;
    }
  }
  return out;
}

/** 4. White balance — gray-world correction with strength mixing. */
export function whiteBalance(src: ImageData, strength: number): ImageData {
  const { width, height, data } = src;
  const s = strength / 100;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 4) {
    sumR += data[i];
    sumG += data[i + 1];
    sumB += data[i + 2];
    n++;
  }
  const avgR = sumR / n;
  const avgG = sumG / n;
  const avgB = sumB / n;
  const gray = (avgR + avgG + avgB) / 3;
  const gainR = gray / (avgR || 1);
  const gainG = gray / (avgG || 1);
  const gainB = gray / (avgB || 1);
  const out = new ImageData(width, height);
  for (let i = 0; i < data.length; i += 4) {
    out.data[i] = lerp(data[i], clamp(data[i] * gainR), s);
    out.data[i + 1] = lerp(data[i + 1], clamp(data[i + 1] * gainG), s);
    out.data[i + 2] = lerp(data[i + 2], clamp(data[i + 2] * gainB), s);
    out.data[i + 3] = data[i + 3];
  }
  return out;
}

/** 5. Auto contrast — percentile-based min/max stretch. */
export function autoContrast(src: ImageData, clipPercent: number): ImageData {
  const { width, height, data } = src;
  const hist = new Uint32Array(256);
  for (let i = 0; i < data.length; i += 4) {
    hist[data[i]]++;
    hist[data[i + 1]]++;
    hist[data[i + 2]]++;
  }
  const total = (width * height * 3) / 100;
  const clip = Math.max(0, Math.min(49, clipPercent));
  let lo = 0;
  let hi = 255;
  let acc = 0;
  for (let v = 0; v < 256; v++) {
    acc += hist[v];
    if (acc >= clip * total) {
      lo = v;
      break;
    }
  }
  acc = 0;
  for (let v = 255; v >= 0; v--) {
    acc += hist[v];
    if (acc >= clip * total) {
      hi = v;
      break;
    }
  }
  const range = hi - lo || 1;
  const out = new ImageData(width, height);
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      out.data[i + c] = clamp(((data[i + c] - lo) / range) * 255);
    }
    out.data[i + 3] = data[i + 3];
  }
  return out;
}

/** 6. Histogram equalization on luma with strength mixing. */
export function histogramEqualize(src: ImageData, strength: number): ImageData {
  const { width, height, data } = src;
  const s = strength / 100;
  const hist = new Uint32Array(256);
  for (let i = 0; i < data.length; i += 4) {
    const y = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    hist[y]++;
  }
  const total = width * height;
  const cdf = new Float64Array(256);
  let acc = 0;
  for (let v = 0; v < 256; v++) {
    acc += hist[v];
    cdf[v] = (acc / total) * 255;
  }
  const out = new ImageData(width, height);
  for (let i = 0; i < data.length; i += 4) {
    const y = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const eq = cdf[clamp(Math.round(y))];
    const scale = y === 0 ? 1 : eq / y;
    out.data[i] = lerp(data[i], clamp(data[i] * scale), s);
    out.data[i + 1] = lerp(data[i + 1], clamp(data[i + 1] * scale), s);
    out.data[i + 2] = lerp(data[i + 2], clamp(data[i + 2] * scale), s);
    out.data[i + 3] = data[i + 3];
  }
  return out;
}

/** 7. HDR tone mapping — Reinhard operator with exposure + strength. */
export function hdrToneMapping(
  src: ImageData,
  exposure: number,
  strength: number
): ImageData {
  const { width, height, data } = src;
  const e = exposure / 100;
  const s = strength / 100;
  const out = new ImageData(width, height);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    const ln = l * e;
    const ld = ln / (1 + ln);
    const scale = ln === 0 ? 1 : ld / ln;
    out.data[i] = lerp(data[i], clamp(r * scale * 255), s);
    out.data[i + 1] = lerp(data[i + 1], clamp(g * scale * 255), s);
    out.data[i + 2] = lerp(data[i + 2], clamp(b * scale * 255), s);
    out.data[i + 3] = data[i + 3];
  }
  return out;
}

/** 8. Dehaze — simplified dark channel prior. */
export function dehaze(
  src: ImageData,
  strength: number,
  windowSize: number
): ImageData {
  const { width, height, data } = src;
  const s = strength / 100;
  const win = Math.max(3, Math.min(31, Math.round(windowSize)));
  const half = win >> 1;

  // Dark channel: local min across RGB.
  const dark = new Uint8ClampedArray(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      let min = Math.min(data[i], data[i + 1], data[i + 2]);
      for (let dy = -half; dy <= half && min > 0; dy++) {
        const yy = clamp(y + dy, 0, height - 1);
        for (let dx = -half; dx <= half && min > 0; dx++) {
          const xx = clamp(x + dx, 0, width - 1);
          const j = (yy * width + xx) * 4;
          const m = Math.min(data[j], data[j + 1], data[j + 2]);
          if (m < min) min = m;
        }
      }
      dark[i / 4] = min;
    }
  }

  // Atmospheric light: brightest pixel among the top-darkest.
  const sorted = Array.from(dark).sort((a, b) => b - a);
  const idx = Math.floor(sorted.length * 0.001);
  let A = sorted[idx] || 200;
  if (A < 120) A = 120;

  // Transmission t = 1 - w * dark / A, clamp at t0.
  const out = new ImageData(width, height);
  const t0 = 1 - 0.95 * s;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const d = dark[i / 4];
      const t = Math.max(t0, 1 - (0.95 * s * d) / A);
      out.data[i] = clamp((data[i] - A) / t + A);
      out.data[i + 1] = clamp((data[i + 1] - A) / t + A);
      out.data[i + 2] = clamp((data[i + 2] - A) / t + A);
      out.data[i + 3] = data[i + 3];
    }
  }
  return out;
}
