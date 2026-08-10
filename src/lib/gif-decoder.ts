/**
 * Minimal GIF89a decoder used by gif-to-images and image-to-gif.
 * Decompresses all frames, compositing them onto the logical screen
 * so each returned frame is a full-frame ImageData ready to export.
 */

export interface GifDecodedFrame {
  imageData: ImageData;
  delayMs: number;
  width: number;
  height: number;
  /** Index of the frame within the GIF (0-based). */
  index: number;
}

export interface GifDecodeResult {
  frames: GifDecodedFrame[];
  width: number;
  height: number;
  loop: number; // 0 = loop forever
}

export function decodeGif(buffer: ArrayBuffer): GifDecodeResult {
  const data = new Uint8Array(buffer);
  let pos = 0;

  // Header "GIF87a" or "GIF89a"
  if (data[0] !== 0x47 || data[1] !== 0x49 || data[2] !== 0x46) {
    throw new Error("Invalid GIF header");
  }
  pos = 6;

  const width = readU16(data, pos);
  const height = readU16(data, pos + 2);
  const packed = data[pos + 4];
  const gctFlag = (packed & 0x80) !== 0;
  const gctSize = 2 << (packed & 0x07);
  const bgColorIndex = data[pos + 5];
  pos += 7;

  let gct: Uint8Array | null = null;
  if (gctFlag) {
    gct = data.slice(pos, pos + gctSize * 3);
    pos += gctSize * 3;
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  // Start from background color
  if (gct && bgColorIndex < gctSize) {
    ctx.fillStyle = rgbString(gct, bgColorIndex);
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  const frames: DrawnFrame[] = [];
  const loop = 0;

  let prevFrame: ImageData | null = null;
  let prevDisposal = 1;

  const snapshot = (): ImageData =>
    ctx.getImageData(0, 0, width, height);

  while (pos < data.length) {
    const block = data[pos++];

    if (block === 0x3b) {
      break; // trailer
    }

    if (block === 0x21) {
      // Extension block
      const label = data[pos++];
      if (label === 0xf9) {
        // Graphic Control Extension
        pos++; // block size (4)
        const gcePacked = data[pos];
        const disposal = (gcePacked >> 2) & 0x07;
        const hasTransparency = (gcePacked & 0x01) !== 0;
        const delayCs = readU16(data, pos + 1);
        const transparentIndex = data[pos + 3];
        pos += 4;
        pos++; // block terminator

        // Next block should be an image descriptor
        const imgBlock = data[pos++];
        if (imgBlock !== 0x2c) {
          throw new Error("Expected image descriptor after GCE");
        }
        const { frames: drawn, prevSnapshot, pos: newPos } = drawFrame({
          data,
          pos,
          width,
          height,
          gct,
          bgColorIndex,
          ctx,
          snapshot,
          prevDisposal,
          prevFrame,
          delayCs,
          transparentIndex,
          hasTransparency,
          disposal,
        });
        pos = newPos;
        frames.push(...drawn);
        prevFrame = prevSnapshot;
        prevDisposal = disposal === 0 ? 1 : disposal;
      } else {
        // Skip other extensions (application, comment, plain text)
        pos = skipSubBlocks(data, pos);
      }
      continue;
    }

    if (block === 0x2c) {
      // Image descriptor without preceding GCE
      const { frames: drawn, prevSnapshot, pos: newPos } = drawFrame({
        data,
        pos,
        width,
        height,
        gct,
        bgColorIndex,
        ctx,
        snapshot,
        prevDisposal,
        prevFrame,
        delayCs: 10,
        transparentIndex: -1,
        hasTransparency: false,
        disposal: 1,
      });
      pos = newPos;
      frames.push(...drawn);
      prevFrame = prevSnapshot;
      prevDisposal = 1;
      continue;
    }

    // Unknown block - skip
    pos = skipSubBlocks(data, pos);
  }

  return {
    frames: frames.map((f, i) => ({
      imageData: f.imageData,
      delayMs: f.delayMs,
      width,
      height,
      index: i,
    })),
    width,
    height,
    loop,
  };
}

interface FrameDrawParams {
  data: Uint8Array;
  pos: number;
  width: number;
  height: number;
  gct: Uint8Array | null;
  bgColorIndex: number;
  ctx: OffscreenCanvasRenderingContext2D;
  snapshot: () => ImageData;
  prevDisposal: number;
  prevFrame: ImageData | null;
  delayCs: number;
  transparentIndex: number;
  hasTransparency: boolean;
  /** Disposal method of the current frame (0-7). */
  disposal: number;
}

interface DrawnFrame {
  imageData: ImageData;
  delayMs: number;
}

/**
 * Parse a single image descriptor (positioned at `pos`), draw it and return
 * the composited frame plus the new read position.
 */
function drawFrame(
  p: FrameDrawParams,
): { frames: DrawnFrame[]; prevSnapshot: ImageData; pos: number } {
  const { data, pos } = p;
  const left = readU16(data, pos);
  const top = readU16(data, pos + 2);
  const fw = readU16(data, pos + 4);
  const fh = readU16(data, pos + 6);
  const ipacked = data[pos + 8];
  const lctFlag = (ipacked & 0x80) !== 0;
  const interlace = (ipacked & 0x40) !== 0;
  const lctSize = 2 << (ipacked & 0x07);
  let cursor = pos + 9;

  let lct = p.gct;
  if (lctFlag) {
    lct = data.slice(cursor, cursor + lctSize * 3);
    cursor += lctSize * 3;
  }

  const minCodeSize = data[cursor++];
  const read = readSubBlocks(data, cursor);
  const indices = lzwDecode(minCodeSize, read.bytes);
  cursor = read.consumed;

  // Apply previous frame's disposal before drawing this frame
  if (p.prevDisposal === 2) {
    if (p.gct && p.bgColorIndex < p.gct.length / 3) {
      p.ctx.fillStyle = rgbString(p.gct, p.bgColorIndex);
      p.ctx.fillRect(0, 0, p.width, p.height);
    } else {
      p.ctx.clearRect(0, 0, p.width, p.height);
    }
  } else if (p.prevDisposal === 3 && p.prevFrame) {
    p.ctx.putImageData(p.prevFrame, 0, 0);
  }

  // Snapshot BEFORE drawing this frame (needed for disposal 3 of the next frame)
  const prevSnapshot = p.snapshot();

  // Draw this frame's pixels
  drawPixels(
    p.ctx,
    indices,
    fw,
    fh,
    left,
    top,
    lct,
    p.hasTransparency ? p.transparentIndex : -1,
    interlace,
  );

  const frames: DrawnFrame[] = [
    {
      imageData: p.snapshot(),
      delayMs: p.delayCs * 10,
    },
  ];

  return { frames, prevSnapshot, pos: cursor };
}

/** Read a little-endian unsigned 16-bit value. */
function readU16(data: Uint8Array, pos: number): number {
  return data[pos] | (data[pos + 1] << 8);
}

/** Color table entry to CSS rgb string. */
function rgbString(table: Uint8Array, index: number): string {
  const i = index * 3;
  if (i + 2 >= table.length) return "#000000";
  return `rgb(${table[i]},${table[i + 1]},${table[i + 2]})`;
}

interface SubBlockResult {
  bytes: Uint8Array;
  /** Total bytes consumed including length prefixes and terminator. */
  consumed: number;
}

/** Read image data sub-blocks, returning the payload and bytes consumed. */
function readSubBlocks(data: Uint8Array, pos: number): SubBlockResult {
  const chunks: number[][] = [];
  let total = 0;
  let cursor = pos;
  while (true) {
    const size = data[cursor++];
    if (size === 0) break;
    chunks.push(Array.from(data.subarray(cursor, cursor + size)));
    total += size;
    cursor += size;
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return { bytes: out, consumed: cursor };
}

/** Advance past a group of sub-blocks. */
function skipSubBlocks(data: Uint8Array, pos: number): number {
  let cursor = pos;
  while (true) {
    const size = data[cursor++];
    if (size === 0) break;
    cursor += size;
  }
  return cursor;
}

/**
 * Standard GIF LZW decompression.
 * Returns an array of palette indices in row-major order.
 */
function lzwDecode(minCodeSize: number, data: Uint8Array): number[] {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;
  let codeSize = minCodeSize + 1;
  let nextCode = eoiCode + 1;

  let dict: number[][] = [];
  const initDict = () => {
    dict = new Array(clearCode);
    for (let i = 0; i < clearCode; i++) dict[i] = [i];
    nextCode = eoiCode + 1;
    codeSize = minCodeSize + 1;
  };
  initDict();

  const output: number[] = [];

  let bitBuf = 0;
  let bitCount = 0;
  let pos = 0;

  const readCode = (): number => {
    while (bitCount < codeSize) {
      if (pos >= data.length) return eoiCode;
      bitBuf |= data[pos++] << bitCount;
      bitCount += 8;
    }
    const code = bitBuf & ((1 << codeSize) - 1);
    bitBuf >>>= codeSize;
    bitCount -= codeSize;
    return code;
  };

  let prevEntry: number[] = [];

  while (true) {
    const code = readCode();
    if (code === eoiCode) break;

    if (code === clearCode) {
      initDict();
      prevEntry = [];
      continue;
    }

    let entry: number[];
    if (code < dict.length) {
      entry = dict[code];
    } else if (code === nextCode && prevEntry.length > 0) {
      // KwKwK special case
      entry = [...prevEntry, prevEntry[0]];
    } else {
      throw new Error("Invalid LZW code");
    }

    output.push(...entry);

    if (prevEntry.length > 0 && nextCode < 4096) {
      dict[nextCode++] = [...prevEntry, entry[0]];
      if (nextCode >= 1 << codeSize && codeSize < 12) {
        codeSize++;
      }
    }

    prevEntry = entry;
  }

  return output;
}

/** Draw a frame's pixels onto the canvas, honoring transparency and interlace. */
function drawPixels(
  ctx: OffscreenCanvasRenderingContext2D,
  indices: number[],
  fw: number,
  fh: number,
  left: number,
  top: number,
  colorTable: Uint8Array | null,
  transparentIndex: number,
  interlace: boolean,
) {
  const imageData = ctx.createImageData(fw, fh);
  const px = imageData.data;

  // Pre-compute the interlace row order.
  const rowOrder: number[] = [];
  if (interlace) {
    for (let start = 0; start < fh; start += 8) rowOrder.push(start);
    for (let start = 4; start < fh; start += 8) rowOrder.push(start);
    for (let start = 2; start < fh; start += 4) rowOrder.push(start);
    for (let start = 1; start < fh; start += 2) rowOrder.push(start);
  } else {
    for (let y = 0; y < fh; y++) rowOrder.push(y);
  }

  let index = 0;
  for (const row of rowOrder) {
    for (let x = 0; x < fw; x++) {
      const paletteIndex = indices[index++] ?? 0;
      const o = (row * fw + x) * 4;
      if (paletteIndex === transparentIndex || !colorTable) {
        px[o] = 0;
        px[o + 1] = 0;
        px[o + 2] = 0;
        px[o + 3] = 0;
      } else {
        const c = paletteIndex * 3;
        if (c + 2 < colorTable.length) {
          px[o] = colorTable[c];
          px[o + 1] = colorTable[c + 1];
          px[o + 2] = colorTable[c + 2];
          px[o + 3] = 255;
        } else {
          px[o] = 0;
          px[o + 1] = 0;
          px[o + 2] = 0;
          px[o + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(imageData, left, top);
}
