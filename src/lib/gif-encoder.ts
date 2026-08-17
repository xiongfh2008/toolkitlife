/**
 * Minimal GIF89a encoder used by video-to-gif and image-to-gif.
 * All frames must share the same width/height; delay is per frame (ms).
 *
 * Quality strategy:
 *  - The global color table is built from ALL frames (not just the first),
 *    so colors that appear later in an animation get a real palette entry
 *    instead of being remapped to an unrelated nearest color.
 *  - Colors are histogrammed at 6 bits/channel and expanded back to 8 bits.
 *  - Quantization uses Floyd–Steinberg error diffusion (dithering), which
 *    removes the color banding that makes gradients look muddy/blurry.
 *  - A precomputed 64³ lookup table keeps per-pixel quantization O(1).
 */

interface EncodedFrame {
  imageData: ImageData;
  delayMs: number;
}

/**
 * Encode frames into an animated GIF89a.
 * @param frames ImageData frames plus per-frame delay in ms
 * @returns Uint8Array containing the GIF file
 */
export function encodeGif(frames: EncodedFrame[]): Uint8Array {
  const width = frames[0].imageData.width;
  const height = frames[0].imageData.height;
  const buf: number[] = [];

  // Build global color table from all frames
  const palette = buildPalette(frames);
  const colorTable = palette.colors;
  const colorTableSize = 256;

  // Header
  writeStr(buf, "GIF89a");
  // Logical Screen Descriptor
  writeU16(buf, width);
  writeU16(buf, height);
  buf.push(0xf7); // GCT flag, 8 bits color resolution, 256 colors
  buf.push(0); // Background color index
  buf.push(0); // Pixel aspect ratio

  // Global Color Table
  for (let i = 0; i < colorTableSize; i++) {
    buf.push(colorTable[i * 3] || 0);
    buf.push(colorTable[i * 3 + 1] || 0);
    buf.push(colorTable[i * 3 + 2] || 0);
  }

  // Netscape extension for looping
  buf.push(0x21, 0xff, 0x0b);
  writeStr(buf, "NETSCAPE2.0");
  buf.push(0x03, 0x01);
  writeU16(buf, 0); // loop forever
  buf.push(0x00);

  for (const frame of frames) {
    const delayCs = Math.round(frame.delayMs / 10);
    // Graphic Control Extension
    buf.push(0x21, 0xf9, 0x04, 0x00);
    writeU16(buf, delayCs);
    buf.push(0x00, 0x00);

    // Image Descriptor
    buf.push(0x2c);
    writeU16(buf, 0); // left
    writeU16(buf, 0); // top
    writeU16(buf, width);
    writeU16(buf, height);
    buf.push(0x00); // no local color table

    // LZW encoded pixels
    const pixels = quantizeFrame(frame.imageData, palette);
    const minCodeSize = 8;
    buf.push(minCodeSize);
    const compressed = lzwEncode(pixels, minCodeSize);
    // Write sub-blocks
    let offset = 0;
    while (offset < compressed.length) {
      const chunkSize = Math.min(255, compressed.length - offset);
      buf.push(chunkSize);
      for (let i = 0; i < chunkSize; i++) {
        buf.push(compressed[offset + i]);
      }
      offset += chunkSize;
    }
    buf.push(0x00); // block terminator
  }

  buf.push(0x3b); // trailer
  return new Uint8Array(buf);
}

interface Palette {
  colors: number[];
  lookup: Uint8Array;
}

function buildPalette(frames: EncodedFrame[]): Palette {
  const colorCounts = new Map<number, number>();

  // Histogram colors across every frame at 6 bits/channel.
  for (const frame of frames) {
    const data = frame.imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const key = ((data[i] >> 2) << 12) | ((data[i + 1] >> 2) << 6) | (data[i + 2] >> 2);
      colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
    }
  }

  const sorted = [...colorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 256);
  const colors: number[] = new Array(768).fill(0);

  // Expand 6-bit keys back to 8-bit RGB.
  sorted.forEach(([color], i) => {
    const r6 = color >> 12;
    const g6 = (color >> 6) & 0x3f;
    const b6 = color & 0x3f;
    colors[i * 3] = (r6 << 2) | (r6 >> 4);
    colors[i * 3 + 1] = (g6 << 2) | (g6 >> 4);
    colors[i * 3 + 2] = (b6 << 2) | (b6 >> 4);
  });

  // Precompute a 64³ LUT (cell -> nearest palette index) so the dithering
  // pass only needs one table lookup per pixel.
  const lookup = new Uint8Array(64 * 64 * 64);
  for (let cr = 0; cr < 64; cr++) {
    const r8 = (cr << 2) + 2; // cell center in 8-bit space
    for (let cg = 0; cg < 64; cg++) {
      const g8 = (cg << 2) + 2;
      for (let cb = 0; cb < 64; cb++) {
        const b8 = (cb << 2) + 2;
        let best = 0;
        let bestDist = Infinity;
        for (let j = 0; j < 256; j++) {
          const dr = colors[j * 3] - r8;
          const dg = colors[j * 3 + 1] - g8;
          const db = colors[j * 3 + 2] - b8;
          const dist = dr * dr + dg * dg + db * db;
          if (dist < bestDist) {
            bestDist = dist;
            best = j;
          }
        }
        lookup[(cr << 12) | (cg << 6) | cb] = best;
      }
    }
  }

  return { colors, lookup };
}

function quantizeFrame(frame: ImageData, palette: Palette): number[] {
  const data = frame.data; // mutated in place by error diffusion
  const w = frame.width;
  const h = frame.height;
  const { colors, lookup } = palette;
  const pixels: number[] = new Array(w * h);

  let i = 0; // RGBA index
  let p = 0; // pixel index
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++, i += 4, p++) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const idx = lookup[((r >> 2) << 12) | ((g >> 2) << 6) | (b >> 2)];
      pixels[p] = idx;

      const er = r - colors[idx * 3];
      const eg = g - colors[idx * 3 + 1];
      const eb = b - colors[idx * 3 + 2];
      if (er === 0 && eg === 0 && eb === 0) continue;

      // Floyd–Steinberg error diffusion (7/16, 3/16, 5/16, 1/16).
      if (x + 1 < w) {
        data[i + 4] += (er * 7) >> 4;
        data[i + 5] += (eg * 7) >> 4;
        data[i + 6] += (eb * 7) >> 4;
      }
      if (y + 1 < h) {
        const next = i + w * 4;
        if (x > 0) {
          data[next - 4] += (er * 3) >> 4;
          data[next - 3] += (eg * 3) >> 4;
          data[next - 2] += (eb * 3) >> 4;
        }
        data[next] += (er * 5) >> 4;
        data[next + 1] += (eg * 5) >> 4;
        data[next + 2] += (eb * 5) >> 4;
        if (x + 1 < w) {
          data[next + 4] += er >> 4;
          data[next + 5] += eg >> 4;
          data[next + 6] += eb >> 4;
        }
      }
    }
  }
  return pixels;
}

function lzwEncode(pixels: number[], minCodeSize: number): number[] {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;
  let codeSize = minCodeSize + 1;
  let nextCode = eoiCode + 1;

  const table = new Map<string, number>();
  for (let i = 0; i < clearCode; i++) table.set(String(i), i);

  const output: number[] = [];
  let bits = 0;
  let bitCount = 0;

  const emit = (code: number) => {
    bits |= code << bitCount;
    bitCount += codeSize;
    while (bitCount >= 8) {
      output.push(bits & 0xff);
      bits >>= 8;
      bitCount -= 8;
    }
  };

  emit(clearCode);
  let current = String(pixels[0]);

  for (let i = 1; i < pixels.length; i++) {
    const next = current + "," + pixels[i];
    if (table.has(next)) {
      current = next;
    } else {
      emit(table.get(current)!);
      if (nextCode < 4096) {
        table.set(next, nextCode++);
        if (nextCode > 1 << codeSize && codeSize < 12) codeSize++;
      } else {
        emit(clearCode);
        table.clear();
        for (let j = 0; j < clearCode; j++) table.set(String(j), j);
        nextCode = eoiCode + 1;
        codeSize = minCodeSize + 1;
      }
      current = String(pixels[i]);
    }
  }

  emit(table.get(current)!);
  emit(eoiCode);
  if (bitCount > 0) output.push(bits & 0xff);

  return output;
}

function writeU16(buf: number[], val: number) {
  buf.push(val & 0xff, (val >> 8) & 0xff);
}

function writeStr(buf: number[], str: string) {
  for (let i = 0; i < str.length; i++) buf.push(str.charCodeAt(i));
}
