/**
 * Browser-side image analysis algorithms (pure, operate on ImageData).
 * Used by histogram / palette / perceptual-hash / comparison tools.
 */

export interface Histogram {
  r: number[];
  g: number[];
  b: number[];
  luma: number[];
}

export interface PaletteColor {
  hex: string;
  rgb: [number, number, number];
  ratio: number; // 0..1, share of pixels in this bucket
}

export interface PhashResult {
  hex: string; // 16 hex chars = 64 bits
  bin: string; // 64 char binary string
}

const clamp = (v: number, min = 0, max = 255) =>
  v < min ? min : v > max ? max : v;

/** Histogram of R/G/B channels and perceptual luminance (256 bins each). */
export function computeHistogram(imageData: ImageData): Histogram {
  const r = new Array(256).fill(0);
  const g = new Array(256).fill(0);
  const b = new Array(256).fill(0);
  const luma = new Array(256).fill(0);
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    const rv = data[i];
    const gv = data[i + 1];
    const bv = data[i + 2];
    r[rv]++;
    g[gv]++;
    b[bv]++;
    luma[Math.round(0.299 * rv + 0.587 * gv + 0.114 * bv)]++;
  }
  return { r, g, b, luma };
}

function channelRange(pixels: number[][]): number {
  let max = -1;
  for (let c = 0; c < 3; c++) {
    let lo = 255;
    let hi = 0;
    for (const p of pixels) {
      if (p[c] < lo) lo = p[c];
      if (p[c] > hi) hi = p[c];
    }
    const range = hi - lo;
    if (range > max) max = range;
  }
  return max;
}

function widestChannel(pixels: number[][]): number {
  let best = 0;
  let bestRange = -1;
  for (let c = 0; c < 3; c++) {
    let lo = 255;
    let hi = 0;
    for (const p of pixels) {
      if (p[c] < lo) lo = p[c];
      if (p[c] > hi) hi = p[c];
    }
    const range = hi - lo;
    if (range > bestRange) {
      bestRange = range;
      best = c;
    }
  }
  return best;
}

/**
 * Extract a dominant-color palette via median-cut quantization.
 * Input is downsampled by the caller; pixels are sampled internally.
 */
export function extractPalette(imageData: ImageData, count: number): PaletteColor[] {
  const { width, height, data } = imageData;
  const n = Math.max(2, Math.min(24, Math.round(count)));
  const total = width * height;
  const step = Math.max(1, Math.floor(total / 40000));
  const pixels: number[][] = [];
  for (let i = 0; i < data.length; i += 4 * step) {
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }
  if (pixels.length === 0) return [];

  const buckets: number[][][] = [pixels];
  while (buckets.length < n) {
    let bi = -1;
    let maxRange = -1;
    buckets.forEach((bucket, idx) => {
      const range = channelRange(bucket);
      if (range > maxRange) {
        maxRange = range;
        bi = idx;
      }
    });
    if (bi < 0) break;
    const bucket = buckets[bi];
    if (bucket.length < 2) break;
    const ch = widestChannel(bucket);
    bucket.sort((a, b2) => a[ch] - b2[ch]);
    const mid = Math.floor(bucket.length / 2);
    const left = bucket.slice(0, mid);
    const right = bucket.slice(mid);
    if (left.length === 0 || right.length === 0) break;
    buckets.splice(bi, 1, left, right);
  }

  const palette: PaletteColor[] = buckets
    .filter((bucket) => bucket.length > 0)
    .map((bucket) => {
      let sr = 0;
      let sg = 0;
      let sb = 0;
      for (const p of bucket) {
        sr += p[0];
        sg += p[1];
        sb += p[2];
      }
      const len = bucket.length;
      const rgb: [number, number, number] = [
        Math.round(sr / len),
        Math.round(sg / len),
        Math.round(sb / len),
      ];
      const hex = "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");
      return { hex, rgb, ratio: len / pixels.length };
    })
    .sort((a, b) => b.ratio - a.ratio);

  return palette;
}

/**
 * Perceptual hash (pHash) — resize to 32x32 grayscale BEFORE calling,
 * then 32x32 DCT, keep top-left 8x8, median binarize into 64 bits.
 */
export function computePhash(imageData: ImageData): PhashResult {
  const n = 32;
  const { data } = imageData;
  const gray: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const i = (y * n + x) * 4;
      gray[x][y] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
  }

  // Precomputed DCT cosine tables.
  const cosA: number[][] = [];
  const cosB: number[][] = [];
  for (let u = 0; u < n; u++) {
    cosA.push([]);
    for (let x = 0; x < n; x++) {
      cosA[u].push(Math.cos(((2 * x + 1) * u * Math.PI) / (2 * n)));
    }
  }
  for (let v = 0; v < n; v++) {
    cosB.push([]);
    for (let y = 0; y < n; y++) {
      cosB[v].push(Math.cos(((2 * y + 1) * v * Math.PI) / (2 * n)));
    }
  }

  const cu = (u: number) => (u === 0 ? 1 / Math.sqrt(2) : 1);
  const dct: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let u = 0; u < n; u++) {
    for (let v = 0; v < n; v++) {
      let sum = 0;
      for (let x = 0; x < n; x++) {
        const cx = cosA[u][x];
        for (let y = 0; y < n; y++) {
          sum += gray[x][y] * cx * cosB[v][y];
        }
      }
      dct[u][v] = 0.25 * cu(u) * cu(v) * sum;
    }
  }

  // Take the top-left 8x8 low-frequency block (skip the DC term for
  // brightness invariance, keep 63 bits then pad with one 0 bit).
  const low = 8;
  const values: number[] = [];
  for (let u = 0; u < low; u++) {
    for (let v = 0; v < low; v++) {
      if (u === 0 && v === 0) continue;
      values.push(dct[u][v]);
    }
  }
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  let bin = "";
  for (const val of values) {
    bin += val > median ? "1" : "0";
  }
  bin = bin.padEnd(64, "0");
  let hex = "";
  for (let i = 0; i < bin.length; i += 4) {
    hex += parseInt(bin.slice(i, i + 4), 2).toString(16);
  }
  return { hex, bin };
}

/** Hamming distance between two 64-bit hash strings (hex or binary). */
export function hammingDistance(a: string, b: string): number {
  const pa = a.length <= 16 ? a : a.slice(0, 16);
  const pb = b.length <= 16 ? b : b.slice(0, 16);
  let dist = 0;
  for (let i = 0; i < pa.length; i++) {
    const xa = parseInt(pa[i], 16);
    const xb = parseInt(pb[i], 16);
    let diff = xa ^ xb;
    while (diff) {
      dist += diff & 1;
      diff >>= 1;
    }
  }
  return dist;
}

/** Similarity percentage (0..100) from hamming distance over 64 bits. */
export function similarityPercent(a: string, b: string): number {
  return Math.round((1 - hammingDistance(a, b) / 64) * 100);
}

/** Pixel-level diff ratio (0..1) between two equal-sized images. */
export function diffRatio(a: ImageData, b: ImageData): number {
  const len = Math.min(a.data.length, b.data.length);
  if (len === 0) return 1;
  let diff = 0;
  for (let i = 0; i < len; i += 4) {
    const dr = Math.abs(a.data[i] - b.data[i]);
    const dg = Math.abs(a.data[i + 1] - b.data[i + 1]);
    const db = Math.abs(a.data[i + 2] - b.data[i + 2]);
    if (dr + dg + db > 30) diff++;
  }
  return diff / (len / 4);
}

/**
 * Build a diff-visualization ImageData (same size as inputs):
 * unchanged pixels darken, differing pixels become red.
 */
export function diffVisualization(a: ImageData, b: ImageData): ImageData {
  const out = new ImageData(a.width, a.height);
  const len = Math.min(a.data.length, b.data.length);
  for (let i = 0; i < len; i += 4) {
    const dr = Math.abs(a.data[i] - b.data[i]);
    const dg = Math.abs(a.data[i + 1] - b.data[i + 1]);
    const db = Math.abs(a.data[i + 2] - b.data[i + 2]);
    const isDiff = dr + dg + db > 30;
    if (isDiff) {
      out.data[i] = 255;
      out.data[i + 1] = 0;
      out.data[i + 2] = 0;
      out.data[i + 3] = 255;
    } else {
      const v = clamp(Math.round(a.data[i] * 0.35));
      out.data[i] = v;
      out.data[i + 1] = v;
      out.data[i + 2] = v;
      out.data[i + 3] = 255;
    }
  }
  return out;
}

/** Split into R / G / B single-channel images (outputs keep alpha). */
export function splitChannels(
  src: ImageData
): { red: ImageData; green: ImageData; blue: ImageData } {
  const red = new ImageData(src.width, src.height);
  const green = new ImageData(src.width, src.height);
  const blue = new ImageData(src.width, src.height);
  for (let i = 0; i < src.data.length; i += 4) {
    red.data[i] = src.data[i];
    red.data[i + 3] = 255;
    green.data[i + 1] = src.data[i + 1];
    green.data[i + 3] = 255;
    blue.data[i + 2] = src.data[i + 2];
    blue.data[i + 3] = 255;
  }
  return { red, green, blue };
}

export interface SimilarityMetrics {
  /** Percentage (0..100) of pixels within the tolerance. */
  similarity: number;
  mse: number;
  /** Peak signal-to-noise ratio in dB (Infinity when identical). */
  psnr: number;
}

/**
 * Pixel-level similarity metrics between two equal-sized images:
 * per-pixel Euclidean distance in RGB space vs tolerance, MSE and PSNR.
 */
export function computeSimilarity(
  a: ImageData,
  b: ImageData,
  tolerance: number
): SimilarityMetrics {
  const len = Math.min(a.data.length, b.data.length);
  const px = len / 4;
  if (px === 0) return { similarity: 0, mse: Infinity, psnr: 0 };
  const tol = Math.max(0, tolerance);
  let sumSq = 0;
  let within = 0;
  for (let i = 0; i < len; i += 4) {
    const dr = a.data[i] - b.data[i];
    const dg = a.data[i + 1] - b.data[i + 1];
    const db = a.data[i + 2] - b.data[i + 2];
    sumSq += dr * dr + dg * dg + db * db;
    if (Math.sqrt(dr * dr + dg * dg + db * db) <= tol) within++;
  }
  const mse = sumSq / (px * 3);
  const psnr = mse === 0 ? Infinity : 10 * Math.log10((255 * 255) / mse);
  return {
    similarity: (within / px) * 100,
    mse,
    psnr,
  };
}
