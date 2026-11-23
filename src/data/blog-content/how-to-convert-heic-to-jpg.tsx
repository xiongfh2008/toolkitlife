import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> To convert an iPhone HEIC photo to JPG, use <Link href="/tools/heic" className="text-blue-400 underline">ToolkitLife&apos;s free HEIC to JPG converter</Link>: drop in your .heic file, pick JPG or PNG, and download the converted image — the conversion runs locally in your browser through WebAssembly, so the photo never leaves your device. Expect one file at a time; if a renamed or unusual .heif variant fails, re-export the photo from your album. To avoid HEIC entirely, switch your iPhone camera settings to shoot JPG.</p>
      </aside>

      <section>
        <h2>What Is HEIC, and Why Does Your iPhone Use It?</h2>
        <p>HEIC (High Efficiency Image Container) is the photo format Apple adopted as the default on iPhones since iOS 11. It stores the same picture in roughly half the space of an old-style JPG, supports better 10-bit color, and can bundle live-photo frames and editing metadata into one file. Half the storage for free is a genuinely good deal — which is exactly why Apple switched.</p>
        <p>The problem appears the moment the photo leaves the Apple world. Windows photo viewers of a few years back, many Android gallery apps, older web forms, government upload portals, printing kiosks, and plenty of desktop software still expect JPG. You upload a .heic, and the site answers with a quiet &quot;unsupported file format.&quot; That&apos;s the moment you need a <strong>HEIC to JPG converter</strong>.</p>
        <ul>
          <li><strong>Why HEIC exists:</strong> it&apos;s built on the same HEVC video compression standard, applied to still images — modern codecs squeeze photos harder than 1992-era JPEG.</li>
          <li><strong>Why JPG survives:</strong> it is the closest thing the internet has to a universal picture format. Everything, everywhere, opens it.</li>
          <li><strong>When to convert:</strong> uploading to portals, sharing to non-Apple devices, embedding in websites, attaching to legacy office software, ordering prints.</li>
        </ul>
      </section>

      <section>
        <h2>Meet the Free HEIC to JPG Converter</h2>
        <p>ToolkitLife&apos;s <Link href="/tools/heic" className="text-blue-400 underline">HEIC converter</Link> turns HEIC files into JPG or PNG entirely inside your browser.</p>
        <ToolCTA
          name="HEIC to JPG"
          href="/tools/heic"
          description="Convert iPhone HEIC photos to JPG or PNG in your browser. Free, no signup, no upload — powered by WebAssembly on your own device. Download the JPG instantly."
        />
        <p>What it does and doesn&apos;t do, plainly:</p>
        <ul>
          <li><strong>Local WebAssembly conversion</strong> — the heic2any decoder is compiled to WebAssembly and runs in your browser tab. Your photo is read, decoded, and re-encoded on your own CPU; nothing is uploaded.</li>
          <li><strong>JPG or PNG output</strong> — JPG for universal compatibility and small size, PNG when you need lossless pixels.</li>
          <li><strong>One file at a time</strong> — drop one photo, convert, download, repeat. There is no batch queue in this tool.</li>
          <li><strong>Aimed at .heic files</strong> — the tool targets genuine .heic images. Some .heif containers or files renamed to .heic from other formats may fail to decode.</li>
        </ul>
      </section>

      <section>
        <h2>How to Convert HEIC to JPG (Step by Step)</h2>
        <ol>
          <li><strong>Open the HEIC converter</strong> and drop your .heic file into the upload area (or click to browse). On iPhone, the photo lives in Files after you save it from Photos; on a computer, it&apos;s wherever you copied it.</li>
          <li><strong>Choose the output format.</strong> JPG is the default choice for compatibility; pick PNG only if you need lossless output or transparency handling.</li>
          <li><strong>Click convert.</strong> The WebAssembly decoder unpacks the HEVC-compressed image data and re-encodes it — usually done in a couple of seconds.</li>
          <li><strong>Download the converted image.</strong> The JPG saves straight to your device with the same base filename.</li>
        </ol>
        <p>No account, no watermark, no email — and the original HEIC file stays untouched on your device.</p>
      </section>

      <section>
        <h2>JPG vs PNG for Converted Photos</h2>
        <p>Both formats open everywhere, but they serve different purposes:</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">Aspect</th>
                <th className="py-2 pr-4">JPG</th>
                <th className="py-2">PNG</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Compression</td>
                <td className="py-2 pr-4">Lossy, tuneable quality</td>
                <td className="py-2">Lossless</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">File size (photos)</td>
                <td className="py-2 pr-4">Small — ideal for camera shots</td>
                <td className="py-2">Very large for photographic content</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Compatibility</td>
                <td className="py-2 pr-4">Universal — every device and form accepts it</td>
                <td className="py-2">Universal for viewing, but heavy for uploads</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Best for</td>
                <td className="py-2 pr-4">Sharing, uploading, printing, archiving camera photos</td>
                <td className="py-2">Screenshots, graphics, images needing lossless fidelity</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>For real camera photos — which is what HEIC files are — JPG is almost always the right answer: photographic noise actually compresses well, so quality loss at 90% quality is invisible while the file stays small. PNG only makes sense if the &quot;photo&quot; is actually a screenshot or graphic with flat colors and text.</p>
      </section>

      <section>
        <h2>Privacy: Your Photos Never Leave the Device</h2>
        <p>Photos are among the most personal files people own — and &quot;free online HEIC converters&quot; typically ask you to upload them to an anonymous server, where they are processed, sometimes cached, and governed by retention policies you never see. For vacation pictures that&apos;s a shrug; for ID photos, documents, or family images it&apos;s a real exposure.</p>
        <p>This converter works differently. The HEIC decoder is a WebAssembly build of an open-source library that executes inside your browser tab: your file is read locally, decoded on your CPU, re-encoded to JPG or PNG, and written back to your downloads. Nothing is transmitted — you can disconnect from Wi-Fi mid-conversion and it will still finish. That&apos;s also why there are no quotas: there&apos;s no server paying for your bandwidth.</p>
      </section>

      <section>
        <h2>Honest Limitations (and the Batch Alternative)</h2>
        <p>A converter page that hides its limits isn&apos;t worth trusting, so here they are:</p>
        <ul>
          <li><strong>One photo per conversion.</strong> For a whole album&apos;s worth of files, converting one by one is tedious.</li>
          <li><strong>Batch alternative on iPhone:</strong> the cleanest bulk solution isn&apos;t conversion at all — it&apos;s not creating HEIC files. Open <em>Settings → Camera → Formats → Most Compatible</em> and your iPhone shoots JPG from then on. For existing photos, sharing several from the Photos app to Mail or a chat can auto-convert them to JPG too.</li>
          <li><strong>.heif and renamed files may fail.</strong> The tool decodes genuine .heic images. Some .heif variants, or files that were merely renamed (for example a .jpg renamed to .heic), can&apos;t be decoded — re-export the photo from your album app as a proper image and try again.</li>
          <li><strong>Metadata is not preserved.</strong> Conversion re-encodes pixels; EXIF data like GPS tags may not carry over. That&apos;s often a privacy bonus, but don&apos;t rely on the JPG for geotags.</li>
          <li><strong>Shrinking after converting:</strong> if the resulting JPG is still too large for a portal, run it through the <Link href="/tools/image-compressor" className="text-blue-400 underline">image compressor</Link> to reduce the size further.</li>
        </ul>
      </section>

      <section>
        <h2>Troubleshooting</h2>
        <p><strong>&quot;The file fails to convert.&quot;</strong> First confirm it really is a HEIC: a file renamed from JPG to .heic won&apos;t decode. Genuine .heif containers occasionally fail too — open the photo in the album app and re-export it as an image, then convert the fresh export.</p>
        <p><strong>&quot;Where do I even find the .heic on iPhone?&quot;</strong> Photos are managed inside the Photos app; to get a file copy, open the photo, tap Share → &quot;Save to Files&quot;, and pick a folder. That copy is the .heic you drop into the converter.</p>
        <p><strong>&quot;The JPG looks slightly different.&quot;</strong> HEIC stores 10-bit color that JPG (8-bit) can&apos;t fully represent; subtle gradient shading can shift a hair. For normal photos this is imperceptible.</p>
        <p><strong>&quot;The converted file is too big.&quot;</strong> A full-resolution iPhone photo is a few MB in JPG. Use an image compressor, or resize first, rather than expecting the converter to shrink it.</p>
      </section>

      <section>
        <h2>Quick FAQ Recap</h2>
        <ul>
          <li>Is converting HEIC to JPG free here? Yes — no watermark, no signup, no file caps, no email required.</li>
          <li>Are my photos uploaded? No. The WebAssembly decoder runs in your browser; nothing is transmitted.</li>
          <li>Can I convert many photos at once? Not in this tool — one at a time. On iPhone, switch Camera formats to &quot;Most Compatible&quot; to shoot JPG directly.</li>
          <li>Why does my .heif or renamed file fail? The tool decodes genuine .heic images; re-export the photo from your album app and convert that copy.</li>
        </ul>
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR：</strong>想把 iPhone 的 HEIC 照片转成 JPG，用 <Link href="/tools/heic" className="text-blue-400 underline">ToolkitLife 免费在线 HEIC 转 JPG 工具</Link>：拖入 .heic 文件，选 JPG 或 PNG，下载转换结果——转换通过 WebAssembly 在浏览器本地完成，照片不离开设备。一次处理一张；如果改名过的或特殊的 .heif 变体转换失败，请从相册重新导出后再试。想彻底避开 HEIC，可以在 iPhone 相机设置里改成直接拍 JPG。</p>
      </aside>

      <section>
        <h2>HEIC 是什么？为什么 iPhone 默认用它？</h2>
        <p>HEIC（高效图像容器）是 Apple 从 iOS 11 起默认采用的照片格式。同样的画面，它占用的空间大约只有老式 JPG 的一半，支持更好的 10-bit 色彩，还能把实况照片的帧和编辑元数据打包进同一个文件。免费省一半存储确实是笔划算买卖——这正是 Apple 换格式的原因。</p>
        <p>问题出现在照片离开 Apple 生态的那一刻。几年前的 Windows 看图软件、许多安卓相册应用、老旧的网页表单、政务上传门户、打印店自助机、大量桌面软件，仍然只认 JPG。你传了个 .heic 上去，网站安静地回一句「不支持的文件格式」。这时你就需要一个<strong>HEIC 转 JPG 工具</strong>。</p>
        <ul>
          <li><strong>HEIC 为什么存在：</strong>它基于和 HEVC 视频相同的压缩标准、用在静态图片上——现代编码器对照片的压缩效率远超 1992 年的 JPEG。</li>
          <li><strong>JPG 为什么还活着：</strong>它是互联网上最接近「通用图片格式」的东西。所有设备、所有场景都能打开。</li>
          <li><strong>什么时候要转：</strong>上传门户、分享给非苹果设备、嵌入网页、附加给老办公软件、冲印下单。</li>
        </ul>
      </section>

      <section>
        <h2>认识免费 HEIC 转 JPG 工具</h2>
        <p>ToolkitLife 的 <Link href="/tools/heic" className="text-blue-400 underline">HEIC 转换器</Link>把 HEIC 文件转成 JPG 或 PNG，全程在浏览器内完成。</p>
        <ToolCTA
          name="HEIC 转 JPG"
          href="/tools/heic"
          description="在浏览器里把 iPhone HEIC 照片转成 JPG 或 PNG。免费、无需注册、不上传——由 WebAssembly 在你自己的设备上完成。立即下载 JPG。"
        />
        <p>它能做什么、不能做什么：</p>
        <ul>
          <li><strong>本地 WebAssembly 转换</strong>——heic2any 解码器编译成 WebAssembly 运行在浏览器标签页里。照片在本地读取、解码、重编码；什么都不上传。</li>
          <li><strong>JPG 或 PNG 输出</strong>——JPG 换通用兼容和小体积，PNG 在需要无损像素时用。</li>
          <li><strong>一次一张</strong>——放一张照片、转换、下载、重复。本工具没有批量队列。</li>
          <li><strong>针对真正的 .heic 文件</strong>——工具解码的是真正的 .heic 图像。部分 .heif 容器、或者从其他格式改名成 .heic 的文件可能解码失败。</li>
        </ul>
      </section>

      <section>
        <h2>如何把 HEIC 转成 JPG（分步教程）</h2>
        <ol>
          <li><strong>打开 HEIC 转换器</strong>，把 .heic 文件拖进上传区（或点击选择）。iPhone 上，从「照片」App 通过分享存到「文件」后就能拿到照片文件；电脑上则在你复制的位置。</li>
          <li><strong>选输出格式。</strong>JPG 是兼容性首选；只有需要无损输出时才选 PNG。</li>
          <li><strong>点转换。</strong>WebAssembly 解码器解包 HEVC 压缩的图像数据并重新编码——通常几秒内完成。</li>
          <li><strong>下载转换结果。</strong>JPG 以同名直接保存到设备。</li>
        </ol>
        <p>没有账号、没有水印、不需要邮箱——原始 HEIC 文件在设备上原封不动。</p>
      </section>

      <section>
        <h2>转换后的照片：JPG 还是 PNG</h2>
        <p>两种格式到处都能打开，但用途不同：</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">对比项</th>
                <th className="py-2 pr-4">JPG</th>
                <th className="py-2">PNG</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">压缩方式</td>
                <td className="py-2 pr-4">有损、质量可调</td>
                <td className="py-2">无损</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">照片体积</td>
                <td className="py-2 pr-4">小——适合相机照片</td>
                <td className="py-2">摄影内容下非常大</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">兼容性</td>
                <td className="py-2 pr-4">通用——所有设备和表单都接受</td>
                <td className="py-2">浏览通用，但上传很重</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">适合场景</td>
                <td className="py-2 pr-4">分享、上传、打印、相机照片归档</td>
                <td className="py-2">截图、图形、需要无损保真的图像</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>对真实相机照片——也就是 HEIC 文件的本体——JPG 几乎总是正确答案：摄影噪点其实很好压缩，90% 质量下的损失肉眼不可见，文件还小。PNG 只在「照片」其实是平面色彩和文字为主的截图或图形时才划算。</p>
      </section>

      <section>
        <h2>隐私：照片不离开设备</h2>
        <p>照片是人最私人的文件之一——而「免费在线 HEIC 转换器」通常要你把照片上传到匿名服务器，在那里被处理、有时被缓存、受你永远看不到的保留策略管辖。度假照无所谓；证件照、文件、家庭照片就是实打实的暴露。</p>
        <p>本转换器走另一条路。HEIC 解码器是开源库的 WebAssembly 构建，在你的浏览器标签页里执行：文件本地读取、在你的 CPU 上解码、重编码成 JPG 或 PNG、写回下载目录。什么都不发送——转换中途断开 Wi-Fi 照样能完成。这也是没有配额的原因：没有服务器替你买单带宽。</p>
      </section>

      <section>
        <h2>诚实的限制说明（和批量替代方案）</h2>
        <p>隐瞒限制的转换器不值得信任，所以直接列出：</p>
        <ul>
          <li><strong>每次转换一张照片。</strong>要转换整个相册的文件，一张张来确实繁琐。</li>
          <li><strong>iPhone 上的批量替代方案：</strong>最干净的批量方案根本不是转换——而是不产生 HEIC 文件。打开「设置 → 相机 → 格式 → 兼容性最佳」，之后 iPhone 直接拍 JPG。对已有照片，在照片 App 里多选后通过邮件或聊天分享，常常也会自动转成 JPG。</li>
          <li><strong>.heif 和改名文件可能失败。</strong>工具解码的是真正的 .heic 图像。部分 .heif 变体、或者只是改了名（例如把 .jpg 改名成 .heic）的文件无法解码——请从相册应用把照片重新导出成正规图片文件再转。</li>
          <li><strong>元数据不保留。</strong>转换会重新编码像素；GPS 标签等 EXIF 数据可能不会带过去。这常常是隐私加分项，但别指望 JPG 保留地理标签。</li>
          <li><strong>转换后还想缩小：</strong>如果转出的 JPG 对门户来说还是太大，用 <Link href="/tools/image-compressor" className="text-blue-400 underline">图片压缩工具</Link>进一步减小体积。</li>
        </ul>
      </section>

      <section>
        <h2>常见问题排查</h2>
        <p><strong>「文件转换失败。」</strong>先确认它真的是 HEIC：把 JPG 改名成 .heic 的文件是解不开的。真正的 .heif 容器偶尔也会失败——在相册应用里打开照片重新导出成图片文件，再转换这份新导出。</p>
        <p><strong>「iPhone 上的 .heic 文件到底在哪？」</strong>照片由「照片」App 管理；要拿到文件副本，打开照片、点分享 → 「存储到文件」，选一个文件夹。那份副本就是可以拖进转换器的 .heic。</p>
        <p><strong>「JPG 看起来有一点不一样。」</strong>HEIC 存 10-bit 色彩，JPG（8-bit）无法完整表示；微妙的渐变可能差之毫厘。对普通照片来说肉眼不可察觉。</p>
        <p><strong>「转换出来的文件太大。」</strong>全分辨率的 iPhone 照片转成 JPG 也有几 MB。用图片压缩工具，或先缩放尺寸，而不是指望转换器帮你缩小。</p>
      </section>

      <section>
        <h2>快速问答回顾</h2>
        <ul>
          <li>在这里 HEIC 转 JPG 免费吗？免费——无水印、无注册、无文件上限、不需要邮箱。</li>
          <li>我的照片会被上传吗？不会。WebAssembly 解码器在你的浏览器里运行，不发送任何数据。</li>
          <li>能一次转换多张吗？本工具不行——一次一张。在 iPhone 上把相机格式改成「兼容性最佳」可以直接拍 JPG。</li>
          <li>为什么我的 .heif 或改名文件失败？工具只解码真正的 .heic 图像；从相册重新导出照片后再转换那份文件。</li>
        </ul>
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="概要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> iPhone の HEIC 写真を JPG に変換するには、<Link href="/tools/heic" className="text-blue-400 underline">ToolkitLife の無料 HEIC→JPG 変換ツール</Link>を使います：.heic ファイルをドロップし、JPG か PNG を選んでダウンロード——変換は WebAssembly によりブラウザ内で完結し、写真は端末から出ません。1回に1ファイル。改名済みや特殊な .heif 亜種が失敗する場合は、アルバムから写真を再エクスポートしてから試してください。HEIC 自体を避けたいなら、iPhone のカメラ設定で JPG 撮影に切り替えられます。</p>
      </aside>

      <section>
        <h2>HEIC とは何か、なぜ iPhone は使うのか</h2>
        <p>HEIC（High Efficiency Image Container）は iOS 11 以降、Apple が標準採用した写真形式です。同じ絵を従来の JPG の約半分の容量で保存でき、より良い 10 ビット色に対応し、ライブフォトのフレームや編集メタデータも1ファイルにまとめられます。タダで容量半減は正真正銘のお得——だから Apple は切り替えたのです。</p>
        <p>問題は写真が Apple の世界を出た瞬間に起こります。数年前までの Windows ビューア、多くの Android ギャラリー、古い Web フォーム、行政のアップロードポータル、印刷キオスク、多数のデスクトップソフトはいまだに JPG を期待します。.heic をアップロードすると、サイトは静かに「未対応のファイル形式です」と返す。そこで<strong>HEIC→JPG 変換ツール</strong>の出番です。</p>
        <ul>
          <li><strong>HEIC が存在する理由：</strong>HEVC 動画と同じ圧縮規格を静止画に適用したもの——現代のコーデックは 1992 年生まれの JPEG より写真を圧縮できます。</li>
          <li><strong>JPG が生き残る理由：</strong>インターネットが持つ最も普遍的な画像形式だから。すべての機材・環境で開けます。</li>
          <li><strong>変換が必要なとき：</strong>ポータルへのアップロード、Apple 以外のデバイスへの共有、Web 埋め込み、レガシーなビジネスソフトへの添付、印刷注文。</li>
        </ul>
      </section>

      <section>
        <h2>無料 HEIC→JPG 変換ツールの紹介</h2>
        <p>ToolkitLife の <Link href="/tools/heic" className="text-blue-400 underline">HEIC 変換ツール</Link>は HEIC ファイルを JPG または PNG へ、完全にブラウザ内で変換します。</p>
        <ToolCTA
          name="HEIC→JPG"
          href="/tools/heic"
          description="ブラウザで iPhone の HEIC 写真を JPG/PNG に変換。無料、登録不要、アップロードなし——WebAssembly があなたの端末上で処理。すぐダウンロード。"
        />
        <ul>
          <li><strong>ローカル WebAssembly 変換</strong>——heic2any デコーダは WebAssembly にコンパイルされブラウザタブ内で実行。写真はローカルで読み込み・デコード・再エンコード。アップロードは一切なし。</li>
          <li><strong>JPG / PNG 出力</strong>——互換性と軽さなら JPG、ロスレスが必要なら PNG。</li>
          <li><strong>1回に1枚</strong>——写真を1枚入れて変換、ダウンロード、繰り返し。このツールに一括キューはありません。</li>
          <li><strong>本物の .heic が対象</strong>——ツールがデコードするのは本物の .heic 画像です。一部の .heif コンテナや、他形式から .heic に改名されただけのファイルはデコードに失敗することがあります。</li>
        </ul>
      </section>

      <section>
        <h2>HEIC を JPG に変換する手順</h2>
        <ol>
          <li><strong>HEIC 変換ツールを開き</strong>、.heic ファイルをアップロード領域へドロップ（クリックで選択も可）。iPhone では写真アプリから「ファイルに保存」すれば写真ファイルを取得できます。PC ならコピーした場所に。</li>
          <li><strong>出力形式を選ぶ。</strong>互換性重視の既定は JPG。ロスレス出力が必要なときだけ PNG。</li>
          <li><strong>変換をクリック。</strong>WebAssembly デコーダが HEVC 圧縮の画像データを展開し再エンコード——通常数秒で完了。</li>
          <li><strong>変換結果をダウンロード。</strong>JPG は同じベース名のまま端末へ保存。</li>
        </ol>
        <p>アカウントも透かしもメールも不要——元の HEIC ファイルは端末にそのまま残ります。</p>
      </section>

      <section>
        <h2>変換後の写真：JPG か PNG か</h2>
        <p>両形式ともどこでも開けますが、役割が違います：</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">項目</th>
                <th className="py-2 pr-4">JPG</th>
                <th className="py-2">PNG</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">圧縮</td>
                <td className="py-2 pr-4">非可逆、品質調整可</td>
                <td className="py-2">ロスレス</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">写真のサイズ</td>
                <td className="py-2 pr-4">小——カメラ写真に最適</td>
                <td className="py-2">写真内容では非常に大きい</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">互換性</td>
                <td className="py-2 pr-4">普遍——全機器・全フォームが受付</td>
                <td className="py-2">表示は普遍だがアップロードには重い</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">向いている用途</td>
                <td className="py-2 pr-4">共有・アップロード・印刷・カメラ写真の保管</td>
                <td className="py-2">スクショ・グラフィック・ロスレスが必要な画像</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>本物のカメラ写真——HEIC ファイルの正体——にはほぼ常に JPG が正解です：写真のノイズは実はよく圧縮され、品質 90% の劣化は目視不可でファイルも小さく保てます。PNG が意味を持つのは、その「写真」が実際はフラットな色とテキスト中心のスクショやグラフィックのときだけです。</p>
      </section>

      <section>
        <h2>プライバシー：写真は端末から出ない</h2>
        <p>写真は人が持つ最も個人的なファイルのひとつです——そして「無料オンライン HEIC 変換」はたいてい、匿名サーバーへのアップロードを求めます。そこで処理され、キャッシュされることもあり、あなたが目にしない保持ポリシーに支配されます。旅行写真なら肩をすくめる程度ですが、身分証写真・書類・家族の写真は現実の露出です。</p>
        <p>この変換ツールは別の道を行きます。HEIC デコーダはオープンソースライブラリの WebAssembly ビルドで、ブラウザタブ内で実行されます：ファイルはローカルで読み込まれ、あなたの CPU でデコードされ、JPG/PNG に再エンコードされてダウンロードへ書き戻されます。何も送信せず、変換中に Wi-Fi を切っても完了します。割り当てがないのも同じ理由——帯域の請求を払うサーバーがここにないからです。</p>
      </section>

      <section>
        <h2>正直な制限（と一括処理の代替案）</h2>
        <p>制限を隠す変換ツールは信頼に値しないので、並べます：</p>
        <ul>
          <li><strong>1回の変換は1枚。</strong>アルバム一式を変換するには、1枚ずつの作業が地味に面倒です。</li>
          <li><strong>iPhone での一括代替案：</strong>最もきれいな一括解決策は変換ではなく、HEIC を作らないこと。<em>設定 → カメラ → フォーマット → 互換性優先</em>にすれば、以後 iPhone は JPG で撮影します。既存写真は、写真アプリで複数選択してメールやチャットに共有すると自動で JPG に変換されることも。</li>
          <li><strong>.heif や改名ファイルは失敗することがある。</strong>ツールは本物の .heic をデコードします。一部の .heif 亜種や、単に改名されただけのファイル（例：.jpg を .heic に改名）はデコード不可——アルバムアプリから写真を正規の画像として再エクスポートしてから試してください。</li>
          <li><strong>メタデータは保持されない。</strong>変換はピクセルを再エンコードします；GPS タグなどの EXIF は引き継がれないことがあります。プライバシー的にはプラスですが、JPG に位置情報を期待しないでください。</li>
          <li><strong>変換後にさらに縮小：</strong>出来上がった JPG がポータルに大きすぎるなら、<Link href="/tools/image-compressor" className="text-blue-400 underline">画像圧縮ツール</Link>でさらに軽量化できます。</li>
        </ul>
      </section>

      <section>
        <h2>トラブルシューティング</h2>
        <p><strong>「ファイルが変換できない。」</strong>まず本物の HEIC か確認を：JPG を .heic に改名しただけのファイルはデコードできません。本物の .heif コンテナもたまに失敗します——写真アプリで開いて画像として再エクスポートし、その新ファイルを変換してください。</p>
        <p><strong>「iPhone の .heic はどこにあるの？」</strong>写真は写真アプリ内で管理されています。ファイルのコピーを得るには、写真を開いて共有 → 「ファイルに保存」→ フォルダを選択。そのコピーが変換ツールに入れる .heic です。</p>
        <p><strong>「JPG が微妙に違う気がする。」</strong>HEIC は 10 ビット色を保存しますが JPG（8 ビット）は完全に表現できません；微妙な階調のグラデーションがわずかに動くことがあります。通常の写真では知覚できません。</p>
        <p><strong>「変換後のファイルが大きすぎる。」</strong>フル解像度の iPhone 写真は JPG でも数 MB あります。画像圧縮ツールを使うか、先にリサイズを——変換ツールに縮小は期待しないで。</p>
      </section>

      <section>
        <h2>クイック FAQ まとめ</h2>
        <ul>
          <li>ここでの HEIC→JPG 変換は無料？はい——透かしなし、登録なし、ファイル上限なし、メール不要。</li>
          <li>写真はアップロードされる？されません。WebAssembly デコーダはブラウザ内で実行、送信はゼロ。</li>
          <li>多数の写真を一度に変換できる？このツールでは不可——1枚ずつ。iPhone ならカメラ形式を「互換性優先」にして最初から JPG 撮影を。</li>
          <li>.heif や改名ファイルが失敗するのはなぜ？ツールは本物の .heic をデコードします；アルバムから写真を再エクスポートしてそのコピーを変換してください。</li>
        </ul>
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> iPhone의 HEIC 사진을 JPG로 바꾸려면 <Link href="/tools/heic" className="text-blue-400 underline">ToolkitLife 무료 HEIC→JPG 변환기</Link>를 사용하세요: .heic 파일을 끌어다 놓고, JPG나 PNG를 고른 뒤 다운로드하면 됩니다 — 변환은 WebAssembly로 브라우저 안에서 완전히 처리되며 사진은 기기를 떠나지 않습니다. 한 번에 한 파일씩; 이름을 바꾼 파일이나 특이한 .heif 변형이 실패하면 앨범에서 사진을 다시 내보낸 후 시도하세요. HEIC 자체를 피하려면 iPhone 카메라 설정에서 JPG 촬영으로 바꾸면 됩니다.</p>
      </aside>

      <section>
        <h2>HEIC란 무엇이고, 왜 iPhone이 쓰는가</h2>
        <p>HEIC(High Efficiency Image Container)는 iOS 11부터 Apple이 기본으로 채택한 사진 형식입니다. 같은 그림을 구식 JPG의 절반 정도 용량으로 저장하고, 더 나은 10비트 색상을 지원하며, 라이브 포토 프레임과 편집 메타데이터까지 한 파일에 담습니다. 공짜로 저장 공간 절반이란 진짜 좋은 조건 — 그래서 Apple이 갈아탄 것입니다.</p>
        <p>문제는 사진이 Apple 세계를 벗어나는 순간 시작됩니다. 몇 년 전의 Windows 뷰어, 수많은 안드로이드 갤러리 앱, 오래된 웹 폼, 정부 업로드 포털, 인쇄 키오스크, 수많은 데스크톱 소프트웨어는 여전히 JPG를 기대합니다. .heic을 올리면 사이트가 조용히 &quot;지원하지 않는 파일 형식&quot;이라 답하죠. 바로 그때 <strong>HEIC→JPG 변환기</strong>가 필요합니다.</p>
        <ul>
          <li><strong>HEIC가 존재하는 이유:</strong> HEVC 동영상과 같은 압축 표준을 정지 이미지에 적용한 것 — 현대 코덱은 1992년생 JPEG보다 사진을 훨씬 잘 압축합니다.</li>
          <li><strong>JPG가 살아남은 이유:</strong> 인터넷이 가진 가장 보편적인 그림 형식이기 때문. 모든 기기, 모든 곳에서 열립니다.</li>
          <li><strong>변환이 필요한 때:</strong> 포털 업로드, 비(非)Apple 기기 공유, 웹 삽입, 레거시 오피스 소프트웨어 첨부, 사진 인화 주문.</li>
        </ul>
      </section>

      <section>
        <h2>무료 HEIC→JPG 변환기 소개</h2>
        <p>ToolkitLife의 <Link href="/tools/heic" className="text-blue-400 underline">HEIC 변환기</Link>는 HEIC 파일을 JPG 또는 PNG로 브라우저 안에서 완전히 변환합니다.</p>
        <ToolCTA
          name="HEIC→JPG"
          href="/tools/heic"
          description="브라우저에서 iPhone HEIC 사진을 JPG/PNG로 변환. 무료, 가입 없음, 업로드 없음 — WebAssembly가 기기에서 직접 처리. 즉시 JPG 다운로드."
        />
        <ul>
          <li><strong>로컬 WebAssembly 변환</strong> — heic2any 디코더가 WebAssembly로 컴파일되어 브라우저 탭 안에서 실행됩니다. 사진은 로컬에서 읽히고, 디코딩되고, 다시 인코딩됩니다. 업로드는 없습니다.</li>
          <li><strong>JPG 또는 PNG 출력</strong> — 호환성과 작은 용량은 JPG, 무손실 픽셀이 필요하면 PNG.</li>
          <li><strong>한 번에 한 장</strong> — 사진 한 장 넣고, 변환하고, 내려받고, 반복. 이 도구에는 일괄 대기열이 없습니다.</li>
          <li><strong>진짜 .heic 파일 대상</strong> — 도구가 디코딩하는 것은 진짜 .heic 이미지입니다. 일부 .heif 컨테이너나 다른 형식에서 .heic으로 이름만 바꾼 파일은 디코딩에 실패할 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2>HEIC를 JPG로 변환하는 방법 (단계별)</h2>
        <ol>
          <li><strong>HEIC 변환기를 열고</strong> .heic 파일을 업로드 영역으로 드래그(또는 클릭해서 선택). iPhone에서는 사진 앱에서 공유 → &quot;파일로 저장&quot;하면 사진 파일을 얻을 수 있고, PC라면 복사해 둔 위치에 있습니다.</li>
          <li><strong>출력 형식을 고르세요.</strong> 호환성 기본값은 JPG. 무손실 출력이 필요할 때만 PNG.</li>
          <li><strong>변환 클릭.</strong> WebAssembly 디코더가 HEVC 압축 이미지 데이터를 풀어 다시 인코딩합니다 — 보통 몇 초면 끝납니다.</li>
          <li><strong>변환 결과를 다운로드.</strong> JPG가 같은 기본 이름으로 기기에 바로 저장됩니다.</li>
        </ol>
        <p>계정도 워터마크도 이메일도 없습니다 — 원본 HEIC 파일은 기기에 그대로 남습니다.</p>
      </section>

      <section>
        <h2>변환한 사진: JPG vs PNG</h2>
        <p>두 형식 모두 어디서든 열리지만 목적이 다릅니다:</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">항목</th>
                <th className="py-2 pr-4">JPG</th>
                <th className="py-2">PNG</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">압축</td>
                <td className="py-2 pr-4">손실, 품질 조절 가능</td>
                <td className="py-2">무손실</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">사진 용량</td>
                <td className="py-2 pr-4">작음 — 카메라 사진에 적합</td>
                <td className="py-2">사진 콘텐츠에서 매우 큼</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">호환성</td>
                <td className="py-2 pr-4">보편적 — 모든 기기와 양식이 수용</td>
                <td className="py-2">보기는 보편적이나 업로드엔 무거움</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">적합한 용도</td>
                <td className="py-2 pr-4">공유, 업로드, 인화, 카메라 사진 보관</td>
                <td className="py-2">스크린샷, 그래픽, 무손실이 필요한 이미지</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>진짜 카메라 사진 — HEIC 파일의 본체 — 에는 거의 항상 JPG가 답입니다: 사진 노이즈는 사실 압축이 잘 되어 90% 품질의 손실은 눈에 보이지 않으면서 파일은 작게 유지됩니다. PNG가 의미를 갖는 것은 그 &quot;사진&quot;이 실제로는 단색과 텍스트 위주의 스크린샷이나 그래픽일 때뿐입니다.</p>
      </section>

      <section>
        <h2>개인정보: 사진은 기기를 떠나지 않습니다</h2>
        <p>사진은 사람이 가진 가장 개인적인 파일 중 하나입니다 — 그리고 &quot;무료 온라인 HEIC 변환기&quot;는 대개 익명 서버로 업로드할 것을 요구합니다. 거기서 처리되고, 때론 캐시되고, 당신이 볼 수 없는 보존 정책의 지배를 받죠. 여행 사진은 어깨를 으쓱할 일이지만 신분증 사진, 서류, 가족 사진은 실제 노출입니다.</p>
        <p>이 변환기는 다른 길을 갑니다. HEIC 디코더는 오픈소스 라이브러리의 WebAssembly 빌드로 브라우저 탭 안에서 실행됩니다: 파일은 로컬에서 읽히고, 당신의 CPU에서 디코딩되고, JPG/PNG로 다시 인코딩되어 다운로드로 기록됩니다. 아무것도 전송되지 않으며 — 변환 중에 Wi-Fi를 끊어도 끝까지 완료됩니다. 할당량이 없는 이유도 같습니다. 당신의 대역폭 요금을 지불할 서버가 여기엔 없습니다.</p>
      </section>

      <section>
        <h2>정직한 한계 (그리고 일괄 처리 대안)</h2>
        <p>한계를 숨기는 변환기는 신뢰할 가치가 없으므로 나열합니다:</p>
        <ul>
          <li><strong>변환당 사진 한 장.</strong> 앨범 통째로 변환하려면 하나씩 하는 게 은근히 번거롭습니다.</li>
          <li><strong>iPhone의 일괄 대안:</strong> 가장 깔끔한 일괄 해법은 변환이 아니라 HEIC를 아예 만들지 않는 것입니다. <em>설정 → 카메라 → 포맷 → 대부분의 기기와 호환</em>으로 바꾸면 이후 iPhone은 JPG로 촬영합니다. 기존 사진은 사진 앱에서 여러 장 선택해 메일이나 채팅으로 공유하면 자동으로 JPG로 변환되기도 합니다.</li>
          <li><strong>.heif와 이름 변경 파일은 실패할 수 있음.</strong> 도구는 진짜 .heic 이미지를 디코딩합니다. 일부 .heif 변형이나 단순히 이름만 바꾼 파일(예: .jpg를 .heic으로)은 디코딩이 안 됩니다 — 앨범 앱에서 사진을 정식 이미지로 다시 내보낸 뒤 변환하세요.</li>
          <li><strong>메타데이터는 보존되지 않음.</strong> 변환은 픽셀을 다시 인코딩합니다; GPS 태그 같은 EXIF는 넘어가지 않을 수 있습니다. 개인정보 측면에선 플러스지만 JPG에 위치 태그를 기대하지 마세요.</li>
          <li><strong>변환 후 더 줄이기:</strong> 결과 JPG가 포털에 여전히 너무 크다면 <Link href="/tools/image-compressor" className="text-blue-400 underline">이미지 압축기</Link>로 한 번 더 줄이세요.</li>
        </ul>
      </section>

      <section>
        <h2>문제 해결</h2>
        <p><strong>&quot;파일이 변환 안 돼요.&quot;</strong> 먼저 진짜 HEIC인지 확인하세요: JPG를 .heic으로 이름만 바꾼 파일은 디코딩되지 않습니다. 진짜 .heif 컨테이너도 가끔 실패합니다 — 사진 앱에서 열어 이미지로 다시 내보내고 그 새 파일을 변환하세요.</p>
        <p><strong>&quot;iPhone에서 .heic 파일은 어디 있나요?&quot;</strong> 사진은 사진 앱 안에서 관리됩니다. 파일 사본을 얻으려면 사진을 열고 공유 → &quot;파일로 저장&quot; → 폴더 선택. 그 사본이 변환기에 넣을 .heic입니다.</p>
        <p><strong>&quot;JPG가 아주 조금 다르게 보여요.&quot;</strong> HEIC는 10비트 색상을 저장하지만 JPG(8비트)는 완전히 표현할 수 없습니다; 미묘한 그라데이션이 아주 조금 변할 수 있습니다. 일반 사진에서는 지각 불가능합니다.</p>
        <p><strong>&quot;변환된 파일이 너무 커요.&quot;</strong> 풀 해상도 iPhone 사진은 JPG로도 몇 MB입니다. 이미지 압축기를 쓰거나 먼저 크기를 줄이세요 — 변환기에 축소를 기대하지 마세요.</p>
      </section>

      <section>
        <h2>빠른 FAQ 정리</h2>
        <ul>
          <li>여기서 HEIC→JPG 변환이 무료인가요? 네 — 워터마크 없음, 가입 없음, 파일 상한 없음, 이메일 불필요.</li>
          <li>사진이 업로드되나요? 아닙니다. WebAssembly 디코더가 브라우저 안에서 실행되며 전송은 없습니다.</li>
          <li>여러 장을 한 번에 변환할 수 있나요? 이 도구는 불가 — 한 장씩. iPhone이면 카메라 포맷을 &quot;대부분의 기기와 호환&quot;으로 바꿔 처음부터 JPG로 찍으세요.</li>
          <li>.heif나 이름 변경 파일이 실패하는 이유는? 도구는 진짜 .heic만 디코딩합니다; 앨범에서 사진을 다시 내보내 그 사본을 변환하세요.</li>
        </ul>
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "How do I convert an iPhone HEIC photo to JPG?", answer: "Use a browser-based converter. With ToolkitLife's HEIC to JPG tool you drop in your .heic file, choose JPG or PNG, and download the result — the conversion runs locally in your browser through WebAssembly, so the photo never leaves your device and there's no signup, watermark, or upload." },
      { question: "Are my photos uploaded to a server when converting HEIC online?", answer: "Not with this tool. The HEIC decoder is a WebAssembly build of an open-source library running inside your browser tab: the photo is read locally, decoded on your CPU, and re-encoded to JPG or PNG on your device. Nothing is transmitted — it even works with Wi-Fi turned off." },
      { question: "Should I convert HEIC to JPG or PNG?", answer: "For real camera photos, JPG is almost always right: photographic content compresses well, so quality loss at 90% quality is invisible while the file stays small. PNG is only worth choosing for screenshots or graphics with flat colors, where lossless pixels matter more than file size." },
      { question: "Why does my .heif or renamed .heic file fail to convert?", answer: "The tool decodes genuine .heic images. Some .heif container variants fail, and files that were merely renamed from another format (like a .jpg renamed to .heic) can't be decoded at all. Open the photo in your album app, re-export it as a proper image file, and convert that fresh copy." },
    ],
    zh: [
      { question: "如何把 iPhone 的 HEIC 照片转成 JPG？", answer: "使用浏览器端转换工具。ToolkitLife 的 HEIC 转 JPG 工具只需拖入 .heic 文件、选 JPG 或 PNG、下载结果——转换通过 WebAssembly 在浏览器本地完成，照片不离开设备，也没有注册、水印和上传。" },
      { question: "在线转换 HEIC 时照片会被上传到服务器吗？", answer: "本工具不会。HEIC 解码器是开源库的 WebAssembly 构建，运行在你的浏览器标签页里：照片本地读取、在你的 CPU 上解码、在设备上重编码成 JPG 或 PNG。什么都不发送——关掉 Wi-Fi 也能转换。" },
      { question: "HEIC 应该转成 JPG 还是 PNG？", answer: "真实相机照片几乎总是选 JPG：摄影内容压缩效果好，90% 质量下的损失肉眼不可见，文件还小。PNG 只在截图或平面色彩为主的图形时值得选——那种场景无损像素比体积更重要。" },
      { question: "为什么我的 .heif 或改名的 .heic 文件转换失败？", answer: "工具解码的是真正的 .heic 图像。部分 .heif 容器变体会失败，从其他格式改名而来的文件（例如把 .jpg 改名成 .heic）完全无法解码。请在相册应用里打开照片、重新导出成正规图片文件，再转换这份新副本。" },
    ],
    ja: [
      { question: "iPhone の HEIC 写真を JPG に変換するには？", answer: "ブラウザ型の変換ツールを使います。ToolkitLife の HEIC→JPG ツールなら、.heic ファイルをドロップし、JPG か PNG を選んでダウンロード——変換は WebAssembly によりブラウザ内でローカルに実行され、写真は端末から出ず、登録・透かし・アップロードもありません。" },
      { question: "オンラインで HEIC を変換すると写真はサーバーにアップロードされますか？", answer: "このツールではされません。HEIC デコーダはオープンソースライブラリの WebAssembly ビルドで、ブラウザタブ内で実行されます：写真はローカルで読み込まれ、あなたの CPU でデコードされ、端末上で JPG/PNG に再エンコードされます。何も送信されず——Wi-Fi を切っていても動きます。" },
      { question: "HEIC は JPG と PNG のどちらに変換すべき？", answer: "本物のカメラ写真ならほぼ常に JPG が正解です：写真コンテンツはよく圧縮され、品質 90% の劣化は目視できずファイルも小さく保てます。PNG を選ぶ価値があるのは、ロスレス画素が容量より重要なスクショやフラット色のグラフィックだけです。" },
      { question: ".heif や改名した .heic ファイルが変換に失敗するのはなぜ？", answer: "ツールは本物の .heic 画像をデコードします。一部の .heif コンテナ亜種は失敗し、他形式から名前を変えただけのファイル（例：.jpg を .heic に改名）はデコード自体が不可能です。アルバムアプリで写真を開き、正規の画像ファイルとして再エクスポートしてから、その新副本を変換してください。" },
    ],
    ko: [
      { question: "iPhone의 HEIC 사진을 JPG로 변환하려면 어떻게 하나요?", answer: "브라우저 기반 변환기를 사용하세요. ToolkitLife의 HEIC→JPG 도구는 .heic 파일을 놓고 JPG나 PNG를 고른 뒤 결과를 다운로드하면 됩니다 — 변환은 WebAssembly로 브라우저 안에서 로컬 실행되며 사진은 기기를 떠나지 않고 가입, 워터마크, 업로드도 없습니다." },
      { question: "온라인에서 HEIC를 변환하면 사진이 서버에 업로드되나요?", answer: "이 도구는 아닙니다. HEIC 디코더는 오픈소스 라이브러리의 WebAssembly 빌드로 브라우저 탭 안에서 실행됩니다: 사진은 로컬에서 읽히고, 당신의 CPU에서 디코딩되고, 기기에서 JPG/PNG로 다시 인코딩됩니다. 아무것도 전송되지 않으며 — Wi-Fi를 꺼도 작동합니다." },
      { question: "HEIC는 JPG와 PNG 중 무엇으로 변환해야 하나요?", answer: "진짜 카메라 사진이라면 거의 항상 JPG가 답입니다: 사진 콘텐츠는 압축이 잘 되어 90% 품질의 손실은 눈에 보이지 않으면서 파일은 작게 유지됩니다. PNG를 고를 가치가 있는 것은 무손실 픽셀이 용량보다 중요한 스크린샷이나 단색 그래픽뿐입니다." },
      { question: ".heif나 이름을 바꾼 .heic 파일이 변환에 실패하는 이유는?", answer: "도구는 진짜 .heic 이미지를 디코딩합니다. 일부 .heif 컨테이너 변형은 실패하고, 다른 형식에서 이름만 바꾼 파일(예: .jpg를 .heic으로)은 디코딩 자체가 불가능합니다. 앨범 앱에서 사진을 열어 정식 이미지 파일로 다시 내보낸 뒤 그 새 사본을 변환하세요." },
    ],
  },
};
