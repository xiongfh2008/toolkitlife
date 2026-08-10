import fs from "fs";
import path from "path";

const liveHtmlPath = process.argv[2] || "C:/Users/xiong/AppData/Local/Temp/trae/toolcall-output/780aec95-23d4-497c-abac-54e45fa218b7.txt";
const html = fs.readFileSync(liveHtmlPath, "utf-8");
const lines = html.split(/\r?\n/);

const KNOWN_CATEGORIES = new Set([
  "Developer", "Design", "Text", "Utility", "Finance", "Legal", "Health", "Home & Energy", "Marketing"
]);

const liveTools = [];
let current = null;
for (const line of lines) {
  const titleMatch = line.match(/^## \[([^\]]+)\]\(https:\/\/toolkitlife\.com\/tools\/([a-z0-9-]+)\)/);
  if (titleMatch) {
    current = { title: titleMatch[1], slug: titleMatch[2], category: "Unknown" };
    liveTools.push(current);
    continue;
  }
  const catMatch = line.match(/^\[([^\]]+)\]\(https:\/\/toolkitlife\.com\/tools\/[a-z0-9-]+\)/);
  if (current && catMatch) {
    const text = catMatch[1].trim();
    if (KNOWN_CATEGORIES.has(text)) {
      current.category = text;
    }
  }
}

const toolsDir = path.join(process.cwd(), "src/app/[locale]/tools");
const existingSlugs = new Set(
  fs.readdirSync(toolsDir)
    .filter((name) => fs.statSync(path.join(toolsDir, name)).isDirectory())
);

const missing = liveTools.filter((t) => !existingSlugs.has(t.slug));
const extra = [...existingSlugs].filter((s) => !liveTools.some((t) => t.slug === s));

const byCategory = {};
for (const t of missing) {
  byCategory[t.category] = byCategory[t.category] || [];
  byCategory[t.category].push(t);
}

console.log(`Live site has ${liveTools.length} tools. We are missing ${missing.length}.\n`);
for (const cat of Object.keys(byCategory).sort()) {
  console.log(`\n${cat} (${byCategory[cat].length})`);
  for (const t of byCategory[cat]) {
    console.log(`- ${t.title} (${t.slug})`);
  }
}

console.log(`\n\nWe have ${extra.length} tools not present on live site:`);
for (const s of extra) console.log(`- ${s}`);
