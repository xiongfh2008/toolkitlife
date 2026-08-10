// One-off: add preset/drag-drop labels to image-filters in all 4 locales.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const extra = {
  en: {
    dropPrompt: "Drop an image here or click to upload",
    dropHint: "JPG, PNG, WebP, GIF",
    presets: "Filter presets",
    custom: "Custom",
  },
  zh: {
    dropPrompt: "拖放图片到这里，或点击上传",
    dropHint: "支持 JPG、PNG、WebP、GIF",
    presets: "滤镜预设",
    custom: "自定义",
  },
  ja: {
    dropPrompt: "画像をここにドロップするか、クリックしてアップロード",
    dropHint: "JPG、PNG、WebP、GIF",
    presets: "フィルタープリセット",
    custom: "カスタム",
  },
  ko: {
    dropPrompt: "이미지를 여기에 놓거나 클릭하여 업로드",
    dropHint: "JPG, PNG, WebP, GIF",
    presets: "필터 프리셋",
    custom: "사용자 지정",
  },
};

for (const lang of ["en", "zh", "ja", "ko"]) {
  const file = join(root, "messages", `${lang}.json`);
  const data = JSON.parse(readFileSync(file, "utf8"));
  const labels = data.tools?.["image-filters"]?.labels;
  if (!labels) {
    console.error(`SKIP ${lang}: image-filters.labels not found`);
    continue;
  }
  Object.assign(labels, extra[lang]);
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`updated ${lang}.json`);
}
console.log("done");
