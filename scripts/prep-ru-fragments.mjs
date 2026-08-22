import fs from "fs";
import path from "path";

/**
 * Split messages/en.json into translation fragments:
 *   scripts/ru-fragments/en/base.json        → all namespaces except home/tools
 *   scripts/ru-fragments/en/home.json        → home namespace (tool directory + UI)
 *   scripts/ru-fragments/en/tools-001.json … → tools namespace, 25 tools per batch
 *
 * Fragments are written as plain JSON (emoji stay as real chars). A separate
 * merge script (merge-ru.mjs) re-escapes emoji to \uXXXX when writing ru.json.
 */
const enPath = path.join(process.cwd(), "messages", "en.json");
const outDir = path.join(process.cwd(), "scripts", "ru-fragments", "en");
fs.mkdirSync(outDir, { recursive: true });

const en = JSON.parse(fs.readFileSync(enPath, "utf-8"));

const BASE_NAMESPACES = [
  "metadata", "common", "nav", "footer", "localeSwitcher",
  "toolLayout", "privacy", "terms", "blogLayout", "blogIndex",
];

const base = {};
for (const ns of BASE_NAMESPACES) base[ns] = en[ns];
fs.writeFileSync(path.join(outDir, "base.json"), JSON.stringify(base, null, 1));

fs.writeFileSync(path.join(outDir, "home.json"), JSON.stringify({ home: en.home }, null, 1));

const slugs = Object.keys(en.tools);
const BATCH = 25;
let batch = 1;
for (let i = 0; i < slugs.length; i += BATCH) {
  const part = {};
  for (const slug of slugs.slice(i, i + BATCH)) part[slug] = en.tools[slug];
  const name = `tools-${String(batch).padStart(3, "0")}.json`;
  fs.writeFileSync(path.join(outDir, name), JSON.stringify({ tools: part }, null, 1));
  batch++;
}

console.log(`wrote ${slugs.length} tools in ${batch - 1} batches + base.json + home.json`);
for (const f of fs.readdirSync(outDir)) {
  const kb = fs.statSync(path.join(outDir, f)).size / 1024;
  console.log(`  ${f}  ${kb.toFixed(0)}KB`);
}
