import type { ReactNode } from "react";
import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> OCR technology converts images of text into editable, copyable text. It works best on clear, high-resolution images with printed text. For best accuracy, crop to the text area, ensure good contrast, and select the correct language. Browser-based OCR tools process everything locally so your documents stay private.</p>
      </aside>

      <section>
        <h2>When You Need OCR</h2>
        <p>You have a screenshot of an error message you need to search. A photo of a whiteboard from a meeting. A scanned receipt for expense reporting. A page from a textbook you need to quote. In all these cases, the text is trapped inside an image and you need it as actual text you can copy, edit, and search.</p>
        <p>This is exactly what OCR does. It analyzes the pixels in your image, identifies characters and words, and outputs them as editable text.</p>
      </section>

      <section>
        <h2>Tips for Better OCR Accuracy</h2>
        <ul>
          <li><strong>Resolution matters:</strong> Higher resolution images produce better results. If possible, use at least 300 DPI for scanned documents.</li>
          <li><strong>Contrast is key:</strong> Dark text on a light background works best. Avoid images with text overlaid on busy backgrounds or photos.</li>
          <li><strong>Crop to the text area:</strong> Remove unnecessary borders, images, and whitespace. The less noise in the image, the better the OCR accuracy.</li>
          <li><strong>Straighten skewed images:</strong> Text that&apos;s rotated or at an angle is harder to recognize. Straighten the image before running OCR.</li>
          <li><strong>Select the right language:</strong> OCR models are language-specific. Selecting the correct language improves character recognition, especially for non-Latin scripts.</li>
        </ul>
      </section>

      <section>
        <h2>Common OCR Use Cases</h2>
        <p><strong>Screenshots:</strong> Extract error messages, code snippets, chat messages, or any text from screenshots. This is the most common use case and typically gives the best accuracy since screenshots are already high-resolution with clean text.</p>
        <p><strong>Scanned documents:</strong> Convert scanned contracts, receipts, letters, and forms into searchable, editable text. Scan at 300+ DPI in grayscale for best results.</p>
        <p><strong>Photos of text:</strong> Whiteboards, signs, book pages, business cards. Accuracy depends on image quality and lighting.</p>
      </section>

      <section>
        <h2>Extract Text for Free</h2>
        <p>Our <Link href="/tools/image-to-text" className="text-blue-400 hover:text-blue-300">free Image to Text tool</Link> uses Tesseract.js OCR engine running entirely in your browser. Upload any image, select the language, and get editable text in seconds. Supports 7 languages, no upload to any server, no signup required.</p>
        <ToolCTA name="Image to Text (OCR)" href="/tools/image-to-text" description="Extract text from any image using Tesseract.js OCR. Supports 7 languages — runs entirely in your browser, no upload required." />
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>太长不看：</strong>OCR 技术能把图片中的文字转换成可编辑、可复制的文本。它对清晰、高分辨率的印刷文字效果最好。要获得最佳准确率，请裁剪到文字区域、保证良好对比度，并选择正确的语言。基于浏览器的 OCR 工具在本地完成全部处理，因此你的文档保持私密。</p>
      </aside>

      <section>
        <h2>什么时候需要 OCR</h2>
        <p>你有一张需要搜索的错误信息截图。一张会议白板的照片。一张要用于报销的扫描收据。一页需要引用的教科书。所有这些情况下，文字都被困在图片里，而你需要的是可以复制、编辑和搜索的真正文本。</p>
        <p>这正是 OCR 的用武之地。它分析图像中的像素，识别字符和单词，并将其输出为可编辑文本。</p>
      </section>

      <section>
        <h2>提高 OCR 准确率的技巧</h2>
        <ul>
          <li><strong>分辨率很重要：</strong>分辨率越高的图片结果越好。扫描文档时尽量使用至少 300 DPI。</li>
          <li><strong>对比度是关键：</strong>深色文字配浅色背景效果最好。避免文字叠加在复杂背景或照片上的图片。</li>
          <li><strong>裁剪到文字区域：</strong>去掉多余的边框、图片和空白。图像中的噪声越少，OCR 准确率越高。</li>
          <li><strong>校正倾斜的图像：</strong>旋转或倾斜的文字更难识别。运行 OCR 前先把图片扶正。</li>
          <li><strong>选择正确的语言：</strong>OCR 模型是按语言训练的。选择正确的语言可以提高字符识别率，对非拉丁文字尤其重要。</li>
        </ul>
      </section>

      <section>
        <h2>常见的 OCR 使用场景</h2>
        <p><strong>截图：</strong>从截图中提取错误信息、代码片段、聊天消息或任何文字。这是最常见的场景，通常准确率也最高，因为截图本身分辨率高、文字清晰。</p>
        <p><strong>扫描文档：</strong>把扫描的合同、收据、信件和表单转换成可搜索、可编辑的文本。以 300+ DPI 灰度扫描效果最佳。</p>
        <p><strong>文字照片：</strong>白板、标牌、书页、名片。准确率取决于图像质量和光线。</p>
      </section>

      <section>
        <h2>免费提取文字</h2>
        <p>我们的<Link href="/tools/image-to-text" className="text-blue-400 hover:text-blue-300">免费图片转文字工具</Link>使用 Tesseract.js OCR 引擎，完全在浏览器中运行。上传任意图片、选择语言，几秒钟即可获得可编辑文本。支持 7 种语言，无需上传到任何服务器，无需注册。</p>
        <ToolCTA name="图片转文字（OCR）" href="/tools/image-to-text" description="使用 Tesseract.js OCR 从任意图片中提取文字。支持 7 种语言——完全在浏览器中运行，无需上传。" />
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="要約" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>要約：</strong>OCR 技術を使えば、画像内のテキストを編集・コピー可能なテキストに変換できます。鮮明で高解像度の印刷テキストで最も精度が高くなります。精度を高めるには、テキスト領域に切り抜き、コントラストを確保し、正しい言語を選択しましょう。ブラウザ内で完結する OCR ツールなら、すべてローカルで処理されるためドキュメントが外部に漏れる心配がありません。</p>
      </aside>

      <section>
        <h2>OCR が必要な場面</h2>
        <p>検索したいエラーメッセージのスクリーンショット。会議で撮ったホワイトボードの写真。経費精算に使うスキャンした領収書。引用したい教科書のページ。こうした場面では、テキストが画像の中に閉じ込められており、コピー・編集・検索できる実際のテキストが必要です。</p>
        <p>OCR はまさにそのための技術です。画像のピクセルを解析し、文字や単語を認識して、編集可能なテキストとして出力します。</p>
      </section>

      <section>
        <h2>OCR の精度を高めるコツ</h2>
        <ul>
          <li><strong>解像度が重要：</strong>高解像度の画像ほど良い結果が得られます。スキャン文書では可能な限り 300 DPI 以上にしましょう。</li>
          <li><strong>コントラストが鍵：</strong>明るい背景に濃い文字が最も読み取りやすいです。複雑な背景や写真の上に文字が重なった画像は避けましょう。</li>
          <li><strong>テキスト領域に切り抜く：</strong>不要な余白や画像を除去します。ノイズが少ないほど OCR の精度は上がります。</li>
          <li><strong>傾きを補正する：</strong>回転していたり斜めになっている文字は認識しにくくなります。OCR を実行する前に画像をまっすぐにしましょう。</li>
          <li><strong>正しい言語を選ぶ：</strong>OCR モデルは言語ごとに特化しています。正しい言語を選ぶと文字認識が向上し、特に非ラテン文字で効果的です。</li>
        </ul>
      </section>

      <section>
        <h2>OCR のよくある活用シーン</h2>
        <p><strong>スクリーンショット：</strong>エラーメッセージ、コード断片、チャットのやり取りなど、スクリーンショットからテキストを抽出します。最も一般的な用途で、スクリーンショットは高解像度で文字もクリアなため、通常は最も精度が高くなります。</p>
        <p><strong>スキャン文書：</strong>スキャンした契約書、領収書、手紙、フォームを、検索・編集可能なテキストに変換します。300 DPI 以上、グレースケールでスキャンすると最良の結果が得られます。</p>
        <p><strong>文字の写真：</strong>ホワイトボード、看板、本のページ、名刺など。精度は画像の品質と照明に左右されます。</p>
      </section>

      <section>
        <h2>テキストを無料で抽出する</h2>
        <p>当サイトの<Link href="/tools/image-to-text" className="text-blue-400 hover:text-blue-300">無料画像テキスト変換ツール</Link>は、Tesseract.js OCR エンジンを使ってブラウザ内で完全に処理します。画像をアップロードして言語を選ぶだけで、数秒で編集可能なテキストが得られます。7 言語対応、サーバーへのアップロードなし、登録不要です。</p>
        <ToolCTA name="画像テキスト変換（OCR）" href="/tools/image-to-text" description="Tesseract.js OCR で任意の画像からテキストを抽出。7 言語対応——ブラウザ内で完結し、アップロード不要です。" />
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>요약:</strong> OCR 기술은 이미지 속 텍스트를 편집·복사 가능한 텍스트로 변환합니다. 선명하고 고해상도이며 인쇄된 텍스트에서 가장 잘 작동합니다. 정확도를 높이려면 텍스트 영역을 잘라내고 명암 대비를 확보하며 올바른 언어를 선택하세요. 브라우저 기반 OCR 도구는 모든 처리를 로컬에서 하므로 문서가 외부로 유출되지 않습니다.</p>
      </aside>

      <section>
        <h2>OCR이 필요한 경우</h2>
        <p>검색해야 할 오류 메시지의 스크린샷. 회의 중 찍은 화이트보드 사진. 비용 보고용으로 스캔한 영수증. 인용해야 할 교과서 페이지. 이런 모든 경우에 텍스트는 이미지 안에 갇혀 있고, 복사·편집·검색할 수 있는 실제 텍스트가 필요합니다.</p>
        <p>OCR이 바로 그런 일을 합니다. 이미지의 픽셀을 분석해 문자와 단어를 식별하고 편집 가능한 텍스트로 출력합니다.</p>
      </section>

      <section>
        <h2>OCR 정확도를 높이는 팁</h2>
        <ul>
          <li><strong>해상도가 중요합니다:</strong> 해상도가 높은 이미지일수록 결과가 좋습니다. 스캔 문서는 가능하면 300 DPI 이상을 사용하세요.</li>
          <li><strong>명암 대비가 핵심입니다:</strong> 밝은 배경에 진한 텍스트가 가장 잘 인식됩니다. 복잡한 배경이나 사진 위에 텍스트가 겹친 이미지는 피하세요.</li>
          <li><strong>텍스트 영역만 잘라내세요:</strong> 불필요한 테두리, 이미지, 여백을 제거합니다. 노이즈가 적을수록 OCR 정확도가 높아집니다.</li>
          <li><strong>기울어진 이미지를 바로 세우세요:</strong> 회전하거나 각도가 있는 텍스트는 인식하기 어렵습니다. OCR 실행 전에 이미지를 반듯하게 펴세요.</li>
          <li><strong>올바른 언어를 선택하세요:</strong> OCR 모델은 언어별로 특화되어 있습니다. 올바른 언어를 선택하면 문자 인식이 향상되며, 특히 비라틴 문자에서 효과적입니다.</li>
        </ul>
      </section>

      <section>
        <h2>OCR 주요 사용 사례</h2>
        <p><strong>스크린샷:</strong> 오류 메시지, 코드 조각, 채팅 메시지 등 스크린샷의 모든 텍스트를 추출합니다. 가장 흔한 용도이며, 스크린샷은 이미 고해상도에 깨끗한 텍스트를 갖고 있으므로 정확도도 가장 높은 편입니다.</p>
        <p><strong>스캔 문서:</strong> 스캔한 계약서, 영수증, 편지, 서식을 검색·편집 가능한 텍스트로 변환합니다. 최상의 결과를 위해 300+ DPI로 흑백 스캔하세요.</p>
        <p><strong>텍스트 사진:</strong> 화이트보드, 간판, 책 페이지, 명함. 정확도는 이미지 품질과 조명에 따라 달라집니다.</p>
      </section>

      <section>
        <h2>텍스트 무료로 추출하기</h2>
        <p>당사의<Link href="/tools/image-to-text" className="text-blue-400 hover:text-blue-300">무료 이미지 텍스트 변환 도구</Link>는 Tesseract.js OCR 엔진을 사용해 브라우저 안에서 완전히 실행됩니다. 이미지를 업로드하고 언어를 선택하면 몇 초 만에 편집 가능한 텍스트를 얻을 수 있습니다. 7개 언어를 지원하며 서버 업로드도 가입도 필요 없습니다.</p>
        <ToolCTA name="이미지 텍스트 변환(OCR)" href="/tools/image-to-text" description="Tesseract.js OCR로 모든 이미지에서 텍스트를 추출합니다. 7개 언어 지원 — 브라우저에서 완전히 실행되며 업로드가 필요 없습니다." />
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "What is OCR and how does it work?", answer: "OCR (Optical Character Recognition) is technology that identifies text characters in images and converts them to editable text. Modern OCR uses neural networks trained on millions of text samples to recognize characters, words, and layout structure in any image." },
      { question: "How accurate is OCR?", answer: "Modern OCR achieves 95-99% accuracy on clean, printed text with good resolution. Accuracy drops with handwriting, low resolution, unusual fonts, skewed images, or poor lighting. For best results, use clear images with high contrast between text and background." },
      { question: "Can OCR read handwritten text?", answer: "Basic OCR tools struggle with handwriting. Specialized handwriting recognition models exist but require more processing power. For printed text, standard OCR works excellently. For handwriting, you may need specialized tools or manual transcription." },
    ],
    zh: [
      { question: "什么是 OCR？它如何工作？", answer: "OCR（光学字符识别）是一种识别图像中文字字符并将其转换为可编辑文本的技术。现代 OCR 使用在海量文本样本上训练过的神经网络，能够识别任意图像中的字符、单词和版面结构。" },
      { question: "OCR 的准确率有多高？", answer: "对于清晰、分辨率良好的印刷文字，现代 OCR 准确率可达 95-99%。手写文字、低分辨率、特殊字体、倾斜图像或光线不佳都会降低准确率。想获得最佳效果，请使用文字与背景对比度高的清晰图像。" },
      { question: "OCR 能识别手写文字吗？", answer: "基础 OCR 工具难以识别手写文字。专门的手写识别模型存在，但需要更强的计算能力。对于印刷文字，标准 OCR 效果极佳。手写文字可能需要专用工具或手动转录。" },
    ],
    ja: [
      { question: "OCR とは何ですか？どのように機能しますか？", answer: "OCR（光学的文字認識）は、画像内の文字を識別して編集可能なテキストに変換する技術です。現代の OCR は数百万のテキストサンプルで訓練されたニューラルネットワークを使用し、あらゆる画像の文字、単語、レイアウト構造を認識します。" },
      { question: "OCR の精度はどのくらいですか？", answer: "現代の OCR は、クリアで解像度の高い印刷テキストでは 95〜99% の精度を達成します。手書き文字、低解像度、特殊なフォント、傾いた画像、照明不良などで精度は低下します。最良の結果を得るには、文字と背景のコントラストが高い鮮明な画像を使用しましょう。" },
      { question: "OCR は手書き文字を読めますか？", answer: "基本的な OCR ツールでは手書き文字の認識は難しい場合があります。専用の手書き認識モデルもありますが、より高い処理能力が必要です。印刷テキストには標準の OCR で十分優秀に機能します。手書きの場合は専用ツールか手動での転記が必要になるかもしれません。" },
    ],
    ko: [
      { question: "OCR이란 무엇이며 어떻게 작동하나요?", answer: "OCR(광학 문자 인식)은 이미지 속 텍스트 문자를 식별해 편집 가능한 텍스트로 변환하는 기술입니다. 최신 OCR은 수백만 개의 텍스트 샘플로 학습된 신경망을 사용해 어떤 이미지에서든 문자, 단어, 레이아웃 구조를 인식합니다." },
      { question: "OCR 정확도는 어느 정도인가요?", answer: "최신 OCR은 해상도가 좋고 깨끗한 인쇄 텍스트에서 95~99%의 정확도를 보입니다. 손글씨, 저해상도, 특이한 글꼴, 기울어진 이미지, 조명이 나쁜 환경에서는 정확도가 떨어집니다. 최상의 결과를 얻으려면 텍스트와 배경의 대비가 뚜렷한 선명한 이미지를 사용하세요." },
      { question: "OCR이 손글씨를 읽을 수 있나요?", answer: "기본 OCR 도구는 손글씨를 처리하는 데 어려움을 겪습니다. 전용 손글씨 인식 모델도 있지만 더 많은 처리 성능이 필요합니다. 인쇄된 텍스트는 표준 OCR로 훌륭하게 처리되지만, 손글씨는 전용 도구나 수동 필사가 필요할 수 있습니다." },
    ],
  },
};
