// One-off: add drag-drop / lock-icon / new-size labels to image-resizer in all 4 locales.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const extra = {
  en: {
    dropPrompt: "Drop an image here or click to upload",
    dropHint: "PNG, JPG, WebP — any size",
    newSize: "New size",
    lockAspect: "Lock aspect ratio",
    unlockAspect: "Unlock aspect ratio",
  },
  zh: {
    dropPrompt: "拖放图片到这里，或点击上传",
    dropHint: "支持 PNG、JPG、WebP — 任意尺寸",
    newSize: "新尺寸",
    lockAspect: "锁定宽高比",
    unlockAspect: "解锁宽高比",
  },
  ja: {
    dropPrompt: "画像をここにドロップするか、クリックしてアップロード",
    dropHint: "PNG、JPG、WebP — 任意のサイズ",
    newSize: "新しいサイズ",
    lockAspect: "アスペクト比をロック",
    unlockAspect: "アスペクト比のロックを解除",
  },
  ko: {
    dropPrompt: "이미지를 여기에 놓거나 클릭하여 업로드",
    dropHint: "PNG, JPG, WebP — 모든 크기",
    newSize: "새 크기",
    lockAspect: "가로세로 비율 잠금",
    unlockAspect: "가로세로 비율 잠금 해제",
  },
};

for (const lang of ["en", "zh", "ja", "ko"]) {
  const file = join(root, "messages", `${lang}.json`);
  const data = JSON.parse(readFileSync(file, "utf8"));
  const labels = data.tools?.["image-resizer"]?.labels;
  if (!labels) {
    console.error(`SKIP ${lang}: image-resizer.labels not found`);
    continue;
  }
  Object.assign(labels, extra[lang]);
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`updated ${lang}.json`);
}
console.log("done");
