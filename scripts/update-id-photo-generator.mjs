// One-off: inject the id-photo-generator tool translations into all locale files.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, "..", "messages");

const LANGS = ["en", "zh", "ja", "ko"];
const SLUG = "id-photo-generator";
const RELATED = ["background-remover", "image-resizer", "image-crop", "image-filters"];

const home = {
  en: { name: "ID Photo Generator", description: "Create passport & visa photos in one click — choose size & background, adjust framing. Free & private.", category: "Image Tools", icon: "📷" },
  zh: { name: "证件照制作", description: "在线制作护照、签证证件照：选择规格与背景色，一键换底并微调构图，免费使用。", category: "图像工具", icon: "📷" },
  ja: { name: "証明写真作成", description: "パスポート・ビザ用証明写真を簡単作成。サイズと背景色を選び、構図を調整する無料ツール。", category: "画像ツール", icon: "📷" },
  ko: { name: "증명사진 생성", description: "여권·비자 증명사진을 손쉽게 제작. 규격과 배경색을 선택하고 구도를 조정하는 무료 도구.", category: "이미지 도구", icon: "📷" },
};

const guideTitles = {
  en: { whatIs: "What is an ID photo generator?", howTo: "How to use", howToIntro: "Three steps:", tips: "Tips for best results" },
  zh: { whatIs: "什么是证件照制作工具？", howTo: "使用方法", howToIntro: "三步完成：", tips: "拍摄小贴士" },
  ja: { whatIs: "証明写真作成ツールとは？", howTo: "使い方", howToIntro: "3ステップ：", tips: "撮影のコツ" },
  ko: { whatIs: "증명사진 생성 도구란?", howTo: "사용 방법", howToIntro: "3단계로 완료:", tips: "촬영 팁" },
};

const D = {
  en: {
    metaTitle: "ID Photo Generator - Passport & Visa Photos Online",
    metaDesc: "Create professional passport and visa photos for free. Choose international sizes (US passport, EU/UK, China, Japan), change background color, and download high-quality PNG. Fully private — processing happens in your browser.",
    title: "ID Photo Generator",
    desc: "Turn your portrait photo into a passport or ID photo. Pick an official size, choose a background color, and fine-tune the framing with zoom and offset controls — then download a print-ready PNG. Everything runs locally in your browser.",
    category: "Image Tools",
    keywords: ["id photo", "passport photo", "visa photo", "证件照", "photo generator", "背景替换", "passport generator", "id photo maker"],
    whatIs: "This tool makes passport, visa and ID photos in your browser. Upload a portrait, and the AI removes the background so you can place your face on any official background color (white, blue, red or gray). Pick one of the international sizes — all rendered at 300 DPI print quality — adjust zoom and position, and download a high-quality PNG. Your photo never leaves your device.",
    howTo: ["Upload a front-facing portrait photo with a plain, well-lit background.", "Choose your target ID size and background color. Use the zoom and offset controls to frame the face correctly.", "Download a high-quality PNG, ready to print or submit digitally."],
    tips: ["Well-lit, front-facing photos with both ears visible and a natural expression work best.", "Keep the face centered — zoom and offset controls fine-tune the composition.", "White is the most common background for passport photos; check your destination country's requirements."],
    faqs: [
      ["Is this ID photo generator free?", "Yes, completely free. No registration, no watermarks, no hidden fees. All processing happens locally in your browser."],
      ["What ID sizes are supported?", "We support US passport/visa (2×2 in), EU/UK passport (35×45 mm), China passport (33×48 mm), Japan passport (45×35 mm), 1×1 inch (25×25 mm), small ID (30×40 mm), plus Chinese 1-inch (25×35 mm) and 2-inch (35×49 mm) photos. All sizes output at 300 DPI."],
      ["Can I change the background color?", "Yes. Choose white, blue, red or gray — the chosen color is placed behind your photo."],
      ["What if my photo isn't perfectly centered?", "Use the X/Y offset sliders to move the photo and the zoom slider to control how large the face appears."],
      ["Is my photo uploaded to a server?", "No. The AI background removal and all rendering happen entirely in your browser using WebAssembly — your photo never leaves your device."],
    ],
    labels: {
      dropPrompt: "Upload a portrait to create an ID photo",
      dropHint: "JPG · PNG · WebP",
      processing: "Removing background…",
      processingHint: "AI is processing your photo, please wait",
      spec: "ID photo size",
      background: "Background color",
      scale: "Zoom",
      offsetX: "Horizontal position",
      offsetY: "Vertical position",
      original: "Original",
      preview: "Preview",
      download: "Download ID photo",
      newImage: "New photo",
      pixel: "px",
      bgWhite: "White",
      bgBlue: "Blue",
      bgRed: "Red",
      bgGray: "Gray",
      bgCustom: "Custom",
    },
    errors: { failed: "Background removal failed. Please try another photo." },
  },
  zh: {
    metaTitle: "证件照制作 - 在线护照签证照片生成器",
    metaDesc: "免费在线制作护照、签证证件照：支持美国、欧盟、中国、日本等国际标准规格，一键换背景色，300 DPI 高清输出。全程浏览器本地处理，照片不上传。",
    title: "证件照制作",
    desc: "将人像照片一键制作成护照、签证证件照：选择国际标准规格与背景颜色，用缩放和偏移微调构图，下载可打印的高清 PNG。所有处理都在浏览器本地完成。",
    category: "图像工具",
    keywords: ["证件照", "证件照制作", "护照照片", "签证照片", "证件照换背景", "证件照尺寸", "一寸照", "二寸照", "id photo", "passport photo"],
    whatIs: "本工具在浏览器内直接制作护照、签证和证件照片。上传人像后，AI 自动移除背景，让你可以把头像放到白色、蓝色、红色或灰色等官方背景上。选择国际标准规格（全部以 300 DPI 打印级分辨率输出），调整缩放与位置，下载高清 PNG。照片全程不离开你的设备。",
    howTo: ["上传一张正面、光线充足、纯色背景的人像照片。", "选择目标证件照规格和背景颜色，用缩放和偏移控件正确框选面部。", "下载高质量 PNG 证件照，可直接打印或用于数字提交。"],
    tips: ["光线充足、正面拍摄、双耳可见、表情自然的照片效果最佳。", "将面部置于画面中央——缩放和偏移控件可帮助微调构图。", "白色是护照照片最常见的背景，请确认目的地国家的要求。"],
    faqs: [
      ["证件照制作工具免费吗？", "是的，完全免费。无需注册、无水印、无隐藏费用。所有处理都在浏览器本地完成。"],
      ["支持哪些证件照尺寸？", "支持美国护照/签证（2×2 英寸）、欧盟/英国护照（35×45 毫米）、中国护照（33×48 毫米）、日本护照（45×35 毫米）、1×1 英寸（25×25 毫米）、小证件照（30×40 毫米），以及中国一寸照（25×35 毫米）和二寸照（35×49 毫米）。所有尺寸均以 300 DPI 输出。"],
      ["可以更换背景颜色吗？", "可以，您可以选择白色、蓝色、红色和灰色背景。选定颜色将作为照片后的纯色背景。"],
      ["如果照片没有完美居中怎么办？", "使用水平/垂直偏移滑块调整照片位置，使用缩放滑块控制面部在画面中的大小。"],
      ["我的照片会被上传到服务器吗？", "不会。AI 抠图和所有渲染都在浏览器内通过 WebAssembly 完成——照片不会离开你的设备。"],
    ],
    labels: {
      dropPrompt: "上传人像照片，制作证件照",
      dropHint: "支持 JPG · PNG · WebP",
      processing: "正在移除背景…",
      processingHint: "AI 正在处理您的照片，请稍候",
      spec: "证件照规格",
      background: "背景颜色",
      scale: "缩放",
      offsetX: "水平偏移",
      offsetY: "垂直偏移",
      original: "原图",
      preview: "预览",
      download: "下载证件照",
      newImage: "重新上传",
      pixel: "像素",
      bgWhite: "白色",
      bgBlue: "蓝色",
      bgRed: "红色",
      bgGray: "灰色",
      bgCustom: "自定义",
    },
    errors: { failed: "背景移除失败，请换一张照片重试。" },
  },
  ja: {
    metaTitle: "証明写真作成 - パスポート・ビザ写真オンライン生成",
    metaDesc: "パスポートやビザ用の証明写真を無料で作成。アメリカ・EU・日本などの国際規格に対応し、背景色の変更も可能。300DPIで出力。すべてブラウザ内で処理されます。",
    title: "証明写真作成",
    desc: "肖像写真からパスポートや証明写真を作成。公式サイズと背景色を選び、ズームとオフセットで構図を微調整して、印刷可能なPNGをダウンロード。すべてブラウザ内で完結。",
    category: "画像ツール",
    keywords: ["証明写真", "パスポート写真", "ビザ写真", "背景変更", "証明写真作成", "id photo", "passport photo"],
    whatIs: "ブラウザ内でパスポート・ビザ・証明写真を作成するツールです。肖像写真をアップロードするとAIが背景を除去し、白・青・赤・グレーなどの公式背景色の上に顔を配置できます。国際規格サイズ（すべて300DPIの印刷品質で出力）を選び、ズームと位置を調整して高画質PNGをダウンロード。写真はデバイスから外に出ません。",
    howTo: ["正面を向いた、明るく均一な背景の肖像写真をアップロードします。", "対象の証明写真サイズと背景色を選択。ズームとオフセットで顔を正しくフレーミングします。", "印刷またはデジタル提出に使える高画質PNGをダウンロードします。"],
    tips: ["明るく正面から撮影し、両耳が見え自然な表情の写真が最適です。", "顔を中央に配置——ズームとオフセットで構図を微調整できます。", "パスポート写真の背景は白が一般的。渡航先の要件を確認してください。"],
    faqs: [
      ["この証明写真作成ツールは無料ですか？", "はい、完全無料です。登録不要、透かしなし、隠れた費用もありません。すべてブラウザ内で処理されます。"],
      ["対応している証明写真サイズは？", "米国パスポート/ビザ（2×2インチ）、EU/英国パスポート（35×45mm）、中国パスポート（33×48mm）、日本パスポート（45×35mm）、1×1インチ（25×25mm）、小証明写真（30×40mm）、中国の1インチ（25×35mm）と2インチ（35×49mm）に対応。すべて300DPIで出力します。"],
      ["背景色を変更できますか？", "はい。白・青・赤・グレーから選択でき、選択した色が写真の背景になります。"],
      ["写真が中央にない場合は？", "X/Yオフセットスライダーで位置を調整し、ズームスライダーで顔の大きさを調整できます。"],
      ["写真はサーバーにアップロードされますか？", "いいえ。AI背景除去もレンダリングもすべてブラウザ内でWebAssemblyにより実行され、写真がデバイスの外に出ることはありません。"],
    ],
    labels: {
      dropPrompt: "肖像写真をアップロードして証明写真を作成",
      dropHint: "JPG · PNG · WebP",
      processing: "背景を除去中…",
      processingHint: "AIが写真を処理中です。お待ちください",
      spec: "証明写真サイズ",
      background: "背景色",
      scale: "ズーム",
      offsetX: "水平位置",
      offsetY: "垂直位置",
      original: "元画像",
      preview: "プレビュー",
      download: "証明写真をダウンロード",
      newImage: "写真を変更",
      pixel: "px",
      bgWhite: "白",
      bgBlue: "青",
      bgRed: "赤",
      bgGray: "グレー",
      bgCustom: "カスタム",
    },
    errors: { failed: "背景除去に失敗しました。別の写真でお試しください。" },
  },
  ko: {
    metaTitle: "증명사진 생성 - 온라인 여권·비자 사진 제작",
    metaDesc: "여권·비자 증명사진을 무료로 제작하세요. 미국, EU, 중국, 일본 등 국제 규격을 지원하고 배경색 변경이 가능합니다. 300DPI 출력, 모든 처리는 브라우저에서.",
    title: "증명사진 생성",
    desc: "인물 사진으로 여권·증명사진을 만드세요. 공식 규격과 배경색을 고르고 줌·오프셋으로 구도를 조정한 뒤 인쇄 가능한 PNG를 다운로드합니다. 모든 처리는 브라우저에서.",
    category: "이미지 도구",
    keywords: ["증명사진", "여권사진", "비자사진", "배경 제거", "증명사진 생성", "id photo", "passport photo"],
    whatIs: "브라우저에서 여권·비자·증명사진을 만드는 도구입니다. 인물 사진을 업로드하면 AI가 배경을 제거해 흰색·파란색·빨간색·회색 등 공식 배경색 위에 얼굴을 배치할 수 있습니다. 국제 규격 크기(모두 300DPI 인쇄 품질로 출력)를 선택하고 줌과 위치를 조정한 뒤 고품질 PNG를 다운로드하세요. 사진은 기기를 벗어나지 않습니다.",
    howTo: ["정면을 바라보고 밝고 균일한 배경의 인물 사진을 업로드하세요.", "대상 증명사진 규격과 배경색을 선택하세요. 줌과 오프셋 컨트롤로 얼굴을 올바르게 프레이밍하세요.", "인쇄하거나 디지털 제출에 사용할 고품질 PNG를 다운로드하세요."],
    tips: ["밝은 조명에서 정면으로 찍고 양쪽 귀가 보이며 자연스러운 표정이 좋습니다.", "얼굴을 중앙에 배치하세요 — 줌과 오프셋 컨트롤로 구도를 미세 조정할 수 있습니다.", "여권 사진 배경은 흰색이 가장 일반적입니다. 목적지 국가의 요건을 확인하세요."],
    faqs: [
      ["이 증명사진 생성 도구는 무료인가요?", "네, 완전 무료입니다. 회원가입 없음, 워터마크 없음, 숨은 비용 없음. 모든 처리는 브라우저에서 로컬로 진행됩니다."],
      ["어떤 규격을 지원하나요?", "미국 여권/비자(2×2인치), EU/영국 여권(35×45mm), 중국 여권(33×48mm), 일본 여권(45×35mm), 1×1인치(25×25mm), 소형 증명사진(30×40mm), 중국 1인치(25×35mm)와 2인치(35×49mm)를 지원합니다. 모두 300DPI로 출력됩니다."],
      ["배경색을 바꿀 수 있나요?", "네. 흰색, 파란색, 빨간색, 회색 중 선택할 수 있으며 선택한 색이 사진의 배경이 됩니다."],
      ["사진이 중앙에 없으면 어떻게 하나요?", "X/Y 오프셋 슬라이더로 위치를 조정하고 줌 슬라이더로 얼굴 크기를 조절하세요."],
      ["사진이 서버에 업로드되나요?", "아니요. AI 배경 제거와 모든 렌더링은 브라우저에서 WebAssembly로 실행되며 사진은 기기를 벗어나지 않습니다."],
    ],
    labels: {
      dropPrompt: "인물 사진을 업로드하여 증명사진 만들기",
      dropHint: "JPG · PNG · WebP",
      processing: "배경 제거 중…",
      processingHint: "AI가 사진을 처리하고 있습니다. 잠시만 기다려주세요",
      spec: "증명사진 규격",
      background: "배경색",
      scale: "줌",
      offsetX: "가로 위치",
      offsetY: "세로 위치",
      original: "원본",
      preview: "미리보기",
      download: "증명사진 다운로드",
      newImage: "사진 변경",
      pixel: "px",
      bgWhite: "흰색",
      bgBlue: "파란색",
      bgRed: "빨간색",
      bgGray: "회색",
      bgCustom: "사용자 지정",
    },
    errors: { failed: "배경 제거에 실패했습니다. 다른 사진으로 시도해주세요." },
  },
};

for (const lang of LANGS) {
  const file = join(messagesDir, `${lang}.json`);
  const data = JSON.parse(readFileSync(file, "utf8"));

  if (data.home?.tools) data.home.tools[SLUG] = home[lang];
  data.tools[SLUG] = {
    metadata: { title: D[lang].title, description: D[lang].desc, category: D[lang].category },
    keywords: D[lang].keywords,
    faqs: D[lang].faqs.map(([q, a]) => ({ question: q, answer: a })),
    relatedTools: RELATED.map((href) => ({ name: data.home.tools[href]?.name ?? href, href: `/tools/${href}` })),
    labels: D[lang].labels,
    errors: D[lang].errors,
    guide: {
      whatIs: { title: guideTitles[lang].whatIs, body: [D[lang].whatIs] },
      howTo: { title: guideTitles[lang].howTo, intro: guideTitles[lang].howToIntro, items: D[lang].howTo },
      tips: { title: guideTitles[lang].tips, body: D[lang].tips },
    },
  };

  if (data.home.heroBadge && data.home.heroBadge.includes("215")) {
    data.home.heroBadge = data.home.heroBadge.replace("215", "216");
  }

  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`updated ${lang}.json`);
}
console.log("done");
