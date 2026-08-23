import fs from "fs";
import path from "path";

/**
 * Align all locale tool bundles to a single authoritative structure.
 *
 * Rules (per user decision):
 *  1. en is the structural source of truth.
 *  2. Missing array entries / object keys in zh/ja/ko/ru are filled with the
 *     corresponding en content (kept in English for later translation).
 *  3. UNION for arrays: entries that only exist in a non-en locale are KEPT
 *     (never trimmed). Only genuinely missing entries are filled from en.
 *     Object keys are still normalized to the en key set (missing keys filled
 *     from en, extra keys dropped) so every locale shares one key shape.
 *  4. Known redundant keys (regex-tester guide.intro / guide.sections — present
 *     in en/zh/ru but NOT in ja/ko, and unreferenced by the page) are removed
 *     everywhere so all locales share one shape.
 */

const LOCALES = ["en", "zh", "ja", "ko", "ru"];
const messagesDir = path.join(process.cwd(), "messages");

// Keys to strip from ALL locales that have them (en-only cruft not referenced
// by the regex-tester page, which uses introduction/howToUse/flags/tips/useCases).
const STRIP_KEYS = [
  ["regex-tester", "guide", "intro"],
  ["regex-tester", "guide", "sections"],
];

const msgs = {};
for (const l of LOCALES) {
  msgs[l] = JSON.parse(fs.readFileSync(path.join(messagesDir, `${l}.json`), "utf-8"));
}

// --- step 1: strip redundant keys from every locale ---
for (const [slug, section, key] of STRIP_KEYS) {
  for (const l of LOCALES) {
    const b = msgs[l].tools[slug];
    if (b?.[section] && typeof b[section] === "object") {
      if (key in b[section]) {
        delete b[section][key];
      }
    }
  }
  console.log(`stripped ${slug}.${section}.${key} in all locales`);
}

// --- step 2: deep-align other locales to en (UNION semantics) ---
function deepAlign(target, template) {
  if (Array.isArray(template)) {
    if (!Array.isArray(target)) return structuredClone(template);
    const len = Math.max(template.length, target.length);
    const out = [];
    for (let i = 0; i < len; i++) {
      if (i < target.length && i < template.length) out.push(deepAlign(target[i], template[i]));
      else if (i < target.length) out.push(structuredClone(target[i])); // keep extra locale entry (union)
      else out.push(structuredClone(template[i])); // fill missing entry with en
    }
    return out;
  }
  if (template && typeof template === "object") {
    const base = target && typeof target === "object" && !Array.isArray(target) ? target : {};
    const out = {};
    // fill / recurse template keys
    for (const k of Object.keys(template)) {
      out[k] = k in base ? deepAlign(base[k], template[k]) : structuredClone(template[k]);
    }
    // template keys win; extra target keys are dropped (align to en)
    return out;
  }
  // scalar: keep target value if present, else template value
  return target !== undefined ? target : template;
}

for (const l of LOCALES.slice(1)) {
  for (const slug of Object.keys(msgs.en.tools)) {
    const tpl = msgs.en.tools[slug];
    const cur = msgs[l].tools[slug];
    if (!cur) continue;
    msgs[l].tools[slug] = deepAlign(cur, tpl);
  }
  console.log(`${l}: aligned`);
}

// --- step 3: write back ---
for (const l of LOCALES) {
  fs.writeFileSync(path.join(messagesDir, `${l}.json`), JSON.stringify(msgs[l], null, 2) + "\n");
}
console.log("wrote 5 locale files");

// --- step 4: subset check across ALL tools ---
// With UNION semantics non-en locales may legitimately hold MORE array entries
// than en, so verify the inverse direction: en's structure must be fully
// covered by every locale (subset), and object keys must match exactly.
function isSubset(template, target) {
  if (Array.isArray(template)) {
    if (!Array.isArray(target) || target.length < template.length) return false;
    for (let i = 0; i < template.length; i++) {
      if (!isSubset(template[i], target[i])) return false;
    }
    return true;
  }
  if (template && typeof template === "object") {
    if (!target || typeof target !== "object" || Array.isArray(target)) return false;
    if (Object.keys(template).length !== Object.keys(target).length) return false;
    for (const k of Object.keys(template)) {
      if (!(k in target)) return false;
      if (!isSubset(template[k], target[k])) return false;
    }
    return true;
  }
  return target !== undefined;
}

let mismatches = 0;
for (const l of LOCALES.slice(1)) {
  for (const slug of Object.keys(msgs.en.tools)) {
    const b = msgs.en.tools[slug];
    const o = msgs[l].tools[slug];
    if (!o) { console.log(`${l} ${slug}: NO BUNDLE`); mismatches++; continue; }
    if (!isSubset(b, o)) {
      console.log(`${l} ${slug}: NOT A SUPERSET OF EN`);
      mismatches++;
    }
  }
}
console.log(
  mismatches === 0
    ? "parity OK: every locale is a structural superset of en for every tool"
    : `PARITY FAILED: ${mismatches} mismatches`
);
