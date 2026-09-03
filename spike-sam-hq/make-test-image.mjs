/**
 * spike-sam-hq / make-test-image.mjs —— 生成一张带两个主体的测试图
 * 800×600：浅灰背景 + 左侧红色圆形 + 右侧蓝色方块，边缘清晰，便于验证交互式分割。
 * 用法：node make-test-image.mjs
 */
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const W = 800, H = 600;
const rgb = new Uint8Array(W * H * 3);
const set = (x, y, r, g, b) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  rgb[i] = r; rgb[i + 1] = g; rgb[i + 2] = b;
};

// 背景：浅灰
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) set(x, y, 236, 236, 241);

// 红色圆形（中心 300,220，半径 120）
const cx = 300, cy = 220, r = 120;
for (let y = cy - r; y <= cy + r; y++)
  for (let x = cx - r; x <= cx + r; x++) {
    const d2 = (x - cx) ** 2 + (y - cy) ** 2;
    if (d2 <= r * r) set(x, y, 214, 69, 65);
  }

// 蓝色方块（左上 540,380，边长 170）
for (let y = 380; y < 380 + 170; y++)
  for (let x = 540; x < 540 + 170; x++) set(x, y, 56, 96, 224);

// —— PNG 编码（无第三方依赖）——
const CRC_TABLE = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type RGB
const raw = Buffer.alloc((W * 3 + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W * 3 + 1)] = 0; // filter none
  Buffer.from(rgb.buffer, y * W * 3, W * 3).copy(raw, y * (W * 3 + 1) + 1);
}
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);
const out = fileURLToPath(new URL("./test-photo.png", import.meta.url));
writeFileSync(out, png);
console.log(`已生成 ${out}（${W}×${H}，${(png.length / 1024).toFixed(1)} KB）`);
