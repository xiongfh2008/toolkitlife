// Zero-dependency ICO container encoder/decoder.
// Container: ICONDIR (6B) + ICONDIRENTRY (16B each) + frame data (PNG blobs or BMP DIBs).
// BMP frames: BITMAPINFOHEADER with height*2 (XOR pixels + AND mask), bottom-up rows.

export interface IcoFrameInput {
  width: number;
  height: number;
  /** PNG file bytes, or a BMP DIB produced by canvasToBmpDib */
  data: Uint8Array;
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

export function isPngData(bytes: Uint8Array): boolean {
  if (bytes.length < 8) return false;
  for (let i = 0; i < 8; i++) if (bytes[i] !== PNG_SIGNATURE[i]) return false;
  return true;
}

export function packIco(frames: IcoFrameInput[]): Uint8Array {
  if (frames.length === 0) throw new Error("No frames to pack");
  const headerSize = 6 + 16 * frames.length;
  const total = headerSize + frames.reduce((n, f) => n + f.data.length, 0);
  const buf = new Uint8Array(total);
  const dv = new DataView(buf.buffer);
  dv.setUint16(0, 0, true); // reserved
  dv.setUint16(2, 1, true); // type: icon
  dv.setUint16(4, frames.length, true);
  let offset = headerSize;
  frames.forEach((f, i) => {
    const e = 6 + 16 * i;
    buf[e] = f.width >= 256 ? 0 : f.width; // 0 means 256
    buf[e + 1] = f.height >= 256 ? 0 : f.height;
    buf[e + 2] = 0; // palette color count (truecolor)
    buf[e + 3] = 0; // reserved
    dv.setUint16(e + 4, 1, true); // planes
    dv.setUint16(e + 6, 32, true); // bits per pixel
    dv.setUint32(e + 8, f.data.length, true);
    dv.setUint32(e + 12, offset, true);
    buf.set(f.data, offset);
    offset += f.data.length;
  });
  return buf;
}

/** Encode the current canvas pixels as a 32bpp BMP DIB (BITMAPINFOHEADER + XOR + AND mask). */
export function canvasToBmpDib(canvas: HTMLCanvasElement): Uint8Array {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  const { width, height } = canvas;
  const img = ctx.getImageData(0, 0, width, height);
  const pixelRow = width * 4; // 32bpp rows are always 4-byte aligned
  const maskRow = Math.ceil(width / 32) * 4;
  const pixelBytes = pixelRow * height;
  const maskBytes = maskRow * height;
  const dib = new Uint8Array(40 + pixelBytes + maskBytes);
  const dv = new DataView(dib.buffer);
  dv.setUint32(0, 40, true); // biSize
  dv.setInt32(4, width, true);
  dv.setInt32(8, height * 2, true); // XOR + AND heights
  dv.setUint16(12, 1, true); // planes
  dv.setUint16(14, 32, true); // bpp
  dv.setUint32(16, 0, true); // BI_RGB
  dv.setUint32(20, pixelBytes + maskBytes, true);
  for (let y = 0; y < height; y++) {
    const src = (height - 1 - y) * pixelRow; // bottom-up
    let dst = 40 + y * pixelRow;
    for (let x = 0; x < width; x++) {
      const s = src + x * 4;
      dib[dst] = img.data[s + 2]; // B
      dib[dst + 1] = img.data[s + 1]; // G
      dib[dst + 2] = img.data[s]; // R
      dib[dst + 3] = img.data[s + 3]; // A
      dst += 4;
    }
  }
  // AND mask stays all zeros: every pixel is governed by the 8-bit alpha channel.
  return dib;
}

export interface IcoEntry {
  width: number;
  height: number;
  bitCount: number;
  isPng: boolean;
  data: Uint8Array;
}

export function parseIco(buffer: ArrayBuffer): IcoEntry[] {
  const dv = new DataView(buffer);
  if (buffer.byteLength < 6) throw new Error("File too small to be an ICO");
  if (dv.getUint16(0, true) !== 0 || dv.getUint16(2, true) !== 1) {
    throw new Error("Invalid ICO header");
  }
  const count = dv.getUint16(4, true);
  if (count === 0 || 6 + 16 * count > buffer.byteLength) {
    throw new Error("Invalid ICO directory");
  }
  const entries: IcoEntry[] = [];
  for (let i = 0; i < count; i++) {
    const e = 6 + 16 * i;
    const width = buf1(e) === 0 ? 256 : buf1(e);
    const height = buf1(e + 1) === 0 ? 256 : buf1(e + 1);
    const bitCount = dv.getUint16(e + 6, true) || 32;
    const dataSize = dv.getUint32(e + 8, true);
    const dataOffset = dv.getUint32(e + 12, true);
    if (dataOffset + dataSize > buffer.byteLength) throw new Error("ICO frame out of range");
    const data = new Uint8Array(buffer.slice(dataOffset, dataOffset + dataSize));
    entries.push({ width, height, bitCount, isPng: isPngData(data), data });
  }
  return entries;

  function buf1(at: number): number {
    return new Uint8Array(buffer)[at];
  }
}

/** Decode a BMP DIB frame (1/4/8bpp palette, 24bpp or 32bpp) into ImageData. */
export function dibToImageData(dib: Uint8Array): ImageData {
  const dv = new DataView(dib.buffer, dib.byteOffset, dib.byteLength);
  if (dib.byteLength < 40) throw new Error("BMP frame too small");
  const biSize = dv.getUint32(0, true);
  const width = dv.getInt32(4, true);
  const doubleHeight = dv.getInt32(8, true);
  const bitCount = dv.getUint16(14, true);
  const compression = dv.getUint32(16, true);
  if (compression !== 0) throw new Error("Compressed BMP frames are not supported");
  if (doubleHeight % 2 !== 0) throw new Error("Unexpected BMP height");
  const height = doubleHeight / 2;
  if (width <= 0 || height <= 0) throw new Error("Invalid BMP dimensions");

  const paletteCount = bitCount <= 8 ? dv.getUint32(32, true) || 1 << bitCount : 0;
  const pxStart = biSize + (paletteCount ? paletteCount * 4 : 0);
  const rowSize = Math.floor((bitCount * width + 31) / 32) * 4;
  const maskRow = Math.ceil(width / 32) * 4;
  const maskStart = pxStart + rowSize * height;

  const img = new ImageData(width, height);
  const maskBit = (x: number, row: number): boolean => {
    const byte = dib[maskStart + row * maskRow + (x >> 3)];
    return (byte & (0x80 >> (x & 7))) !== 0; // set bit = transparent
  };

  for (let row = 0; row < height; row++) {
    const src = pxStart + row * rowSize;
    const dst = (height - 1 - row) * width * 4; // storage is bottom-up
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 255;
      if (bitCount === 32) {
        const i = src + x * 4;
        b = dib[i];
        g = dib[i + 1];
        r = dib[i + 2];
        a = dib[i + 3];
      } else if (bitCount === 24) {
        const i = src + x * 3;
        b = dib[i];
        g = dib[i + 1];
        r = dib[i + 2];
        a = maskBit(x, row) ? 0 : 255;
      } else if (bitCount === 8 || bitCount === 4 || bitCount === 1) {
        let index: number;
        if (bitCount === 8) {
          index = dib[src + x];
        } else {
          const perByte = 8 / bitCount;
          const byte = dib[src + (x >> Math.log2(perByte))];
          const shift = 8 - bitCount * ((x % perByte) + 1);
          index = (byte >> shift) & (bitCount === 1 ? 1 : bitCount === 4 ? 0x0f : 0xff);
        }
        const ct = biSize + index * 4;
        b = dib[ct];
        g = dib[ct + 1];
        r = dib[ct + 2];
        a = maskBit(x, row) ? 0 : 255;
      }
      const o = dst + x * 4;
      img.data[o] = r;
      img.data[o + 1] = g;
      img.data[o + 2] = b;
      img.data[o + 3] = a;
    }
  }
  return img;
}
