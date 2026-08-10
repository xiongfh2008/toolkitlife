import fs from "fs";
import path from "path";

const posts = {
  en: {
    "how-to-build-a-resume": { title: "How to Build a Resume That Gets Interviews (2026 Guide)", description: "Learn how to write a resume that stands out. Covers formatting, sections to include, ATS optimization, common mistakes, and free tools to build your resume." },
    "how-to-compress-video": { title: "How to Compress a Video Without Losing Quality (2026 Guide)", description: "Learn how to reduce video file size for email, Discord, and social media. Covers compression settings, resolution, codecs, and free browser-based tools." },
    "how-to-convert-pdf-to-word": { title: "How to Convert PDF to Word for Free (2026 Guide)", description: "Learn how to convert PDF files to editable Word documents. Covers text-based vs scanned PDFs, formatting preservation, privacy, and free browser-based tools." },
    "how-to-convert-text-to-speech": { title: "How to Convert Text to Speech for Free (2026 Guide)", description: "Learn how to convert text to natural-sounding speech. Covers browser-based TTS, voice options, accessibility use cases, and free tools." },
    "how-to-convert-video-to-gif": { title: "How to Convert Video to GIF for Free (2026 Guide)", description: "Learn how to convert video clips to animated GIFs. Covers trimming, sizing, frame rate, optimization, and free browser-based tools." },
    "how-to-create-digital-signature": { title: "How to Create a Digital Signature for Free (2026 Guide)", description: "Learn how to create a digital signature for documents, PDFs, and contracts. Covers drawing, typing, uploading, and free tools with no signup." },
    "how-to-extract-text-from-images": { title: "How to Extract Text from Images: OCR Guide (2026)", description: "Learn how to extract text from screenshots, photos, and scanned documents using OCR. Covers accuracy tips, language support, and free browser-based tools." },
    "how-to-make-memes": { title: "How to Make Memes: Free Meme Generator Guide (2026)", description: "Learn how to create memes with custom text and images. Covers meme formats, text placement, fonts, and free browser-based meme generators." },
    "how-to-record-your-screen": { title: "How to Record Your Screen for Free (2026 Guide)", description: "Learn how to record your screen on any device. Covers browser-based recording, system audio capture, webcam overlay, and free tools with no watermark." },
    "how-to-upscale-images": { title: "How to Upscale Images Without Losing Quality (2026 Guide)", description: "Learn how to enlarge and upscale images for print, web, and social media. Covers upscaling methods, when to use each one, and free browser-based tools." },
  },
  zh: {
    "how-to-build-a-resume": { title: "如何制作能获得面试的简历（2026指南）", description: "学习如何写出脱颖而出的简历。涵盖格式、应包含的板块、ATS优化、常见错误以及免费简历制作工具。" },
    "how-to-compress-video": { title: "如何在不影响画质的情况下压缩视频（2026指南）", description: "学习如何为邮件、Discord和社交媒体减小视频文件大小。涵盖压缩设置、分辨率、编码器和免费浏览器工具。" },
    "how-to-convert-pdf-to-word": { title: "如何免费将PDF转换为Word（2026指南）", description: "学习如何将PDF文件转换为可编辑的Word文档。涵盖文本型与扫描型PDF、格式保留、隐私保护以及免费浏览器工具。" },
    "how-to-convert-text-to-speech": { title: "如何免费将文本转换为语音（2026指南）", description: "学习如何将文本转换为自然 sounding 的语音。涵盖浏览器TTS、语音选项、无障碍用例以及免费工具。" },
    "how-to-convert-video-to-gif": { title: "如何免费将视频转换为GIF（2026指南）", description: "学习如何将视频片段转换为动画GIF。涵盖裁剪、尺寸、帧率、优化以及免费浏览器工具。" },
    "how-to-create-digital-signature": { title: "如何免费创建数字签名（2026指南）", description: "学习如何为文档、PDF和合同创建数字签名。涵盖手绘、输入、上传以及无需注册的免费工具。" },
    "how-to-extract-text-from-images": { title: "如何从图片中提取文字：OCR指南（2026）", description: "学习如何使用OCR从截图、照片和扫描文档中提取文字。涵盖准确度提示、语言支持以及免费浏览器工具。" },
    "how-to-make-memes": { title: "如何制作表情包：免费表情包生成器指南（2026）", description: "学习如何使用自定义文字和图片制作表情包。涵盖表情包格式、文字位置、字体以及免费浏览器表情包生成器。" },
    "how-to-record-your-screen": { title: "如何免费录制屏幕（2026指南）", description: "学习如何在任何设备上录制屏幕。涵盖浏览器录制、系统音频捕获、摄像头叠加以及无水印免费工具。" },
    "how-to-upscale-images": { title: "如何在不损失质量的情况下放大图片（2026指南）", description: "学习如何为印刷、网页和社交媒体放大和增强图片。涵盖放大方法、何时使用每种方法以及免费浏览器工具。" },
  },
  ja: {
    "how-to-build-a-resume": { title: "面接に繋がる履歴書の作り方（2026ガイド）", description: "目立つ履歴書の書き方を学びます。フォーマット、含めるべきセクション、ATS最適化、よくある間違い、無料の履歴書作成ツールを解説します。" },
    "how-to-compress-video": { title: "画質を落とさずに動画を圧縮する方法（2026ガイド）", description: "メール、Discord、SNS用に動画ファイルサイズを小さくする方法を学びます。圧縮設定、解像度、コーデック、無料のブラウザツールを解説します。" },
    "how-to-convert-pdf-to-word": { title: "PDFをWordに無料変換する方法（2026ガイド）", description: "PDFファイルを編集可能なWord文書に変換する方法を学びます。テキストベースとスキャンPDFの違い、書式保持、プライバシー、無料のブラウザツールを解説します。" },
    "how-to-convert-text-to-speech": { title: "テキストを音声に無料変換する方法（2026ガイド）", description: "テキストを自然な音声に変換する方法を学びます。ブラウザベースのTTS、音声オプション、アクセシビリティのユースケース、無料ツールを解説します。" },
    "how-to-convert-video-to-gif": { title: "動画をGIFに無料変換する方法（2026ガイド）", description: "動画クリップをアニメーションGIFに変換する方法を学びます。トリミング、サイズ、フレームレート、最適化、無料のブラウザツールを解説します。" },
    "how-to-create-digital-signature": { title: "デジタル署名を無料で作成する方法（2026ガイド）", description: "文書、PDF、契約書用のデジタル署名を作成する方法を学びます。手書き、入力、アップロード、登録不要の無料ツールを解説します。" },
    "how-to-extract-text-from-images": { title: "画像からテキストを抽出する方法：OCRガイド（2026）", description: "OCRを使ってスクリーンショット、写真、スキャン文書からテキストを抽出する方法を学びます。精度向上のコツ、言語サポート、無料のブラウザツールを解説します。" },
    "how-to-make-memes": { title: "ミームの作り方：無料ミームジェネレーターガイド（2026）", description: "カスタムテキストと画像を使ってミームを作成する方法を学びます。ミーム形式、テキスト配置、フォント、無料のブラウザミームジェネレーターを解説します。" },
    "how-to-record-your-screen": { title: "画面を無料で録画する方法（2026ガイド）", description: "あらゆるデバイスで画面を録画する方法を学びます。ブラウザ録画、システム音声キャプチャ、ウェブカメラオーバーレイ、ウォーターマークなしの無料ツールを解説します。" },
    "how-to-upscale-images": { title: "画質を落とさずに画像を拡大する方法（2026ガイド）", description: "印刷、Web、SNS用に画像を拡大・高画質化する方法を学びます。拡大方法、それぞれを使う場面、無料のブラウザツールを解説します。" },
  },
  ko: {
    "how-to-build-a-resume": { title: "면접으로 이어지는 이력서 작성법(2026 가이드)", description: "눈에 띄는 이력서를 작성하는 방법을 알아보세요. 서식, 포함해야 할 섹션, ATS 최적화, 흔한 실수, \uBB34\uB8CC 이력서를 만들 수 있는 도구를 다룹니다." },
    "how-to-compress-video": { title: "화질 저하 없이 동영상 압축하는 법(2026 가이드)", description: "이메일, Discord, 소셜 미디어용으로 동영상 파일 크기를 줄이는 방법을 알아보세요. 압축 설정, 해상도, 코덱, \uBB34\uB8CC\uC778 브라우저 기반 도구를 다룹니다." },
    "how-to-convert-pdf-to-word": { title: "PDF를 Word로 \uBB34\uB8CC 변환하는 법(2026 가이드)", description: "PDF 파일을 편집 가능한 Word 문서로 변환하는 방법을 알아보세요. 텍스트 기반 vs 스캔 PDF, 서식 유지, 개인정보 보호, \uBB34\uB8CC\uC778 브라우저 기반 도구를 다룹니다." },
    "how-to-convert-text-to-speech": { title: "텍스트를 음성으로 \uBB34\uB8CC 변환하는 법(2026 가이드)", description: "텍스트를 자연스러운 음성으로 변환하는 방법을 알아보세요. 브라우저 기반 TTS, 음성 옵션, 접근성 사용 사례, \uBB34\uB8CC\uC778 도구를 다룹니다." },
    "how-to-convert-video-to-gif": { title: "동영상을 GIF로 \uBB34\uB8CC 변환하는 법(2026 가이드)", description: "동영상 클립을 애니메이션 GIF로 변환하는 방법을 알아보세요. 트리밍, 크기, 프레임 속도, 최적화, \uBB34\uB8CC\uC778 브라우저 기반 도구를 다룹니다." },
    "how-to-create-digital-signature": { title: "디지털 서명을 \uBB34\uB8CC 만드는 법(2026 가이드)", description: "문서, PDF, 계약서용 디지털 서명을 만드는 방법을 알아보세요. 그리기, 입력, 업로드, 가입 없이 사용하는 \uBB34\uB8CC\uC778 도구를 다룹니다." },
    "how-to-extract-text-from-images": { title: "이미지에서 텍스트 추출하기: OCR 가이드(2026)", description: "OCR을 사용하여 스크린샷, 사진, 스캔 문서에서 텍스트를 추출하는 방법을 알아보세요. 정확도 팁, 언어 지원, \uBB34\uB8CC\uC778 브라우저 기반 도구를 다룹니다." },
    "how-to-make-memes": { title: "밈 만들기: \uBB34\uB8CC\uC778 밈 생성기 가이드(2026)", description: "사용자 지정 텍스트와 이미지로 밈을 만드는 방법을 알아보세요. 밈 형식, 텍스트 배치, 글꼴, \uBB34\uB8CC\uC778 브라우저 밈 생성기를 다룹니다." },
    "how-to-record-your-screen": { title: "화면을 \uBB34\uB8CC 녹화하는 법(2026 가이드)", description: "모든 기기에서 화면을 녹화하는 방법을 알아보세요. 브라우저 기반 녹화, 시스템 오디오 캡처, 웹캠 오버레이, 워터마크 없는 \uBB34\uB8CC\uC778 도구를 다룹니다." },
    "how-to-upscale-images": { title: "화질 손실 없이 이미지 확대하는 법(2026 가이드)", description: "인쇄, 웹, 소셜 미디어용으로 이미지를 확대하고 업스케일하는 방법을 알아보세요. 업스케일 방법, 각 방법을 사용할 때, \uBB34\uB8CC\uC778 브라우저 기반 도구를 다룹니다." },
  },
};

for (const locale of ["en", "zh", "ja", "ko"]) {
  const filePath = path.join(process.cwd(), `messages/${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  data.blogPosts = posts[locale];
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Added blogPosts to messages/${locale}.json`);
}
