import fs from "fs";
import path from "path";
import enContent from "./website-content-en.mjs";
import zhContent from "./website-content-zh.mjs";
import jaContent from "./website-content-ja.mjs";
import koContent from "./website-content-ko.mjs";

const root = process.cwd();
const LOCALES = ["en", "zh", "ja", "ko"];
const CONTENT = { en: enContent, zh: zhContent, ja: jaContent, ko: koContent };

function buildEntry(slug, obj, indent) {
  const lines = [];
  lines.push(`${" ".repeat(indent)}"${slug}": {`);
  const inner = JSON.stringify(obj, null, 2).split("\n");
  for (let i = 1; i < inner.length - 1; i++) {
    lines.push(`${" ".repeat(indent)}${inner[i]}`);
  }
  lines.push(`${" ".repeat(indent)}},`);
  return lines.join("\n");
}

function insertAfter(text, anchor, block) {
  const idx = text.indexOf(anchor);
  if (idx === -1) throw new Error(`Anchor not found: ${JSON.stringify(anchor.slice(0, 40))}`);
  const insertAt = idx + anchor.length;
  return text.slice(0, insertAt) + "\n" + block + "\n" + text.slice(insertAt);
}

for (const locale of LOCALES) {
  const file = path.join(root, "messages", `${locale}.json`);
  let text = fs.readFileSync(file, "utf-8");

  // Anchors start with the file's EOL so the 2-space variant can never match
  // inside the 4-space variant (otherwise "  \"tools\"" is a substring of "    \"tools\"").
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const homeAnchor = `${eol}    "tools": {${eol}`;
  const toolsAnchor = `${eol}  "tools": {${eol}`;

  const data = CONTENT[locale] ?? CONTENT.en;
  const homeBlock = Object.entries(data)
    .map(([slug, d]) => buildEntry(slug, d.home, 6))
    .join("\n");
  const toolsBlock = Object.entries(data)
    .map(([slug, d]) => buildEntry(slug, d.tool, 4))
    .join("\n");

  text = insertAfter(text, homeAnchor, homeBlock);
  text = insertAfter(text, toolsAnchor, toolsBlock);

  fs.writeFileSync(file, text);
  console.log(`Updated ${locale}.json`);
}
