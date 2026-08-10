/**
 * Minimal GIF89a encoder used by video-to-gif and image-to-gif.
 * All frames must share the same width/height; delay is per frame (ms).
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

  // Build global color table from first frame
  const palette = buildPalette(frames[0].imageData);
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
  lookup: Map<number, number>;
}

function buildPalette(frame: ImageData): Palette {
  const colorCounts = new Map<number, number>();
  const data = frame.data;

  for (let i = 0; i < data.length; i += 16) {
    // Sample every 4th pixel
    const r = data[i] & 0xf8;
    const g = data[i + 1] & 0xf8;
    const b = data[i + 2] & 0xf8;
    const key = (r << 16) | (g << 8) | b;
    colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
  }

  const sorted = [...colorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 256);
  const colors: number[] = new Array(768).fill(0);
  const lookup = new Map<number, number>();

  sorted.forEach(([color], i) => {
    colors[i * 3] = (color >> 16) & 0xff;
    colors[i * 3 + 1] = (color >> 8) & 0xff;
    colors[i * 3 + 2] = color & 0xff;
    lookup.set(color, i);
  });

  return { colors, lookup };
}

function quantizeFrame(frame: ImageData, palette: Palette): number[] {
  const data = frame.data;
  const pixels: number[] = [];
  const { colors, lookup } = palette;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] & 0xf8;
    const g = data[i + 1] & 0xf8;
    const b = data[i + 2] & 0xf8;
    const key = (r << 16) | (g << 8) | b;

    let idx = lookup.get(key);
    if (idx === undefined) {
      // Find nearest color
      let minDist = Infinity;
      idx = 0;
      for (let j = 0; j < 256; j++) {
        const dr = colors[j * 3] - data[i];
        const dg = colors[j * 3 + 1] - data[i + 1];
        const db = colors[j * 3 + 2] - data[i + 2];
        const dist = dr * dr + dg * dg + db * db;
        if (dist < minDist) {
          minDist = dist;
          idx = j;
        }
      }
    }
    pixels.push(idx);
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
