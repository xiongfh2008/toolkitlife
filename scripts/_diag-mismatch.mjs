import fs from "fs";

const LOCALES = ["en", "zh", "ja", "ko", "ru"];
const msgs = {};
for (const l of LOCALES) msgs[l] = JSON.parse(fs.readFileSync(`messages/${l}.json`, "utf-8"));

// Deep structural compare: reports missing keys, type changes, and array
// element key differences (but ignores string values and array lengths).
function deepDiff(base, other, prefix = "", out = []) {
  if (Array.isArray(base) || Array.isArray(other)) {
    // Compare array element structures (align by index)
    const n = Math.max(base?.length || 0, other?.length || 0);
    for (let i = 0; i < n; i++) {
      const b = base?.[i];
      const o = other?.[i];
      if (b === undefined && o === undefined) continue;
      if (b === undefined) { out.push(`${prefix}[${i}] missing in base`); continue; }
      if (o === undefined) { out.push(`${prefix}[${i}] missing in other`); continue; }
      deepDiff(b, o, `${prefix}[${i}]`, out);
    }
    return out;
  }
  if (base && other && typeof base === "object" && typeof other === "object") {
    const allKeys = new Set([...Object.keys(base), ...Object.keys(other)]);
    for (const k of allKeys) {
      if (!(k in other)) { out.push(`${prefix}.${k} missing in other`); continue; }
      if (!(k in base)) { out.push(`${prefix}.${k} missing in base`); continue; }
      deepDiff(base[k], other[k], `${prefix}.${k}`, out);
    }
    return out;
  }
  if (typeof base !== typeof other) {
    out.push(`${prefix} type ${typeof base} vs ${typeof other}`);
  }
  return out;
}

const summary = {};
for (const l of LOCALES.slice(1)) {
  summary[l] = [];
  for (const slug of Object.keys(msgs.en.tools)) {
    const b = msgs.en.tools[slug];
    const o = msgs[l].tools[slug];
    if (!o) { summary[l].push(`${slug}: NO BUNDLE`); continue; }
    const diffs = deepDiff(b, o);
    if (diffs.length) {
      const keyDiffs = diffs.filter((d) => !d.includes("[len"));
      // Also note pure array-length differences
      const lenDiffs = [];
      (function walkLen(a, c, p) {
        if (Array.isArray(a) && Array.isArray(c) && a.length !== c.length) {
          lenDiffs.push(`${p}[len ${a.length} vs ${c.length}]`);
        }
        if (a && c && typeof a === "object" && typeof c === "object") {
          const ks = new Set([...Object.keys(a), ...Object.keys(c)]);
          for (const k of ks) {
            if (a[k] && c[k] && (Array.isArray(a[k]) || (a[k] && typeof a[k] === "object")))
              walkLen(a[k], c[k], `${p}.${k}`);
          }
        }
      })(b, o, "");
      const reasons = new Set([...keyDiffs, ...lenDiffs]);
      if (reasons.size) summary[l].push({ slug, diffs: [...reasons] });
    }
  }
}

for (const l of Object.keys(summary)) {
  console.log(`\n===== ${l}: ${summary[l].length} tools with structural diffs =====`);
  for (const { slug, diffs } of summary[l]) {
    console.log(`${slug}:`);
    for (const d of diffs) console.log(`    ${d}`);
  }
}
