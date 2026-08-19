import fs from "fs";

const LOCALES = ["en", "zh", "ja", "ko"];
const files = {};
for (const l of LOCALES) files[l] = JSON.parse(fs.readFileSync(`messages/${l}.json`, "utf-8"));

const en = files.en;
const issues = [];

// 1. slug set diff
const enSlugs = new Set(Object.keys(en.tools));
for (const l of LOCALES.slice(1)) {
  const slugs = new Set(Object.keys(files[l].tools));
  for (const s of enSlugs) if (!slugs.has(s)) issues.push(`${l}: MISSING tool "${s}"`);
  for (const s of slugs) if (!enSlugs.has(s)) issues.push(`${l}: EXTRA tool "${s}"`);
}

// 2. per-tool key structure diff (en = reference, keys must exist in all locales)
function collectKeys(obj, prefix = "", out = []) {
  if (Array.isArray(obj)) return out;
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      const p = prefix ? `${prefix}.${k}` : k;
      out.push(p);
      collectKeys(v, p, out);
    }
  }
  return out;
}

for (const slug of enSlugs) {
  const ref = collectKeys(en.tools[slug]);
  for (const l of LOCALES.slice(1)) {
    const other = files[l].tools[slug];
    if (!other) continue;
    const otherKeys = collectKeys(other);
    for (const k of ref) {
      if (!otherKeys.includes(k)) issues.push(`${l}.${slug}: MISSING key "${k}"`);
    }
    // arrays in en must be arrays elsewhere
    const walk = (a, b, prefix = "") => {
      if (Array.isArray(a)) {
        if (!Array.isArray(b)) issues.push(`${l}.${slug}.${prefix}: en array but not array`);
        return;
      }
      if (a && typeof a === "object") {
        for (const [k, v] of Object.entries(a)) {
          walk(v, b?.[k], prefix ? `${prefix}.${k}` : k);
        }
      }
    };
    walk(en.tools[slug], other);
  }
}

console.log(`Total issues: ${issues.length}`);
for (const i of issues.slice(0, 60)) console.log("  " + i);
if (issues.length > 60) console.log(`  ... and ${issues.length - 60} more`);
