import fs from "fs";
import path from "path";
import enContent from "./tracking-content-en.mjs";
import zhContent from "./tracking-content-zh.mjs";
import jaContent from "./tracking-content-ja.mjs";
import koContent from "./tracking-content-ko.mjs";

const root = process.cwd();
const LOCALES = ["en", "zh", "ja", "ko"];
const CONTENT = { en: enContent, zh: zhContent, ja: jaContent, ko: koContent };

// scenes.marketing line (last scene, no trailing comma) per locale.
const SCENE_ANCHOR = {
  en: '      "marketing": "Marketing"',
  zh: '      "marketing": "营销"',
  ja: '      "marketing": "マーケティング"',
  ko: '      "marketing": "마케팅"',
};
const SCENE_ADD = {
  en: '      "tracking": "Tracking",\n      "domain": "Domain"',
  zh: '      "tracking": "追踪",\n      "domain": "域名"',
  ja: '      "tracking": "トラッキング",\n      "domain": "ドメイン"',
  ko: '      "tracking": "추적",\n      "domain": "도메인"',
};

// home.categories "Marketing" line (trailing comma) per locale.
const CAT_ANCHOR = {
  en: '      "Marketing": "Marketing",',
  zh: '      "Marketing": "营销",',
  ja: '      "Marketing": "マーケティング",',
  ko: '      "Marketing": "마케팅",',
};
const CAT_ADD = {
  en: '      "Tracking": "Tracking",\n      "Domain": "Domain",',
  zh: '      "Tracking": "追踪",\n      "Domain": "域名",',
  ja: '      "Tracking": "トラッキング",\n      "Domain": "ドメイン",',
  ko: '      "Tracking": "추적",\n      "Domain": "도메인",',
};

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

function replaceOnce(text, anchor, replacement) {
  const idx = text.indexOf(anchor);
  if (idx === -1) throw new Error(`Anchor not found: ${JSON.stringify(anchor.slice(0, 40))}`);
  return text.slice(0, idx) + replacement + text.slice(idx + anchor.length);
}

for (const locale of LOCALES) {
  const file = path.join(root, "messages", `${locale}.json`);
  let text = fs.readFileSync(file, "utf-8");

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
  text = replaceOnce(text, SCENE_ANCHOR[locale], `${SCENE_ANCHOR[locale]},\n${SCENE_ADD[locale]}`);
  text = replaceOnce(text, CAT_ANCHOR[locale], `${CAT_ANCHOR[locale]}\n${CAT_ADD[locale]}`);

  fs.writeFileSync(file, text);
  console.log(`Updated ${locale}.json`);
}
