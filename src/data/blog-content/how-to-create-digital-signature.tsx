import type { ReactNode } from "react";
import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> Create a digital signature by drawing with your mouse/trackpad, typing your name in a script font, or uploading an existing signature image. Download as PNG (transparent background) and insert into PDFs, contracts, and documents. Browser-based tools keep your signature private — nothing is uploaded.</p>
      </aside>

      <section>
        <h2>When You Need a Digital Signature</h2>
        <p>Rental agreements, freelance contracts, tax forms, school permission slips, employment paperwork — there are countless documents that need a signature. Instead of printing, signing, and scanning, create a digital signature once and reuse it on any document.</p>
      </section>

      <section>
        <h2>Three Ways to Create Your Signature</h2>
        <p><strong>Draw it:</strong> Use your mouse, trackpad, or touchscreen to draw your signature freehand. This gives the most natural, authentic-looking result. Drawing on a tablet or phone with your finger produces the best results.</p>
        <p><strong>Type it:</strong> Type your name and select a script or handwriting-style font. This is the fastest method and produces a clean, consistent signature every time. Multiple font options let you find one that matches your style.</p>
        <p><strong>Upload it:</strong> Sign a piece of white paper, take a photo, and upload it. The tool places it on a transparent canvas. This gives you a signature that matches your real handwriting exactly.</p>
      </section>

      <section>
        <h2>Adding Your Signature to Documents</h2>
        <ul>
          <li><strong>Mac Preview:</strong> Open the PDF, click the Markup toolbar, click Signature, then &quot;Create Signature from File&quot; and select your PNG.</li>
          <li><strong>Adobe Reader:</strong> Open the PDF, go to Fill &amp; Sign, click the signature icon, choose &quot;Add Image&quot; and select your PNG.</li>
          <li><strong>Google Docs:</strong> Insert &gt; Image &gt; Upload, then resize and position over the signature line.</li>
          <li><strong>Microsoft Word:</strong> Insert &gt; Pictures, select your PNG, then set text wrapping to &quot;In Front of Text&quot; for easy positioning.</li>
        </ul>
      </section>

      <section>
        <h2>Create Your Signature for Free</h2>
        <p>Our <Link href="/tools/digital-signature" className="text-blue-400 hover:text-blue-300">free Digital Signature Creator</Link> lets you draw, type, or upload a signature and download it as PNG or SVG. No signup, no watermark, nothing stored on any server.</p>
        <ToolCTA name="Digital Signature Creator" href="/tools/digital-signature" description="Create a digital signature by drawing, typing, or uploading. Download as PNG or SVG. No signup, 100% private." />
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>太长不看：</strong>用鼠标/触控板手绘、用花体字体输入名字，或上传已有的签名图片，即可创建电子签名。下载为 PNG（透明背景）后，可插入 PDF、合同和各类文档。基于浏览器的工具会保护你的签名隐私——不会有任何内容被上传。</p>
      </aside>

      <section>
        <h2>什么时候需要电子签名</h2>
        <p>租房合同、自由职业合同、税表、学校同意书、入职文件——需要签名的文件数不胜数。与其打印、手签、再扫描，不如创建一次电子签名，之后在任意文档中反复使用。</p>
      </section>

      <section>
        <h2>创建签名的三种方法</h2>
        <p><strong>绘制：</strong>用鼠标、触控板或触摸屏手绘你的签名。这样效果最自然、最接近真实笔迹。在平板或手机上用手指绘制效果最佳。</p>
        <p><strong>输入：</strong>输入你的名字，选择花体或手写风格字体。这是最快的方法，每次都能得到干净、一致的签名。多种字体可选，让你找到最符合自己风格的一款。</p>
        <p><strong>上传：</strong>在一张白纸上签名、拍照并上传。工具会将其放在透明画布上。这样得到的签名与你的真实笔迹完全一致。</p>
      </section>

      <section>
        <h2>把签名添加到文档中</h2>
        <ul>
          <li><strong>Mac 预览（Preview）：</strong>打开 PDF，点击标记（Markup）工具栏，点击 Signature（签名），然后选择 &quot;Create Signature from File&quot;（从文件创建签名）并选中你的 PNG 文件。</li>
          <li><strong>Adobe Reader：</strong>打开 PDF，进入 Fill &amp; Sign（填写并签名），点击签名图标，选择 &quot;Add Image&quot;（添加图像）并选中你的 PNG 文件。</li>
          <li><strong>Google Docs：</strong>插入 &gt; 图片 &gt; 上传，然后调整大小并移动到签名行上方。</li>
          <li><strong>Microsoft Word：</strong>插入 &gt; 图片，选择你的 PNG，然后将文字环绕设置为 &quot;In Front of Text&quot;（浮于文字上方）以便自由调整位置。</li>
        </ul>
      </section>

      <section>
        <h2>免费创建你的电子签名</h2>
        <p>我们的<Link href="/tools/digital-signature" className="text-blue-400 hover:text-blue-300">免费电子签名生成器</Link>支持绘制、输入或上传签名，并可下载为 PNG 或 SVG。无需注册、无水印、不存储在任何服务器上。</p>
        <ToolCTA name="电子签名生成器" href="/tools/digital-signature" description="通过绘制、输入或上传创建电子签名。可下载为 PNG 或 SVG。无需注册，100% 私密。" />
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="要約" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>要約：</strong>マウスやトラックパッドで描く、筆記体フォントで名前を入力する、既存の署名画像をアップロードする——このいずれかでデジタル署名を作成できます。PNG（透明背景）でダウンロードし、PDF や契約書、書類に挿入しましょう。ブラウザ内で完結するツールなら署名が外部に送信されることはなく、プライバシーが守られます。</p>
      </aside>

      <section>
        <h2>デジタル署名が必要な場面</h2>
        <p>賃貸契約、フリーランスの契約書、税務申告書、学校の承諾書、雇用関連書類——署名が必要な書類は数え切れません。印刷して署名してスキャンする代わりに、デジタル署名を一度作成すれば、あらゆる書類で使い回せます。</p>
      </section>

      <section>
        <h2>署名を作る 3 つの方法</h2>
        <p><strong>描く：</strong>マウス、トラックパッド、タッチスクリーンで自由に署名を描きます。最も自然で本物らしい仕上がりになります。タブレットやスマホで指を使って描くと最も良い結果が得られます。</p>
        <p><strong>入力する：</strong>名前を入力し、筆記体または手書き風フォントを選びます。最も速い方法で、毎回きれいで一貫した署名ができます。複数のフォントから自分のスタイルに合うものを見つけられます。</p>
        <p><strong>アップロードする：</strong>白い紙に署名し、写真を撮ってアップロードします。ツールが透明なキャンバスに配置します。実際の筆跡と完全に一致する署名が手に入ります。</p>
      </section>

      <section>
        <h2>署名を書類に追加する</h2>
        <ul>
          <li><strong>Mac のプレビュー：</strong>PDF を開き、マークアップツールバーをクリックして Signature（署名）をクリックし、&quot;Create Signature from File&quot;（ファイルから署名を作成）で PNG を選択します。</li>
          <li><strong>Adobe Reader：</strong>PDF を開き、Fill &amp; Sign（入力と署名）に移動し、署名アイコンをクリックして &quot;Add Image&quot;（画像を追加）で PNG を選択します。</li>
          <li><strong>Google ドキュメント：</strong>挿入 &gt; 画像 &gt; アップロード で画像を追加し、サイズを調整して署名欄の上に配置します。</li>
          <li><strong>Microsoft Word：</strong>挿入 &gt; 図 で PNG を選択し、文字列の折り返しを &quot;In Front of Text&quot;（前面）に設定すると自由に配置できます。</li>
        </ul>
      </section>

      <section>
        <h2>署名を無料で作成する</h2>
        <p>当サイトの<Link href="/tools/digital-signature" className="text-blue-400 hover:text-blue-300">無料デジタル署名作成ツール</Link>なら、描く・入力する・アップロードのいずれかで署名を作成し、PNG または SVG でダウンロードできます。登録不要、透かしなし、サーバーに保存されることもありません。</p>
        <ToolCTA name="デジタル署名作成ツール" href="/tools/digital-signature" description="描く・入力する・アップロードでデジタル署名を作成。PNG または SVG でダウンロード可能。登録不要、完全プライベート。" />
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>요약:</strong> 마우스/트랙패드로 직접 그리거나, 필기체 글꼴로 이름을 입력하거나, 기존 서명 이미지를 업로드해 디지털 서명을 만들 수 있습니다. PNG(투명 배경)로 다운로드해 PDF, 계약서, 문서에 삽입하세요. 브라우저 기반 도구는 서명이 업로드되지 않으므로 프라이버시가 보호됩니다.</p>
      </aside>

      <section>
        <h2>디지털 서명이 필요한 경우</h2>
        <p>임대 계약, 프리랜스 계약서, 세금 신고서, 학교 동의서, 고용 서류——서명이 필요한 문서는 끝없이 많습니다. 인쇄하고 서명하고 스캔하는 대신, 디지털 서명을 한 번 만들어 두면 어떤 문서든 그대로 재사용할 수 있습니다.</p>
      </section>

      <section>
        <h2>서명을 만드는 세 가지 방법</h2>
        <p><strong>직접 그리기:</strong> 마우스, 트랙패드, 터치스크린으로 서명을 자유롭게 그립니다. 가장 자연스럽고 진짜 같은 결과를 얻을 수 있습니다. 태블릿이나 휴대폰에서 손가락으로 그리면 최상의 결과가 나옵니다.</p>
        <p><strong>입력하기:</strong> 이름을 입력하고 필기체 또는 손글씨 스타일 글꼴을 선택합니다. 가장 빠른 방법이며 매번 깔끔하고 일관된 서명을 만들어 줍니다. 여러 글꼴 중에 자신의 스타일에 맞는 것을 고를 수 있습니다.</p>
        <p><strong>업로드하기:</strong> 흰 종이에 서명하고 사진을 찍어 업로드합니다. 도구가 투명 캔버스에 배치해 줍니다. 실제 필체와 완전히 일치하는 서명을 얻을 수 있습니다.</p>
      </section>

      <section>
        <h2>문서에 서명 추가하기</h2>
        <ul>
          <li><strong>Mac 미리보기(Preview):</strong> PDF를 열고 마크업 툴바에서 Signature(서명)을 클릭한 다음 &quot;Create Signature from File&quot;(파일에서 서명 생성)을 선택하고 PNG를 선택합니다.</li>
          <li><strong>Adobe Reader:</strong> PDF를 열고 Fill &amp; Sign(채우기 및 서명)으로 이동해 서명 아이콘을 클릭하고 &quot;Add Image&quot;(이미지 추가)에서 PNG를 선택합니다.</li>
          <li><strong>Google Docs:</strong> 삽입 &gt; 이미지 &gt; 업로드 후, 크기를 조절해 서명란 위에 배치합니다.</li>
          <li><strong>Microsoft Word:</strong> 삽입 &gt; 그림에서 PNG를 선택한 뒤 텍스트 줄 바꿈을 &quot;In Front of Text&quot;(텍스트 앞)으로 설정하면 쉽게 배치할 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2>서명 무료로 만들기</h2>
        <p>당사의<Link href="/tools/digital-signature" className="text-blue-400 hover:text-blue-300">무료 디지털 서명 생성기</Link>는 그리기, 입력, 업로드 중 원하는 방식으로 서명을 만들고 PNG 또는 SVG로 다운로드할 수 있게 해 줍니다. 가입도 워터마크도 없고 서버에 저장되는 것도 없습니다.</p>
        <ToolCTA name="디지털 서명 생성기" href="/tools/digital-signature" description="그리기, 입력, 업로드로 디지털 서명을 만드세요. PNG 또는 SVG로 다운로드 가능. 가입 없이 100% 프라이빗." />
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "Is a digital signature legally binding?", answer: "A signature image created with a free tool is an electronic signature, which is legally valid for most everyday documents in most jurisdictions under laws like ESIGN (US) and eIDAS (EU). However, for high-stakes legal documents, you may need a qualified electronic signature with identity verification and audit trail." },
      { question: "How do I add my signature to a PDF?", answer: "Download your signature as a PNG, then insert it into your PDF using Preview (Mac), Adobe Reader (Fill & Sign), or any PDF editor. Most tools have an 'Add Image' or 'Stamp' feature that lets you place and resize the signature." },
      { question: "PNG or SVG — which format should I use?", answer: "PNG is best for most uses — it supports transparency and works everywhere. SVG is vector format, so it scales to any size without losing quality. Use SVG if you need to print at large sizes." },
      { question: "Is my signature stored on a server?", answer: "Not with browser-based tools. Everything runs locally. Your signature exists only on the canvas in your browser and in the file you download. Nothing is uploaded." },
    ],
    zh: [
      { question: "电子签名具有法律效力吗？", answer: "用免费工具创建的签名图片属于电子签名，在美国 ESIGN、欧盟 eIDAS 等法律下，对大多数日常文件在大多数司法管辖区具有法律效力。不过，对于高风险的法律文书，你可能需要带身份验证和审计追踪的合格电子签名。" },
      { question: "如何把签名添加到 PDF 中？", answer: "先将签名下载为 PNG，然后用 Preview（Mac）、Adobe Reader（Fill & Sign 填写和签名）或任意 PDF 编辑器将其插入到 PDF 中。大多数工具都有“添加图像”（Add Image）或“图章”（Stamp）功能，可以放置并调整签名大小。" },
      { question: "PNG 和 SVG 该选哪个？", answer: "大多数场景 PNG 最好——支持透明背景，兼容性最广。SVG 是矢量格式，可以缩放到任意尺寸而不损失画质。需要大尺寸打印时请用 SVG。" },
      { question: "我的签名会存储在服务器上吗？", answer: "使用基于浏览器的工具不会。所有处理都在本地完成。你的签名只存在于浏览器画布和你下载的文件中，不会有任何内容被上传。" },
    ],
    ja: [
      { question: "デジタル署名に法的効力はありますか？", answer: "無料ツールで作成した署名画像は電子署名に該当し、米国の ESIGN や EU の eIDAS などの法律のもと、多くの法域で日常的な書類に法的効力があります。ただし、重要な法律文書では、本人確認と監査証跡を備えた適格電子署名が必要になる場合があります。" },
      { question: "PDF に署名を追加するには？", answer: "署名を PNG でダウンロードし、Preview（Mac）、Adobe Reader（Fill & Sign）、または任意の PDF エディターで PDF に挿入します。ほとんどのツールに「Add Image」や「Stamp」機能があり、署名を配置してサイズを調整できます。" },
      { question: "PNG と SVG、どちらを使うべき？", answer: "PNG がほとんどの用途に適しています。透過をサポートし、どこでも使えます。SVG はベクター形式なので、品質を落とさずに任意のサイズへ拡大できます。大きなサイズで印刷する必要がある場合は SVG を使いましょう。" },
      { question: "署名はサーバーに保存されますか？", answer: "ブラウザ内で完結するツールなら保存されません。すべてローカルで処理されます。署名はブラウザのキャンバスとダウンロードしたファイルにだけ存在し、何もアップロードされません。" },
    ],
    ko: [
      { question: "디지털 서명에 법적 효력이 있나요?", answer: "무료 도구로 만든 서명 이미지는 전자 서명으로, 미국의 ESIGN, EU의 eIDAS 같은 법률 아래 대부분의 관할권에서 일상적인 문서에 법적 효력이 있습니다. 다만 효력이 중대한 법률 문서에서는 본인 확인과 감사 추적 기능을 갖춘 적격 전자 서명이 필요할 수 있습니다." },
      { question: "PDF에 서명을 추가하려면 어떻게 하나요?", answer: "서명을 PNG로 다운로드한 뒤 Preview(Mac), Adobe Reader(Fill & Sign), 또는 아무 PDF 편집기를 사용해 PDF에 삽입하세요. 대부분의 도구에는 서명을 배치하고 크기를 조절할 수 있는 'Add Image' 또는 'Stamp' 기능이 있습니다." },
      { question: "PNG와 SVG 중 어떤 형식을 사용해야 하나요?", answer: "PNG가 대부분의 용도에 가장 적합합니다. 투명도를 지원하고 어디서나 동작합니다. SVG는 벡터 형식이라 품질 손실 없이 어떤 크기로도 확대할 수 있습니다. 크게 인쇄해야 한다면 SVG를 사용하세요." },
      { question: "내 서명이 서버에 저장되나요?", answer: "브라우저 기반 도구에서는 저장되지 않습니다. 모든 처리가 로컬에서 이루어집니다. 서명은 브라우저의 캔버스와 다운로드한 파일에만 존재하며, 업로드되는 것은 없습니다." },
    ],
  },
};
