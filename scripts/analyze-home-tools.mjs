import fs from "fs";
import path from "path";

const root = process.cwd();
const files = ["zh.json", "ja.json", "ko.json"];

function asciiRatio(str) {
  if (!str) return 0;
  const asciiLetters = (str.match(/[A-Za-z]/g) || []).length;
  const totalChars = str.replace(/\s+/g, "").length || 1;
  return asciiLetters / totalChars;
}

for (const file of files) {
  const filePath = path.join(root, "messages", file);
  const messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const tools = messages.home?.tools || {};
  const englishSlugs = [];
  for (const [slug, data] of Object.entries(tools)) {
    const name = data?.name || "";
    const ratio = asciiRatio(name);
    if (ratio > 0.5) {
      englishSlugs.push({ slug, name, ratio: ratio.toFixed(2) });
    }
  }
  console.log(`\n=== ${file} ===`);
  console.log(`Total home.tools entries: ${Object.keys(tools).length}`);
  console.log(`English names (>50% ASCII): ${englishSlugs.length}`);
  for (const item of englishSlugs) {
    console.log(`  ${item.slug}: "${item.name}" (ratio ${item.ratio})`);
  }
}
