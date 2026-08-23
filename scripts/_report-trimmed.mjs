import fs from "fs";

/**
 * Report: list every non-en locale array that was TRIMMED by the alignment
 * (i.e. the locale had MORE entries than en, so extras were dropped).
 * Also report en keys that were stripped as redundant.
 */
const LOCALES = ["en", "zh", "ja", "ko", "ru"];
const back = {};
const now = {};
for (const l of LOCALES) {
  back[l] = JSON.parse(fs.readFileSync(`scripts/.backup-messages/${l}.json`, "utf-8"));
  now[l] = JSON.parse(fs.readFileSync(`messages/${l}.json`, "utf-8"));
}

function arraysOf(obj, prefix = "", out = []) {
  if (!obj || typeof obj !== "object") return out;
  if (Array.isArray(obj)) {
    out.push({ path: prefix, arr: obj });
    obj.forEach((v, i) => arraysOf(v, `${prefix}[${i}]`, out));
    return out;
  }
  for (const k of Object.keys(obj)) arraysOf(obj[k], prefix ? `${prefix}.${k}` : k, out);
  return out;
}

const report = [];
for (const l of LOCALES.slice(1)) {
  for (const slug of Object.keys(now[l].tools)) {
    const b = back[l].tools[slug];
    const n = now[l].tools[slug];
    if (!b || !n) continue;
    const bArrays = arraysOf(b);
    const nArrays = arraysOf(n);
    const mapN = new Map(nArrays.map((x) => [x.path, x.arr]));
    for (const { path, arr } of bArrays) {
      const cur = mapN.get(path);
      if (cur && cur.length < arr.length) {
        const dropped = arr.slice(cur.length).map((x) =>
          typeof x === "string" ? x.slice(0, 80) : JSON.stringify(x).slice(0, 80)
        );
        report.push({ l, slug, path, before: arr.length, after: cur.length, dropped });
      }
    }
  }
}

console.log("=== TRIMMED CONTENT REPORT ===\n");
if (report.length === 0) {
  console.log("No content was trimmed.");
} else {
  for (const r of report) {
    console.log(`[${r.l}] ${r.slug} ${r.path}: ${r.before} -> ${r.after}`);
    for (const d of r.dropped) console.log(`    dropped: ${d}`);
  }
}
