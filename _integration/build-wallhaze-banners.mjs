// Crop the 7 WallHaze bottom banners to their solid card area, round the corners
// with alpha, and export web-friendly WebP files into public/promo/.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd());
const SRC = path.join(ROOT, "_integration", "wallhaze-banners");
const OUT = path.join(ROOT, "public", "promo");

const PAIRS = [
  ["en-English.png", "en"],
  ["zh-Chinese.png", "zh"],
  ["ja-Japanese.png", "ja"],
  ["ko-Korean.png", "ko"],
  ["es-Spanish.png", "es"],
  ["de-German.png", "de"],
  ["fr-French.png", "fr"],
];

const TARGET_W = 1600;
const DARK = 120;

async function measure(file) {
  const img = sharp(path.join(SRC, file));
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  const dark = (x, y) => {
    const i = (y * w + x) * ch;
    return data[i] < DARK && data[i + 1] < DARK && data[i + 2] < DARK;
  };
  const midX = Math.floor(w / 2);
  const midY = Math.floor(h / 2);
  let top = -1, bottom = -1, left = -1, right = -1;
  for (let y = 0; y < h; y++) if (dark(midX, y)) { top = y; break; }
  for (let y = h - 1; y >= 0; y--) if (dark(midX, y)) { bottom = y; break; }
  for (let x = 0; x < w; x++) if (dark(x, midY)) { left = x; break; }
  for (let x = w - 1; x >= 0; x--) if (dark(x, midY)) { right = x; break; }
  let radius = 0;
  while (radius < 140 && !dark(left + radius, top)) radius++;
  return { left, top, width: right - left + 1, height: bottom - top + 1, radius, canvasW: w, canvasH: h };
}

fs.mkdirSync(OUT, { recursive: true });

for (const [file, locale] of PAIRS) {
  const rect = await measure(file);
  const scale = TARGET_W / rect.width;
  const height = Math.round(rect.height * scale);
  const radius = Math.round(rect.radius * scale);

  const base = await sharp(path.join(SRC, file))
    .extract({ left: rect.left, top: rect.top, width: rect.width, height: rect.height })
    .resize({ width: TARGET_W, height, fit: "fill" })
    .png()
    .toBuffer();

  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TARGET_W}" height="${height}">` +
      `<rect x="0" y="0" width="${TARGET_W}" height="${height}" rx="${radius}" ry="${radius}" fill="#fff"/>` +
      `</svg>`
  );

  const out = path.join(OUT, `wallhaze-bottom-${locale}.webp`);
  const info = await sharp(base)
    .composite([{ input: mask, blend: "dest-in" }])
    .webp({ quality: 86, alphaQuality: 100 })
    .toFile(out);

  console.log(
    `${locale}: canvas ${rect.canvasW}x${rect.canvasH} -> rect ${rect.width}x${rect.height} r${rect.radius}` +
      ` -> ${TARGET_W}x${height} r${radius} | ${(info.size / 1024).toFixed(0)} KB`
  );
}
console.log("OK");
