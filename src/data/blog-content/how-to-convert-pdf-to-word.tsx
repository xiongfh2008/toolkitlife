import type { ReactNode } from "react";
import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> PDF to Word conversion extracts text from a PDF and puts it into an editable document format. Works best with text-based PDFs (not scanned images). Simple documents convert well; complex layouts may need manual cleanup. Use a browser-based converter to keep sensitive documents private.</p>
      </aside>

      <section>
        <h2>Why Convert PDF to Word</h2>
        <p>PDFs are designed to look the same everywhere, but they&apos;re not designed to be edited. When you need to modify text in a PDF, the fastest approach is converting it to a Word document, making your changes, and then exporting back to PDF if needed.</p>
        <p>Common scenarios: editing a contract, updating a resume originally saved as PDF, extracting content from a report, or repurposing text from a document you received.</p>
      </section>

      <section>
        <h2>Text-Based vs Scanned PDFs</h2>
        <p><strong>Text-based PDFs</strong> were created digitally from Word, Google Docs, LaTeX, or similar tools. The text is stored as actual text data inside the file. These convert cleanly and accurately.</p>
        <p><strong>Scanned PDFs</strong> are essentially images of paper documents. Each page is a photograph. A standard PDF-to-Word converter can&apos;t extract text from these because there is no text data, only pixels. You need OCR (Optical Character Recognition) to read the text from the image first.</p>
        <p>To check which type you have: open the PDF and try selecting text with your cursor. If you can highlight individual words, it&apos;s text-based. If the whole page selects as one block (or nothing selects), it&apos;s scanned.</p>
      </section>

      <section>
        <h2>What to Expect from Conversion</h2>
        <ul>
          <li><strong>Text content:</strong> Extracted accurately in almost all cases.</li>
          <li><strong>Paragraphs and line breaks:</strong> Preserved well for simple documents.</li>
          <li><strong>Tables:</strong> May be converted to plain text. Complex table layouts often need manual re-creation.</li>
          <li><strong>Images:</strong> Not extracted by basic converters. You may need to copy images separately.</li>
          <li><strong>Fonts and styling:</strong> Basic bold/italic may be preserved. Exact font matching depends on what fonts are installed on your system.</li>
        </ul>
      </section>

      <section>
        <h2>Convert PDF to Word for Free</h2>
        <p>Our <Link href="/tools/pdf-to-word" className="text-blue-400 hover:text-blue-300">free PDF to Word Converter</Link> extracts text from any text-based PDF and generates a .doc file that opens in Word, Google Docs, or LibreOffice. Processing happens entirely in your browser using PDF.js. No upload, no signup, no file size limits.</p>
        <ToolCTA name="PDF to Word Converter" href="/tools/pdf-to-word" description="Extract text from any PDF and download as a .doc file. Uses PDF.js — your document never leaves your device." />
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>太长不看：</strong>PDF 转 Word 是从 PDF 中提取文本并放入可编辑的文档格式中。对基于文本的 PDF（非扫描图片）效果最好。简单文档转换良好；复杂版式可能需要手动整理。使用基于浏览器的转换工具，让敏感文档保持私密。</p>
      </aside>

      <section>
        <h2>为什么要把 PDF 转成 Word</h2>
        <p>PDF 的设计目标是处处显示一致，而不是方便编辑。当你需要修改 PDF 中的文字时，最快的办法是先转成 Word 文档、改完内容，再按需导出回 PDF。</p>
        <p>常见场景包括：修改合同、更新原本存为 PDF 的简历、从报告中提取内容，或者复用别人发来的文档中的文字。</p>
      </section>

      <section>
        <h2>文本型 PDF 与扫描型 PDF</h2>
        <p><strong>文本型 PDF</strong> 由 Word、Google Docs、LaTeX 或类似工具以数字化方式生成，文本以真正的文字数据形式存储在文件中。这类 PDF 可以干净、准确地转换。</p>
        <p><strong>扫描型 PDF</strong> 本质上是纸质文档的图像。每一页都是一张照片。普通 PDF 转 Word 工具无法从中提取文字，因为文件里没有文字数据，只有像素。你需要先用 OCR（光学字符识别）从图像中读出文字。</p>
        <p>如何判断你手上的是哪种：打开 PDF 并用光标尝试选中文字。如果能逐个高亮单词，就是文本型；如果整页被当作一个整体选中（或什么都选不中），就是扫描型。</p>
      </section>

      <section>
        <h2>转换结果会有多好</h2>
        <ul>
          <li><strong>文本内容：</strong>几乎所有情况下都能准确提取。</li>
          <li><strong>段落和换行：</strong>简单文档保留得很好。</li>
          <li><strong>表格：</strong>可能被转成纯文本。复杂的表格版式往往需要手动重建。</li>
          <li><strong>图片：</strong>基础转换器不会提取图片。可能需要单独复制图片。</li>
          <li><strong>字体和样式：</strong>基本的粗体/斜体可能保留。字体是否完全一致取决于你系统里安装的字体。</li>
        </ul>
      </section>

      <section>
        <h2>免费把 PDF 转成 Word</h2>
        <p>我们的<Link href="/tools/pdf-to-word" className="text-blue-400 hover:text-blue-300">免费 PDF 转 Word 转换器</Link>会从任何文本型 PDF 中提取文字，生成可在 Word、Google Docs 或 LibreOffice 中打开的 .doc 文件。处理完全在你的浏览器中通过 PDF.js 完成。无需上传、无需注册、无文件大小限制。</p>
        <ToolCTA name="PDF 转 Word 转换器" href="/tools/pdf-to-word" description="从任意 PDF 中提取文本并下载为 .doc 文件。基于 PDF.js——你的文档不会离开设备。" />
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="要約" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>要約：</strong>PDF を Word に変換すると、PDF からテキストを抽出して、編集可能な文書形式に変換できます。テキストベースの PDF（スキャン画像ではないもの）で最も効果的です。シンプルな文書はきれいに変換されますが、複雑なレイアウトは手作業での修正が必要になることがあります。機密文書のプライバシーを守るには、ブラウザ内で完結する変換ツールを使いましょう。</p>
      </aside>

      <section>
        <h2>PDF を Word に変換する理由</h2>
        <p>PDF はどこで開いても同じ見た目になるよう設計されていますが、編集を想定していません。PDF 内のテキストを修正する必要がある場合、最も速い方法は Word 文書に変換して修正し、必要なら再度 PDF に書き出すことです。</p>
        <p>よくあるケース：契約書の修正、元々 PDF で保存された履歴書の更新、レポートからのテキスト抽出、受け取った文書のテキストの流用などです。</p>
      </section>

      <section>
        <h2>テキストベース PDF とスキャン PDF</h2>
        <p><strong>テキストベース PDF</strong> は Word、Google Docs、LaTeX などのツールでデジタルに作成されたものです。テキストはファイル内に実際の文字データとして保存されています。このタイプはきれいに正確に変換できます。</p>
        <p><strong>スキャン PDF</strong> は紙の文書の画像そのものです。各ページは写真です。通常の PDF から Word への変換ツールでは、文字データがなくピクセルしかないためテキストを抽出できません。まず OCR（光学文字認識）で画像から文字を読み取る必要があります。</p>
        <p>どちらのタイプか確認するには：PDF を開いてカーソルでテキストを選択してみます。単語ごとにハイライトできればテキストベース、ページ全体が 1 つのブロックとして選択される（または何も選択できない）場合はスキャン PDF です。</p>
      </section>

      <section>
        <h2>変換の仕上がり</h2>
        <ul>
          <li><strong>テキスト内容：</strong>ほぼすべてのケースで正確に抽出されます。</li>
          <li><strong>段落と改行：</strong>シンプルな文書ではよく保持されます。</li>
          <li><strong>表：</strong>プレーンテキストになることがあります。複雑な表は手作業での再作成が必要になることが多いです。</li>
          <li><strong>画像：</strong>基本的な変換ツールでは抽出されません。画像は別途コピーする必要があります。</li>
          <li><strong>フォントとスタイル：</strong>基本的な太字/斜体は保持されることがあります。フォントが完全に一致するかはシステムにインストールされているフォント次第です。</li>
        </ul>
      </section>

      <section>
        <h2>PDF を無料で Word に変換する</h2>
        <p>当サイトの<Link href="/tools/pdf-to-word" className="text-blue-400 hover:text-blue-300">無料 PDF から Word への変換ツール</Link>は、テキストベースの PDF からテキストを抽出し、Word、Google Docs、LibreOffice で開ける .doc ファイルを生成します。処理は PDF.js を使いブラウザ内で完全に行われます。アップロードも登録もファイルサイズ制限もありません。</p>
        <ToolCTA name="PDF から Word への変換ツール" href="/tools/pdf-to-word" description="任意の PDF からテキストを抽出して .doc ファイルとしてダウンロード。PDF.js を使用するため、文書が端末から出ることはありません。" />
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>요약:</strong> PDF를 Word로 변환하면 PDF에서 텍스트를 추출해 편집 가능한 문서 형식으로 만듭니다. 텍스트 기반 PDF(스캔 이미지가 아닌)에서 가장 잘 작동합니다. 단순한 문서는 깔끔하게 변환되지만 복잡한 레이아웃은 수동 정리가 필요할 수 있습니다. 브라우저 기반 변환기를 사용하면 민감한 문서의 프라이버시를 지킬 수 있습니다.</p>
      </aside>

      <section>
        <h2>PDF를 Word로 변환해야 하는 이유</h2>
        <p>PDF는 어디서나 동일하게 보이도록 설계되었지만, 편집을 염두에 두고 만들어진 것은 아닙니다. PDF 안의 텍스트를 수정해야 할 때 가장 빠른 방법은 Word 문서로 변환해 수정한 뒤, 필요하면 다시 PDF로 내보내는 것입니다.</p>
        <p>흔한 사례: 계약서 수정, 원래 PDF로 저장된 이력서 업데이트, 보고서에서 내용 추출, 받은 문서의 텍스트 재활용 등입니다.</p>
      </section>

      <section>
        <h2>텍스트 기반 PDF와 스캔 PDF</h2>
        <p><strong>텍스트 기반 PDF</strong>는 Word, Google Docs, LaTeX 등으로 디지털 생성되었습니다. 텍스트가 파일 안에 실제 문자 데이터로 저장되어 있어 깔끔하고 정확하게 변환됩니다.</p>
        <p><strong>스캔 PDF</strong>는 본질적으로 종이 문서의 이미지입니다. 각 페이지가 사진입니다. 일반적인 PDF to Word 변환기는 텍스트 데이터가 없고 픽셀뿐이므로 여기서 텍스트를 추출할 수 없습니다. 먼저 OCR(광학 문자 인식)로 이미지에서 텍스트를 읽어야 합니다.</p>
        <p>어떤 유형인지 확인하는 방법: PDF를 열고 커서로 텍스트를 선택해 보세요. 단어 단위로 하이라이트되면 텍스트 기반이고, 페이지 전체가 한 블록으로 선택되거나(아무것도 선택되지 않으면) 스캔 PDF입니다.</p>
      </section>

      <section>
        <h2>변환 결과에 대한 기대치</h2>
        <ul>
          <li><strong>텍스트 내용:</strong> 거의 모든 경우 정확하게 추출됩니다.</li>
          <li><strong>문단과 줄바꿈:</strong> 단순한 문서에서는 잘 유지됩니다.</li>
          <li><strong>표:</strong> 일반 텍스트로 변환될 수 있습니다. 복잡한 표는 수동으로 다시 만들어야 하는 경우가 많습니다.</li>
          <li><strong>이미지:</strong> 기본 변환기로는 추출되지 않습니다. 이미지를 별도로 복사해야 할 수 있습니다.</li>
          <li><strong>글꼴과 스타일:</strong> 기본적인 굵게/기울임은 유지될 수 있습니다. 글꼴이 정확히 일치하는지는 시스템에 설치된 글꼴에 따라 다릅니다.</li>
        </ul>
      </section>

      <section>
        <h2>PDF를 Word로 무료로 변환하기</h2>
        <p>당사의 <Link href="/tools/pdf-to-word" className="text-blue-400 hover:text-blue-300">무료 PDF to Word 변환기</Link>는 텍스트 기반 PDF에서 텍스트를 추출해 Word, Google Docs, LibreOffice에서 열리는 .doc 파일을 생성합니다. 처리는 PDF.js를 사용해 브라우저 안에서 완전히 이루어집니다. 업로드도, 가입도, 파일 크기 제한도 없습니다.</p>
        <ToolCTA name="PDF to Word 변환기" href="/tools/pdf-to-word" description="모든 PDF에서 텍스트를 추출해 .doc 파일로 다운로드하세요. PDF.js 기반이라 문서가 기기를 떠나지 않습니다." />
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "Can I convert a PDF to Word for free?", answer: "Yes. Several tools offer free PDF to Word conversion. Browser-based tools process the file locally on your device, so there's no upload and no file size limit. The output is a .doc file that opens in Microsoft Word, Google Docs, and LibreOffice." },
      { question: "Will the formatting be preserved?", answer: "Text content and basic paragraph structure are preserved well. Complex layouts with multiple columns, tables, and embedded images may not convert perfectly. For simple text documents, the conversion is nearly identical. For complex layouts, some manual formatting adjustment may be needed." },
      { question: "Can I convert a scanned PDF?", answer: "Scanned PDFs are images, not text. You need OCR (Optical Character Recognition) to extract text from scanned pages. Use an OCR tool first to extract the text, then paste it into a Word document. Our Image to Text tool can help with this." },
      { question: "Is it safe to convert PDFs online?", answer: "Cloud-based converters upload your file to a server, which is a privacy risk for sensitive documents. Browser-based tools like ToolkitLife process everything locally — your PDF never leaves your device. For confidential documents, always use a local tool." },
    ],
    zh: [
      { question: "可以免费把 PDF 转成 Word 吗？", answer: "可以。不少工具都提供免费的 PDF 转 Word 服务。基于浏览器的工具会在你的设备本地处理文件，因此无需上传、没有文件大小限制。输出是 .doc 文件，可在 Microsoft Word、Google Docs 和 LibreOffice 中打开。" },
      { question: "格式会被保留吗？", answer: "文本内容和基本段落结构保留得很好。多栏、表格和嵌入图片等复杂版式可能无法完美转换。对于简单文本文档，转换结果几乎与原版一致；对于复杂版式，可能需要进行一些手动格式调整。" },
      { question: "可以转换扫描版 PDF 吗？", answer: "扫描版 PDF 是图像而不是文字。要从中提取文本，需要使用 OCR（光学字符识别）。先用 OCR 工具提取文本，再粘贴到 Word 文档中。我们的图片转文字工具可以帮你完成这一步。" },
      { question: "在线转换 PDF 安全吗？", answer: "云端转换器会把文件上传到服务器，对敏感文档存在隐私风险。ToolkitLife 这类基于浏览器的工具完全在本地处理——你的 PDF 永远不会离开设备。机密文档请始终使用本地工具。" },
    ],
    ja: [
      { question: "PDF を無料で Word に変換できますか？", answer: "できます。無料で PDF を Word に変換できるツールはいくつかあります。ブラウザ型のツールはファイルを端末上でローカル処理するため、アップロードもファイルサイズ制限もありません。出力される .doc ファイルは Microsoft Word、Google Docs、LibreOffice で開けます。" },
      { question: "フォーマットは保持されますか？", answer: "テキスト内容と基本的な段落構造はよく保持されます。複数列、表、埋め込み画像を含む複雑なレイアウトは完全には変換できないことがあります。シンプルな文書なら変換結果はほぼ同じです。複雑なレイアウトでは手動での調整が必要になる場合があります。" },
      { question: "スキャン PDF を変換できますか？", answer: "スキャン PDF はテキストではなく画像です。スキャンされたページからテキストを抽出するには OCR（光学文字認識）が必要です。まず OCR ツールでテキストを抽出し、Word 文書に貼り付けましょう。当サイトの画像からテキスト変換ツールが役立ちます。" },
      { question: "オンラインで PDF を変換しても安全ですか？", answer: "クラウド型の変換ツールはファイルをサーバーにアップロードするため、機密文書にはプライバシーのリスクがあります。ToolkitLife のようなブラウザ型ツールはすべてローカルで処理するため、PDF が端末から出ることはありません。機密文書は必ずローカルツールを使いましょう。" },
    ],
    ko: [
      { question: "PDF를 Word로 무료로 변환할 수 있나요?", answer: "네. 무료로 PDF를 Word로 변환해 주는 도구가 여럿 있습니다. 브라우저 기반 도구는 기기에서 로컬로 파일을 처리하므로 업로드가 없고 파일 크기 제한도 없습니다. 출력물은 .doc 파일로 Microsoft Word, Google Docs, LibreOffice에서 열립니다." },
      { question: "서식이 유지되나요?", answer: "텍스트 내용과 기본 문단 구조는 잘 유지됩니다. 다단, 표, 삽입 이미지가 있는 복잡한 레이아웃은 완벽하게 변환되지 않을 수 있습니다. 단순한 텍스트 문서라면 변환 결과가 거의 동일합니다. 복잡한 레이아웃은 수동으로 서식을 조정해야 할 수 있습니다." },
      { question: "스캔된 PDF도 변환할 수 있나요?", answer: "스캔된 PDF는 텍스트가 아니라 이미지입니다. 스캔 페이지에서 텍스트를 추출하려면 OCR(광학 문자 인식)이 필요합니다. 먼저 OCR 도구로 텍스트를 추출한 다음 Word 문서에 붙여넣으세요. 당사의 이미지 텍스트 추출 도구가 도움이 될 수 있습니다." },
      { question: "온라인으로 PDF를 변환해도 안전한가요?", answer: "클라우드 기반 변환기는 파일을 서버에 업로드하므로 민감한 문서에는 프라이버시 위험이 있습니다. ToolkitLife 같은 브라우저 기반 도구는 모든 것을 로컬에서 처리하므로 PDF가 기기를 떠나지 않습니다. 기밀 문서는 항상 로컬 도구를 사용하세요." },
    ],
  },
};
