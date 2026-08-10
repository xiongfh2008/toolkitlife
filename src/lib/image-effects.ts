/**
 * Browser-side image effect algorithms (pure, operate on ImageData).
 */

const clamp = (v: number, min = 0, max = 255) =>
  v < min ? min : v > max ? max : v;

/** Negative / invert. */
export function negative(src: ImageData): ImageData {
  const { width, height, data } = src;
  const out = new ImageData(width, height);
  for (let i = 0; i < data.length; i += 4) {
    out.data[i] = 255 - data[i];
    out.data[i + 1] = 255 - data[i + 1];
    out.data[i + 2] = 255 - data[i + 2];
    out.data[i + 3] = data[i + 3];
  }
  return out;
}

/** Mosaic / pixelate — average color per block. */
export function pixelate(src: ImageData, blockSize: number): ImageData {
  const { width, height, data } = src;
  const bs = Math.max(2, Math.min(64, Math.round(blockSize)));
  const out = new ImageData(width, height);
  for (let by = 0; by < height; by += bs) {
    for (let bx = 0; bx < width; bx += bs) {
      let r = 0;
      let g = 0;
      let b = 0;
      let n = 0;
      const ex = Math.min(width, bx + bs);
      const ey = Math.min(height, by + bs);
      for (let y = by; y < ey; y++) {
        for (let x = bx; x < ex; x++) {
          const i = (y * width + x) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          n++;
        }
      }
      r /= n;
      g /= n;
      b /= n;
      for (let y = by; y < ey; y++) {
        for (let x = bx; x < ex; x++) {
          const i = (y * width + x) * 4;
          out.data[i] = r;
          out.data[i + 1] = g;
          out.data[i + 2] = b;
          out.data[i + 3] = data[i + 3];
        }
      }
    }
  }
  return out;
}

/** Oil painting — most frequent color in neighborhood (quantized). */
export function oilPaint(src: ImageData, radius: number, levels: number): ImageData {
  const { width, height, data } = src;
  const r = Math.max(1, Math.min(10, Math.round(radius)));
  const lv = Math.max(2, Math.min(64, Math.round(levels)));
  const bin = 256 / lv;
  const out = new ImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const hist = new Int32Array(lv);
      const sumR = new Int32Array(lv);
      const sumG = new Int32Array(lv);
      const sumB = new Int32Array(lv);
      for (let dy = -r; dy <= r; dy++) {
        const yy = clamp(y + dy, 0, height - 1);
        for (let dx = -r; dx <= r; dx++) {
          const xx = clamp(x + dx, 0, width - 1);
          const i = (yy * width + xx) * 4;
          const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const b = Math.min(lv - 1, Math.floor(lum / bin));
          hist[b]++;
          sumR[b] += data[i];
          sumG[b] += data[i + 1];
          sumB[b] += data[i + 2];
        }
      }
      let best = 0;
      for (let b = 1; b < lv; b++) {
        if (hist[b] > hist[best]) best = b;
      }
      const cnt = hist[best] || 1;
      const i = (y * width + x) * 4;
      out.data[i] = sumR[best] / cnt;
      out.data[i + 1] = sumG[best] / cnt;
      out.data[i + 2] = sumB[best] / cnt;
      out.data[i + 3] = data[i + 3];
    }
  }
  return out;
}

/** Edge detection via Sobel operator — returns grayscale edge map. */
export function edgeDetect(src: ImageData, threshold: number): ImageData {
  const { width, height, data } = src;
  const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0, p = 0; p < data.length; i++, p += 4) {
    gray[i] = (data[p] + data[p + 1] + data[p + 2]) / 3;
  }
  const out = new ImageData(width, height);
  const th = Math.max(0, Math.min(255, Math.round(threshold)));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sx = 0;
      let sy = 0;
      let k = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++, k++) {
          const xx = clamp(x + dx, 0, width - 1);
          const yy = clamp(y + dy, 0, height - 1);
          const v = gray[yy * width + xx];
          sx += gx[k] * v;
          sy += gy[k] * v;
        }
      }
      const mag = Math.min(255, Math.sqrt(sx * sx + sy * sy));
      const i = (y * width + x) * 4;
      const val = mag >= th ? 255 : 0;
      out.data[i] = val;
      out.data[i + 1] = val;
      out.data[i + 2] = val;
      out.data[i + 3] = 255;
    }
  }
  return out;
}
