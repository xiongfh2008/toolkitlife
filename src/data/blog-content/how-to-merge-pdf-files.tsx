import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> To merge PDF files into one document for free, use <Link href="/tools/merge-pdf" className="text-blue-400 underline">ToolkitLife&apos;s online PDF merger</Link>: drag two or more PDFs into the tool, reorder them with the arrow buttons, and click merge. The combined PDF downloads instantly — no watermark, no signup, no file-size limit, no email required. Because it runs entirely in your browser with no server upload, it works offline and is safe for contracts, invoices, bank statements, and ID scans.</p>
      </aside>

      <section>
        <h2>Why Merge PDF Files?</h2>
        <p>PDFs are the universal format for finished documents — invoices, contracts, applications, receipts, statements, scanned papers, e-books. But real life produces them one at a time: one scan per page from a flatbed scanner, one PDF per invoice from a portal, one download per bank statement. When you actually need to <strong>combine multiple PDF files into one document</strong>, the pain starts: email systems want a single attachment, government portals accept only one file, printers handle one job better than twenty.</p>
        <p>Typical situations where merging pays off immediately:</p>
        <ul>
          <li><strong>Job applications:</strong> merge a cover letter, résumé, and portfolio into a single attachment so HR sees one coherent document.</li>
          <li><strong>Expense reports:</strong> combine dozens of receipt scans into one PDF ordered by date.</li>
          <li><strong>Scanned contracts:</strong> stitch page-by-page scans back into the original document order.</li>
          <li><strong>Study materials:</strong> merge lecture notes, slides, and past exams into one file per course.</li>
          <li><strong>Banking and tax:</strong> twelve monthly statements become one annual PDF that is easy to store and search.</li>
          <li><strong>Legal and compliance:</strong> append exhibits, annexes, and signatures to a main agreement in the right order.</li>
        </ul>
      </section>

      <section>
        <h2>Meet the Free PDF Merger</h2>
        <p>ToolkitLife&apos;s <Link href="/tools/merge-pdf" className="text-blue-400 underline">Merge PDF tool</Link> combines any number of PDFs in the exact order you choose, entirely inside your browser.</p>
        <ToolCTA
          name="Merge PDF"
          href="/tools/merge-pdf"
          description="Combine multiple PDF files into one document in your browser. Free, no watermark, no signup, no file limit. Reorder before merging, download instantly."
        />
        <p>What it does and doesn&apos;t do, plainly:</p>
        <ul>
          <li><strong>Merges unlimited files</strong> — add two PDFs or two hundred; each is appended in full, with all pages preserved.</li>
          <li><strong>Reorders before merging</strong> — arrow buttons move each file up or down, and you can remove a file you added by mistake.</li>
          <li><strong>Shows a page count</strong> — after merging you see the total number of pages in the combined document, a quick sanity check.</li>
          <li><strong>No editing inside pages</strong> — this is a pure merger. It won&apos;t split, compress, or annotate; use the companion tools for that.</li>
        </ul>
      </section>

      <section>
        <h2>How to Merge PDF Files Online for Free (Step by Step)</h2>
        <ol>
          <li><strong>Open the Merge PDF tool</strong> and drag your PDF files into the upload area (or click to browse). Select multiple files at once — order of selection becomes the initial order.</li>
          <li><strong>Arrange the order.</strong> Use the ↑ / ↓ buttons on each entry to move files into the exact sequence you want the pages to appear. Remove any wrong file with ✕.</li>
          <li><strong>Click merge.</strong> Each PDF is loaded, all pages are copied into a new document, and progress is shown per file.</li>
          <li><strong>Download the merged PDF.</strong> The combined file downloads immediately, with a total page count displayed as confirmation.</li>
        </ol>
        <p>That&apos;s the whole flow. No account, no watermark stamped across your pages, no &quot;free tier&quot; page limits, no email address harvested.</p>
      </section>

      <section>
        <h2>Why a Browser-Based PDF Merger Beats Desktop Software</h2>
        <p>The obvious alternative for <strong>combining PDF files</strong> is desktop software — Adobe Acrobat, or the bundled &quot;Print to PDF&quot; tricks, or a viewer&apos;s paid &quot;combine files&quot; wizard. Here&apos;s how an in-browser merger compares:</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">Feature</th>
                <th className="py-2 pr-4">Browser merger</th>
                <th className="py-2">Desktop suites</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Cost</td>
                <td className="py-2 pr-4">Free, no tiers</td>
                <td className="py-2">Subscription or pay-per-feature</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Install needed</td>
                <td className="py-2 pr-4">None</td>
                <td className="py-2">Hundreds of MB to gigabytes</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Privacy</td>
                <td className="py-2 pr-4">Files never leave the device</td>
                <td className="py-2">Local too — but cloud suites sync them</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Watermarks / page caps</td>
                <td className="py-2 pr-4">None</td>
                <td className="py-2">Free tiers often add watermarks or caps</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Works on</td>
                <td className="py-2 pr-4">Any OS with a browser — Windows, Mac, Linux, Chromebook, Android, iPhone</td>
                <td className="py-2">Installed platform only</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Note the privacy row: many &quot;free online PDF mergers&quot; are not like this one — they <em>upload</em> your files to their servers, merge them there, and hand them back. For a school handout that&apos;s fine; for contracts, payslips, medical records, or ID scans it&apos;s a genuine data exposure. A merger that runs client-side has no upload step at all, which is also why there&apos;s no size limit: your device&apos;s memory is the only boundary.</p>
      </section>

      <section>
        <h2>Merging PDFs on Windows, Mac, iPhone, and Android</h2>
        <p>Because the tool is a web page, the same three steps work everywhere:</p>
        <ul>
          <li><strong>Windows:</strong> works in Chrome, Edge, and Firefox — no &quot;print to PDF&quot; workarounds, no third-party installs, no trials that expire.</li>
          <li><strong>Mac:</strong> macOS has a built-in Preview trick for merging, but Preview re-writes files and sometimes mangles form fields and annotations. A page-preserving merger keeps the original page content untouched.</li>
          <li><strong>iPhone / Android:</strong> the tool works in mobile browsers; files picked from the Files app or Downloads merge the same way. No app store download required.</li>
          <li><strong>Chromebook / locked-down work PCs:</strong> if you can open a web page, you can merge PDFs — no admin rights needed.</li>
        </ul>
      </section>

      <section>
        <h2>Getting the Page Order Right</h2>
        <p>The most common mistake when merging PDFs is not the merging — it&apos;s the order. Files merge top-to-bottom as listed, so think about the final document before you click merge:</p>
        <ul>
          <li><strong>Use the arrows deliberately.</strong> Selection dialogs and multi-file pickers hand files over in arbitrary or alphabetical order — always rearrange to your intended reading order.</li>
          <li><strong>Name files to sort themselves.</strong> If you merge the same sets regularly (e.g. monthly statements), prefix filenames with numbers — 01-jan.pdf, 02-feb.pdf — so even the initial order is close.</li>
          <li><strong>Verify with the page count.</strong> After merging, compare the reported total page count against the sum of the source files&apos; pages. If it matches, every page made it through.</li>
          <li><strong>Merge once, keep order.</strong> Re-merging an already-merged file later still preserves page order — just make sure the smaller pieces stay in the list order you want.</li>
        </ul>
      </section>

      <section>
        <h2>Common Merging Scenarios</h2>
        <p><strong>Scanned documents:</strong> scanners that save each page as a separate PDF are the classic case. Scan everything first, then merge in one pass — much faster than scanning into one file page by page and fixing mistakes mid-way.</p>
        <p><strong>Receipts and invoices:</strong> sort by date or by category first. Finance teams usually prefer one PDF per month; job hunters one PDF per application.</p>
        <p><strong>Large assemblies:</strong> appending a 200-page attachment to a main document works exactly like merging two small files — pages are copied, not re-rendered, so quality and fonts stay identical to the originals.</p>
        <p><strong>Forms and annotations:</strong> because merging copies pages as-is, filled form fields, highlights, and comments in the source files carry over into the merged document.</p>
      </section>

      <section>
        <h2>Privacy: Why &quot;No Upload&quot; Matters for PDFs</h2>
        <p>A merged PDF can contain your salary, your signature, your medical history, your address. Uploading such files to an anonymous server just to combine them is an unnecessary risk — data breaches happen, and retention policies are rarely transparent.</p>
        <p>This merger uses PDF libraries that run inside your browser tab via WebAssembly. Your files are read from disk, combined in memory, and written straight back to your Downloads folder. Nothing is transmitted; you can even disconnect from the internet mid-task and it will still work. It&apos;s the reason there&apos;s no per-file or per-day quota — the constraint of online services is their server bill, and here there is no server.</p>
      </section>

      <section>
        <h2>Related PDF Tasks (Split, Compress, Convert)</h2>
        <p>Merging is one of four fundamental PDF operations:</p>
        <ul>
          <li><strong>Merge</strong> — many PDFs into one (this tool).</li>
          <li><strong>Split</strong> — one PDF into many; use it when a merged file needs to be disassembled again, or to extract a page range.</li>
          <li><strong>Compress</strong> — shrink a merged file&apos;s size when it contains scanned pages; scans are where PDFs bloat.</li>
          <li><strong>Convert</strong> — PDF to Word for editing, or images to PDF to create a mergeable document in the first place.</li>
        </ul>
        <p>A practical pipeline for the classic &quot;scan → tidy → send&quot; chore: scan pages, merge them in order, compress if the scans are heavy, then send. Each step is free in the browser with no uploads.</p>
      </section>

      <section>
        <h2>Troubleshooting</h2>
        <p><strong>&quot;Merge button does nothing.&quot;</strong> At least two PDF files must be in the list. Add a second file first.</p>
        <p><strong>&quot;One file fails to load.&quot;</strong> The file is likely corrupted, DRM-protected, or not actually a PDF (some apps export files with a .pdf name but wrong contents). Open it once in a viewer to confirm; if it&apos;s password-protected, unlock it first — merged output can&apos;t be produced from a file that can&apos;t be read.</p>
        <p><strong>&quot;The merged file is huge.&quot;</strong> Merging never re-compresses — it preserves every page exactly. If the sources are heavy scans, run the result through a PDF compressor afterward.</p>
        <p><strong>&quot;Pages are in the wrong order.&quot;</strong> The list order defines page order. Rearrange with the arrows and merge again from the source files — no need to redo any single-file work.</p>
      </section>

      <section>
        <h2>Quick FAQ Recap</h2>
        <ul>
          <li>Is merging PDFs free here? Yes — no watermark, no signup, no page caps, no hidden &quot;premium&quot; merge.</li>
          <li>Are my documents uploaded? No. Everything happens in your browser; nothing is transmitted or stored.</li>
          <li>Is there a file-size or file-count limit? No server means no artificial limits — practical limits are your device&apos;s memory.</li>
          <li>Does merging reduce quality? No. Pages are copied 1:1; text, fonts, images, and form fields stay exactly as they were.</li>
        </ul>
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR：</strong>想免费把多个 PDF 合并成一个文件，用 <Link href="/tools/merge-pdf" className="text-blue-400 underline">ToolkitLife 在线 PDF 合并工具</Link>：把两个或更多 PDF 拖进工具，用箭头按钮排好顺序，点合并即可。合并后的 PDF 立即下载——无水印、无需注册、无文件大小限制、不需要邮箱。全程在浏览器本地完成、不上传服务器，可离线使用，合同、发票、银行流水、证件扫描件都安全。</p>
      </aside>

      <section>
        <h2>为什么需要合并 PDF 文件？</h2>
        <p>PDF 是「成品文档」的通用格式——发票、合同、申请表、收据、流水、扫描件、电子书。但现实生活里它们总是一个个产生：扫描仪每页存一个 PDF、采购系统每张发票一个 PDF、银行每月流水一个文件。当你真的需要<strong>把多个 PDF 合并成一个文档</strong>时，痛点就来了：邮件系统想要单个附件、政务门户只收一个文件、打印机一个任务远比二十个省事。</p>
        <p>几个立刻用得上的场景：</p>
        <ul>
          <li><strong>求职投递：</strong>把求职信、简历、作品集合并成单个附件，HR 看到的是一份完整文档。</li>
          <li><strong>报销单据：</strong>几十张收据扫描件按日期合并成一份 PDF。</li>
          <li><strong>扫描合同：</strong>逐页扫描的文件按原始页序拼接还原。</li>
          <li><strong>学习资料：</strong>讲义、课件、历年试题按课程各合并一份。</li>
          <li><strong>银行与税务：</strong>12 个月的流水变成一份年度 PDF，存储检索都方便。</li>
          <li><strong>法律合规：</strong>把附件、附录、签字页按正确顺序附加到主协议后面。</li>
        </ul>
      </section>

      <section>
        <h2>认识免费 PDF 合并工具</h2>
        <p>ToolkitLife 的<Link href="/tools/merge-pdf" className="text-blue-400 underline">PDF 合并工具</Link>按你选择的顺序合并任意数量的 PDF，全程在浏览器内完成。</p>
        <ToolCTA
          name="PDF 合并工具"
          href="/tools/merge-pdf"
          description="在浏览器里把多个 PDF 文件合并成一个文档。免费、无水印、无需注册、无文件数量限制。合并前可排序，立即下载。"
        />
        <p>它能做什么、不能做什么：</p>
        <ul>
          <li><strong>合并数量无限制</strong>——两个 PDF 还是两百个都行，每个文件完整追加，所有页面保留。</li>
          <li><strong>合并前可排序</strong>——箭头按钮上下移动文件，加错了可以用 ✕ 移除。</li>
          <li><strong>显示总页数</strong>——合并后显示合并文档的总页数，方便快速核对。</li>
          <li><strong>不做页内编辑</strong>——这是纯粹的合并工具，不拆分、不压缩、不批注；那些需求用配套工具。</li>
        </ul>
      </section>

      <section>
        <h2>如何在线免费合并 PDF（分步教程）</h2>
        <ol>
          <li><strong>打开 PDF 合并工具</strong>，把 PDF 文件拖进上传区（或点击选择）。一次可以选多个文件——选择的顺序就是初始顺序。</li>
          <li><strong>调整顺序。</strong>用每项的 ↑ / ↓ 按钮把文件排成你想要的页面顺序，加错的用 ✕ 移除。</li>
          <li><strong>点合并。</strong>逐个加载 PDF，把所有页面复制进新文档，每个文件的进度都会显示。</li>
          <li><strong>下载合并结果。</strong>合并后的文件立即下载，并显示总页数供确认。</li>
        </ol>
        <p>流程就这么简单。没有账号、没有盖在你页面上的水印、没有「免费版」页数限制、不收集邮箱。</p>
      </section>

      <section>
        <h2>为什么浏览器合并比桌面软件更省事</h2>
        <p><strong>合并 PDF 文件</strong>的传统做法是桌面软件——Adobe Acrobat、各种「打印成 PDF」的变通招数，或阅读器里付费的「合并文件」向导。浏览器合并的对比：</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">对比项</th>
                <th className="py-2 pr-4">浏览器合并</th>
                <th className="py-2">桌面套件</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">费用</td>
                <td className="py-2 pr-4">免费，无版本分级</td>
                <td className="py-2">订阅或按功能付费</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">需要安装</td>
                <td className="py-2 pr-4">不需要</td>
                <td className="py-2">几百 MB 到几 GB</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">隐私</td>
                <td className="py-2 pr-4">文件不离开设备</td>
                <td className="py-2">本地也一样——但云端套件会同步</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">水印 / 页数限制</td>
                <td className="py-2 pr-4">无</td>
                <td className="py-2">免费版常加水印或限制</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">适用平台</td>
                <td className="py-2 pr-4">任何有浏览器的系统——Windows、Mac、Linux、Chromebook、安卓、iPhone</td>
                <td className="py-2">仅限已安装的平台</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>注意隐私这一行：很多「免费在线 PDF 合并」并不是这样——它们会把文件<em>上传</em>到自己的服务器、在服务器上合并再传回来。发给同学讲义无所谓；合同、工资单、病历、证件扫描件就是实打实的数据暴露。客户端运行的合并没有上传环节，这也是它没有大小限制的原因：唯一的边界是你设备的内存。</p>
      </section>

      <section>
        <h2>在 Windows、Mac、iPhone、安卓上合并 PDF</h2>
        <p>因为工具就是网页，同样的三步到处通用：</p>
        <ul>
          <li><strong>Windows：</strong>Chrome、Edge、Firefox 都行——不用「打印成 PDF」绕弯，不用装第三方软件，没有会过期的试用。</li>
          <li><strong>Mac：</strong>macOS 自带 Preview（预览）合并招数，但 Preview 会重写文件，有时会弄坏表单域和批注。保页面的合并工具不动原始页面内容。</li>
          <li><strong>iPhone / 安卓：</strong>手机浏览器直接用；从「文件」App 或下载目录选取的文件同样合并。不用下载 App。</li>
          <li><strong>Chromebook / 锁死的办公电脑：</strong>能打开网页就能合并 PDF——不需要管理员权限。</li>
        </ul>
      </section>

      <section>
        <h2>把页面顺序排对</h2>
        <p>合并 PDF 最常见的错误不在合并本身，而在顺序。文件按列表从上到下依次合并，所以点合并之前先想好最终文档：</p>
        <ul>
          <li><strong>刻意用箭头。</strong>文件选择对话框和多选上传交给工具的顺序是随机的或按文件名排序的——务必重排成你的阅读顺序。</li>
          <li><strong>让文件名自己排序。</strong>如果经常合并同一类文件（比如月度流水），给文件名加序号——01-一月.pdf、02-二月.pdf——这样初始顺序就近乎正确。</li>
          <li><strong>用页数核对。</strong>合并后把显示的总页数与各源文件页数之和对比。对得上，说明每一页都进来了。</li>
          <li><strong>一次合并保序。</strong>已合并的文件以后再参与合并仍然保持页序——只要小文件在列表里的顺序正确。</li>
        </ul>
      </section>

      <section>
        <h2>常见合并场景</h2>
        <p><strong>扫描文档：</strong>每页存一个 PDF 的扫描仪是经典案例。先全部扫完，再一次合并——比逐页扫进一个文件、中途出错还要重来快得多。</p>
        <p><strong>收据与发票：</strong>先按日期或类别排好。财务团队通常喜欢每月一份 PDF；求职者一份申请一份 PDF。</p>
        <p><strong>大体量拼接：</strong>把 200 页的附件附加到主文档，和合并两个小文件完全一样——页面是复制而非重新渲染，字体和画质与原件完全一致。</p>
        <p><strong>表单与批注：</strong>因为合并按原样复制页面，源文件里已填写的表单域、高亮和批注都会带进合并后的文档。</p>
      </section>

      <section>
        <h2>隐私：为什么 PDF「不上传」很重要</h2>
        <p>一份合并的 PDF 里可能装着你的工资、签名、病史、住址。仅仅为了合并就把这些文件传到匿名服务器是不必要的风险——数据泄露时有发生，保留策略也很少透明。</p>
        <p>这个合并工具使用的 PDF 库通过 WebAssembly 在你的浏览器标签页里运行。文件从磁盘读入、在内存中合并、直接写回你的下载目录。什么都不发送；中途断网照样能用。这也是没有单文件或每日配额的原因——在线服务的限制来自服务器账单，而这里没有服务器。</p>
      </section>

      <section>
        <h2>相关 PDF 操作（拆分、压缩、转换）</h2>
        <p>合并只是四个基础 PDF 操作之一：</p>
        <ul>
          <li><strong>合并</strong>——多个 PDF 变一个（本工具）。</li>
          <li><strong>拆分</strong>——一个 PDF 变多个；合并后的文件需要重新拆开、或提取某几页时用它。</li>
          <li><strong>压缩</strong>——合并后的文件含扫描页太大时瘦身；扫描件正是 PDF 体积膨胀的元凶。</li>
          <li><strong>转换</strong>——PDF 转 Word 便于编辑；或把图片转成 PDF，制造出可合并的文档。</li>
        </ul>
        <p>经典的「扫描 → 整理 → 发送」流程：扫页面 → 按顺序合并 → 扫描件太大就压缩 → 发送。每一步都在浏览器里免费完成，无需上传。</p>
      </section>

      <section>
        <h2>常见问题排查</h2>
        <p><strong>「合并按钮没反应。」</strong>列表里至少要有两个 PDF 文件。先添加第二个文件。</p>
        <p><strong>「某个文件加载失败。」</strong>文件多半损坏、有 DRM 保护，或者其实不是 PDF（有些软件导出 .pdf 后缀但内容不对）。先用阅读器打开确认；如果加了密码，先解除——读不出来的文件无法参与合并。</p>
        <p><strong>「合并后的文件很大。」</strong>合并从不重新压缩——每一页都原样保留。如果源文件是重型扫描件，把结果再过一遍 PDF 压缩即可。</p>
        <p><strong>「页面顺序不对。」</strong>列表顺序就是页面顺序。用箭头重排后从源文件重新合并——不需要重做任何单文件处理。</p>
      </section>

      <section>
        <h2>快速问答回顾</h2>
        <ul>
          <li>在这里合并 PDF 免费吗？免费——无水印、无注册、无页数上限，没有隐藏的「高级合并」。</li>
          <li>我的文件会被上传吗？不会。一切发生在你的浏览器里，不发送、不存储。</li>
          <li>有文件大小或数量限制吗？没有服务器就没有人为限制——实际上限是你设备的内存。</li>
          <li>合并会降低画质吗？不会。页面 1:1 复制；文字、字体、图片、表单域完全保持原样。</li>
        </ul>
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="概要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> 複数の PDF を無料で1つに結合するには、<Link href="/tools/merge-pdf" className="text-blue-400 underline">ToolkitLife のオンライン PDF 結合ツール</Link>を使います：PDF を2つ以上ドラッグし、矢印ボタンで順序を整えて結合をクリック。結合された PDF はすぐにダウンロードできます——透かしなし、登録不要、ファイルサイズ制限なし、メールアドレス不要。ブラウザ内で完結しサーバーへのアップロードがないため、オフラインでも動作し、契約書・請求書・銀行明細・身分証スキャンも安全です。</p>
      </aside>

      <section>
        <h2>なぜ PDF を結合するのか</h2>
        <p>PDF は完成文書の共通形式です——請求書、契約書、申込書、領収書、明細、スキャン書類、電子書籍。しかし現実には1つずつ生まれます：フラットベッドスキャナは1ページごとに1 PDF、ポータルは請求書ごとに1 PDF、銀行は月ごとに1ファイル。<strong>複数の PDF を1つの文書に結合</strong>する必要が生じたときに苦労が始まります：メールは添付を1つにしたがり、行政ポータルは1ファイルしか受け付けず、印刷は20ジョブより1ジョブの方が楽です。</p>
        <ul>
          <li><strong>求職応募：</strong>職務経歴書・履歴書・ポートフォリオを1つの添付にまとめ、人事に一貫した書類を見せる。</li>
          <li><strong>経費精算：</strong>数十枚の領収書スキャンを日付順に1つの PDF へ。</li>
          <li><strong>スキャンした契約書：</strong>ページごとのスキャンを元の順序に復元。</li>
          <li><strong>学習資料：</strong>講義ノート・スライド・過去問を科目ごとに1ファイルへ。</li>
          <li><strong>銀行・税務：</strong>12か月の明細を1つの年次 PDF に。保存も検索も容易。</li>
          <li><strong>法務・コンプライアンス：</strong>添付資料・付録・署名ページを正しい順序で主契約に追加。</li>
        </ul>
      </section>

      <section>
        <h2>無料 PDF 結合ツールの紹介</h2>
        <p>ToolkitLife の <Link href="/tools/merge-pdf" className="text-blue-400 underline">PDF 結合ツール</Link>は、選んだ順序どおりに任意の数の PDF をブラウザ内で結合します。</p>
        <ToolCTA
          name="PDF 結合"
          href="/tools/merge-pdf"
          description="複数の PDF ファイルをブラウザで1つの文書に結合。無料、透かしなし、登録不要、ファイル数制限なし。結合前に並べ替え、すぐダウンロード。"
        />
        <ul>
          <li><strong>ファイル数無制限で結合</strong>——2つでも200個でも、各ファイルが丸ごと追加され全ページ保持。</li>
          <li><strong>結合前に並べ替え</strong>——矢印ボタンで各ファイルを上下移動、誤って追加したものは ✕ で削除。</li>
          <li><strong>ページ数を表示</strong>——結合後に総ページ数を表示し、即座に整合確認。</li>
          <li><strong>ページ内編集はしない</strong>——純粋な結合ツール。分割・圧縮・注釈は姉妹ツールで。</li>
        </ul>
      </section>

      <section>
        <h2>オンラインで PDF を無料結合する手順</h2>
        <ol>
          <li><strong>PDF 結合ツールを開き</strong>、PDF ファイルをアップロード領域へドラッグ（クリックで選択も可）。複数ファイルを一括選択でき、選択順が初期順になります。</li>
          <li><strong>順序を整える。</strong>各項目の ↑ / ↓ ボタンで目的のページ順に並べ替え、誤りは ✕ で削除。</li>
          <li><strong>結合をクリック。</strong>各 PDF を読み込み、全ページを新文書へコピー。ファイルごとに進捗が表示されます。</li>
          <li><strong>結合結果をダウンロード。</strong>結合ファイルは即座にダウンロードされ、総ページ数が確認として表示されます。</li>
        </ol>
        <p>流れはこれだけ。アカウントも、ページに押し付けられる透かしも、「無料版」のページ制限も、収集されるメールアドレスもありません。</p>
      </section>

      <section>
        <h2>ブラウザ型 PDF 結合がデスクトップソフトに勝る理由</h2>
        <p><strong>PDF を結合する</strong>従来の選択肢はデスクトップソフト——Adobe Acrobat、「PDF として印刷」の裏技、ビューアの有料「ファイル結合」ウィザードです。比較すると：</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">項目</th>
                <th className="py-2 pr-4">ブラウザ結合</th>
                <th className="py-2">デスクトップスイート</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">費用</td>
                <td className="py-2 pr-4">無料、段階なし</td>
                <td className="py-2">サブスクまたは機能ごと課金</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">インストール</td>
                <td className="py-2 pr-4">不要</td>
                <td className="py-2">数百 MB〜数 GB</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">プライバシー</td>
                <td className="py-2 pr-4">端末から出ない</td>
                <td className="py-2">ローカルも同様——ただしクラウド版は同期する</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">透かし・ページ制限</td>
                <td className="py-2 pr-4">なし</td>
                <td className="py-2">無料版は透かしや制限が多い</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">動作環境</td>
                <td className="py-2 pr-4">ブラウザのある全 OS——Windows、Mac、Linux、Chromebook、Android、iPhone</td>
                <td className="py-2">インストールしたプラットフォームのみ</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>プライバシーの行に注目：多くの「無料オンライン PDF 結合」はこれとは違い、ファイルをサーバーに<em>アップロード</em>して結合し返してきます。配布資料ならいいですが、契約書・給与明細・医療記録・身分証スキャンは現実のデータ露出です。クライアントサイドで動く結合にはアップロード工程自体がなく、サイズ制限がないのも同じ理由——唯一の境界は端末のメモリです。</p>
      </section>

      <section>
        <h2>Windows・Mac・iPhone・Android での PDF 結合</h2>
        <p>ツールは Web ページなので、同じ3ステップがどこでも使えます：</p>
        <ul>
          <li><strong>Windows：</strong>Chrome・Edge・Firefox で動作——「PDF として印刷」の回避策も、サードパーティ製インストールも、期限切れトライアルも不要。</li>
          <li><strong>Mac：</strong>macOS の Preview には結合の裏技がありますが、Preview はファイルを書き換え、フォームフィールドや注釈を壊すことがあります。ページを保持する結合は元のページ内容に手を触れません。</li>
          <li><strong>iPhone / Android：</strong>モバイルブラウザでそのまま動作。「ファイル」App やダウンロードから選んだファイルも同じように結合。アプリのダウンロード不要。</li>
          <li><strong>Chromebook / 制限された業務 PC：</strong>Web ページを開けるなら PDF も結合できます——管理者権限不要。</li>
        </ul>
      </section>

      <section>
        <h2>ページ順序を正しく整える</h2>
        <p>PDF 結合で最も多い間違いは結合そのものではなく順序です。ファイルはリストの上から下へ結合されるので、クリック前に最終文書を思い描いてください：</p>
        <ul>
          <li><strong>矢印を意図的に使う。</strong>ファイル選択ダイアログやマルチ選択が渡す順序は任意・五十音順——必ず意図した読書順に並べ替え。</li>
          <li><strong>ファイル名を自己整列させる。</strong>同じセットを定期的に結合するなら（例：月次明細）、ファイル名に番号を付ける——01-1月.pdf、02-2月.pdf——初期順序がほぼ正しくなります。</li>
          <li><strong>ページ数で検証。</strong>結合後に表示された総ページ数を、ソースファイルのページ数の合計と比較。一致すれば全ページが入っています。</li>
          <li><strong>一度の結合で順序維持。</strong>結合済みファイルの再結合でもページ順は保たれます——リスト内の順序を正しく保つのが鍵。</li>
        </ul>
      </section>

      <section>
        <h2>よくある結合シーン</h2>
        <p><strong>スキャン文書：</strong>1ページごとに PDF を保存するスキャナは定番のケースです。まず全部をスキャンし、一括で結合——1ファイルにページごとスキャンして途中でやり直すよりはるかに速い。</p>
        <p><strong>領収書と請求書：</strong>日付やカテゴリで先に並べる。経理は月ごと1 PDF、求職者は応募ごと1 PDF が一般的です。</p>
        <p><strong>大きな結合：</strong>200ページの添付を主文書に追加するのも小さな2ファイルの結合と同じ——ページは再描画でなくコピーされるため、品質とフォントは元のまま。</p>
        <p><strong>フォームと注釈：</strong>結合はページをそのままコピーするため、ソース内の記入済みフォーム・ハイライト・コメントは結合後の文書に引き継がれます。</p>
      </section>

      <section>
        <h2>プライバシー：PDF で「アップロードなし」が重要な理由</h2>
        <p>結合された PDF には給与、署名、病歴、住所が含まれ得ます。結合のためだけにそんなファイルを匿名サーバーへ送るのは不必要なリスクです——漏えいは起き、保存ポリシーはほとんど不透明です。</p>
        <p>この結合ツールは WebAssembly でブラウザタブ内で動く PDF ライブラリを使います。ファイルはディスクから読み込み、メモリ内で結合し、ダウンロードフォルダへ書き戻します。何も送信せず、作業中にネットを切っても動きます。1ファイル・1日あたりの割り当てがないのも同じ理由——オンラインサービスの制限はサーバー費用から来るもので、ここにサーバーはありません。</p>
      </section>

      <section>
        <h2>関連する PDF 操作（分割・圧縮・変換）</h2>
        <p>結合は4つの基本 PDF 操作の1つです：</p>
        <ul>
          <li><strong>結合</strong>——複数の PDF を1つに（このツール）。</li>
          <li><strong>分割</strong>——1つの PDF を複数に。結合ファイルを再分解したりページ範囲を抽出したりするときに。</li>
          <li><strong>圧縮</strong>——スキャンページを含む結合ファイルのサイズ縮小。スキャンこそ PDF が肥大する原因。</li>
          <li><strong>変換</strong>——編集用に PDF から Word へ、あるいは画像から PDF を作って結合可能な文書をまず作る。</li>
        </ul>
        <p>古典的な「スキャン→整理→送信」の流れ：ページをスキャン→順序どおり結合→重ければ圧縮→送信。各ステップがブラウザで無料、アップロードなし。</p>
      </section>

      <section>
        <h2>トラブルシューティング</h2>
        <p><strong>「結合ボタンが反応しない。」</strong>リストには2つ以上の PDF が必要です。まず2つ目を追加してください。</p>
        <p><strong>「あるファイルだけ読み込めない。」</strong>そのファイルは破損している、DRM 保護されている、または実際は PDF ではない（.pdf という名前だが中身が違う）可能性が高いです。ビューアで一度開いて確認。パスワード保護なら先に解除——読めないファイルから結合結果は作れません。</p>
        <p><strong>「結合ファイルが巨大。」</strong>結合は再圧縮しません——全ページをそのまま保持します。ソースが重いスキャンなら、結果を PDF 圧縮に通してください。</p>
        <p><strong>「ページ順が違う。」</strong>リスト順がページ順です。矢印で並べ替えてソースから再結合——単一ファイルの作業をやり直す必要はありません。</p>
      </section>

      <section>
        <h2>クイック FAQ まとめ</h2>
        <ul>
          <li>ここでの PDF 結合は無料？はい——透かしなし、登録なし、ページ上限なし、隠れた「プレミアム結合」もありません。</li>
          <li>文書はアップロードされる？されません。すべてブラウザ内で完結し、送信も保存もありません。</li>
          <li>サイズ・件数制限は？サーバーがないので人為的制限もありません——実用上の上限は端末のメモリです。</li>
          <li>結合で品質は落ちる？落ちません。ページは1対1でコピー。テキスト・フォント・画像・フォームフィールドはそのまま。</li>
        </ul>
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> 여러 PDF를 무료로 하나로 합치려면 <Link href="/tools/merge-pdf" className="text-blue-400 underline">ToolkitLife 온라인 PDF 병합 도구</Link>를 사용하세요: PDF 두 개 이상을 끌어다 놓고, 화살표 버튼으로 순서를 정한 뒤 병합을 클릭합니다. 병합된 PDF는 즉시 다운로드됩니다 — 워터마크 없음, 가입 없음, 파일 크기 제한 없음, 이메일 불필요. 브라우저에서 완전히 처리되어 서버 업로드가 없으므로 오프라인에서도 작동하며 계약서, 송장, 은행 명세서, 신분증 스캔본도 안전합니다.</p>
      </aside>

      <section>
        <h2>PDF 파일을 병합하는 이유</h2>
        <p>PDF는 완성된 문서의 범용 형식입니다 — 송장, 계약서, 신청서, 영수증, 명세서, 스캔 서류, 전자책. 하지만 현실에서는 하나씩 생겨납니다: 스캐너는 페이지마다 PDF 하나, 포털은 송장마다 PDF 하나, 은행은 월별로 파일 하나. <strong>여러 PDF 파일을 하나의 문서로 결합</strong>해야 할 때 고통이 시작됩니다: 이메일은 첨부 하나를 원하고, 정부 포털은 파일 하나만 받고, 프린터는 스무 개 작업보다 하나가 편합니다.</p>
        <ul>
          <li><strong>취업 지원:</strong> 자기소개서, 이력서, 포트폴리오를 하나의 첨부로 합쳐 인사팀이 일관된 문서를 보게 합니다.</li>
          <li><strong>경비 보고서:</strong> 수십 장의 영수증 스캔을 날짜순으로 한 PDF에.</li>
          <li><strong>스캔한 계약서:</strong> 페이지별 스캔을 원래 순서로 되살립니다.</li>
          <li><strong>학습 자료:</strong> 강의 노트, 슬라이드, 기출문제를 과목별로 한 파일에.</li>
          <li><strong>은행·세무:</strong> 12개월 명세가 하나의 연간 PDF로. 보관과 검색이 쉽습니다.</li>
          <li><strong>법무·컴플라이언스:</strong> 증거 서류, 부록, 서명 페이지를 올바른 순서로 본 계약서에 추가.</li>
        </ul>
      </section>

      <section>
        <h2>무료 PDF 병합 도구 소개</h2>
        <p>ToolkitLife의 <Link href="/tools/merge-pdf" className="text-blue-400 underline">PDF 병합 도구</Link>는 선택한 순서 그대로 원하는 만큼의 PDF를 브라우저 안에서 결합합니다.</p>
        <ToolCTA
          name="PDF 병합"
          href="/tools/merge-pdf"
          description="브라우저에서 여러 PDF 파일을 하나의 문서로 결합. 무료, 워터마크 없음, 가입 없음, 파일 수 제한 없음. 병합 전 재정렬, 즉시 다운로드."
        />
        <ul>
          <li><strong>무제한 파일 병합</strong> — 2개든 200개든, 각 파일이 온전히 추가되고 모든 페이지가 보존됩니다.</li>
          <li><strong>병합 전 재정렬</strong> — 화살표 버튼으로 파일을 위아래로 이동, 잘못 추가한 파일은 ✕로 제거.</li>
          <li><strong>페이지 수 표시</strong> — 병합 후 결합 문서의 총 페이지 수를 보여주어 빠르게 검증.</li>
          <li><strong>페이지 내부 편집은 안 함</strong> — 순수 병합 도구. 분할·압축·주석은 자매 도구를 사용하세요.</li>
        </ul>
      </section>

      <section>
        <h2>온라인에서 무료로 PDF 병합하는 방법 (단계별)</h2>
        <ol>
          <li><strong>PDF 병합 도구를 열고</strong> PDF 파일을 업로드 영역으로 드래그(또는 클릭해서 선택). 여러 파일을 한 번에 선택할 수 있으며 선택 순서가 초기 순서가 됩니다.</li>
          <li><strong>순서를 배열.</strong> 각 항목의 ↑ / ↓ 버튼으로 원하는 페이지 순서를 만들고, 잘못된 파일은 ✕로 제거.</li>
          <li><strong>병합 클릭.</strong> 각 PDF를 로드하고 모든 페이지를 새 문서로 복사하며, 파일별 진행률이 표시됩니다.</li>
          <li><strong>병합 결과 다운로드.</strong> 결합 파일이 즉시 다운로드되고 총 페이지 수가 확인용으로 표시됩니다.</li>
        </ol>
        <p>전 흐름이 이게 전부입니다. 계정도, 페이지에 찍히는 워터마크도, &quot;무료 티어&quot; 페이지 제한도, 수집되는 이메일 주소도 없습니다.</p>
      </section>

      <section>
        <h2>브라우저 기반 PDF 병합이 데스크톱 소프트웨어보다 나은 이유</h2>
        <p><strong>PDF 파일을 결합하는</strong> 전통적인 방법은 데스크톱 소프트웨어입니다 — Adobe Acrobat, &quot;PDF로 인쇄&quot; 편법, 뷰어의 유료 &quot;파일 결합&quot; 마법사. 비교하면:</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">항목</th>
                <th className="py-2 pr-4">브라우저 병합</th>
                <th className="py-2">데스크톱 스위트</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">비용</td>
                <td className="py-2 pr-4">무료, 등급 없음</td>
                <td className="py-2">구독 또는 기능별 과금</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">설치 필요</td>
                <td className="py-2 pr-4">없음</td>
                <td className="py-2">수백 MB~수 GB</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">개인정보</td>
                <td className="py-2 pr-4">기기를 떠나지 않음</td>
                <td className="py-2">로컬도 마찬가지 — 단 클라우드 제품은 동기화</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">워터마크 / 페이지 제한</td>
                <td className="py-2 pr-4">없음</td>
                <td className="py-2">무료 티어는 워터마크나 제한이 잦음</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">실행 환경</td>
                <td className="py-2 pr-4">브라우저가 있는 모든 OS — Windows, Mac, Linux, Chromebook, Android, iPhone</td>
                <td className="py-2">설치된 플랫폼만</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>개인정보 행에 주목: 많은 &quot;무료 온라인 PDF 병합기&quot;는 이것과 다릅니다 — 파일을 자기 서버로 <em>업로드</em>해서 거기서 병합하고 돌려줍니다. 수업 자료는 괜찮지만 계약서, 급여 명세서, 의료 기록, 신분증 스캔은 실제 데이터 노출입니다. 클라이언트 측에서 실행되는 병합기에는 업로드 단계 자체가 없고, 크기 제한이 없는 이유도 같습니다 — 유일한 경계는 기기의 메모리입니다.</p>
      </section>

      <section>
        <h2>Windows, Mac, iPhone, Android에서 PDF 병합</h2>
        <p>도구가 웹 페이지이므로 같은 세 단계가 어디서든 작동합니다:</p>
        <ul>
          <li><strong>Windows:</strong> Chrome, Edge, Firefox에서 작동 — &quot;PDF로 인쇄&quot; 편법도, 서드파티 설치도, 만료되는 체험판도 없습니다.</li>
          <li><strong>Mac:</strong> macOS에는 Preview로 병합하는 내장 요술이 있지만 Preview는 파일을 다시 쓰며 양식 필드와 주석을 손상시킬 수 있습니다. 페이지를 보존하는 병합은 원본 페이지 내용을 그대로 둡니다.</li>
          <li><strong>iPhone / Android:</strong> 모바일 브라우저에서 바로 작동. 파일 앱이나 다운로드에서 고른 파일도 같은 방식으로 병합. 앱 스토어 다운로드 불필요.</li>
          <li><strong>Chromebook / 잠긴 회사 PC:</strong> 웹 페이지를 열 수만 있으면 PDF도 병합할 수 있습니다 — 관리자 권한 불필요.</li>
        </ul>
      </section>

      <section>
        <h2>페이지 순서를 제대로 맞추기</h2>
        <p>PDF 병합에서 가장 흔한 실수는 병합이 아니라 순서입니다. 파일은 목록 위에서 아래로 병합되므로 클릭 전에 최종 문서를 상상하세요:</p>
        <ul>
          <li><strong>화살표를 의도적으로 사용.</strong> 파일 선택 대화상자와 다중 선택은 임의 또는 알파벳 순서로 넘깁니다 — 반드시 원하는 읽기 순서로 재배열하세요.</li>
          <li><strong>파일명이 스스로 정렬되게.</strong> 같은 세트를 자주 병합한다면(예: 월별 명세) 파일명에 번호를 붙이세요 — 01-1월.pdf, 02-2월.pdf — 초기 순서도 거의 맞습니다.</li>
          <li><strong>페이지 수로 검증.</strong> 병합 후 표시된 총 페이지 수를 소스 파일 페이지 수의 합과 비교하세요. 일치하면 모든 페이지가 들어간 것입니다.</li>
          <li><strong>한 번 병합, 순서 유지.</strong> 이미 병합된 파일을 나중에 다시 병합해도 페이지 순서는 유지됩니다 — 작은 조각들의 목록 순서만 올바르면 됩니다.</li>
        </ul>
      </section>

      <section>
        <h2>흔한 병합 시나리오</h2>
        <p><strong>스캔 문서:</strong> 페이지마다 PDF를 저장하는 스캐너가 고전적인 경우입니다. 먼저 전부 스캔하고 한 번에 병합 — 한 파일에 페이지별로 스캔하다 중간에 실수를 고치는 것보다 훨씬 빠릅니다.</p>
        <p><strong>영수증과 송장:</strong> 날짜나 카테고리별로 먼저 정렬하세요. 재무팀은 보통 월별 한 PDF, 구직자는 지원별 한 PDF를 선호합니다.</p>
        <p><strong>대형 조립:</strong> 200페이지 첨부를 본 문서에 붙이는 것도 작은 두 파일을 병합하는 것과 같습니다 — 페이지는 다시 렌더링되지 않고 복사되므로 품질과 글꼴이 원본과 동일합니다.</p>
        <p><strong>양식과 주석:</strong> 병합은 페이지를 그대로 복사하므로 소스 파일의 작성된 양식 필드, 형광펜, 메모가 병합 문서로 그대로 넘어갑니다.</p>
      </section>

      <section>
        <h2>개인정보: PDF에서 &quot;업로드 없음&quot;이 중요한 이유</h2>
        <p>병합된 PDF에는 급여, 서명, 병력, 주소가 담길 수 있습니다. 결합하기 위해서만 그런 파일을 익명 서버로 올리는 것은 불필요한 위험입니다 — 유출은 일어나고 보존 정책은 거의 투명하지 않습니다.</p>
        <p>이 병합기는 WebAssembly로 브라우저 탭 안에서 실행되는 PDF 라이브러리를 사용합니다. 파일은 디스크에서 읽히고, 메모리에서 결합되고, 다운로드 폴더로 바로 기록됩니다. 아무것도 전송되지 않으며 작업 중에 인터넷을 끊어도 작동합니다. 파일당·일일 할당량이 없는 이유도 같습니다 — 온라인 서비스의 제한은 서버 요금에서 오고, 여기엔 서버가 없습니다.</p>
      </section>

      <section>
        <h2>관련 PDF 작업 (분할, 압축, 변환)</h2>
        <p>병합은 네 가지 기본 PDF 작업 중 하나입니다:</p>
        <ul>
          <li><strong>병합</strong> — 여러 PDF를 하나로(이 도구).</li>
          <li><strong>분할</strong> — 하나의 PDF를 여러 개로. 병합 파일을 다시 해체하거나 페이지 범위를 추출할 때.</li>
          <li><strong>압축</strong> — 스캔 페이지가 들어 있는 병합 파일의 크기 축소. 스캔본이야말로 PDF가 비대해지는 원인입니다.</li>
          <li><strong>변환</strong> — 편집하려면 PDF를 Word로, 혹은 이미지를 PDF로 만들어 병합 가능한 문서를 먼저 만들기.</li>
        </ul>
        <p>고전적인 &quot;스캔 → 정리 → 전송&quot; 파이프라인: 페이지 스캔 → 순서대로 병합 → 스캔이 무거우면 압축 → 전송. 각 단계가 브라우저에서 무료, 업로드 없이.</p>
      </section>

      <section>
        <h2>문제 해결</h2>
        <p><strong>&quot;병합 버튼이 반응 없어요.&quot;</strong> 목록에 최소 두 개의 PDF가 필요합니다. 먼저 두 번째 파일을 추가하세요.</p>
        <p><strong>&quot;한 파일만 로드 실패.&quot;</strong> 그 파일은 손상되었거나 DRM 보호 중이거나 실제로는 PDF가 아닙니다(.pdf 이름이지만 내용이 다름). 뷰어로 한 번 열어 확인하세요. 비밀번호가 걸려 있으면 먼저 해제 — 읽을 수 없는 파일로는 병합 결과를 만들 수 없습니다.</p>
        <p><strong>&quot;병합 파일이 너무 커요.&quot;</strong> 병합은 재압축하지 않습니다 — 모든 페이지를 그대로 보존합니다. 소스가 무거운 스캔이라면 결과를 PDF 압축기로 한 번 돌리세요.</p>
        <p><strong>&quot;페이지 순서가 틀려요.&quot;</strong> 목록 순서가 곧 페이지 순서입니다. 화살표로 재배열한 뒤 소스 파일에서 다시 병합하세요 — 파일별 작업을 다시 할 필요는 없습니다.</p>
      </section>

      <section>
        <h2>빠른 FAQ 정리</h2>
        <ul>
          <li>여기서 PDF 병합이 무료인가요? 네 — 워터마크 없음, 가입 없음, 페이지 상한 없음, 숨겨진 &quot;프리미엄 병합&quot;도 없습니다.</li>
          <li>문서가 업로드되나요? 아닙니다. 모든 것이 브라우저에서 일어나며 전송도 저장도 없습니다.</li>
          <li>파일 크기나 개수 제한이 있나요? 서버가 없으면 인위적 제한도 없습니다 — 실질적 한계는 기기의 메모리입니다.</li>
          <li>병합하면 품질이 떨어지나요? 아닙니다. 페이지는 1:1로 복사됩니다. 텍스트, 글꼴, 이미지, 양식 필드가 정확히 그대로입니다.</li>
        </ul>
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "How do I merge PDF files for free without a watermark?", answer: "Use a browser-based merger that processes files locally. With ToolkitLife's Merge PDF tool you drag in your PDFs, reorder them with the arrow buttons, and download the combined document — no watermark, no signup, no page limits, and no email address required." },
      { question: "Are my documents uploaded to a server when I merge PDFs online?", answer: "Not with this tool. The merge runs entirely inside your browser using a PDF library compiled to WebAssembly — files are read from disk, combined in memory, and written straight back to your device. Nothing is transmitted, so contracts, payslips, and ID scans stay private, and the tool even works offline." },
      { question: "Is there a file size or page limit when combining PDFs?", answer: "No. Because merging happens on your device rather than on a paid server, there are no artificial per-file or per-day limits. The practical limit is your device's memory — even dozens of large PDFs merge fine on a normal laptop, and the total page count is displayed after merging so you can verify nothing was dropped." },
      { question: "Does merging PDFs reduce quality or lose form fields?", answer: "No. Merging copies every page 1:1 without re-rendering, so text, fonts, images, filled form fields, highlights, and annotations are preserved exactly as they were in the source files. Only the page order changes, and that is the order you set before merging." },
    ],
    zh: [
      { question: "如何免费合并 PDF 且没有水印？", answer: "使用在本地处理文件的浏览器合并工具。ToolkitLife 的 PDF 合并工具只需拖入文件、用箭头按钮排序、下载合并结果——无水印、无需注册、无页数限制、不需要邮箱。" },
      { question: "在线合并 PDF 时我的文档会被上传到服务器吗？", answer: "本工具不会。合并完全在浏览器内通过编译成 WebAssembly 的 PDF 库完成——文件从磁盘读取、在内存中合并、直接写回设备。什么都不发送，合同、工资单、证件扫描件保持私密，断网也能用。" },
      { question: "合并 PDF 有文件大小或页数限制吗？", answer: "没有。因为合并在你的设备上而不是付费服务器上进行，没有人为的单文件或每日限制。实际上限是设备内存——普通笔记本合并几十个大 PDF 毫无压力，合并后还会显示总页数供你核对有没有丢页。" },
      { question: "合并 PDF 会降低画质或丢失表单域吗？", answer: "不会。合并按 1:1 复制每一页、不重新渲染，文字、字体、图片、已填写的表单域、高亮和批注都与源文件完全一致。只有页面顺序会变，而那是你在合并前自己设定的顺序。" },
    ],
    ja: [
      { question: "透かしなしで無料 PDF 結合するには？", answer: "ファイルをローカルで処理するブラウザ型結合ツールを使います。ToolkitLife の PDF 結合ツールなら、PDF をドラッグし、矢印ボタンで並べ替えて結合結果をダウンロード——透かしなし、登録不要、ページ制限なし、メールアドレスも不要です。" },
      { question: "オンラインで PDF を結合すると文書はサーバーにアップロードされますか？", answer: "このツールではされません。結合は WebAssembly にコンパイルされた PDF ライブラリで完全にブラウザ内で実行されます——ファイルはディスクから読み込まれ、メモリ内で結合され、端末に直接書き戻されます。何も送信されないため契約書・給与明細・身分証スキャンも秘密のままで、オフラインでも動作します。" },
      { question: "PDF 結合にファイルサイズやページ数の制限はありますか？", answer: "ありません。結合は有料サーバーではなく端末上で行われるため、人為的なファイル制限や日次制限がありません。実用上の上限は端末のメモリです——普通のノート PC なら数十の大きな PDF も問題なく結合でき、結合後に総ページ数が表示されるので落丁の確認もできます。" },
      { question: "PDF を結合すると品質が落ちたりフォームフィールドが消えたりしますか？", answer: "いいえ。結合は再描画せずに全ページを1対1でコピーするため、テキスト・フォント・画像・記入済みフォーム・ハイライト・注釈はソースファイルのまま保存されます。変わるのはページ順序だけで、それは結合前に自分で設定した順序です。" },
    ],
    ko: [
      { question: "워터마크 없이 무료로 PDF를 병합하려면 어떻게 하나요?", answer: "파일을 로컬에서 처리하는 브라우저 기반 병합기를 사용하세요. ToolkitLife의 PDF 병합 도구는 PDF를 끌어다 놓고 화살표 버튼으로 정렬한 뒤 결합 문서를 다운로드하면 됩니다 — 워터마크 없음, 가입 없음, 페이지 제한 없음, 이메일 불필요." },
      { question: "온라인에서 PDF를 병합하면 문서가 서버에 업로드되나요?", answer: "이 도구는 아닙니다. 병합은 WebAssembly로 컴파일된 PDF 라이브러리로 브라우저 안에서 완전히 실행됩니다 — 파일은 디스크에서 읽히고 메모리에서 결합되고 기기로 바로 기록됩니다. 아무것도 전송되지 않으므로 계약서, 급여 명세서, 신분증 스캔이 비공개로 유지되며 오프라인에서도 작동합니다." },
      { question: "PDF 병합에 파일 크기나 페이지 제한이 있나요?", answer: "없습니다. 병합이 유료 서버가 아닌 기기에서 일어나므로 인위적인 파일당·일일 제한이 없습니다. 실질적 한계는 기기 메모리입니다 — 일반 노트북에서 수십 개의 큰 PDF도 문제없이 병합되며, 병합 후 총 페이지 수가 표시되어 누락 여부를 확인할 수 있습니다." },
      { question: "PDF를 병합하면 품질이 떨어지거나 양식 필드가 사라지나요?", answer: "아닙니다. 병합은 다시 렌더링하지 않고 모든 페이지를 1:1로 복사하므로 텍스트, 글꼴, 이미지, 작성된 양식 필드, 형광펜, 주석이 소스 파일 그대로 보존됩니다. 바뀌는 것은 페이지 순서뿐이며 그것은 병합 전에 직접 설정한 순서입니다." },
    ],
  },
};
