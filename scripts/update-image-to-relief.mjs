// One-off: inject the image-to-relief tool translations into all locale files.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, "..", "messages");

const LANGS = ["en", "zh", "ja", "ko"];
const SLUG = "image-to-relief";
const RELATED = ["background-remover", "image-upscaler", "image-filters", "convert"];

const home = {
  en: { name: "Image to 3D Relief", description: "Turn any photo into a 3D relief — preview it and export GLB or STL. Free & private.", category: "Image Tools", icon: "🧊" },
  zh: { name: "图片转 3D 浮雕", description: "将图片转换为 3D 浮雕，支持在线预览并导出 GLB/STL，免费使用。", category: "图像工具", icon: "🧊" },
  ja: { name: "画像を3Dレリーフ化", description: "画像から3Dレリーフを生成。プレビュー後、GLB/STLで書き出し可能な無料ツール。", category: "画像ツール", icon: "🧊" },
  ko: { name: "이미지 3D 릴리프", description: "이미지를 3D 릴리프로 변환하고 GLB/STL로 내보내는 무료 도구.", category: "이미지 도구", icon: "🧊" },
};

const guideTitles = {
  en: { whatIs: "What is an image-to-3D relief tool?", howTo: "How to use", howToIntro: "Three steps:", tips: "Tips" },
  zh: { whatIs: "什么是图片转 3D 浮雕工具？", howTo: "使用方法", howToIntro: "三步完成：", tips: "小提示" },
  ja: { whatIs: "画像3Dレリーフ変換ツールとは？", howTo: "使い方", howToIntro: "3ステップ：", tips: "ヒント" },
  ko: { whatIs: "이미지 3D 릴리프 변환 도구란?", howTo: "사용 방법", howToIntro: "3단계로 완료:", tips: "팁" },
};

const D = {
  en: {
    metaTitle: "Image to 3D Relief - Free Online Tool",
    metaDesc: "Free online tool to turn any photo into a 3D relief. Preview in 3D and export GLB or STL. No signup, fully private — processing happens in your browser.",
    title: "Image to 3D Relief",
    desc: "Turn any photo into a 3D relief based on its brightness. Preview the result in full 3D and export as GLB or STL — all in your browser.",
    category: "Image Tools",
    keywords: ["image to 3d", "3d relief", "photo to 3d", "relief generator", "height map", "displacement map", "stl relief", "emboss"],
    whatIs: "This tool turns any photo into a 3D relief: it maps the image's brightness onto a mesh so bright areas stand out, then lets you preview the result with full 3D controls and export it as GLB (viewers/game engines) or STL (3D printing). Everything runs locally in your browser — nothing is uploaded.",
    howTo: ["Upload an image (JPG, PNG or WebP).", "Adjust grid resolution, relief strength and smoothing, then click Generate 3D.", "Preview the mesh (drag to rotate, scroll to zoom), then download GLB or STL."],
    tips: ["Images with strong contrast produce more dramatic reliefs.", "Increase smoothing to reduce noise on detailed photos.", "For 3D printing, choose STL — the model is automatically laid flat for slicing."],
    faqs: [
      ["How is the 3D relief generated?", "The tool reads each pixel's brightness (luminance) and lifts the mesh height accordingly — bright areas rise, dark areas stay low. Parameters let you control resolution, height and smoothing."],
      ["What's the difference between GLB and STL?", "GLB is a general 3D format for viewers and game engines. STL is the standard format for 3D printing and is exported pre-oriented flat."],
      ["Is my image uploaded?", "No. All processing happens in your browser; your image never leaves your device."],
      ["Why does my result look flat?", "Low-contrast images produce subtle reliefs. Try increasing relief strength, lowering smoothing, or using a photo with stronger lighting contrast."],
    ],
    labels: {
      dropPrompt: "Upload an image to create a 3D relief",
      dropHint: "JPG · PNG · WebP",
      source: "Source image",
      gridSize: "Grid resolution",
      strength: "Relief strength",
      smooth: "Smoothing",
      invert: "Invert depth (light = recessed)",
      generate: "Generate 3D",
      generating: "Generating…",
      previewHint: "Drag to rotate · Scroll to zoom",
      downloadGlb: "Download GLB",
      downloadStl: "Download STL (3D printing)",
      newImage: "New image",
    },
    errors: { failed: "Generation failed. Please try again." },
  },
  zh: {
    metaTitle: "图片转 3D 浮雕 - 免费在线工具",
    metaDesc: "免费在线将任意图片转换为 3D 浮雕：3D 预览并导出 GLB/STL。无需注册，全程浏览器本地处理、图片不上传。",
    title: "图片转 3D 浮雕",
    desc: "根据图片明暗生成 3D 浮雕模型，支持 3D 交互预览，并导出 GLB 或 STL 文件，全程在浏览器本地完成。",
    category: "图像工具",
    keywords: ["图片转3d", "3d浮雕", "照片转3d", "浮雕生成", "高度图", "置换贴图", "stl浮雕", "浮雕模型"],
    whatIs: "本工具将任意图片转换为 3D 浮雕：根据画面明暗把像素亮度映射为凹凸起伏，生成可交互预览的 3D 网格，并可导出 GLB（3D 查看/游戏引擎）或 STL（3D 打印）。所有处理都在浏览器本地完成，图片不会上传。",
    howTo: ["上传一张图片（JPG、PNG 或 WebP）。", "调整网格精度、浮雕高度与平滑次数，点击\u201c生成 3D\u201d。", "在 3D 预览中拖拽旋转、滚轮缩放，满意后下载 GLB 或 STL。"],
    tips: ["对比度强的图片能生成更有立体感的浮雕。", "细节较多的照片可适当提高平滑次数以减少噪点。", "3D 打印请选择 STL 格式，导出时已自动摆平底边。"],
    faqs: [
      ["3D 浮雕是怎么生成的？", "工具读取每个像素的亮度（明暗），按亮度抬高网格：亮处凸起、暗处低平。分辨率、高度和平滑次数都可调节。"],
      ["GLB 和 STL 有什么区别？", "GLB 是通用 3D 格式，适合查看器和游戏引擎；STL 是 3D 打印的标准格式，导出时已自动摆平。"],
      ["我的图片会被上传吗？", "不会。所有处理都在浏览器本地完成，图片不会离开你的设备。"],
      ["为什么生成的浮雕不够立体？", "对比度低的图片浮雕效果较平。可尝试提高浮雕高度、降低平滑次数，或改用明暗对比更强的照片。"],
    ],
    labels: {
      dropPrompt: "上传图片，生成 3D 浮雕",
      dropHint: "支持 JPG · PNG · WebP",
      source: "原图",
      gridSize: "网格精度",
      strength: "浮雕高度",
      smooth: "平滑次数",
      invert: "反转凹凸（亮处变凹）",
      generate: "生成 3D",
      generating: "正在生成…",
      previewHint: "拖拽旋转 · 滚轮缩放",
      downloadGlb: "下载 GLB",
      downloadStl: "下载 STL（3D 打印）",
      newImage: "重新上传",
    },
    errors: { failed: "生成失败，请重试。" },
  },
  ja: {
    metaTitle: "画像を3Dレリーフ化 - 無料オンラインツール",
    metaDesc: "画像の明暗から3Dレリーフを無料で生成。3Dプレビュー後、GLB/STLで書き出し。登録不要、すべてブラウザ内で処理。",
    title: "画像を3Dレリーフ化",
    desc: "画像の明暗を高さに変換して3Dレリーフを生成。3Dプレビューで確認し、GLBまたはSTLとして書き出せます。",
    category: "画像ツール",
    keywords: ["画像を3d化", "3dレリーフ", "写真を3d化", "レリーフ生成", "ハイトマップ", "ディスプレイスメント", "stlレリーフ"],
    whatIs: "画像の明暗を高さに変換し、3Dレリーフを生成するツールです。ブラウザ上で自由に回転・ズームして確認でき、GLB（3Dビューア・ゲームエンジン）やSTL（3Dプリント）で書き出せます。すべてブラウザ内で処理され、画像はアップロードされません。",
    howTo: ["画像（JPG・PNG・WebP）をアップロードします。", "グリッド精度・浮き出しの高さ・スムージングを調整し、「3D生成」をクリック。", "プレビューを回転・ズームして確認し、GLBまたはSTLをダウンロードします。"],
    tips: ["コントラストの強い画像ほど立体感のあるレリーフになります。", "細かい写真はスムージングを上げるとノイズが減ります。", "3DプリントにはSTL形式を選択してください。底辺が平らになるよう自動で配置されます。"],
    faqs: [
      ["3Dレリーフはどうやって生成されますか？", "各ピクセルの明るさ（輝度）を読み取り、明るい部分を高く持ち上げてメッシュを変形します。解像度・高さ・スムージングを調整できます。"],
      ["GLBとSTLの違いは？", "GLBはビューアやゲームエンジン向けの汎用3D形式です。STLは3Dプリントの標準形式で、底辺が平らな状態で書き出されます。"],
      ["画像はアップロードされますか？", "いいえ。すべてブラウザ内で処理され、画像がデバイスの外に出ることはありません。"],
      ["生成結果が平たくなってしまうのはなぜ？", "コントラストが低い画像は浮き出しが弱くなります。浮き出しの高さを上げる、スムージングを下げる、または明暗の強い写真を試してください。"],
    ],
    labels: {
      dropPrompt: "画像をアップロードして3Dレリーフを作成",
      dropHint: "JPG · PNG · WebP",
      source: "元画像",
      gridSize: "グリッド精度",
      strength: "浮き出しの高さ",
      smooth: "スムージング",
      invert: "反転（明るい部分を凹ませる）",
      generate: "3D生成",
      generating: "生成中…",
      previewHint: "ドラッグで回転・ホイールでズーム",
      downloadGlb: "GLBをダウンロード",
      downloadStl: "STLをダウンロード（3Dプリント）",
      newImage: "別の画像",
    },
    errors: { failed: "生成に失敗しました。もう一度お試しください。" },
  },
  ko: {
    metaTitle: "이미지 3D 릴리프 - 무료 온라인 도구",
    metaDesc: "이미지의 밝기로 3D 릴리프를 무료로 생성. 3D 미리보기 후 GLB/STL로 내보내기. 회원가입 불필요, 브라우저에서만 처리.",
    title: "이미지 3D 릴리프",
    desc: "이미지의 밝기를 높이로 변환해 3D 릴리프를 생성하고, 3D 미리보기 후 GLB 또는 STL로 내보낼 수 있습니다.",
    category: "이미지 도구",
    keywords: ["이미지 3d 변환", "3d 릴리프", "사진 3d 변환", "릴리프 생성", "하이트맵", "변위 맵", "stl 릴리프"],
    whatIs: "이미지의 밝기를 높이로 변환해 3D 릴리프를 생성하는 도구입니다. 브라우저에서 자유롭게 회전·확대하며 확인하고 GLB(3D 뷰어·게임 엔진) 또는 STL(3D 프린팅)로 내보낼 수 있습니다. 모든 처리는 브라우저에서만 이루어지며 업로드되지 않습니다.",
    howTo: ["이미지(JPG·PNG·WebP)를 업로드합니다.", "그리드 정밀도·릴리프 높이·스무딩을 조정하고 '3D 생성'을 클릭합니다.", "미리보기에서 회전·확대하며 확인한 뒤 GLB 또는 STL을 다운로드합니다."],
    tips: ["대비가 강한 이미지일수록 더 입체적인 릴리프가 생성됩니다.", "디테일이 많은 사진은 스무딩을 높이면 노이즈가 줄어듭니다.", "3D 프린팅에는 STL 형식을 선택하세요. 바닥이 평평하도록 자동으로 배치됩니다."],
    faqs: [
      ["3D 릴리프는 어떻게 생성되나요?", "각 픽셀의 밝기(휘도)를 읽어 밝은 부분은 높이 올리고 어두운 부분은 낮게 유지하도록 메시를 변형합니다. 정밀도·높이·스무딩을 조절할 수 있습니다."],
      ["GLB와 STL의 차이는?", "GLB는 뷰어·게임 엔진용 범용 3D 형식입니다. STL은 3D 프린팅 표준 형식으로, 바닥이 평평하게 배치된 상태로 내보내집니다."],
      ["이미지가 업로드되나요?", "아니요. 모든 처리는 브라우저에서만 이루어지며 이미지가 기기를 벗어나지 않습니다."],
      ["결과가 평평하게 나오는 이유는?", "대비가 낮은 이미지는 릴리프 효과가 약합니다. 릴리프 높이를 높이거나 스무딩을 낮추고, 명암 대비가 강한 사진을 사용해 보세요."],
    ],
    labels: {
      dropPrompt: "이미지를 업로드해 3D 릴리프 생성",
      dropHint: "JPG · PNG · WebP",
      source: "원본 이미지",
      gridSize: "그리드 정밀도",
      strength: "릴리프 높이",
      smooth: "스무딩",
      invert: "반전(밝은 부분이 오목하게)",
      generate: "3D 생성",
      generating: "생성 중…",
      previewHint: "드래그로 회전 · 휠로 확대/축소",
      downloadGlb: "GLB 다운로드",
      downloadStl: "STL 다운로드(3D 프린팅)",
      newImage: "이미지 변경",
    },
    errors: { failed: "생성에 실패했습니다. 다시 시도해 주세요." },
  },
};

for (const lang of LANGS) {
  const file = join(messagesDir, `${lang}.json`);
  const data = JSON.parse(readFileSync(file, "utf8"));

  data.home.tools[SLUG] = home[lang];

  const d = D[lang];
  const g = guideTitles[lang];
  data.tools[SLUG] = {
    metadata: { title: d.metaTitle, description: d.metaDesc },
    title: d.title,
    description: d.desc,
    category: d.category,
    keywords: d.keywords,
    guide: {
      whatIs: { title: g.whatIs, body: [d.whatIs] },
      howTo: { title: g.howTo, intro: g.howToIntro, items: d.howTo },
      tips: { title: g.tips, items: d.tips },
    },
    faqs: d.faqs.map(([q, a]) => ({ question: q, answer: a })),
    relatedTools: RELATED.map((s) => ({
      name: data.home.tools[s]?.name ?? s,
      href: `/tools/${s}`,
    })),
    labels: d.labels,
    errors: d.errors,
  };

  if (data.home.heroBadge && data.home.heroBadge.includes("214")) {
    data.home.heroBadge = data.home.heroBadge.replace("214", "215");
  }

  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`updated ${lang}`);
}
