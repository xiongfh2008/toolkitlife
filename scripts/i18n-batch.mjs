/**
 * Translation pipeline for adding a locale in batches.
 *
 * Usage:
 *   node scripts/i18n-batch.mjs status es              # translated/total
 *   node scripts/i18n-batch.mjs extract es 800 0       # batch of 800 untranslated, skip 0 -> scripts/_batch.json
 *   node scripts/i18n-batch.mjs merge es _done.json    # merge translated {path: value} into messages/es.json
 *
 * Untranslated = value still identical to the en baseline.
 * Paths are dot-joined (verified: no message keys contain dots).
 */
import fs from "fs";

const [, , cmd, loc, a1, a2] = process.argv;
const file = `messages/${loc}.json`;

function flatten(o, p = "", out = {}) {
  if (typeof o === "string") { out[p] = o; return out; }
  if (Array.isArray(o)) { o.forEach((v, i) => flatten(v, `${p}.${i}`, out)); return out; }
  if (o && typeof o === "object") { for (const k in o) flatten(o[k], p ? `${p}.${k}` : k, out); }
  return out;
}

function deepSet(obj, path, value) {
  const segs = path.split(".");
  let cur = obj;
  for (let i = 0; i < segs.length - 1; i++) cur = cur[segs[i]];
  cur[segs[segs.length - 1]] = value;
}

const en = JSON.parse(fs.readFileSync("messages/en.json", "utf8"));
const loc_ = JSON.parse(fs.readFileSync(file, "utf8"));
const enFlat = flatten(en);
const locFlat = flatten(loc_);
const paths = Object.keys(enFlat);
const untranslated = paths.filter((p) => locFlat[p] === enFlat[p]);

if (cmd === "status") {
  console.log(`${loc}: ${paths.length - untranslated.length}/${paths.length} translated (${untranslated.length} left)`);
} else if (cmd === "extract") {
  const take = Number(a1), skip = Number(a2 || 0);
  // exclude keys already claimed by any existing batch files (done or in-flight)
  const claimed = new Set();
  for (const f of fs.readdirSync("scripts")) {
    if (/^_batch-\d+\.json$/.test(f)) {
      for (const k of Object.keys(JSON.parse(fs.readFileSync(`scripts/${f}`, "utf8")))) claimed.add(k);
    }
  }
  const free = untranslated.filter((p) => !claimed.has(p));
  const slice = free.slice(skip, skip + take);
  const batch = {};
  for (const p of slice) batch[p] = enFlat[p];
  fs.writeFileSync("scripts/_batch.json", JSON.stringify(batch, null, 1));
  console.log(`extracted ${slice.length} values (skip=${skip}, claimed-excluded=${claimed.size}) -> scripts/_batch.json; free left after: ${free.length - skip - slice.length}`);
} else if (cmd === "merge") {
  const done = JSON.parse(fs.readFileSync(`scripts/${a1}`, "utf8"));
  const tokens = (s) => (s.match(/\{[a-zA-Z0-9_]+\}/g) || []).sort().join(",");
  let ok = 0, skipped = [];
  for (const [p, v] of Object.entries(done)) {
    if (!(p in enFlat)) { skipped.push(p + " (no such path)"); continue; }
    if (typeof v !== "string" || !v.trim()) {
      // icons/pure symbols (no letters in English) fall back to the English value
      if (typeof v === "string" && !/[a-zA-Z]/.test(enFlat[p])) { deepSet(loc_, p, enFlat[p]); ok++; }
      else skipped.push(p + " (empty)");
      continue;
    }
    if (tokens(enFlat[p]) !== tokens(v)) { skipped.push(p + " (placeholder mismatch)"); continue; }
    deepSet(loc_, p, v);
    ok++;
  }
  fs.writeFileSync(file, JSON.stringify(loc_, null, 4) + "\n");
  JSON.parse(fs.readFileSync(file, "utf8"));
  console.log(`merged ${ok}/${Object.keys(done).length} values into ${file}; skipped: ${skipped.length}`);
  if (skipped.length) console.log(skipped.slice(0, 10).join("\n"));
  const now = flatten(JSON.parse(fs.readFileSync(file, "utf8")));
  console.log(`progress: ${paths.filter((p) => now[p] !== enFlat[p]).length}/${paths.length}`);
} else {
  console.log("unknown command");
}
