// Add dropzone hint keys to tools.ico-converter.labels in all 9 locale files.
import { readFileSync, writeFileSync } from "node:fs";

const T = {
  en: { dropHint: "Drop images here or click to select", dropHintIco: "Drop an ICO file here or click to select" },
  zh: { dropHint: "拖拽图片到此处，或点击选择", dropHintIco: "拖拽 ICO 文件到此处，或点击选择" },
  ja: { dropHint: "画像をここにドラッグ＆ドロップ、またはクリックして選択", dropHintIco: "ICO ファイルをここにドラッグ＆ドロップ、またはクリックして選択" },
  ko: { dropHint: "이미지를 여기에 끌어다 놓거나 클릭하여 선택", dropHintIco: "ICO 파일을 여기에 끌어다 놓거나 클릭하여 선택" },
  ru: { dropHint: "Перетащите изображения сюда или нажмите для выбора", dropHintIco: "Перетащите файл ICO сюда или нажмите для выбора" },
  es: { dropHint: "Arrastra imágenes aquí o haz clic para seleccionar", dropHintIco: "Arrastra un archivo ICO aquí o haz clic para seleccionar" },
};

for (const locale of ["en", "zh", "ja", "ko", "ru", "es", "de", "fr", "pt"]) {
  const path = `messages/${locale}.json`;
  const m = JSON.parse(readFileSync(path, "utf8"));
  const labels = m.tools["ico-converter"].labels;
  if (labels.dropHint) {
    console.log(`${locale}: already patched, skip`);
    continue;
  }
  const v = T[locale] ?? T.en;
  const out = {};
  for (const [k, val] of Object.entries(labels)) {
    out[k] = val;
    if (k === "pasteHint") {
      out.dropHint = v.dropHint;
      out.dropHintIco = v.dropHintIco;
    }
  }
  if (!out.dropHint) {
    out.dropHint = v.dropHint;
    out.dropHintIco = v.dropHintIco;
  }
  m.tools["ico-converter"].labels = out;
  writeFileSync(path, JSON.stringify(m, null, 2) + "\n");
  console.log(`${locale}: added dropHint + dropHintIco`);
}
