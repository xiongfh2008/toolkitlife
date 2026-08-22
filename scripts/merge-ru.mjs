import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Merge the translated ru fragments (base + home + tools-001..012) into a
 * single messages/ru.json, and verify structural parity against en.json.
 * Safe to re-run.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const fragDir = path.join(__dirname, "ru-fragments", "ru");
const enPath = path.join(root, "messages", "en.json");
const outPath = path.join(root, "messages", "ru.json");

const en = JSON.parse(fs.readFileSync(enPath, "utf-8"));

const merged = {};
let toolCount = 0;

// base.json holds the root namespaces (common/nav/footer/localeSwitcher/...).
const base = JSON.parse(
  fs.readFileSync(path.join(fragDir, "base.json"), "utf-8")
);
for (const [k, v] of Object.entries(base)) merged[k] = v;

// home.json holds the `home` namespace (tool directory + scenes + UI).
const homeFrag = JSON.parse(
  fs.readFileSync(path.join(fragDir, "home.json"), "utf-8")
);
merged.home = homeFrag.home;

// blogPosts.json holds the blog list metadata (title/description per post).
merged.blogPosts = JSON.parse(
  fs.readFileSync(path.join(fragDir, "blogPosts.json"), "utf-8")
);

// tools-001..012 hold the per-tool detail bundles, wrapped as { tools: {...} }.
merged.tools = {};
const toolFiles = fs
  .readdirSync(fragDir)
  .filter((f) => /^tools-\d{3}\.json$/.test(f))
  .sort();
for (const f of toolFiles) {
  const frag = JSON.parse(fs.readFileSync(path.join(fragDir, f), "utf-8"));
  for (const [slug, bundle] of Object.entries(frag.tools)) {
    if (merged.tools[slug]) {
      console.error(`DUPLICATE tool slug in fragments: ${slug}`);
      process.exit(1);
    }
    merged.tools[slug] = bundle;
    toolCount++;
  }
}

// ---- Structural verification against en ----
let problems = [];
const walk = (a, b, keyPath) => {
  if (a === null || b === null) return;
  if (typeof a !== typeof b) {
    problems.push(`type mismatch at ${keyPath}: en=${typeof a} ru=${typeof b}`);
    return;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      problems.push(`array mismatch at ${keyPath}`);
      return;
    }
    if (a.length !== b.length)
      problems.push(`array length at ${keyPath}: en=${a.length} ru=${b.length}`);
    a.forEach((_, i) => walk(a[i], b[i], `${keyPath}[${i}]`));
    return;
  }
  if (typeof a === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    const missing = aKeys.filter((k) => !(k in b));
    const extra = bKeys.filter((k) => !(k in a));
    if (missing.length)
      problems.push(`missing keys at ${keyPath}: ${missing.slice(0, 8).join(", ")}`);
    if (extra.length)
      problems.push(`extra keys at ${keyPath}: ${extra.slice(0, 8).join(", ")}`);
    for (const k of aKeys) if (k in b) walk(a[k], b[k], `${keyPath}.${k}`);
    return;
  }
  // leaf: en value may be an empty string that ru translated; require non-empty
  // only when en is non-empty.
  if (typeof a === "string" && a.trim() !== "" && typeof b === "string" && b.trim() === "") {
    problems.push(`empty ru value at ${keyPath} (en="${a.slice(0, 40)}")`);
  }
};

walk(en, merged, "root");

const enToolSlugs = Object.keys(en.home.tools);
const ruToolSlugs = Object.keys(merged.home.tools);
const missingTools = enToolSlugs.filter((s) => !(s in merged.tools));
const extraTools = ruToolSlugs.filter((s) => !(s in en.home.tools));

console.log("---- merge report ----");
console.log(`root namespaces ru: ${Object.keys(merged).join(", ")}`);
console.log(`tool bundles merged: ${toolCount} (en home.tools: ${enToolSlugs.length})`);
console.log(`tool detail missing in ru.tools: ${missingTools.length}${missingTools.length ? " " + missingTools.join(",") : ""}`);
console.log(`home.tools keys missing: ${enToolSlugs.length - ruToolSlugs.length}`);
console.log(`extra tools in home (not in en): ${extraTools.length}`);
console.log(`structural problems: ${problems.length}`);
if (problems.length) {
  for (const p of problems.slice(0, 40)) console.log("  " + p);
}
if (problems.length || missingTools.length || enToolSlugs.length !== ruToolSlugs.length) {
  console.error("ABORT: ru.json NOT written (parity check failed).");
  process.exit(1);
}

fs.writeFileSync(outPath, JSON.stringify(merged, null, 2) + "\n", "utf-8");
const bytes = fs.statSync(outPath).size;
console.log(`WROTE messages/ru.json: ${bytes.toLocaleString()} bytes`);
console.log(`en.json size: ${fs.statSync(enPath).size.toLocaleString()} bytes`);
