// One-off: add drag-drop / visual-crop labels to image-crop in all 4 locales.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const extra = {
  en: {
    dropPrompt: "Drop an image here or click to upload",
    dropHint: "JPG, PNG, WebP, GIF, BMP",
    freeCrop: "Free",
    cropHint: "Drag on the image to select the crop area",
    cropSize: "Crop size",
  },
  zh: {
    dropPrompt: "拖放图片到这里，或点击上传",
    dropHint: "支持 JPG、PNG、WebP、GIF、BMP",
    freeCrop: "自由裁剪",
    cropHint: "在图片上拖拽选择裁剪区域",
    cropSize: "裁剪尺寸",
  },
  ja: {
    dropPrompt: "画像をここにドロップするか、クリックしてアップロード",
    dropHint: "JPG、PNG、WebP、GIF、BMP",
    freeCrop: "自由",
    cropHint: "画像上でドラッグして切り抜き範囲を選択",
    cropSize: "切り抜きサイズ",
  },
  ko: {
    dropPrompt: "이미지를 여기에 놓거나 클릭하여 업로드",
    dropHint: "JPG, PNG, WebP, GIF, BMP",
    freeCrop: "자유",
    cropHint: "이미지에서 드래그하여 자르기 영역 선택",
    cropSize: "자르기 크기",
  },
};

for (const lang of ["en", "zh", "ja", "ko"]) {
  const file = join(root, "messages", `${lang}.json`);
  const data = JSON.parse(readFileSync(file, "utf8"));
  const labels = data.tools?.["image-crop"]?.labels;
  if (!labels) {
    console.error(`SKIP ${lang}: image-crop.labels not found`);
    continue;
  }
  Object.assign(labels, extra[lang]);
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`updated ${lang}.json`);
}
console.log("done");
