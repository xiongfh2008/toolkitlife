import fs from "fs";
import path from "path";

/**
 * Smoke test for the 33 image tools added in this round + homepage:
 * fetch each /en/tools/<slug> and assert 200 + non-empty HTML.
 * Usage: node scripts/smoke-image-tools.mjs [baseUrl]
 */
const base = process.argv[2] ?? "http://localhost:3112";
const slugs = fs
  .readdirSync("scripts/tool-data")
  .filter((x) => x.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join("scripts/tool-data", f), "utf-8")).slug);

async function timed(path) {
  const t0 = Date.now();
  const r = await fetch(base + path);
  const h = await r.text();
  return { ms: Date.now() - t0, status: r.status, len: h.length };
}

// warm up
await timed("/en");
await timed("/en/tools/image-slice");

let fail = 0;
const home = await timed("/en");
console.log(`[home /en] ${home.status} ${home.ms}ms ${(home.len / 1024).toFixed(0)}KB`);
for (const s of slugs) {
  const r = await timed(`/en/tools/${s}`);
  const ok = r.status === 200 && r.len > 2000;
  if (!ok) fail++;
  console.log(`${ok ? "ok  " : "FAIL"} /en/tools/${s}  ${r.status} ${r.ms}ms ${(r.len / 1024).toFixed(0)}KB`);
}
console.log(fail === 0 ? `\nALL ${slugs.length} TOOL PAGES OK` : `\n${fail} FAILURES`);
