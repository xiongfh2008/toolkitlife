import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> To combine all pages of a PDF into one single tall image, use <Link href="/tools/pdf-long-image" className="text-blue-400 underline">ToolkitLife&apos;s PDF to Long Image tool</Link>: drop in your PDF, pick PNG or JPEG, choose a clarity level (1x–3x), and click convert. The tool renders every page with pdf.js, stacks them vertically, and downloads one long image — entirely in your browser, with no upload to any server. Use 1x–2x for typical documents and 3x for small text; if the image is too tall for your browser&apos;s canvas, lower the scale.</p>
      </aside>

      <section>
        <h2>When Do You Need a Long Image of a PDF?</h2>
        <p>A PDF is great for printing and archiving, but terrible for scrolling. Chat apps, social feeds, and messaging boards don&apos;t preview PDF pages inline — recipients get a file card they have to download and open in another app. A single continuous image behaves the opposite way: it scrolls naturally in any chat, can be embedded in a blog post or wiki page, and shows the whole document at a glance.</p>
        <p>Typical situations where <strong>combining PDF pages into one image</strong> pays off:</p>
        <ul>
          <li><strong>Social sharing:</strong> post a multi-page guide, receipt, or itinerary as one swipe-friendly image on platforms that treat PDFs as second-class attachments.</li>
          <li><strong>Continuous reading:</strong> lecture notes, cheat sheets, and web novels read better as one scrollable strip than as page-flipping.</li>
          <li><strong>Screenshot archives:</strong> keep a visual record of a web-generated PDF (order confirmation, ticket, statement) in your notes app, where images preview but PDFs don&apos;t.</li>
          <li><strong>Quick review:</strong> send one image to a colleague for an &quot;is this right?&quot; check instead of making them download a file.</li>
        </ul>
      </section>

      <section>
        <h2>Meet the PDF to Long Image Tool</h2>
        <p>ToolkitLife&apos;s <Link href="/tools/pdf-long-image" className="text-blue-400 underline">PDF to Long Image tool</Link> renders each page of your PDF and stitches them top-to-bottom into a single PNG or JPEG, all inside your browser.</p>
        <ToolCTA
          name="PDF to Long Image"
          href="/tools/pdf-long-image"
          description="Convert a PDF into one tall image in your browser. Free, no signup, no upload. Choose PNG or JPEG, set clarity 1x–3x, and download the stitched long image instantly."
        />
        <p>What it does and doesn&apos;t do, plainly:</p>
        <ul>
          <li><strong>Fully local processing</strong> — the PDF is parsed and rendered by pdf.js running in your browser tab. No file is uploaded anywhere; the tool even works offline.</li>
          <li><strong>PNG or JPEG output</strong> — you choose the format before converting, with a quality setting for JPEG.</li>
          <li><strong>Clarity levels 1x–3x</strong> — trade file size for sharpness. Higher values render pages at larger sizes.</li>
          <li><strong>One file at a time</strong> — it converts a whole PDF into one image; it does not split a PDF into separate per-page images or extract a single page. For that, use the PDF to JPG tool instead.</li>
        </ul>
      </section>

      <section>
        <h2>How to Convert a PDF to One Long Image (Step by Step)</h2>
        <ol>
          <li><strong>Open the PDF to Long Image tool</strong> and drop your PDF into the upload area (or click to browse). One PDF per conversion.</li>
          <li><strong>Pick the output format.</strong> Choose PNG for maximum sharpness or JPEG for a smaller file.</li>
          <li><strong>Set the clarity level.</strong> 1x renders at native PDF size, 2x doubles it (the default, a good balance), 3x triples it for very small text. Start at 2x.</li>
          <li><strong>Click convert.</strong> Each page is rendered and stacked, with progress shown as pages complete.</li>
          <li><strong>Download the long image.</strong> The stitched image saves straight to your device — one file, all pages in order.</li>
        </ol>
        <p>That&apos;s the whole flow: no account, no watermark, no email address, no &quot;free tier&quot; page cap.</p>
      </section>

      <section>
        <h2>PNG vs JPEG: Which Format to Choose</h2>
        <p>The format choice matters more than most people expect:</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">Aspect</th>
                <th className="py-2 pr-4">PNG</th>
                <th className="py-2">JPEG</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Compression</td>
                <td className="py-2 pr-4">Lossless</td>
                <td className="py-2">Lossy</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Text and screenshots</td>
                <td className="py-2 pr-4">Crisp edges, no artifacts</td>
                <td className="py-2">Fuzzy halos around small text</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">File size</td>
                <td className="py-2 pr-4">Large</td>
                <td className="py-2">Much smaller</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Best for</td>
                <td className="py-2 pr-4">Text documents, forms, code, screenshots</td>
                <td className="py-2">Scanned or image-heavy documents, sharing in size-limited apps</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Rule of thumb: if the PDF is mostly text rendered from a computer (not scanned), PNG keeps the letters razor-sharp. If it&apos;s a heavy scan or a photo-filled catalog — or if a chat app rejects large files — JPEG is the pragmatic pick.</p>
      </section>

      <section>
        <h2>Understanding the 1x–3x Clarity Levels (and Canvas Limits)</h2>
        <p>The clarity level is a render scale. At 1x, a page renders exactly at its PDF point size (A4 ≈ 595 × 842 px). At 2x every dimension doubles (≈ 1190 × 1684 px), and at 3x it triples (≈ 1785 × 2526 px). Multiply by the number of pages and you get the final image height: a 30-page PDF at 3x would be over 75,000 pixels tall.</p>
        <p>That matters because browsers draw images on an internal <em>canvas</em> element, and canvases have hard height limits that differ per browser and device — Safari is notoriously the strictest, capping canvas area at levels modern iOS hardware can hit with long documents. When a conversion exceeds the limit, rendering fails or produces a blank image.</p>
        <ul>
          <li><strong>Start at 2x.</strong> It doubles resolution — noticeably sharper than 1x on phones and retina screens — while keeping the total height manageable.</li>
          <li><strong>Use 3x only for short PDFs or tiny text.</strong> A few pages at 3x is fine; a hundred pages usually isn&apos;t.</li>
          <li><strong>Drop to 1x when the conversion fails or the image looks blank.</strong> Lowering the scale shrinks the total canvas height below the browser limit.</li>
          <li><strong>Very long documents:</strong> consider converting in two halves (page ranges via a PDF splitter) and stitching the results, or fall back to per-page images.</li>
        </ul>
      </section>

      <section>
        <h2>Privacy: Everything Happens on Your Device</h2>
        <p>Long-image converters are exactly the kind of site that quietly uploads your PDF — the rendering must happen <em>somewhere</em>, and &quot;somewhere&quot; is usually their server. Whatever the privacy policy says, the file has left your device.</p>
        <p>This tool takes the other path: pdf.js is loaded in your browser and renders the pages locally, on your CPU. The PDF is read from disk, drawn in memory, and the finished image is written straight back to your downloads. Nothing is transmitted — you can disconnect from the internet mid-task and it will still work. Contracts, payslips, medical letters, and ID scans never leave the device.</p>
      </section>

      <section>
        <h2>Limitations and When to Use a Different Tool</h2>
        <p>An honest tool states its limits:</p>
        <ul>
          <li><strong>One file per conversion.</strong> To merge several PDFs into one image, merge the PDFs first, then convert.</li>
          <li><strong>No per-page extraction.</strong> If you need each page as a separate image — for example, individual JPGs of a scanned contract — the long-image tool isn&apos;t the right shape. Use the <Link href="/tools/pdf-to-jpg" className="text-blue-400 underline">PDF to JPG tool</Link>, which converts pages into separate images you can download one by one or as needed.</li>
          <li><strong>Canvas height limits.</strong> As covered above, extremely long results can exceed browser limits; lowering the clarity level resolves it.</li>
          <li><strong>Vector text stays text-sharp; scanned pages stay scan-quality.</strong> The tool renders pages as they are — it doesn&apos;t enhance blurry scans.</li>
        </ul>
      </section>

      <section>
        <h2>Troubleshooting</h2>
        <p><strong>&quot;The output image is blank or the conversion fails.&quot;</strong> Almost always the canvas height limit: too many pages at too high a scale. Lower the clarity level to 1x, or split the PDF into parts and convert each.</p>
        <p><strong>&quot;The image is huge (tens of MB).&quot;</strong> Long PNGs of text-heavy pages are big by nature. Switch to JPEG, or drop the clarity to 1x–2x, or compress the result with an image compressor afterward.</p>
        <p><strong>&quot;The text looks fuzzy.&quot;</strong> Raise the clarity level (2x → 3x) if the page count allows, or switch from JPEG to PNG — JPEG compression blurs small text first.</p>
        <p><strong>&quot;The file won&apos;t load.&quot;</strong> The PDF may be corrupted, password-protected, or not actually a PDF despite the extension. Open it once in a viewer to check; unlock it first if needed.</p>
      </section>

      <section>
        <h2>Quick FAQ Recap</h2>
        <ul>
          <li>Is converting a PDF to a long image free here? Yes — no watermark, no signup, no page caps, no email required.</li>
          <li>Is my PDF uploaded? No. Rendering runs entirely in your browser via pdf.js; nothing is transmitted.</li>
          <li>PNG or JPEG? PNG for text and screenshots (lossless), JPEG for smaller files and image-heavy documents.</li>
          <li>Why did my conversion fail? Likely the browser canvas height limit — lower the clarity level from 3x to 1x and retry.</li>
        </ul>
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR：</strong>想把 PDF 的所有页面拼成一张长图，用 <Link href="/tools/pdf-long-image" className="text-blue-400 underline">ToolkitLife 的 PDF 转长图工具</Link>：拖入 PDF，选 PNG 或 JPEG，选清晰度（1x–3x），点转换即可。工具用 pdf.js 渲染每一页并纵向拼接成一张长图，全程在浏览器本地完成、不上传任何服务器。普通文档用 1x–2x，小字文档用 3x；如果图片过长超出浏览器画布限制导致失败，就降低倍率重试。</p>
      </aside>

      <section>
        <h2>什么时候需要把 PDF 拼成长图？</h2>
        <p>PDF 适合打印和归档，却不适合滚动浏览。聊天软件、社交媒体、群组论坛大多不会内联预览 PDF 页面——对方收到的是一个文件卡片，还得下载后用别的应用打开。一张连续长图则相反：在任何聊天里都能自然滚动，可以贴进博客或 wiki 页面，一眼看到整个文档。</p>
        <p>几个立刻用得上的场景：</p>
        <ul>
          <li><strong>社交分享：</strong>把多页攻略、收据、行程单变成一张滑动就能看完的图，发到那些把 PDF 当二等附件的平台。</li>
          <li><strong>连续阅读：</strong>讲义、速查表、网络小说，一条长滚动条远比不停翻页舒服。</li>
          <li><strong>截图存档：</strong>把网页生成的 PDF（订单确认、车票、账单）以图片形式存进笔记应用——那里图片能预览，PDF 不能。</li>
          <li><strong>快速核对：</strong>发给同事一张图问「这样对吗」，省去对方下载文件的麻烦。</li>
        </ul>
      </section>

      <section>
        <h2>认识 PDF 转长图工具</h2>
        <p>ToolkitLife 的 <Link href="/tools/pdf-long-image" className="text-blue-400 underline">PDF 转长图工具</Link>渲染 PDF 的每一页，并把它们从上到下拼接成一张 PNG 或 JPEG，全程在浏览器内完成。</p>
        <ToolCTA
          name="PDF 转长图"
          href="/tools/pdf-long-image"
          description="在浏览器里把 PDF 转成一张长图。免费、无需注册、不上传。可选 PNG 或 JPEG，清晰度 1x–3x，立即下载拼接结果。"
        />
        <p>它能做什么、不能做什么：</p>
        <ul>
          <li><strong>完全本地处理</strong>——PDF 由运行在浏览器标签页里的 pdf.js 解析渲染，任何文件都不上传；断网也能用。</li>
          <li><strong>PNG 或 JPEG 输出</strong>——转换前自选格式，JPEG 还可调质量。</li>
          <li><strong>清晰度 1x–3x</strong>——用体积换清晰度，倍率越高渲染尺寸越大。</li>
          <li><strong>一次处理一个文件</strong>——它把整个 PDF 变成一张图；不做按页拆分成多张图，也不提取单页。那种需求请用 PDF 转 JPG 工具。</li>
        </ul>
      </section>

      <section>
        <h2>如何把 PDF 转成一张长图（分步教程）</h2>
        <ol>
          <li><strong>打开 PDF 转长图工具</strong>，把 PDF 拖进上传区（或点击选择）。每次转换一个 PDF。</li>
          <li><strong>选输出格式。</strong>要最高清晰度选 PNG，要更小体积选 JPEG。</li>
          <li><strong>设清晰度。</strong>1x 按 PDF 原始尺寸渲染，2x 放大一倍（默认值，比较均衡），3x 放大两倍适合很小的字。先从 2x 试起。</li>
          <li><strong>点转换。</strong>逐页渲染并纵向拼接，每页完成都有进度显示。</li>
          <li><strong>下载长图。</strong>拼接好的图片直接保存到设备——一个文件，所有页面按顺序排列。</li>
        </ol>
        <p>流程就这么简单：没有账号、没有水印、不需要邮箱、没有「免费版」页数限制。</p>
      </section>

      <section>
        <h2>PNG 还是 JPEG：格式怎么选</h2>
        <p>格式选择比多数人想的更重要：</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">对比项</th>
                <th className="py-2 pr-4">PNG</th>
                <th className="py-2">JPEG</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">压缩方式</td>
                <td className="py-2 pr-4">无损</td>
                <td className="py-2">有损</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">文字与截图</td>
                <td className="py-2 pr-4">边缘锐利、无伪影</td>
                <td className="py-2">小字周围出现模糊光晕</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">文件体积</td>
                <td className="py-2 pr-4">较大</td>
                <td className="py-2">小得多</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">适合场景</td>
                <td className="py-2 pr-4">文字文档、表单、代码、截图</td>
                <td className="py-2">扫描件、图片为主的文档、受限于体积的分享</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>经验法则：如果 PDF 主要是电脑生成的文字（非扫描），PNG 能让笔画保持锋利；如果是厚重的扫描件或图片画册——或者聊天软件嫌文件太大——JPEG 是务实之选。</p>
      </section>

      <section>
        <h2>看懂 1x–3x 清晰度（以及画布高度限制）</h2>
        <p>清晰度就是渲染倍率。1x 时每页按 PDF 原始点数渲染（A4 ≈ 595 × 842 像素）；2x 每个维度翻倍（≈ 1190 × 1684），3x 翻两番（≈ 1785 × 2526）。乘上页数就是最终图片的高度：一份 30 页的 PDF 用 3x，成品会超过 75000 像素高。</p>
        <p>这很重要，因为浏览器在内部的<em>画布（canvas）</em>元素上绘图，而画布有硬性的高度上限，各浏览器各设备不一样——Safari 尤其严格，画布面积上限较低，现代 iOS 设备处理长文档时很容易撞线。超过限制时，渲染会失败或输出一张空白图。</p>
        <ul>
          <li><strong>从 2x 开始。</strong>分辨率翻倍——手机和视网膜屏上明显更清晰——同时总高度还可控。</li>
          <li><strong>3x 只用于短文档或极小字号。</strong>几页用 3x 没问题；上百页通常不行。</li>
          <li><strong>转换失败或图片空白就降到 1x。</strong>降低倍率能把画布总高度压到浏览器限制以内。</li>
          <li><strong>超长文档：</strong>可以先用 PDF 拆分工具把页码范围拆成两半分别转换再拼接，或者退回逐页出图。</li>
        </ul>
      </section>

      <section>
        <h2>隐私：一切都在你的设备上完成</h2>
        <p>长图转换器正是那种悄悄上传你 PDF 的站点——渲染总得在<em>某个地方</em>发生，而「某个地方」通常是它们的服务器。无论隐私政策写得多么漂亮，文件已经离开了你的设备。</p>
        <p>本工具走另一条路：pdf.js 在你的浏览器里加载，页面由你本地的 CPU 渲染。PDF 从磁盘读入、在内存中绘制、成品图直接写回下载目录。什么都不发送——中途断网照样能用。合同、工资单、医疗信函、证件扫描件都不离开设备。</p>
      </section>

      <section>
        <h2>限制说明与替代工具</h2>
        <p>诚实的工具会说明自己的边界：</p>
        <ul>
          <li><strong>每次转换一个文件。</strong>想把多个 PDF 拼成一张图，先用合并工具把 PDF 合成一个，再转长图。</li>
          <li><strong>不做逐页提取。</strong>如果你需要每一页单独成图——比如扫描合同的逐页 JPG——长图工具不是合适的形状。请用 <Link href="/tools/pdf-to-jpg" className="text-blue-400 underline">PDF 转 JPG 工具</Link>，它把各页转成独立图片，按需逐张下载。</li>
          <li><strong>画布高度限制。</strong>如上文所述，超长结果可能超出浏览器限制；降低清晰度即可解决。</li>
          <li><strong>矢量文字保持文字的锐利；扫描页保持扫描的画质。</strong>工具按原样渲染页面，不会增强模糊的扫描件。</li>
        </ul>
      </section>

      <section>
        <h2>常见问题排查</h2>
        <p><strong>「输出图片是空白的，或转换失败。」</strong>几乎总是画布高度限制：页数太多、倍率太高。把清晰度降到 1x，或把 PDF 拆成几部分分别转换。</p>
        <p><strong>「图片太大了（几十 MB）。」</strong>文字密集页面的长 PNG 天然就大。改用 JPEG，或把清晰度降到 1x–2x，或转完后用图片压缩工具压一遍。</p>
        <p><strong>「文字发糊。」</strong>页数允许的话提高清晰度（2x → 3x），或从 JPEG 换成 PNG——JPEG 压缩最先模糊的就是小字。</p>
        <p><strong>「文件加载不了。」</strong>PDF 可能损坏、加了密码，或者虽然有扩展名其实不是 PDF。先用阅读器打开确认；有密码就先解锁。</p>
      </section>

      <section>
        <h2>快速问答回顾</h2>
        <ul>
          <li>在这里把 PDF 转长图免费吗？免费——无水印、无注册、无页数上限、不需要邮箱。</li>
          <li>我的 PDF 会被上传吗？不会。渲染完全在你的浏览器里通过 pdf.js 完成，不发送任何数据。</li>
          <li>PNG 还是 JPEG？文字和截图用 PNG（无损）；要小体积、图片为主的文档用 JPEG。</li>
          <li>为什么转换失败了？多半是浏览器画布高度限制——把清晰度从 3x 降到 1x 再试。</li>
        </ul>
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="概要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> PDF の全ページを1枚の縦長画像にまとめるには、<Link href="/tools/pdf-long-image" className="text-blue-400 underline">ToolkitLife の PDF ロング画像変換ツール</Link>を使います：PDF をドロップし、PNG か JPEG を選び、鮮明度（1x–3x）を設定して変換。pdf.js で各ページを描画して縦に連結し、1枚の長い画像としてダウンロード——すべてブラウザ内で完結し、サーバーへのアップロードはありません。通常の文書は 1x–2x、小さな文字は 3x。画像が長すぎてブラウザのキャンバス上限を超えたら、倍率を下げて再試行してください。</p>
      </aside>

      <section>
        <h2>PDF を長い画像にまとめたい場面</h2>
        <p>PDF は印刷や保存には最適ですが、スクロール表示には向きません。チャットアプリや SNS、掲示板の多くは PDF ページをインラインでプレビューせず、受け手はファイルカードをダウンロードして別アプリで開くはめになります。1枚の連続画像はその逆で、どんなチャットでも自然にスクロールでき、ブログや wiki に埋め込め、文書全体をひと目で確認できます。</p>
        <ul>
          <li><strong>SNS 共有：</strong>複数ページのガイドや領収書、旅程表を、スワイプで読める1枚の画像として。PDF が二流扱いされるプラットフォーム向け。</li>
          <li><strong>連続読書：</strong>講義ノート、チートシート、Web 小説は、ページ送りより1本の長いスクロールが読みやすい。</li>
          <li><strong>スクリーンショット保存：</strong>Web で生成した PDF（注文確認、チケット、明細）を画像としてノートアプリに保存。画像はプレビューできても PDF はできない環境で。</li>
          <li><strong>すぐ確認：</strong>「これで合ってる？」と同僚に見せるのはファイルより画像1枚が早い。</li>
        </ul>
      </section>

      <section>
        <h2>PDF ロング画像ツールの紹介</h2>
        <p>ToolkitLife の <Link href="/tools/pdf-long-image" className="text-blue-400 underline">PDF ロング画像ツール</Link>は PDF の各ページを描画し、上から下へ1枚の PNG または JPEG に連結します。すべてブラウザ内で処理されます。</p>
        <ToolCTA
          name="PDF ロング画像"
          href="/tools/pdf-long-image"
          description="ブラウザで PDF を1枚の縦長画像に変換。無料、登録不要、アップロードなし。PNG/JPEG 選択、鮮明度 1x–3x、すぐダウンロード。"
        />
        <ul>
          <li><strong>完全ローカル処理</strong>——PDF はブラウザタブ内で動く pdf.js が解析・描画。ファイルはどこにもアップロードされず、オフラインでも動作。</li>
          <li><strong>PNG / JPEG 出力</strong>——変換前に形式を選択。JPEG は品質調整も可能。</li>
          <li><strong>鮮明度 1x–3x</strong>——ファイルサイズと引き換えに鮮明さを上げる。</li>
          <li><strong>1回に1ファイル</strong>——PDF 全体を1枚の画像に変換するツールです。ページごとの分割画像や単一ページの抽出は PDF→JPG ツールで。</li>
        </ul>
      </section>

      <section>
        <h2>PDF を1枚の長い画像に変換する手順</h2>
        <ol>
          <li><strong>PDF ロング画像ツールを開き</strong>、PDF をアップロード領域へドロップ（クリックで選択も可）。1回の変換につき1ファイル。</li>
          <li><strong>出力形式を選ぶ。</strong>最大鮮明度なら PNG、軽量化なら JPEG。</li>
          <li><strong>鮮明度を設定。</strong>1x は PDF の元サイズ（A4 ≈ 595 × 842 px）、2x は2倍（既定、バランス良好）、3x は3倍で小さな文字向け。まず 2x から。</li>
          <li><strong>変換をクリック。</strong>各ページが描画・連結され、進捗が表示されます。</li>
          <li><strong>長い画像をダウンロード。</strong>連結済みの画像がそのまま端末に保存——1ファイル、全ページ順番どおり。</li>
        </ol>
        <p>流れはこれだけ：アカウントも透かしもメールアドレスも「無料版」ページ制限もありません。</p>
      </section>

      <section>
        <h2>PNG と JPEG、どちらを選ぶか</h2>
        <p>形式の選択は想像以上に重要です：</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">項目</th>
                <th className="py-2 pr-4">PNG</th>
                <th className="py-2">JPEG</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">圧縮</td>
                <td className="py-2 pr-4">ロスレス</td>
                <td className="py-2">非可逆</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">テキスト・スクショ</td>
                <td className="py-2 pr-4">輪郭がシャープ、ノイズなし</td>
                <td className="py-2">小さな文字ににじみ</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">ファイルサイズ</td>
                <td className="py-2 pr-4">大きい</td>
                <td className="py-2">はるかに小さい</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">向いている用途</td>
                <td className="py-2 pr-4">文書・フォーム・コード・スクリーンショット</td>
                <td className="py-2">スキャンや画像中心の文書、サイズ制限のある共有</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>目安：PDF がスキャンではなくコンピュータ生成のテキスト主体なら PNG が文字をシャープに保ちます。重いスキャンや写真だらけのカタログ——あるいはチャットアプリに容量で弾かれるとき——は JPEG が実用的です。</p>
      </section>

      <section>
        <h2>鮮明度 1x–3x の意味とキャンバス上限</h2>
        <p>鮮明度は描画倍率です。1x ではページは PDF のポイントサイズそのまま（A4 ≈ 595 × 842 px）。2x は各寸法が2倍（≈ 1190 × 1684）、3x は3倍（≈ 1785 × 2526）。ページ数を掛けたものが最終画像の高さになります：30 ページの PDF を 3x で変換すると高さ 75,000 px 超です。</p>
        <p>ここが重要なのは、ブラウザが画像を内部の<em>キャンバス</em>要素に描画するためで、キャンバスにはブラウザや機種ごとに異なるハードな高さ上限があります——Safari は特に厳しく、現代の iOS 端末でも長い文書で上限に達します。制限を超えると描画が失敗するか、真っ白な画像が出力されます。</p>
        <ul>
          <li><strong>まず 2x から。</strong>解像度が2倍になり、スマホや Retina ディスプレイで明らかにシャープになりつつ、総高さも管理可能。</li>
          <li><strong>3x は短い PDF か極小文字のみ。</strong>数ページなら問題なし。100 ページは通常無理。</li>
          <li><strong>失敗・真っ白なら 1x に下げる。</strong>倍率を下げればキャンバスの総高さが制限内に収まります。</li>
          <li><strong>非常に長い文書：</strong>PDF 分割でページ範囲を2つに分けて別々に変換し後でつなげるか、ページごとの画像にフォールバック。</li>
        </ul>
      </section>

      <section>
        <h2>プライバシー：すべて端末内で完結</h2>
        <p>ロング画像変換サイトは、こっそり PDF をアップロードするタイプの典型です——描画は<em>どこか</em>で起きる必要があり、その「どこか」はたいてい相手のサーバーです。プライバシーポリシーが何を言おうと、ファイルは端末を離れています。</p>
        <p>このツールは逆の道を行きます：pdf.js をブラウザ内で読み込み、ページをローカルの CPU で描画します。PDF はディスクから読み込み、メモリ上で描き、完成画像はダウンロードへ直接書き戻します。何も送信せず、作業中にネットを切っても動きます。契約書・給与明細・医療手紙・身分証スキャンは端末から出ません。</p>
      </section>

      <section>
        <h2>制限と代替ツール</h2>
        <p>正直なツールは限界を明示します：</p>
        <ul>
          <li><strong>1回の変換は1ファイル。</strong>複数 PDF を1枚の画像にしたい場合は、まず PDF を結合してから変換。</li>
          <li><strong>ページ単位の抽出は不可。</strong>各ページを別画像にしたい（例：スキャン契約書のページごと JPG）場合はロング画像ツールは不向き。<Link href="/tools/pdf-to-jpg" className="text-blue-400 underline">PDF→JPG ツール</Link>を使えばページごとの独立した画像を必要な分だけダウンロードできます。</li>
          <li><strong>キャンバス高さ制限。</strong>前述のとおり、極端に長い結果は上限を超えることがあり、鮮明度を下げれば解決。</li>
          <li><strong>ベクターテキストはテキストの鮮明さのまま、スキャンはスキャンの画質のまま。</strong>ツールはページをそのまま描画し、ぼやけたスキャンを補正しません。</li>
        </ul>
      </section>

      <section>
        <h2>トラブルシューティング</h2>
        <p><strong>「出力画像が真っ白、または変換失敗。」</strong>ほぼ確実にキャンバス高さ制限：ページ数が多く倍率が高すぎます。鮮明度を 1x に下げるか、PDF を分割して個別に変換。</p>
        <p><strong>「画像が巨大（数十 MB）。」</strong>テキスト多用ページの長い PNG は本質的に大きいです。JPEG に切り替えるか、鮮明度を 1x–2x に下げるか、変換後に画像圧縮ツールへ通してください。</p>
        <p><strong>「文字がにじむ。」</strong>ページ数が許せば鮮明度を上げ（2x → 3x）、JPEG から PNG へ切り替え——JPEG 圧縮は小さな文字から潰します。</p>
        <p><strong>「ファイルを読み込めない。」</strong>PDF が破損・パスワード保護・拡張子は .pdf だが中身が違う可能性。ビューアで一度開いて確認し、必要ならロック解除を。</p>
      </section>

      <section>
        <h2>クイック FAQ まとめ</h2>
        <ul>
          <li>ここでの PDF→長い画像変換は無料？はい——透かしなし、登録なし、ページ上限なし、メール不要。</li>
          <li>PDF はアップロードされる？されません。描画は pdf.js により完全にブラウザ内で実行、送信はゼロ。</li>
          <li>PNG と JPEG どっち？テキストとスクショは PNG（ロスレス）、軽量化や画像中心の文書は JPEG。</li>
          <li>変換が失敗するのはなぜ？ブラウザのキャンバス高さ制限の可能性大——鮮明度を 3x から 1x に下げて再試行。</li>
        </ul>
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> PDF의 모든 페이지를 한 장의 긴 이미지로 합치려면 <Link href="/tools/pdf-long-image" className="text-blue-400 underline">ToolkitLife PDF 장황 이미지 도구</Link>를 사용하세요: PDF를 끌어다 놓고, PNG 또는 JPEG를 고르고, 선명도(1x–3x)를 정한 뒤 변환을 클릭합니다. pdf.js로 각 페이지를 렌더링해 세로로 이어 붙여 하나의 긴 이미지로 다운로드합니다 — 브라우저에서 완전히 처리되며 서버 업로드가 없습니다. 일반 문서는 1x–2x, 작은 글씨는 3x. 이미지가 너무 길어 브라우저 캔버스 한도를 초과하면 배율을 낮춰 재시도하세요.</p>
      </aside>

      <section>
        <h2>PDF를 긴 이미지로 만들어야 하는 때</h2>
        <p>PDF는 인쇄와 보관에는 좋지만 스크롤에는 최악입니다. 채팅 앱, 소셜 피드, 게시판 대부분은 PDF 페이지를 인라인으로 미리보지 않고, 받는 사람은 파일 카드를 내려받아 다른 앱으로 열어야 합니다. 연속 이미지는 정반대로 어디서든 자연스럽게 스크롤되고, 블로그나 위키에 삽입할 수 있으며, 문서 전체를 한눈에 보여줍니다.</p>
        <ul>
          <li><strong>소셜 공유:</strong> 여러 페이지 가이드, 영수증, 일정표를 스와이프로 읽히는 한 장의 이미지로. PDF를 이등급 첨부로 취급하는 플랫폼에 적합합니다.</li>
          <li><strong>연속 읽기:</strong> 강의 노트, 치트시트, 웹소설은 페이지 넘기기보다 한 줄의 긴 스크롤이 편합니다.</li>
          <li><strong>스크린샷 아카이브:</strong> 웹에서 생성한 PDF(주문 확인, 티켓, 명세서)를 이미지로 노트 앱에 보관 — 이미지는 미리보기되지만 PDF는 안 되는 환경에서.</li>
          <li><strong>빠른 확인:</strong> 동료에게 &quot;이거 맞나요?&quot; 물어볼 때 파일보다 이미지 한 장이 빠릅니다.</li>
        </ul>
      </section>

      <section>
        <h2>PDF 장황 이미지 도구 소개</h2>
        <p>ToolkitLife의 <Link href="/tools/pdf-long-image" className="text-blue-400 underline">PDF 장황 이미지 도구</Link>는 PDF의 각 페이지를 렌더링해 위에서 아래로 한 장의 PNG 또는 JPEG로 이어 붙입니다. 모든 과정이 브라우저 안에서 일어납니다.</p>
        <ToolCTA
          name="PDF 장황 이미지"
          href="/tools/pdf-long-image"
          description="브라우저에서 PDF를 한 장의 긴 이미지로 변환. 무료, 가입 없음, 업로드 없음. PNG/JPEG 선택, 선명도 1x–3x, 즉시 다운로드."
        />
        <ul>
          <li><strong>완전 로컬 처리</strong> — PDF는 브라우저 탭 안의 pdf.js가 해석·렌더링합니다. 파일은 어디에도 업로드되지 않으며 오프라인에서도 작동.</li>
          <li><strong>PNG / JPEG 출력</strong> — 변환 전에 형식을 선택. JPEG는 품질 조절도 가능.</li>
          <li><strong>선명도 1x–3x</strong> — 파일 크기와 맞바꾸는 선명도.</li>
          <li><strong>한 번에 한 파일</strong> — PDF 전체를 한 장으로 바꾸는 도구입니다. 페이지별 분할 이미지나 단일 페이지 추출은 PDF→JPG 도구를 사용하세요.</li>
        </ul>
      </section>

      <section>
        <h2>PDF를 한 장의 긴 이미지로 변환하는 방법 (단계별)</h2>
        <ol>
          <li><strong>PDF 장황 이미지 도구를 열고</strong> PDF를 업로드 영역으로 드래그(또는 클릭해서 선택). 변환당 파일 하나.</li>
          <li><strong>출력 형식을 고르세요.</strong> 최대 선명도는 PNG, 더 작은 용량은 JPEG.</li>
          <li><strong>선명도를 설정.</strong> 1x는 PDF 원본 크기(A4 ≈ 595 × 842 px), 2x는 두 배(기본값, 균형 좋음), 3x는 세 배로 아주 작은 글씨용. 2x부터 시작하세요.</li>
          <li><strong>변환 클릭.</strong> 각 페이지가 렌더링·연결되며 진행률이 표시됩니다.</li>
          <li><strong>긴 이미지를 다운로드.</strong> 이어 붙인 이미지가 기기에 바로 저장 — 한 파일, 모든 페이지가 순서대로.</li>
        </ol>
        <p>전 흐름이 이게 전부: 계정도 워터마크도 이메일도 &quot;무료 티어&quot; 페이지 제한도 없습니다.</p>
      </section>

      <section>
        <h2>PNG vs JPEG: 어떤 형식을 고를까</h2>
        <p>형식 선택은 생각보다 훨씬 중요합니다:</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">항목</th>
                <th className="py-2 pr-4">PNG</th>
                <th className="py-2">JPEG</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">압축</td>
                <td className="py-2 pr-4">무손실</td>
                <td className="py-2">손실</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">텍스트·스크린샷</td>
                <td className="py-2 pr-4">선명한 가장자리, 노이즈 없음</td>
                <td className="py-2">작은 글씨 주변 흐림</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">파일 크기</td>
                <td className="py-2 pr-4">큼</td>
                <td className="py-2">훨씬 작음</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">적합한 용도</td>
                <td className="py-2 pr-4">문서, 양식, 코드, 스크린샷</td>
                <td className="py-2">스캔본·이미지 중심 문서, 용량 제한 공유</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>경험 법칙: PDF가 스캔이 아닌 컴퓨터 생성 텍스트 위주라면 PNG가 글자를 날카롭게 유지합니다. 무거운 스캔이나 사진이 가득한 카탈로그 — 혹은 채팅 앱이 용량으로 거부할 때 — 는 JPEG이 실용적입니다.</p>
      </section>

      <section>
        <h2>선명도 1x–3x의 의미와 캔버스 한도</h2>
        <p>선명도는 렌더링 배율입니다. 1x에서 페이지는 PDF 포인트 크기 그대로(A4 ≈ 595 × 842 px) 렌더링됩니다. 2x는 모든 면이 두 배(≈ 1190 × 1684), 3x는 세 배(≈ 1785 × 2526). 페이지 수를 곱하면 최종 이미지 높이가 됩니다: 30페이지 PDF를 3x로 변환하면 높이 75,000 픽셀을 넘습니다.</p>
        <p>중요한 이유는 브라우저가 이미지를 내부 <em>캔버스</em> 요소에 그리기 때문입니다. 캔버스에는 브라우저·기기별로 다른 하드한 높이 한도가 있으며 — Safari가 특히 엄격해서 최신 iOS 기기에서도 긴 문서에 걸립니다. 한도를 초과하면 렌더링이 실패하거나 빈 이미지가 나옵니다.</p>
        <ul>
          <li><strong>2x로 시작.</strong> 해상도가 두 배가 되어 폰과 레티나 화면에서 눈에 띄게 선명해지면서 총 높이도 관리 가능.</li>
          <li><strong>3x는 짧은 PDF나 아주 작은 글씨에만.</strong> 몇 페이지는 괜찮지만 백 페이지는 보통 안 됩니다.</li>
          <li><strong>실패하거나 빈 이미지면 1x로.</strong> 배율을 낮추면 캔버스 총 높이가 브라우저 한도 안으로 들어옵니다.</li>
          <li><strong>아주 긴 문서:</strong> PDF 분할기로 페이지 범위를 둘로 나눠 각각 변환한 뒤 이어 붙이거나, 페이지별 이미지로 전환하세요.</li>
        </ul>
      </section>

      <section>
        <h2>개인정보: 모든 것이 기기 안에서</h2>
        <p>장황 이미지 변환 사이트는 조용히 PDF를 업로드하는 유형의 전형입니다 — 렌더링은 <em>어딘가</em>에서 일어나야 하고 그 &quot;어딘가&quot;는 보통 그들의 서버입니다. 개인정보 처리방침이 뭐라 하든 파일은 이미 기기를 떠났습니다.</p>
        <p>이 도구는 반대 길을 갑니다: pdf.js를 브라우저에서 불러와 페이지를 로컬 CPU로 렌더링합니다. PDF는 디스크에서 읽히고, 메모리에서 그려지고, 완성 이미지는 다운로드 폴더로 바로 기록됩니다. 아무것도 전송되지 않으며 작업 중에 인터넷을 끊어도 작동합니다. 계약서, 급여 명세서, 진료 안내, 신분증 스캔은 기기를 떠나지 않습니다.</p>
      </section>

      <section>
        <h2>제한 사항과 대체 도구</h2>
        <p>정직한 도구는 한계를 밝힙니다:</p>
        <ul>
          <li><strong>변환당 한 파일.</strong> 여러 PDF를 한 장으로 합치려면 먼저 PDF를 병합한 뒤 변환하세요.</li>
          <li><strong>페이지별 추출 불가.</strong> 각 페이지를 별도 이미지로(예: 스캔 계약서의 페이지별 JPG) 필요하면 장황 이미지 도구는 맞지 않습니다. <Link href="/tools/pdf-to-jpg" className="text-blue-400 underline">PDF→JPG 도구</Link>를 쓰면 페이지별 독립 이미지를 필요한 만큼 내려받을 수 있습니다.</li>
          <li><strong>캔버스 높이 한도.</strong> 위에서 다룬 대로, 극단적으로 긴 결과는 한도를 넘을 수 있으며 선명도를 낮추면 해결됩니다.</li>
          <li><strong>벡터 텍스트는 텍스트의 선명함 그대로, 스캔은 스캔 품질 그대로.</strong> 도구는 페이지를 있는 그대로 렌더링하며 흐린 스캔을 보정하지 않습니다.</li>
        </ul>
      </section>

      <section>
        <h2>문제 해결</h2>
        <p><strong>&quot;출력 이미지가 비어 있거나 변환 실패.&quot;</strong> 거의 항상 캔버스 높이 한도 문제입니다: 페이지가 많고 배율이 높습니다. 선명도를 1x로 낮추거나 PDF를 나눠 각각 변환하세요.</p>
        <p><strong>&quot;이미지가 너무 커요(수십 MB).&quot;</strong> 텍스트 위주 페이지의 긴 PNG는 본질적으로 큽니다. JPEG로 바꾸거나 선명도를 1x–2x로 낮추거나 변환 후 이미지 압축기를 돌리세요.</p>
        <p><strong>&quot;글씨가 흐려요.&quot;</strong> 페이지 수가 허용하면 선명도를 올리고(2x → 3x) JPEG에서 PNG로 바꾸세요 — JPEG 압축은 작은 글씨부터 무너뜨립니다.</p>
        <p><strong>&quot;파일이 로드 안 돼요.&quot;</strong> PDF가 손상됐거나 암호 보호 중이거나 확장자만 .pdf일 수 있습니다. 뷰어로 한 번 열어 확인하고, 필요하면 잠금을 먼저 해제하세요.</p>
      </section>

      <section>
        <h2>빠른 FAQ 정리</h2>
        <ul>
          <li>여기서 PDF→긴 이미지 변환이 무료인가요? 네 — 워터마크 없음, 가입 없음, 페이지 상한 없음, 이메일 불필요.</li>
          <li>PDF가 업로드되나요? 아닙니다. 렌더링은 pdf.js로 브라우저 안에서 완전히 실행되며 전송은 없습니다.</li>
          <li>PNG vs JPEG? 텍스트와 스크린샷은 PNG(무손실), 작은 용량·이미지 중심 문서는 JPEG.</li>
          <li>변환이 왜 실패하죠? 브라우저 캔버스 높이 한도일 가능성이 큽니다 — 선명도를 3x에서 1x로 낮추고 재시도하세요.</li>
        </ul>
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "How do I combine all pages of a PDF into one single image?", answer: "Use a browser-based long-image converter. With ToolkitLife's PDF to Long Image tool you drop in your PDF, choose PNG or JPEG, set a clarity level (1x–3x), and click convert — every page is rendered with pdf.js and stitched top-to-bottom into one tall image that downloads instantly." },
      { question: "Is my PDF uploaded to a server during the conversion?", answer: "No. The rendering runs entirely inside your browser via pdf.js: the file is read from disk, drawn in memory, and the finished image is written back to your device. Nothing is transmitted, so the tool works even offline and is safe for contracts, statements, and ID scans." },
      { question: "Should I choose PNG or JPEG for a long image?", answer: "Choose PNG for text documents, forms, and screenshots — it is lossless and keeps small letters razor-sharp. Choose JPEG when you need a much smaller file, such as for scanned documents or for apps that reject large uploads; JPEG's lossy compression slightly blurs fine text." },
      { question: "Why did my conversion fail or produce a blank image?", answer: "Almost certainly the browser canvas height limit. Long documents at high clarity levels produce images taller than some browsers can draw — Safari is the strictest. Lower the clarity level (3x → 2x → 1x), or split the PDF into parts and convert each half separately." },
    ],
    zh: [
      { question: "如何把 PDF 的所有页面合并成一张图片？", answer: "使用浏览器端的长图转换工具。ToolkitLife 的 PDF 转长图工具只需拖入 PDF、选 PNG 或 JPEG、设清晰度（1x–3x）、点转换——每一页由 pdf.js 渲染并从上到下拼接成一张长图，立即下载。" },
      { question: "转换过程中我的 PDF 会被上传到服务器吗？", answer: "不会。渲染完全在你的浏览器内通过 pdf.js 完成：文件从磁盘读取、在内存中绘制、成品图直接写回设备。什么都不发送，所以断网也能用，合同、账单、证件扫描件都安全。" },
      { question: "长图该选 PNG 还是 JPEG？", answer: "文字文档、表单、截图选 PNG——无损压缩，小字保持锐利。需要小体积时选 JPEG，比如扫描件或拒绝大文件的应用；JPEG 有损压缩会让细小文字轻微发糊。" },
      { question: "为什么转换失败或输出空白图片？", answer: "几乎可以肯定是浏览器画布高度限制。高清晰度下的长文档会生成超出部分浏览器绘制能力的超高图片——Safari 最严格。降低清晰度（3x → 2x → 1x），或把 PDF 拆成几部分分别转换。" },
    ],
    ja: [
      { question: "PDF の全ページを1枚の画像にまとめるには？", answer: "ブラウザ型のロング画像変換ツールを使います。ToolkitLife の PDF ロング画像ツールなら、PDF をドロップし、PNG か JPEG を選び、鮮明度（1x–3x）を設定して変換をクリック——各ページが pdf.js で描画され、上から下へ連結された1枚の長い画像がすぐダウンロードされます。" },
      { question: "変換中に PDF はサーバーにアップロードされますか？", answer: "いいえ。描画は pdf.js により完全にブラウザ内で実行されます：ファイルはディスクから読み込まれ、メモリ上で描画され、完成画像は端末へ書き戻されます。何も送信されないためオフラインでも動作し、契約書・明細・身分証スキャンも安全です。" },
      { question: "長い画像は PNG と JPEG のどちらを選ぶべき？", answer: "テキスト文書・フォーム・スクリーンショットは PNG——ロスレスで小さな文字もシャープに保ちます。ファイルを大幅に軽くしたいとき（スキャン文書や大容量を拒むアプリへの共有など）は JPEG。JPEG の非可逆圧縮は細かい文字をわずかににじませます。" },
      { question: "変換が失敗したり真っ白な画像が出るのはなぜ？", answer: "ほぼ確実にブラウザのキャンバス高さ制限です。高鮮明度の長い文書は、一部のブラウザが描画できる高さを超えます——Safari が最も厳格です。鮮明度を下げる（3x → 2x → 1x）か、PDF を分割して別々に変換してください。" },
    ],
    ko: [
      { question: "PDF의 모든 페이지를 한 장의 이미지로 합치려면 어떻게 하나요?", answer: "브라우저 기반 장황 이미지 변환기를 사용하세요. ToolkitLife의 PDF 장황 이미지 도구는 PDF를 놓고 PNG 또는 JPEG를 고르고 선명도(1x–3x)를 정한 뒤 변환을 클릭하면 — 각 페이지가 pdf.js로 렌더링되어 위에서 아래로 이어 붙은 한 장의 긴 이미지가 즉시 다운로드됩니다." },
      { question: "변환 중에 PDF가 서버에 업로드되나요?", answer: "아니요. 렌더링은 pdf.js로 브라우저 안에서 완전히 실행됩니다: 파일은 디스크에서 읽히고 메모리에서 그려지며 완성 이미지는 기기로 기록됩니다. 아무것도 전송되지 않아 오프라인에서도 작동하고 계약서, 명세서, 신분증 스캔도 안전합니다." },
      { question: "긴 이미지는 PNG와 JPEG 중 무엇을 골라야 하나요?", answer: "텍스트 문서, 양식, 스크린샷은 PNG — 무손실이라 작은 글씨도 날카롭게 유지됩니다. 용량을 크게 줄여야 할 때(스캔 문서, 대용량 업로드를 거부하는 앱 등)는 JPEG. JPEG의 손실 압축은 가는 글씨를 약간 흐리게 만듭니다." },
      { question: "변환이 실패하거나 빈 이미지가 나오는 이유는?", answer: "거의 확실히 브라우저 캔버스 높이 한도 때문입니다. 높은 선명도의 긴 문서는 일부 브라우저가 그릴 수 있는 높이를 초과합니다 — Safari가 가장 엄격합니다. 선명도를 낮추거나(3x → 2x → 1x) PDF를 나눠 각각 변환하세요." },
    ],
  },
};
