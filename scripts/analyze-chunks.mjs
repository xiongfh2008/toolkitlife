/**
 * Analyze client-side chunk sizes and attribute heavy libraries.
 * Usage: node scripts/analyze-chunks.mjs
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const dir = path.join(process.cwd(), ".next", "static", "chunks");

const MARKERS = [
  { name: "three", re: /WebGLRenderer|SRGBColorSpace|BufferGeometry/ },
  { name: "tfjs", re: /@tensorflow\/tfjs|isBackendRegistered|backend_webgl/ },
  { name: "ffmpeg", re: /@ffmpeg|ffmpeg\.wasm|createFFmpeg/ },
  { name: "mediapipe", re: /mediapipe|TasksVision/ },
  { name: "imgly-bg-removal", re: /background-removal|imgly/ },
  { name: "nsfwjs", re: /nsfwjs|inception|resnet/ },
  { name: "zxing", re: /zxing|ZXing/ },
  { name: "pdf-lib", re: /pdf-lib|PDFDocument/ },
  { name: "docx-preview", re: /docx-preview|jszip/ },
  { name: "wasi", re: /browser_wasi_shim|wasi/ },
  { name: "multiavatar", re: /multiavatar/ },
  { name: "screen-shot", re: /js-web-screen-shot|webScreenShot/ },
  { name: "qrcode", re: /qrcode|QRCode/ },
  { name: "uuid", re: /uuid/ },
];

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".js") && !e.name.endsWith(".js.map")) out.push(p);
  }
  return out;
}

const files = walk(dir);
const results = [];

for (const f of files) {
  const stat = fs.statSync(f);
  if (stat.size < 50 * 1024) continue; // only scan chunks >= 50KB
  const src = fs.readFileSync(f, "utf8");
  const hits = MARKERS.filter((m) => m.re.test(src)).map((m) => m.name);
  results.push({
    file: path.relative(dir, f),
    kb: Math.round(stat.size / 1024),
    sha: crypto.createHash("sha1").update(src).digest("hex").slice(0, 8),
    hits,
  });
}

results.sort((a, b) => b.kb - a.kb);
console.log("=== chunks >= 50KB (top 30) ===");
for (const r of results.slice(0, 30)) {
  console.log(
    `${String(r.kb).padStart(7)}KB  ${r.file.padEnd(64)} sha:${r.sha}  ${r.hits.join(",") || "-"}`
  );
}

const total = results.reduce((s, r) => s + r.kb, 0);
console.log(`\nTotal JS (chunks >=50KB): ${Math.round(total / 1024)} MB`);
console.log(`Biggest chunk: ${results[0]?.file} (${results[0]?.kb}KB)`);
