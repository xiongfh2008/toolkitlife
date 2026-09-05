// One-shot: disambiguate image-format-converter (batch) from convert
// via slug-scoped raw-text replacement. Delete after use.
import fs from "fs";

const NEW = {
  en: { name: "Batch Image Converter", title: "Batch Image Converter - PNG JPG WebP Online" },
  zh: { name: "批量图片格式转换器", title: "批量图片格式转换器 - 在线PNG JPG WebP互转" },
  ja: { name: "一括画像フォーマット変換", title: "一括画像フォーマット変換 - PNG JPG WebP オンライン変換" },
  ko: { name: "일괄 이미지 형식 변환기", title: "일괄 이미지 형식 변환기 - PNG JPG WebP 온라인 변환" },
  ru: { name: "Пакетный конвертер изображений", title: "Пакетный конвертер изображений - PNG JPG WebP онлайн" },
};

for (const [l, v] of Object.entries(NEW)) {
  const file = `messages/${l}.json`;
  let text = fs.readFileSync(file, "utf8");
  const slug = '"image-format-converter"';
  const occurrences = [...text.matchAll(new RegExp(slug, "g"))].map((m) => m.index);
  if (occurrences.length !== 2) throw new Error(`${l}: expected 2 slug occurrences, got ${occurrences.length}`);
  const oldName = text.slice(occurrences[0], occurrences[0] + 600).match(/"name": "([^"]+)"/)?.[1];
  const oldTitle = text.slice(occurrences[1], occurrences[1] + 800).match(/"title": "([^"]+)"/)?.[1];
  if (!oldName || !oldTitle) throw new Error(`${l}: old values not found`);
  // occurrence 1 = home.tools (has name), occurrence 2 = tools.metadata (has title)
  text =
    text.slice(0, occurrences[0]) +
    text.slice(occurrences[0], occurrences[1]).replace(`"name": "${oldName}"`, `"name": "${v.name}"`) +
    text.slice(occurrences[1]).replace(`"title": "${oldTitle}"`, `"title": "${v.title}"`);
  // verify + validate
  const m = JSON.parse(text);
  if (m.home.tools["image-format-converter"].name !== v.name) throw new Error(`${l}: name apply failed`);
  if (m.tools["image-format-converter"].metadata.title !== v.title) throw new Error(`${l}: title apply failed`);
  if (m.home.tools["convert"].name === v.name) throw new Error(`${l}: convert collided`);
  fs.writeFileSync(file, text, "utf8");
  console.log(`${l}: "${oldName}" -> "${v.name}" | title -> "${v.title}" (${v.title.length + 14} with brand)`);
}
