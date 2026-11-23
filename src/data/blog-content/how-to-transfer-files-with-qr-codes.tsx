import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> To transfer files between devices using QR codes, open <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">ToolkitLife&apos;s QR File Transfer tool</Link> on both devices: the sender picks a file or text and displays an endless animated QR stream; the receiver opens the camera and points it at the screen. The fountain-coded stream reassembles into the exact file, verified by a SHA-256 checksum — no internet, no accounts, no cable, no cloud. Files up to 64 MB work; transfer speed is roughly tens of KB per second, so keep the phones steady and the screen bright.</p>
      </aside>

      <section>
        <h2>When Would You Transfer Files with QR Codes?</h2>
        <p>It sounds like a party trick until you hit the situation where it&apos;s the <em>only</em> option. Networks are not always available — and not always allowed:</p>
        <ul>
          <li><strong>No Wi-Fi, no data:</strong> a laptop with files to move and a phone with a camera, and neither has usable internet — hotel TV-room, basement workshop, airplane, countryside.</li>
          <li><strong>Air-gapped or restricted networks:</strong> corporate or school machines where file sharing services, email attachments, and USB drives are blocked, but a browser page still loads.</li>
          <li><strong>Cross-platform one-offs:</strong> getting a file from an iPhone to an Android TV, or from a locked-down work PC to your personal phone, without installing any app or logging into anything.</li>
          <li><strong>Privacy-critical snippets:</strong> a password, a recovery key, or an account number you don&apos;t want typed, messaged, or emailed — you want it to travel as light, literally.</li>
        </ul>
        <p>In all of these, the transfer medium becomes the screen and the camera: one device displays, the other watches. Nothing in between.</p>
      </section>

      <section>
        <h2>Meet the QR File Transfer Tool</h2>
        <p>ToolkitLife&apos;s <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">QR File Transfer tool</Link> moves files or text between two devices through an animated QR code stream, entirely in the browser.</p>
        <ToolCTA
          name="QR File Transfer"
          href="/tools/qr-file-transfer"
          description="Send files between devices with animated QR codes. No internet, no accounts, no cloud — data travels as light from one screen to another camera. Up to 64 MB, SHA-256 verified."
        />
        <p>What it does and doesn&apos;t do, plainly:</p>
        <ul>
          <li><strong>Sender side:</strong> pick a file (up to 64 MB) or type a text snippet; the tool encodes it into a continuous stream of animated QR codes.</li>
          <li><strong>Receiver side:</strong> open the camera view and aim it at the sending screen; frames are decoded continuously in background workers.</li>
          <li><strong>Fountain codes:</strong> the data is split into coded packets in a way that lets the receiver reassemble the file from <em>any</em> sufficiently large set of frames — order doesn&apos;t matter, and missed frames are simply replaced by later ones.</li>
          <li><strong>SHA-256 verification:</strong> when enough frames are collected, the reassembled file is checksum-verified; the transfer reports success only if the hash matches the original.</li>
          <li><strong>One direction at a time:</strong> it&apos;s a one-way pipe — sender to receiver. For the reverse direction, swap roles.</li>
        </ul>
      </section>

      <section>
        <h2>How It Works: Light as the Transport Layer</h2>
        <p>The clever parts are invisible, but worth one paragraph so you trust the result:</p>
        <ul>
          <li><strong>Animated QR stream:</strong> a single QR code holds only a few KB, so the tool shows a continuous animation — each frame carries a small slice of the file.</li>
          <li><strong>Fountain coding (LT codes):</strong> rather than sending fixed chunk #1, #2, #3..., the sender broadcasts an endless stream of <em>coded</em> packets. The receiver doesn&apos;t care which frames it catches — once it has enough (roughly the file size divided by packet size, plus a little overhead), it can reconstruct the complete original. You can start watching mid-stream; nothing is lost.</li>
          <li><strong>Local QR decoding:</strong> the receiver decodes frames with a WebAssembly QR decoder running in web workers, so camera frames are processed continuously without freezing the page.</li>
          <li><strong>Integrity check:</strong> the final bytes are hashed with SHA-256 and compared against the sender&apos;s declared hash. A mismatch is reported — QR decoding is fast but not infallible, and the checksum is the guarantee.</li>
        </ul>
      </section>

      <section>
        <h2>How to Transfer a File with QR Codes (Step by Step)</h2>
        <ol>
          <li><strong>Open the tool on both devices</strong> — the sending device and the receiving device each open <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">the QR File Transfer page</Link> in a browser. No app, no login, no network needed after the page loads.</li>
          <li><strong>On the sender, choose what to send.</strong> Pick a file (up to 64 MB) or paste/type a text snippet, then start the stream. An animated sequence of QR codes fills the screen.</li>
          <li><strong>On the receiver, open the camera.</strong> Grant camera permission when the browser asks, then aim the camera at the sending screen. Keep the two devices a comfortable distance apart so the whole QR code is in frame.</li>
          <li><strong>Hold steady and wait.</strong> A progress indicator grows as usable frames are collected. The fountain decoder needs a bit more data than the raw file size, so expect the stream to run somewhat longer than one &quot;pass&quot; of the file.</li>
          <li><strong>Confirm and download.</strong> When the SHA-256 check passes, the receiver shows the file (or text) and a download button. Done — no bytes ever touched a network.</li>
        </ol>
      </section>

      <section>
        <h2>Speed and the 64 MB Limit, Honestly</h2>
        <p>QR transport is wonderfully cable-free and painfully slow by network standards. A large QR code carries roughly 1–3 KB per frame, and a phone camera decodes a handful of frames per second at best. The practical throughput lands around tens of KB per second — a 2 MB photo takes a couple of minutes, a 20 MB video chunk takes substantially longer.</p>
        <ul>
          <li><strong>Right-sized jobs:</strong> passwords, keys, links, documents, a handful of photos — QR transfer is genuinely convenient for these.</li>
          <li><strong>Wrong-sized jobs:</strong> gigabyte videos and photo libraries — use a cable, a local network, or a cloud drive instead; QR would take hours.</li>
          <li><strong>The 64 MB cap:</strong> the tool refuses files beyond 64 MB — beyond that size, the fountain decoder&apos;s bookkeeping and the sheer frame count make the transfer impractical in a browser.</li>
        </ul>
      </section>

      <section>
        <h2>Security: What QR Transfer Protects Against — and What It Doesn&apos;t</h2>
        <p>The honest security story has two sides:</p>
        <ul>
          <li><strong>No server, no wiretap-in-the-middle:</strong> the data travels as modulated light between two screens. There is no server receiving a copy, no network packet to intercept, and no account to subpoena. Within the line between the two screens, nothing exists to hack.</li>
          <li><strong>But light is not private light:</strong> anyone (or any camera) with a clear view of the sending screen during the transfer sees the same QR stream. An onlooker, a ceiling camera, or a video call aimed at your screen can capture the frames and reconstruct the file. QR transfer is eavesdropper-resistant <em>only in a trusted environment</em> — a private room, not a public café table or a screen visible through a window.</li>
          <li><strong>No encryption claim:</strong> treat the stream like a broadcast. If the content is a password or recovery key, transfer it where no other camera can see the screen, and clear the stream when done.</li>
        </ul>
        <p>Used in a trusted setting, the threat model is excellent: the two devices exchange data with zero infrastructure in between, and the SHA-256 check catches any corruption. Used in public, it&apos;s a whiteboard — readable by whoever&apos;s looking.</p>
      </section>

      <section>
        <h2>Troubleshooting Slow or Failing Transfers</h2>
        <p><strong>&quot;Progress crawls or stalls.&quot;</strong> Screen glare and dim brightness are the usual culprits. Raise the sender&apos;s screen brightness, reduce reflections (tilt slightly if there&apos;s glare), and darken the room if possible.</p>
        <p><strong>&quot;The camera can&apos;t hold focus.&quot;</strong> Move the devices closer or further until the QR fills a good part of the viewfinder but stays sharp; avoid extreme angles — aim for roughly perpendicular.</p>
        <p><strong>&quot;Shaky hands ruin the frames.&quot;</strong> Prop the receiving phone against something, or lay both devices on a table. Stability is the single biggest speed factor.</p>
        <p><strong>&quot;It almost finishes, then stalls.&quot;</strong> The last few percent of fountain-coded data still needs new frames — keep the stream running and the camera steady; missed frames get replaced by later coded ones.</p>
        <p><strong>&quot;Checksum failed.&quot;</strong> Rare, but possible with heavily corrupted frames. Restart the transfer; if it recurs, reduce the bytes-per-frame setting so each QR code carries less data and decodes more reliably.</p>
      </section>

      <section>
        <h2>Quick FAQ Recap</h2>
        <ul>
          <li>Do both devices need internet? No — after the page loads, the whole transfer runs offline. That&apos;s the point.</li>
          <li>Is my file uploaded anywhere? No. There is no server; the data crosses the gap between the two screens as QR codes.</li>
          <li>How big can the file be? Up to 64 MB, and expect minutes, not seconds — QR bandwidth is modest.</li>
          <li>Is it secure? The transfer needs no network, but anyone with a clear view of the sending screen can film the frames — use it in trusted, private spaces.</li>
        </ul>
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR：</strong>想在设备之间用二维码传文件，在两台设备上分别打开 <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">ToolkitLife 的二维码传文件工具</Link>：发送端选文件或文本，屏幕上出现连续滚动的动画二维码流；接收端打开摄像头对准屏幕即可。喷泉码把数据重组为与原件完全一致的文件，并用 SHA-256 校验确认——不需要网络、不需要账号、不需要数据线、不经过云端。文件上限 64 MB；速度大约每秒几十 KB，请保持手机稳定、屏幕够亮。</p>
      </aside>

      <section>
        <h2>什么场景会用二维码传文件？</h2>
        <p>听起来像派对戏法，直到你撞上它<em>唯一可行</em>的时刻。网络并不总是可用——也不总是被允许：</p>
        <ul>
          <li><strong>没有 Wi-Fi 也没有流量：</strong>一台装着文件的笔记本和一台带摄像头的手机，哪个都没有能用的网络——酒店电视间、地下室车间、飞机上、郊外。</li>
          <li><strong>隔离或受限制的网络：</strong>公司或学校电脑上，文件共享服务、邮件附件、U 盘全被封，但浏览器网页还能打开。</li>
          <li><strong>跨平台一次性传输：</strong>把文件从 iPhone 传到安卓电视、或从锁死的办公电脑传到你的私人手机——不装 App、不登录任何账号。</li>
          <li><strong>隐私敏感的短文本：</strong>密码、恢复密钥、账号——你不想手打、不想发消息、不想发邮件，想让它「以光速」过去，字面意义上的。</li>
        </ul>
        <p>以上所有场景里，传输介质变成了屏幕和摄像头：一台设备负责显示，另一台负责观看。中间什么都没有。</p>
      </section>

      <section>
        <h2>认识二维码传文件工具</h2>
        <p>ToolkitLife 的 <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">二维码传文件工具</Link>通过动画二维码流在两台设备之间传输文件或文本，全程在浏览器内完成。</p>
        <ToolCTA
          name="二维码传文件"
          href="/tools/qr-file-transfer"
          description="用动画二维码在设备之间传文件。不需要网络、账号、云端——数据以光的形式从一块屏幕到另一个摄像头。上限 64 MB，SHA-256 校验。"
        />
        <p>它能做什么、不能做什么：</p>
        <ul>
          <li><strong>发送端：</strong>选择文件（最大 64 MB）或输入文本片段；工具把它编码成连续不断的动画二维码流。</li>
          <li><strong>接收端：</strong>打开摄像头取景并对准发送屏幕；二维码帧在后台 Worker 里持续解码。</li>
          <li><strong>喷泉码：</strong>数据被编码成数据包，接收端只要凑够<em>任意</em>足够的帧就能重组文件——顺序无所谓，漏掉的帧由后续帧自然补上。</li>
          <li><strong>SHA-256 校验：</strong>凑够帧后对重组文件做校验；只有哈希与原件一致才报告成功。</li>
          <li><strong>一次单向传输：</strong>这是条单行道——从发送端到接收端。反向传输就交换角色。</li>
        </ul>
      </section>

      <section>
        <h2>原理：光就是传输层</h2>
        <p>巧妙的部分不可见，但值得用一段说清楚，让你信任结果：</p>
        <ul>
          <li><strong>动画二维码流：</strong>单个二维码只能装几 KB，所以工具播放连续动画——每帧携带文件的一小片。</li>
          <li><strong>喷泉码（LT 码）：</strong>发送端不是按固定顺序发「第 1、2、3 块」，而是无尽地广播<em>编码后</em>的数据包。接收端不在乎自己收到了哪些帧——只要凑够大约「文件大小 ÷ 每包大小」再多一点的量，就能重建完整原件。中途才开始看也没关系，什么都不会丢。</li>
          <li><strong>本地二维码解码：</strong>接收端用运行在 Web Worker 里的 WebAssembly 解码器持续解码摄像头帧，页面不卡顿。</li>
          <li><strong>完整性校验：</strong>最终字节用 SHA-256 哈希并与发送端声明的哈希对比。不一致就报错——二维码解码很快但不保证万无一失，校验和才是保证。</li>
        </ul>
      </section>

      <section>
        <h2>如何用二维码传文件（分步教程）</h2>
        <ol>
          <li><strong>两台设备都打开工具</strong>——发送设备和接收设备各自在浏览器里打开 <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">二维码传文件页面</Link>。页面加载完成后不需要 App、不需要登录、不需要网络。</li>
          <li><strong>发送端选择要传的内容。</strong>选择文件（最大 64 MB）或粘贴/输入文本，然后开始传输流。屏幕上出现连续的动画二维码。</li>
          <li><strong>接收端打开摄像头。</strong>浏览器请求权限时允许摄像头，然后把摄像头对准发送屏幕。两台设备保持合适距离，让整个二维码都在画面里。</li>
          <li><strong>保持稳定，等待。</strong>收到可用帧后进度条增长。喷泉解码需要比原始文件略多一点的量，所以流的播放时间会比「完整过一遍文件」略长。</li>
          <li><strong>确认并下载。</strong>SHA-256 校验通过后，接收端显示文件（或文本）和下载按钮。完成——没有字节碰过网络。</li>
        </ol>
      </section>

      <section>
        <h2>速度与 64 MB 限制，老实说</h2>
        <p>二维码传输彻底摆脱了线缆，但按网络标准慢得感人。一个大二维码每帧大约装 1–3 KB，手机摄像头最多每秒解码几帧。实际吞吐量大约每秒几十 KB——一张 2 MB 的照片要几分钟，20 MB 的视频片段要相当久。</p>
        <ul>
          <li><strong>合适的任务：</strong>密码、密钥、链接、文档、几张照片——这些用二维码传输确实方便。</li>
          <li><strong>不合适的任务：</strong>几个 GB 的视频和照片库——用数据线、局域网或网盘；二维码得传几个小时。</li>
          <li><strong>64 MB 上限：</strong>工具拒绝超过 64 MB 的文件——再大下去，喷泉解码器的账目和天文数字般的帧数会让浏览器里的传输不再现实。</li>
        </ul>
      </section>

      <section>
        <h2>安全：二维码传输防得住什么、防不住什么</h2>
        <p>诚实的安全故事有两面：</p>
        <ul>
          <li><strong>没有服务器，就没有中间窃听：</strong>数据以调制光的形式在两块屏幕之间传播。没有任何服务器持有副本、没有可被拦截的网络包、没有可被调取的账号。在两块屏幕之间的这条视线上，不存在可被入侵的东西。</li>
          <li><strong>但光不是私密的光：</strong>传输期间，任何（或任何摄像头）能清楚看到发送屏幕的人都会看到同样的二维码流。旁观者、天花板摄像头、对着你屏幕的视频通话都能拍下帧并重组文件。二维码传输只在<em>可信环境</em>里防窃听——私人房间，而不是咖啡馆的桌面或透过窗户可见的屏幕。</li>
          <li><strong>不要当作加密：</strong>把传输流当作广播对待。如果内容是密码或恢复密钥，请在没有其他摄像头能看到屏幕的地方传输，传完就结束流。</li>
        </ul>
        <p>在可信环境里使用，威胁模型非常好：两台设备在零基础设施之间交换数据，SHA-256 校验捕获任何损坏。在公共场合使用，它就是一块白板——谁看谁读。</p>
      </section>

      <section>
        <h2>传输慢或失败怎么办</h2>
        <p><strong>「进度很慢或卡住。」</strong>屏幕反光和亮度不足是常见原因。调高发送端屏幕亮度、减少反光（有眩光就稍微倾斜）、可能的话把房间调暗。</p>
        <p><strong>「摄像头对不上焦。」</strong>把设备移近或移远，让二维码占据取景框的相当部分并保持清晰；避免极端角度——大致垂直对准。</p>
        <p><strong>「手抖毁帧。」</strong>把接收手机靠在什么东西上，或两台设备都平放在桌上。稳定性是影响速度的第一要素。</p>
        <p><strong>「快完成了却卡住。」</strong>喷泉码的最后几个百分点仍需要新帧——让流继续播、摄像头保持稳定；漏掉的帧会被后续编码帧补上。</p>
        <p><strong>「校验失败。」</strong>罕见，但帧严重损坏时可能发生。重新开始传输；反复出现就调低每帧字节数设置，让每个二维码少装点数据、解码更可靠。</p>
      </section>

      <section>
        <h2>快速问答回顾</h2>
        <ul>
          <li>两台设备都需要联网吗？不需要——页面加载完成后整个传输离线进行。这正是它的意义。</li>
          <li>我的文件会被上传到任何地方吗？不会。没有服务器；数据以二维码的形式跨越两块屏幕之间的空隙。</li>
          <li>文件能有多大？最大 64 MB，而且预计要几分钟而不是几秒——二维码的带宽很有限。</li>
          <li>安全吗？传输不需要网络，但任何能看清发送屏幕的人都能拍下帧——请在可信的私密空间使用。</li>
        </ul>
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="概要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> QR コードでデバイス間にファイルを転送するには、両方の端末で <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">ToolkitLife の QR ファイル転送ツール</Link>を開きます：送信側はファイルかテキストを選び、アニメーション QR ストリームを表示；受信側はカメラを開いて画面に向けるだけ。ファウンテンコードがデータを元ファイルどおりに再構築し、SHA-256 で検証します——インターネット不要、アカウント不要、ケーブル不要、クラウド不要。ファイルは最大 64 MB。速度は毎秒数十 KB 程度なので、スマホを安定させ画面を明るく。</p>
      </aside>

      <section>
        <h2>QR コードでファイルを転送する場面</h2>
        <p>パーティーの芸に聞こえますが、これが<em>唯一の選択肢</em>になる瞬間があります。ネットワークは常に使えるとは限らず、許されるとも限りません：</p>
        <ul>
          <li><strong>Wi-Fi もデータもない：</strong>ファイルのあるノート PC とカメラのあるスマホ、どちらもネットが使えない——ホテルの TV ルーム、地下の作業場、飛行機、郊外。</li>
          <li><strong>エアギャップ・制限ネットワーク：</strong>会社や学校の PC でファイル共有・メール添付・USB メモリが全部ブロックされているが、ブラウザのページは開ける。</li>
          <li><strong>クロスプラットフォームの単発移動：</strong>iPhone から Android TV へ、ロックされた業務 PC から個人スマホへ——アプリを入れず何にもログインせずに。</li>
          <li><strong>プライバシーが重要な断片：</strong>パスワード、リカバリーキー、口座番号——打ちたくも、送信したくも、メールしたくもない。「光の速さ」で運びたい、文字どおり。</li>
        </ul>
        <p>いずれの場合も転送媒体は画面とカメラです：一方の端末が表示し、もう一方が見る。間には何もありません。</p>
      </section>

      <section>
        <h2>QR ファイル転送ツールの紹介</h2>
        <p>ToolkitLife の <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">QR ファイル転送ツール</Link>は、アニメーション QR ストリームで2台の端末の間にファイルやテキストを運びます。完全にブラウザ内で。</p>
        <ToolCTA
          name="QR ファイル転送"
          href="/tools/qr-file-transfer"
          description="アニメーション QR コードでデバイス間にファイルを送信。インターネット・アカウント・クラウド不要——データは画面からカメラへ「光」として渡ります。最大 64 MB、SHA-256 検証付き。"
        />
        <ul>
          <li><strong>送信側：</strong>ファイル（最大 64 MB）かテキスト断片を選ぶと、ツールが連続するアニメーション QR ストリームにエンコードします。</li>
          <li><strong>受信側：</strong>カメラビューを開いて送信画面に向ける。フレームはバックグラウンド Worker で絶えずデコードされます。</li>
          <li><strong>ファウンテンコード：</strong>データはコード化されたパケットに分割され、受信側は<em>任意の</em>十分な数のフレームからファイルを再構築できます——順序は関係なく、逃したフレームは後のフレームが自然に補います。</li>
          <li><strong>SHA-256 検証：</strong>十分なフレームが揃うと再構築ファイルをチェックサム検証。ハッシュが元と一致したときだけ成功を報告します。</li>
          <li><strong>一度に一方向：</strong>片方向のパイプ——送信から受信へ。逆方向は役割を交換。</li>
        </ul>
      </section>

      <section>
        <h2>仕組み：光がトランスポート層</h2>
        <p>巧妙な部分は見えませんが、結果を信頼してもらうために1段落で説明します：</p>
        <ul>
          <li><strong>アニメーション QR ストリーム：</strong>1つの QR コードが持てるのは数 KB だけ。そこでツールは連続アニメーションを表示——各フレームがファイルの小さな一片を運びます。</li>
          <li><strong>ファウンテン符号化（LT コード）：</strong>固定のチャンク #1、#2、#3… を送る代わりに、送信側は<em>符号化された</em>パケットを無限にブロードキャスト。受信側はどのフレームを捕えたかを気にせず、十分な量（おおよそ「ファイルサイズ ÷ パケットサイズ」＋わずかなオーバーヘッド）が揃えば完全な原本を再構築できます。途中から見始めても何も失われません。</li>
          <li><strong>ローカル QR デコード：</strong>受信側は Web Worker 内で動く WebAssembly QR デコーダでフレームを処理し、ページを固めずに連続デコードします。</li>
          <li><strong>整合性チェック：</strong>最終バイト列を SHA-256 でハッシュし、送信側が宣言したハッシュと比較。不一致は報告されます——QR デコードは速いが完璧ではなく、チェックサムこそが保証です。</li>
        </ul>
      </section>

      <section>
        <h2>QR コードでファイルを転送する手順</h2>
        <ol>
          <li><strong>両端末でツールを開く</strong>——送信側・受信側それぞれのブラウザで <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">QR ファイル転送ページ</Link>を開きます。ページ読み込み後はアプリもログインもネットワークも不要。</li>
          <li><strong>送信側で内容を選択。</strong>ファイル（最大 64 MB）かテキスト断片を選び、ストリームを開始。画面にアニメーション QR が並びます。</li>
          <li><strong>受信側でカメラを開く。</strong>ブラウザが求めたらカメラを許可し、送信画面に向ける。QR 全体がフレームに収まる距離を保ってください。</li>
          <li><strong>安定させて待つ。</strong>使えるフレームが揃うにつれ進捗が伸びます。ファウンテンデコーダは生ファイルより少し多く必要なので、ストリームは「ファイル1周分」よりやや長く回ります。</li>
          <li><strong>確認してダウンロード。</strong>SHA-256 チェックが通ると、受信側にファイル（またはテキスト）とダウンロードボタンが表示。完了——バイト列は一切ネットワークに触れていません。</li>
        </ol>
      </section>

      <section>
        <h2>速度と 64 MB 制限、正直に</h2>
        <p>QR 転送はケーブルフリーで素晴らしい一方、ネットワーク基準では痛いほど遅いです。大きな QR コードは1フレームおよそ 1–3 KB、スマホのカメラはせいぜい毎秒数フレーム。実効スループットは毎秒数十 KB 程度——2 MB の写真は数分、20 MB の動画断片はかなり長くかかります。</p>
        <ul>
          <li><strong>適した仕事：</strong>パスワード、キー、リンク、文書、数枚の写真——この規模なら QR 転送は実用十分に便利。</li>
          <li><strong>不向きな仕事：</strong>数 GB の動画や写真ライブラリ——ケーブル、ローカルネット、クラウドドライブを使って。QR では数時間かかります。</li>
          <li><strong>64 MB の上限：</strong>ツールは 64 MB を超えるファイルを拒みます——それ以上はファウンテンデコーダの管理と膨大なフレーム数がブラウザ内転送を非現実的にするからです。</li>
        </ul>
      </section>

      <section>
        <h2>セキュリティ：QR 転送が守れるもの・守れないもの</h2>
        <p>正直なセキュリティの話には2面あります：</p>
        <ul>
          <li><strong>サーバーがなければ中間窃聴もない：</strong>データは2つの画面の間を変調光として飛びます。副本を受け取るサーバーも、傍受できるネットワークパケットも、差し押さえられるアカウントもない。2画面間の視線の中に、攻撃できるものは存在しません。</li>
          <li><strong>しかし光はプライベートな光ではない：</strong>転送中、送信画面をはっきり見られる人（またはカメラ）は誰でも同じ QR ストリームを見ます。立ち会い人、天井カメラ、あなたの画面に向けたビデオ通話がフレームを撮ってファイルを再構築できます。QR 転送が盗聴に強いのは<em>信頼できる環境だけ</em>——個室であり、カフェのテーブルや窓から見える画面ではない。</li>
          <li><strong>暗号化とは言わない：</strong>ストリームは放送として扱うこと。内容がパスワードやリカバリーキーなら、他のカメラから画面が見えない場所で転送し、終わったらストリームを止めてください。</li>
        </ul>
        <p>信頼できる場で使えば脅威モデルは非常に優れています：2端末がゼロのインフラでデータを交換し、SHA-256 チェックがあらゆる破損を検出します。公共の場で使えばそれはホワイトボード——見る人が誰でも読めます。</p>
      </section>

      <section>
        <h2>転送が遅い・失敗するときの対処</h2>
        <p><strong>「進捗が這う・止まる。」</strong>画面の反射と暗さが定番の原因です。送信側の画面を最亮に、反射を減らし（ぎらつくなら少し傾ける）、可能なら部屋を暗く。</p>
        <p><strong>「カメラがフォーカスを合わせられない。」</strong>QR がファインダーの良い割合を占めつつシャープに見える距離に移動；極端な角度は避け、だいたい垂直に。</p>
        <p><strong>「手の揺れでフレームが台無し。」</strong>受信スマホを何かに立て掛けるか、両端末を机に置く。安定性は速度への最大の要因です。</p>
        <p><strong>「ほぼ終わるのに止まる。」</strong>ファウンテン符号データの最後の数パーセントも新フレームを必要とします——ストリームを回し続け、カメラを安定させて。逃したフレームは後続の符号フレームが補います。</p>
        <p><strong>「チェックサム失敗。」</strong>稀ですが、ひどく壊れたフレームでは起こり得ます。転送をやり直し；繰り返すならフレームあたりのバイト数設定を下げて、各 QR のデータを減らしデコードを確実に。</p>
      </section>

      <section>
        <h2>クイック FAQ まとめ</h2>
        <ul>
          <li>両端末にインターネットが必要？いいえ——ページ読み込み後、転送全体がオフラインで完結します。それがポイント。</li>
          <li>ファイルはどこかにアップロードされる？されません。サーバーなし；データは2画面の間を QR コードとして渡ります。</li>
          <li>ファイルはどれくらい大きくできる？最大 64 MB。数秒ではなく数分を見込んで——QR の帯域は控えめです。</li>
          <li>セキュア？転送にネットワークは不要ですが、送信画面をはっきり見られる人は誰でもフレームを撮影できます——信頼できるプライベートな場所で使いましょう。</li>
        </ul>
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> QR 코드로 기기 간에 파일을 전송하려면 두 기기에서 <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">ToolkitLife QR 파일 전송 도구</Link>를 여세요: 보내는 쪽은 파일이나 텍스트를 골라 끊임없이 흐르는 애니메이션 QR 스트림을 표시하고, 받는 쪽은 카메라를 열어 화면에 향합니다. 파운틴 코드가 데이터를 원본과 완전히 같은 파일로 재조립하고 SHA-256으로 검증합니다 — 인터넷 불필요, 계정 불필요, 케이블 불필요, 클라우드 불필요. 파일은 최대 64 MB. 속도는 초당 수십 KB 수준이므로 폰을 안정적으로 두고 화면을 밝게.</p>
      </aside>

      <section>
        <h2>QR 코드로 파일을 전송하는 경우</h2>
        <p>파티 묘기처럼 들리지만, 이것이 <em>유일한</em> 선택지가 되는 순간이 있습니다. 네트워크는 항상 사용 가능한 것도, 허용되는 것도 아닙니다:</p>
        <ul>
          <li><strong>Wi-Fi도 데이터도 없음:</strong> 파일이 있는 노트북과 카메라가 있는 폰, 어느 쪽도 쓸 만한 인터넷이 없는 상황 — 호텔 TV 룸, 지하 작업실, 비행기, 시골.</li>
          <li><strong>에어갭·제한 네트워크:</strong> 회사나 학교 PC에서 파일 공유, 메일 첨부, USB 드라이브가 전부 차단됐지만 브라우저 페이지는 열리는 경우.</li>
          <li><strong>크로스 플랫폼 일회성 전송:</strong> iPhone에서 Android TV로, 잠긴 회사 PC에서 개인 폰으로 — 앱 설치도 로그인도 없이.</li>
          <li><strong>프라이버시가 중요한 짧은 텍스트:</strong> 비밀번호, 복구 키, 계좌번호 — 타이핑도, 메시지도, 메일도 하고 싶지 않은 것. 문자 그대로 &quot;빛의 속도&quot;로 보내고 싶은 것.</li>
        </ul>
        <p>이 모든 상황에서 전송 매체는 화면과 카메라입니다: 한 기기가 표시하고 다른 기기가 지켜봅니다. 그 사이에는 아무것도 없습니다.</p>
      </section>

      <section>
        <h2>QR 파일 전송 도구 소개</h2>
        <p>ToolkitLife의 <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">QR 파일 전송 도구</Link>는 애니메이션 QR 스트림을 통해 두 기기 사이에 파일이나 텍스트를 옮깁니다. 전부 브라우저 안에서.</p>
        <ToolCTA
          name="QR 파일 전송"
          href="/tools/qr-file-transfer"
          description="애니메이션 QR 코드로 기기 간 파일 전송. 인터넷, 계정, 클라우드 불필요 — 데이터는 한 화면에서 다른 카메라로 빛으로 전달됩니다. 최대 64 MB, SHA-256 검증."
        />
        <ul>
          <li><strong>보내는 쪽:</strong> 파일(최대 64 MB)이나 텍스트를 고르면 도구가 연속적인 애니메이션 QR 스트림으로 인코딩합니다.</li>
          <li><strong>받는 쪽:</strong> 카메라 뷰를 열어 전송 화면에 향하세요. 프레임은 백그라운드 워커에서 계속 디코딩됩니다.</li>
          <li><strong>파운틴 코드:</strong> 데이터는 코딩된 패킷으로 나뉘고, 받는 쪽은 <em>어떤</em> 충분한 프레임 묶음으로도 파일을 재조립할 수 있습니다 — 순서는 상관없고, 놓친 프레임은 이후 프레임이 자연히 대체합니다.</li>
          <li><strong>SHA-256 검증:</strong> 프레임이 충분히 모이면 재조립 파일의 체크섬을 검증합니다. 해시가 원본과 일치할 때만 성공을 보고합니다.</li>
          <li><strong>한 번에 한 방향:</strong> 일방향 파이프 — 보내는 쪽에서 받는 쪽으로. 반대 방향은 역할을 바꾸면 됩니다.</li>
        </ul>
      </section>

      <section>
        <h2>작동 원리: 빛이 곧 전송 계층</h2>
        <p>영리한 부분은 보이지 않지만, 결과를 신뢰하도록 한 단락으로 설명합니다:</p>
        <ul>
          <li><strong>애니메이션 QR 스트림:</strong> 하나의 QR 코드는 겨우 몇 KB를 담습니다. 그래서 도구는 연속 애니메이션을 재생 — 각 프레임이 파일의 작은 조각을 실어 나릅니다.</li>
          <li><strong>파운틴 코딩(LT 코드):</strong> 고정된 청크 #1, #2, #3…을 보내는 대신, 보내는 쪽은 <em>코딩된</em> 패킷을 끝없이 방송합니다. 받는 쪽은 어떤 프레임을 잡았는지 신경 쓰지 않고 — 대략 &quot;파일 크기 ÷ 패킷 크기&quot;에 약간의 오버헤드만 더한 양이 모이면 완전한 원본을 재구성할 수 있습니다. 한가운데서 보기 시작해도 아무것도 잃지 않습니다.</li>
          <li><strong>로컬 QR 디코딩:</strong> 받는 쪽은 웹 워커 안의 WebAssembly QR 디코더로 프레임을 처리해 페이지를 얼리지 않고 연속 디코딩합니다.</li>
          <li><strong>무결성 검사:</strong> 최종 바이트를 SHA-256으로 해시해 보내는 쪽이 선언한 해시와 비교합니다. 불일치는 보고됩니다 — QR 디코딩은 빠르지만 완벽하지 않으며, 체크섬이 보증입니다.</li>
        </ul>
      </section>

      <section>
        <h2>QR 코드로 파일 전송하는 방법 (단계별)</h2>
        <ol>
          <li><strong>두 기기 모두에서 도구를 열기</strong> — 보내는 기기와 받는 기기가 각자 브라우저에서 <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">QR 파일 전송 페이지</Link>를 엽니다. 페이지 로드 후에는 앱도, 로그인도, 네트워크도 불필요.</li>
          <li><strong>보내는 쪽에서 전송할 것 선택.</strong> 파일(최대 64 MB)을 고르거나 텍스트를 붙여넣고 스트림을 시작합니다. 화면에 연속된 애니메이션 QR가 흐릅니다.</li>
          <li><strong>받는 쪽에서 카메라 열기.</strong> 브라우저가 요청하면 카메라를 허용하고 전송 화면에 향하세요. QR 전체가 화면에 들어오는 거리를 유지합니다.</li>
          <li><strong>안정적으로 유지하며 대기.</strong> 쓸모 있는 프레임이 모이면서 진행률이 늘어납니다. 파운틴 디코더는 원본보다 조금 더 필요로 하므로 스트림이 &quot;파일 한 바퀴&quot;보다 약간 더 돌아야 합니다.</li>
          <li><strong>확인하고 다운로드.</strong> SHA-256 검사가 통과하면 받는 쪽에 파일(또는 텍스트)과 다운로드 버튼이 표시됩니다. 완료 — 바이트는 네트워크를 전혀 거치지 않았습니다.</li>
        </ol>
      </section>

      <section>
        <h2>속도와 64 MB 한도, 솔직하게</h2>
        <p>QR 전송은 케이블 없이 훌륭하지만 네트워크 기준으로는 고통스러울 만큼 느립니다. 큰 QR 코드는 프레임당 약 1–3 KB를 담고, 폰 카메라는 기껏해야 초당 몇 프레임을 디코딩합니다. 실제 처리량은 초당 수십 KB 수준 — 2 MB 사진은 몇 분, 20 MB 동영상 조각은 상당히 오래 걸립니다.</p>
        <ul>
          <li><strong>알맞은 작업:</strong> 비밀번호, 키, 링크, 문서, 사진 몇 장 — 이 규모라면 QR 전송이 정말 편리합니다.</li>
          <li><strong>맞지 않는 작업:</strong> 수 GB짜리 영상과 사진 라이브러리 — 케이블, 로컬 네트워크, 클라우드 드라이브를 쓰세요. QR로는 몇 시간 걸립니다.</li>
          <li><strong>64 MB 상한:</strong> 도구는 64 MB를 넘는 파일을 거부합니다 — 그 이상은 파운틴 디코더의 관리와 어마어마한 프레임 수가 브라우저 내 전송을 비현실적으로 만들기 때문입니다.</li>
        </ul>
      </section>

      <section>
        <h2>보안: QR 전송이 막아주는 것과 못 막아주는 것</h2>
        <p>정직한 보안 이야기에는 두 면이 있습니다:</p>
        <ul>
          <li><strong>서버가 없으면 중간 도청도 없다:</strong> 데이터는 두 화면 사이를 변조된 빛으로 이동합니다. 사본을 받는 서버도, 가로챌 네트워크 패킷도, 압수할 계정도 없습니다. 두 화면 사이의 시선 안에는 해킹할 대상이 존재하지 않습니다.</li>
          <li><strong>하지만 빛은 사적(私的)인 빛이 아닙니다:</strong> 전송 중에 전송 화면을 또렷이 볼 수 있는 사람(또는 카메라)은 누구나 같은 QR 스트림을 봅니다. 지켜보는 사람, 천장 카메라, 당신 화면을 향한 영상통화가 프레임을 찍어 파일을 재구성할 수 있습니다. QR 전송이 도청에 강한 것은 <em>신뢰할 수 있는 환경에서만</em>입니다 — 개인 공간이지, 카페 테이블이나 창밖에서 보이는 화면이 아닙니다.</li>
          <li><strong>암호화로 착각하지 말 것:</strong> 스트림을 방송으로 취급하세요. 내용이 비밀번호나 복구 키라면 다른 카메라에 화면이 보이지 않는 곳에서 전송하고, 끝나면 스트림을 종료하세요.</li>
        </ul>
        <p>신뢰할 수 있는 환경에서 쓰면 위협 모델은 아주 좋습니다: 두 기기가 제로 인프라 사이에서 데이터를 교환하고, SHA-256 검사가 모든 손상을 잡아냅니다. 공공장소에서 쓰면 그것은 화이트보드 — 보는 사람 누구나 읽습니다.</p>
      </section>

      <section>
        <h2>느리거나 실패하는 전송 문제 해결</h2>
        <p><strong>&quot;진행이 느리거나 멈춰요.&quot;</strong> 화면 반사와 어두운 밝기가 단골 원인입니다. 보내는 쪽 화면 밝기를 최대로 올리고, 반사를 줄이고(번쩍이면 살짝 기울이고), 가능하면 방을 어둡게.</p>
        <p><strong>&quot;카메라가 초점을 못 잡아요.&quot;</strong> QR이 뷰파인더의 적당한 부분을 차지하면서 선명하게 보이는 거리로 조절하세요. 극단적인 각도는 피하고 대체로 수직으로.</p>
        <p><strong>&quot;떨리는 손이 프레임을 망쳐요.&quot;</strong> 받는 폰을 뭔가에 기대 놓거나 두 기기를 모두 탁자에 놓으세요. 안정성이 속도의 최대 요인입니다.</p>
        <p><strong>&quot;거의 다 됐는데 멈춰요.&quot;</strong> 파운틴 코딩 데이터의 마지막 몇 퍼센트도 새 프레임이 필요합니다 — 스트림을 계속 돌리고 카메라를 안정적으로. 놓친 프레임은 이후 코딩 프레임이 대체합니다.</p>
        <p><strong>&quot;체크섬 실패.&quot;</strong> 드물지만 심하게 손상된 프레임에서 일어날 수 있습니다. 전송을 다시 시작하고; 반복되면 프레임당 바이트 설정을 낮춰 각 QR이 적은 데이터를 담고 더 안정적으로 디코딩되게 하세요.</p>
      </section>

      <section>
        <h2>빠른 FAQ 정리</h2>
        <ul>
          <li>두 기기 모두 인터넷이 필요한가요? 아니요 — 페이지 로드 후 전송 전체가 오프라인으로 진행됩니다. 그것이 핵심입니다.</li>
          <li>파일이 어딘가에 업로드되나요? 아닙니다. 서버가 없습니다; 데이터는 두 화면 사이를 QR 코드로 건너갑니다.</li>
          <li>파일은 얼마나 클 수 있나요? 최대 64 MB이며 몇 초가 아닌 몇 분을 예상하세요 — QR 대역폭은 소박합니다.</li>
          <li>안전한가요? 전송에 네트워크는 불필요하지만 전송 화면을 또렷이 볼 수 있는 사람은 프레임을 촬영할 수 있습니다 — 신뢰할 수 있는 개인 공간에서 사용하세요.</li>
        </ul>
      </section>
    </>
  ),

  ru: (
    <>
      <aside aria-label="Сводка" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>Коротко:</strong> чтобы передать файлы между устройствами с помощью QR-кодов, откройте <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">инструмент передачи файлов по QR от ToolkitLife</Link> на обоих устройствах: отправляющая сторона выбирает файл или текст и показывает бесконечный анимированный QR-поток; принимающая открывает камеру и наводит её на экран. Поток из фонтанных кодов собирается обратно в точную копию файла и проверяется контрольной суммой SHA-256 — без интернета, аккаунтов, кабеля и облака. Поддерживаются файлы до 64 МБ; скорость — порядка десятков КБ в секунду, поэтому держите телефоны неподвижно, а экран ярким.</p>
      </aside>

      <section>
        <h2>Когда вообще передавать файлы по QR-кодам?</h2>
        <p>Звучит как фокус с вечеринки — пока вы не столкнулись с ситуацией, когда это <em>единственный</em> вариант. Сеть доступна не всегда — и не всегда разрешена:</p>
        <ul>
          <li><strong>Ни Wi-Fi, ни мобильного интернета:</strong> ноутбук с файлами и телефон с камерой, и у обоих нет работающей сети — номер в отеле с телевизором, подвальная мастерская, самолёт, деревня.</li>
          <li><strong>Изолированные или ограниченные сети:</strong> корпоративные или школьные машины, где сервисы обмена файлами, почтовые вложения и USB-накопители заблокированы, а страница в браузере всё ещё открывается.</li>
          <li><strong>Разовые передачи между платформами:</strong> перекинуть файл с iPhone на Android TV или с запертого рабочего компьютера на личный телефон — без установки приложений и входа куда-либо.</li>
          <li><strong>Конфиденциальные короткие данные:</strong> пароль, ключ восстановления или номер счёта, который не хочется набирать вручную, отправлять в мессенджере или почтой — хочется, чтобы он буквально «проследовал со скоростью света».</li>
        </ul>
        <p>Во всех этих случаях средой передачи становятся экран и камера: одно устройство показывает, другое смотрит. Между ними — ничего.</p>
      </section>

      <section>
        <h2>Знакомьтесь: инструмент передачи файлов по QR</h2>
        <p><Link href="/tools/qr-file-transfer" className="text-blue-400 underline">Инструмент передачи файлов по QR</Link> от ToolkitLife переносит файлы или текст между двумя устройствами через поток анимированных QR-кодов, целиком в браузере.</p>
        <ToolCTA
          name="Передача файлов по QR"
          href="/tools/qr-file-transfer"
          description="Отправляйте файлы между устройствами анимированными QR-кодами. Без интернета, аккаунтов и облака — данные путешествуют как свет от одного экрана к камере другого. До 64 МБ, проверка SHA-256."
        />
        <p>Что он умеет и чего не делает — без прикрас:</p>
        <ul>
          <li><strong>Сторона отправителя:</strong> выберите файл (до 64 МБ) или введите текст — инструмент закодирует его в непрерывный поток анимированных QR-кодов.</li>
          <li><strong>Сторона получателя:</strong> откройте вид камеры и наведите его на экран отправителя; кадры непрерывно декодируются в фоновых воркерах.</li>
          <li><strong>Фонтанные коды:</strong> данные разбиваются на кодовые пакеты так, что получатель может собрать файл из <em>любого</em> достаточно большого набора кадров — порядок не важен, а пропущенные кадры просто заменяются последующими.</li>
          <li><strong>Проверка SHA-256:</strong> когда кадров наберётся достаточно, собранный файл проверяется контрольной суммой; передача отмечается как успешная, только если хеш совпал с исходным.</li>
          <li><strong>Одно направление за раз:</strong> это односторонний канал — от отправителя к получателю. Для обратного направления поменяйтесь ролями.</li>
        </ul>
      </section>

      <section>
        <h2>Как это работает: свет в роли транспортного уровня</h2>
        <p>Хитрая часть невидима, но стоит одного абзаца, чтобы вы доверяли результату:</p>
        <ul>
          <li><strong>Анимированный QR-поток:</strong> один QR-код вмещает лишь несколько КБ, поэтому инструмент показывает непрерывную анимацию — каждый кадр несёт небольшой кусочек файла.</li>
          <li><strong>Фонтанное кодирование (LT-коды):</strong> вместо отправки фиксированных блоков №1, №2, №3… отправитель транслирует бесконечный поток <em>кодовых</em> пакетов. Получателю не важно, какие кадры он поймал: набрав достаточно (примерно размер файла, делённый на размер пакета, плюс небольшой запас), он восстанавливает полный оригинал. Можно включиться с середины потока — ничего не потеряется.</li>
          <li><strong>Локальное декодирование QR:</strong> получатель декодирует кадры WebAssembly-декодером внутри веб-воркеров, поэтому кадры с камеры обрабатываются непрерывно, не подвешивая страницу.</li>
          <li><strong>Проверка целостности:</strong> итоговые байты хешируются SHA-256 и сравниваются с хешем, заявленным отправителем. Несовпадение сообщается — декодирование QR быстрое, но не безошибочное, и именно контрольная сумма даёт гарантию.</li>
        </ul>
      </section>

      <section>
        <h2>Как передать файл по QR-кодам (по шагам)</h2>
        <ol>
          <li><strong>Откройте инструмент на обоих устройствах</strong> — отправляющее и принимающее устройства каждое в своём браузере открывают <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">страницу передачи файлов по QR</Link>. После загрузки страницы не нужны ни приложение, ни вход, ни сеть.</li>
          <li><strong>На отправителе выберите, что передать.</strong> Укажите файл (до 64 МБ) или вставьте/наберите текст, затем запустите поток. Экран заполнит анимированная последовательность QR-кодов.</li>
          <li><strong>На получателе откройте камеру.</strong> Разрешите доступ к камере, когда браузер спросит, и наведите её на экран отправителя. Держите устройства на комфортном расстоянии, чтобы весь QR-код помещался в кадр.</li>
          <li><strong>Держите неподвижно и ждите.</strong> Индикатор прогресса растёт по мере сбора полезных кадров. Фонтанному декодеру нужно чуть больше данных, чем весит файл, поэтому поток будет крутиться несколько дольше одного «прохода».</li>
          <li><strong>Подтвердите и скачайте.</strong> Когда проверка SHA-256 пройдёт, получатель покажет файл (или текст) с кнопкой скачивания. Готово — ни один байт не коснулся сети.</li>
        </ol>
      </section>

      <section>
        <h2>Скорость и лимит 64 МБ — честно</h2>
        <p>QR-передача чудесно свободна от кабелей и мучительно медленна по меркам сетей. Крупный QR-код несёт примерно 1–3 КБ за кадр, а камера телефона декодирует в лучшем случае несколько кадров в секунду. Практическая пропускная способность — порядка десятков КБ в секунду: фото на 2 МБ займёт пару минут, а фрагмент видео на 20 МБ — заметно дольше.</p>
        <ul>
          <li><strong>Задачи подходящего размера:</strong> пароли, ключи, ссылки, документы, несколько фото — для этого QR-передача по-настоящему удобна.</li>
          <li><strong>Задачи неподходящего размера:</strong> гигабайтные видео и фототеки — берите кабель, локальную сеть или облачный диск; QR потребует часов.</li>
          <li><strong>Лимит 64 МБ:</strong> инструмент отказывается принимать файлы свыше 64 МБ — при большем размере учёт фонтанного декодера и само число кадров делают передачу в браузере непрактичной.</li>
        </ul>
      </section>

      <section>
        <h2>Безопасность: от чего защищает QR-передача — а от чего нет</h2>
        <p>Честная история о безопасности двусторонняя:</p>
        <ul>
          <li><strong>Нет сервера — нет прослушки посередине:</strong> данные путешествуют в виде модулированного света между двумя экранами. Нет сервера, хранящего копию; нет сетевого пакета, который можно перехватить; нет аккаунта, который можно запросить по требованию. На линии между двумя экранами взламывать нечего.</li>
          <li><strong>Но свет — не приватный свет:</strong> во время передачи любой человек (или любая камера) с хорошим обзором экрана отправителя видит тот же QR-поток. Наблюдатель, потолочная камера или видеозвонок, нацеленный на ваш экран, снимут кадры и восстановят файл. QR-передача защищена от подслушивания <em>только в доверенной обстановке</em> — частная комната, а не столик в кафе и не экран, видный из окна.</li>
          <li><strong>Никаких заявлений о шифровании:</strong> обращайтесь с потоком как с трансляцией. Если передаёте пароль или ключ восстановления, делайте это там, где экран не видит ни одна другая камера, и завершайте поток по окончании.</li>
        </ul>
        <p>В доверенной обстановке модель угроз великолепна: два устройства обмениваются данными при нулевой инфраструктуре, а проверка SHA-256 ловит любые повреждения. В общественном месте это доска для записей — читает тот, кто смотрит.</p>
      </section>

      <section>
        <h2>Если передача идёт медленно или срывается</h2>
        <p><strong>«Прогресс ползёт или встал».</strong> Обычно виноваты блики и низкая яркость. Поднимите яркость экрана отправителя, уберите отражения (при бликах чуть наклоните экран) и, если возможно, затемните комнату.</p>
        <p><strong>«Камера не может сфокусироваться».</strong> Сдвиньте устройства ближе или дальше, чтобы QR занимал приличную часть видоискателя и оставался резким; избегайте крайних углов — цельтесь примерно перпендикулярно.</p>
        <p><strong>«Дрожащие руки портят кадры».</strong> Обоприте принимающий телефон обо что-нибудь или положите оба устройства на стол. Стабильность — главный фактор скорости.</p>
        <p><strong>«Почти завершилось, но застряло».</strong> Последние проценты фонтанно-кодированных данных всё ещё ждут новые кадры — не останавливайте поток и держите камеру ровно; пропущенные кадры заменят последующие кодовые.</p>
        <p><strong>«Контрольная сумма не сошлась».</strong> Редко, но случается при сильно повреждённых кадрах. Перезапустите передачу; если повторяется, уменьшите настройку байт на кадр, чтобы каждый QR-код нёс меньше данных и декодировался надёжнее.</p>
      </section>

      <section>
        <h2>Краткое повторение FAQ</h2>
        <ul>
          <li>Обоим устройствам нужен интернет? Нет — после загрузки страницы передача целиком идёт офлайн. В этом и смысл.</li>
          <li>Мой файл куда-то загружается? Нет. Сервера нет; данные пересекают зазор между двумя экранами в виде QR-кодов.</li>
          <li>Каким может быть размер файла? До 64 МБ, и рассчитывайте на минуты, а не секунды — пропускная способность у QR скромная.</li>
          <li>Это безопасно? Передаче сеть не нужна, но любой с хорошим обзором экрана отправителя может снять кадры — используйте в доверенных, приватных местах.</li>
        </ul>
      </section>
    </>
  ),

  es: (
    <>
      <aside aria-label="Resumen" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>En resumen:</strong> para transferir archivos entre dispositivos con códigos QR, abre la <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">herramienta de transferencia de archivos por QR de ToolkitLife</Link> en ambos dispositivos: el emisor elige un archivo o texto y muestra un flujo animado infinito de códigos QR; el receptor abre la cámara y la apunta hacia la pantalla. El flujo de códigos fuente se reensambla en el archivo exacto, verificado con una suma de comprobación SHA-256 — sin internet, sin cuentas, sin cable y sin nube. Funciona con archivos de hasta 64 MB; la velocidad ronda las decenas de KB por segundo, así que mantén los teléfonos firmes y la pantalla brillante.</p>
      </aside>

      <section>
        <h2>¿Cuándo transferir archivos con códigos QR?</h2>
        <p>Suena a truco de fiesta, hasta que te topas con la situación en la que es la <em>única</em> opción. Las redes no siempre están disponibles — y no siempre están permitidas:</p>
        <ul>
          <li><strong>Sin Wi-Fi y sin datos:</strong> un portátil con archivos que mover y un teléfono con cámara, y ninguno tiene internet utilizable — la habitación del hotel con televisor, un taller en el sótano, un avión, el campo.</li>
          <li><strong>Redes aisladas o restringidas:</strong> equipos corporativos o escolares donde los servicios para compartir archivos, los adjuntos de correo y las memorias USB están bloqueados, pero una página web sigue cargando.</li>
          <li><strong>Traspasos puntuales entre plataformas:</strong> llevar un archivo de un iPhone a un Android TV, o de un PC de trabajo bloqueado a tu teléfono personal, sin instalar ninguna app ni iniciar sesión en nada.</li>
          <li><strong>Fragmentos delicados para la privacidad:</strong> una contraseña, una clave de recuperación o un número de cuenta que no quieres teclear, enviar por mensaje ni por correo — quieres que viaje, literalmente, «a la velocidad de la luz».</li>
        </ul>
        <p>En todos estos casos el medio de transmisión pasa a ser la pantalla y la cámara: un dispositivo muestra, el otro observa. Nada en medio.</p>
      </section>

      <section>
        <h2>Conoce la herramienta de transferencia de archivos por QR</h2>
        <p>La <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">herramienta de transferencia de archivos por QR</Link> de ToolkitLife mueve archivos o texto entre dos dispositivos mediante un flujo de códigos QR animados, todo dentro del navegador.</p>
        <ToolCTA
          name="Transferencia de archivos por QR"
          href="/tools/qr-file-transfer"
          description="Envía archivos entre dispositivos con códigos QR animados. Sin internet, sin cuentas y sin nube — los datos viajan como luz de una pantalla a la cámara de otro. Hasta 64 MB, verificación SHA-256."
        />
        <p>Lo que hace y lo que no hace, sin rodeos:</p>
        <ul>
          <li><strong>Lado del emisor:</strong> elige un archivo (hasta 64 MB) o escribe un fragmento de texto; la herramienta lo codifica en un flujo continuo de códigos QR animados.</li>
          <li><strong>Lado del receptor:</strong> abre la vista de cámara y apúntala a la pantalla emisora; los fotogramas se decodifican sin parar en workers en segundo plano.</li>
          <li><strong>Códigos fuente (fountain):</strong> los datos se dividen en paquetes codificados de forma que el receptor puede reensamblar el archivo a partir de <em>cualquier</em> conjunto de fotogramas suficientemente grande — el orden no importa, y los fotogramas perdidos simplemente los sustituyen los posteriores.</li>
          <li><strong>Verificación SHA-256:</strong> cuando se han reunido suficientes fotogramas, el archivo reensamblado se comprueba con su suma de verificación; la transferencia solo informa de éxito si el hash coincide con el original.</li>
          <li><strong>Una dirección cada vez:</strong> es un conducto unidireccional — del emisor al receptor. Para el sentido contrario, intercambia los papeles.</li>
        </ul>
      </section>

      <section>
        <h2>Cómo funciona: la luz como capa de transporte</h2>
        <p>Lo ingenioso es invisible, pero merece un párrafo para que confíes en el resultado:</p>
        <ul>
          <li><strong>Flujo de QR animado:</strong> un solo código QR solo guarda unos pocos KB, así que la herramienta muestra una animación continua — cada fotograma lleva una pequeña porción del archivo.</li>
          <li><strong>Codificación fuente (códigos LT):</strong> en lugar de enviar los bloques fijos #1, #2, #3…, el emisor emite sin fin una corriente de paquetes <em>codificados</em>. Al receptor no le importa qué fotogramas capturó — una vez que tiene suficientes (aproximadamente el tamaño del archivo dividido entre el tamaño del paquete, más un pequeño margen), puede reconstruir el original completo. Puedes empezar a mirar a mitad del flujo; no se pierde nada.</li>
          <li><strong>Decodificación QR local:</strong> el receptor decodifica los fotogramas con un decodificador QR en WebAssembly que corre en web workers, de modo que los fotogramas de la cámara se procesan sin congelar la página.</li>
          <li><strong>Comprobación de integridad:</strong> los bytes finales se hashean con SHA-256 y se comparan con el hash declarado por el emisor. Una discrepancia se informa — la decodificación QR es rápida pero no infalible, y la suma de comprobación es la garantía.</li>
        </ul>
      </section>

      <section>
        <h2>Cómo transferir un archivo con códigos QR (paso a paso)</h2>
        <ol>
          <li><strong>Abre la herramienta en ambos dispositivos</strong> — el dispositivo emisor y el receptor abren cada uno la <Link href="/tools/qr-file-transfer" className="text-blue-400 underline">página de transferencia de archivos por QR</Link> en su navegador. Tras cargar la página no hace falta ni app, ni inicio de sesión, ni red.</li>
          <li><strong>En el emisor, elige qué enviar.</strong> Selecciona un archivo (hasta 64 MB) o pega/escribe un texto, y arranca el flujo. Una secuencia animada de códigos QR llena la pantalla.</li>
          <li><strong>En el receptor, abre la cámara.</strong> Concede el permiso de cámara cuando el navegador lo pida y apunta hacia la pantalla emisora. Mantén los dispositivos a una distancia cómoda para que el código QR completo entre en el encuadre.</li>
          <li><strong>Sujeta firme y espera.</strong> El indicador de progreso crece a medida que se recogen fotogramas útiles. El decodificador fuente necesita algo más de datos que el tamaño bruto del archivo, así que el flujo correrá algo más de una «pasada» completa.</li>
          <li><strong>Confirma y descarga.</strong> Cuando la comprobación SHA-256 pase, el receptor muestra el archivo (o texto) con un botón de descarga. Listo — ningún byte tocó una red.</li>
        </ol>
      </section>

      <section>
        <h2>Velocidad y el límite de 64 MB, con franqueza</h2>
        <p>La transmisión por QR es maravillosamente libre de cables y dolorosamente lenta según los estándares de red. Un código QR grande lleva en torno a 1–3 KB por fotograma, y la cámara de un teléfono decodifica como mucho unos pocos fotogramas por segundo. El rendimiento práctico ronda las decenas de KB por segundo — una foto de 2 MB tarda un par de minutos, y un trozo de vídeo de 20 MB bastante más.</p>
        <ul>
          <li><strong>Tareas del tamaño adecuado:</strong> contraseñas, claves, enlaces, documentos, un puñado de fotos — para esto la transferencia por QR es de verdad cómoda.</li>
          <li><strong>Tareas del tamaño equivocado:</strong> vídeos de varios gigabytes y fototecas — usa un cable, una red local o una unidad en la nube; por QR llevaría horas.</li>
          <li><strong>El tope de 64 MB:</strong> la herramienta rechaza archivos de más de 64 MB — por encima de ese tamaño, la contabilidad del decodificador fuente y el número ingente de fotogramas hacen la transferencia inviable en un navegador.</li>
        </ul>
      </section>

      <section>
        <h2>Seguridad: de qué protege la transferencia por QR — y de qué no</h2>
        <p>La historia honesta de seguridad tiene dos caras:</p>
        <ul>
          <li><strong>Sin servidor, sin escucha intermedia:</strong> los datos viajan como luz modulada entre dos pantallas. No hay servidor que reciba una copia, ni paquete de red que interceptar, ni cuenta que requerir judicialmente. En la línea entre las dos pantallas no hay nada que hackear.</li>
          <li><strong>Pero la luz no es luz privada:</strong> durante la transferencia, cualquiera (o cualquier cámara) con visión clara de la pantalla emisora ve el mismo flujo de QR. Un curiosillo, una cámara del techo o una videollamada apuntada a tu pantalla pueden capturar los fotogramas y reconstruir el archivo. La transferencia por QR resiste escuchas <em>solo en un entorno de confianza</em> — una habitación privada, no la mesa de un café ni una pantalla visible desde la ventana.</li>
          <li><strong>Sin pretensiones de cifrado:</strong> trata el flujo como una emisión. Si el contenido es una contraseña o una clave de recuperación, transfiéelo donde ninguna otra cámara vea la pantalla, y corta el flujo al terminar.</li>
        </ul>
        <p>Usada en un entorno de confianza, el modelo de amenazas es excelente: dos dispositivos intercambian datos con infraestructura cero en medio, y la comprobación SHA-256 detecta cualquier corrupción. En público, es una pizarra — la lee quien la mire.</p>
      </section>

      <section>
        <h2>Transferencias lentas o fallidas: qué hacer</h2>
        <p><strong>«El progreso avanza a rastras o se atasca».</strong> Los reflejos y el brillo bajo son los culpables habituales. Sube el brillo de la pantalla emisora, reduce los reflejos (inclínala un poco si deslumbra) y oscurece la habitación si es posible.</p>
        <p><strong>«La cámara no logra enfocar».</strong> Acerca o aleja los dispositivos hasta que el QR ocupe una buena parte del visor y siga nítido; evita los ángulos extremos — apunta más bien en perpendicular.</p>
        <p><strong>«Las manos temblorosas arruinan los fotogramas».</strong> Apoya el teléfono receptor contra algo, o coloca ambos dispositivos sobre una mesa. La estabilidad es el mayor factor de velocidad.</p>
        <p><strong>«Casi termina y se atasca».</strong> El último porcentaje de datos codificados fuente también necesita fotogramas nuevos — deja el flujo corriendo y la cámara firme; los fotogramas perdidos los sustituyen los codificados posteriores.</p>
        <p><strong>«La suma de comprobación falló».</strong> Raro, pero posible con fotogramas muy dañados. Reinicia la transferencia; si se repite, baja el ajuste de bytes por fotograma para que cada código QR lleve menos datos y se decodifique con más fiabilidad.</p>
      </section>

      <section>
        <h2>Repaso rápido de preguntas frecuentes</h2>
        <ul>
          <li>¿Ambos dispositivos necesitan internet? No — tras cargar la página, toda la transferencia ocurre sin conexión. Ese es el propósito.</li>
          <li>¿Mi archivo se sube a algún sitio? No. No hay servidor; los datos cruzan el hueco entre las dos pantallas como códigos QR.</li>
          <li>¿De qué tamaño puede ser el archivo? Hasta 64 MB, y espera minutos, no segundos — el ancho de banda del QR es modesto.</li>
          <li>¿Es seguro? La transferencia no necesita red, pero quien vea con claridad la pantalla emisora puede filmar los fotogramas — úsalo en espacios de confianza y privados.</li>
        </ul>
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "Can I really transfer files between devices with no internet?", answer: "Yes. Both devices open the QR File Transfer page once; after that the entire transfer runs offline. The sender displays an animated stream of QR codes and the receiver's camera reads them — the data crosses the air gap as light, not as network packets, so no Wi-Fi, Bluetooth, cable, or cloud service is involved." },
      { question: "How does the tool guarantee the received file is intact?", answer: "The file is split into fountain-coded packets: the receiver can reassemble the complete original from any sufficiently large set of captured frames, regardless of order or dropped frames. Once reassembled, the result is hashed with SHA-256 and compared against the sender's declared hash — the transfer only reports success when the checksum matches." },
      { question: "What is the file size limit and how fast is the transfer?", answer: "Files up to 64 MB are supported. Speed depends on lighting, screen brightness, and camera stability, but expect roughly tens of KB per second — a small document or a few photos takes a minute or two, while large media files are better suited to a cable or local network." },
      { question: "Is QR file transfer secure?", answer: "There is no server involved and nothing to intercept on a network, but the data is visible as QR codes to anyone with a clear view of the sending screen — an onlooker or camera can film the frames and reconstruct the file. Use the tool in trusted, private environments, especially for passwords or recovery keys." },
    ],
    zh: [
      { question: "两台设备之间真的可以在没有网络的情况下传文件吗？", answer: "可以。两台设备各打开一次二维码传文件页面，之后整个传输完全离线进行。发送端播放动画二维码流，接收端摄像头读取——数据以光的形式跨越物理隔离，而不是以网络包的形式，全程不涉及 Wi-Fi、蓝牙、数据线或云服务。" },
      { question: "工具如何保证收到的文件完好无损？", answer: "文件被拆分成喷泉码数据包：接收端可以从任意足够数量的帧中重组完整原件，与顺序无关、漏帧也无所谓。重组完成后用 SHA-256 哈希并与发送端声明的哈希对比——只有校验和一致时才报告传输成功。" },
      { question: "文件大小上限是多少？传输速度如何？", answer: "支持最大 64 MB 的文件。速度取决于光线、屏幕亮度和摄像头稳定性，大约每秒几十 KB——小文档或几张照片要一两分钟，大媒体文件更适合数据线或局域网。" },
      { question: "二维码传文件安全吗？", answer: "全程没有服务器参与、网络上没有可拦截的东西，但任何能清楚看到发送屏幕的人都能把二维码拍下来重组文件。请在可信的私密环境使用，传密码或恢复密钥时尤其如此。" },
    ],
    ja: [
      { question: "インターネットなしで本当にデバイス間のファイル転送ができる？", answer: "できます。両端末で QR ファイル転送ページを一度開けば、以降の転送は完全にオフラインで完結します。送信側はアニメーション QR ストリームを表示し、受信側のカメラがそれを読む——データはネットワークパケットではなく光として物理分離を越えます。Wi-Fi、Bluetooth、ケーブル、クラウドは一切関与しません。" },
      { question: "受け取ったファイルが無傷であることをツールはどう保証する？", answer: "ファイルはファウンテン符号化パケットに分割されます：受信側は順序や欠落と無関係に、捕えたフレームの十分大きな任意の集合から完全な原本を再構築できます。再構築後は SHA-256 でハッシュし、送信側が宣言したハッシュと比較——チェックサムが一致したときだけ転送成功を報告します。" },
      { question: "ファイルサイズの上限と転送速度は？", answer: "最大 64 MB まで対応。速度は照明・画面の明るさ・カメラの安定性に依存しますが、毎秒数十 KB 程度を見込んでください——小さな文書や数枚の写真は1〜2分、大きなメディアファイルはケーブルやローカルネットワーク向きです。" },
      { question: "QR ファイル転送はセキュア？", answer: "サーバーは関与せずネットワーク上に傍受対象もありませんが、データは QR コードとして見えるため、送信画面をはっきり見られる人は誰でもフレームを撮影してファイルを再構築できます。信頼できるプライベート環境で使いましょう——パスワードやリカバリーキーの場合は特に。" },
    ],
    ko: [
      { question: "인터넷 없이 정말 기기 간 파일 전송이 가능한가요?", answer: "가능합니다. 두 기기에서 QR 파일 전송 페이지를 한 번씩 열면 이후 전송은 완전히 오프라인으로 진행됩니다. 보내는 쪽은 애니메이션 QR 스트림을 표시하고 받는 쪽 카메라가 읽습니다 — 데이터는 네트워크 패킷이 아닌 빛으로 물리적 단절을 건너며 Wi-Fi, 블루투스, 케이블, 클라우드가 전혀 개입하지 않습니다." },
      { question: "도구는 받은 파일이 온전한지 어떻게 보장하나요?", answer: "파일은 파운틴 코딩 패킷으로 나뉩니다: 받는 쪽은 순서나 누락과 무관하게, 포획한 프레임의 충분히 큰 임의의 집합에서 완전한 원본을 재구성할 수 있습니다. 재구성 후 SHA-256으로 해시해 보내는 쪽이 선언한 해시와 비교 — 체크섬이 일치할 때만 전송 성공을 보고합니다." },
      { question: "파일 크기 한도와 전송 속도는 어떻게 되나요?", answer: "최대 64 MB까지 지원합니다. 속도는 조명, 화면 밝기, 카메라 안정성에 따르지만 초당 수십 KB 정도를 예상하세요 — 작은 문서나 사진 몇 장은 한두 분, 큰 미디어 파일은 케이블이나 로컬 네트워크가 적합합니다." },
      { question: "QR 파일 전송은 안전한가요?", answer: "서버가 개입하지 않고 네트워크상 가로챌 대상도 없지만, 데이터는 QR 코드로 보이므로 전송 화면을 또렷이 볼 수 있는 사람은 프레임을 촬영해 파일을 재구성할 수 있습니다. 신뢰할 수 있는 개인 환경에서 사용하세요 — 비밀번호나 복구 키라면 특히." },
    ],
    ru: [
      { question: "Действительно можно передавать файлы между устройствами без интернета?", answer: "Да. Оба устройства один раз открывают страницу передачи файлов по QR; дальше вся передача идёт офлайн. Отправитель показывает анимированный QR-поток, камера получателя его читает — данные пересекают воздушный зазор как свет, а не как сетевые пакеты, поэтому Wi-Fi, Bluetooth, кабель или облачный сервис не участвуют вовсе." },
      { question: "Как инструмент гарантирует, что файл получен без повреждений?", answer: "Файл делится на пакеты с фонтанным кодированием: получатель может собрать полный оригинал из любого достаточно большого набора пойманных кадров, независимо от порядка и пропусков. После сборки результат хешируется SHA-256 и сравнивается с хешем, заявленным отправителем, — передача отмечается как успешная, только когда контрольная сумма совпала." },
      { question: "Каков лимит размера файла и скорость передачи?", answer: "Поддерживаются файлы до 64 МБ. Скорость зависит от освещения, яркости экрана и стабильности камеры, но рассчитывайте примерно на десятки КБ в секунду — небольшой документ или несколько фото займут минуту-другую, а крупные медиафайлы лучше передавать кабелем или по локальной сети." },
      { question: "Безопасна ли передача файлов по QR?", answer: "Сервер в процессе не участвует, и перехватывать в сети нечего, но данные видны как QR-коды всякому, кто хорошо видит экран отправителя, — наблюдатель или камера могут заснять кадры и восстановить файл. Используйте инструмент в доверенной приватной обстановке, особенно для паролей и ключей восстановления." },
    ],
    es: [
      { question: "¿De verdad se pueden transferir archivos entre dispositivos sin internet?", answer: "Sí. Ambos dispositivos abren una vez la página de transferencia de archivos por QR; a partir de ahí, toda la transferencia ocurre sin conexión. El emisor muestra un flujo animado de códigos QR y la cámara del receptor los lee — los datos cruzan el aislamiento físico como luz, no como paquetes de red, sin que intervengan Wi-Fi, Bluetooth, cables ni servicios en la nube." },
      { question: "¿Cómo garantiza la herramienta que el archivo recibido está intacto?", answer: "El archivo se divide en paquetes con codificación fuente: el receptor puede reensamblar el original completo a partir de cualquier conjunto de fotogramas capturados suficientemente grande, sin importar el orden ni los fotogramas perdidos. Una vez reensamblado, el resultado se hashea con SHA-256 y se compara con el hash declarado por el emisor — la transferencia solo informa de éxito cuando la suma de comprobación coincide." },
      { question: "¿Cuál es el límite de tamaño y la velocidad de transferencia?", answer: "Se admiten archivos de hasta 64 MB. La velocidad depende de la iluminación, el brillo de la pantalla y la estabilidad de la cámara, pero espera en torno a decenas de KB por segundo — un documento pequeño o unas pocas fotos tardan uno o dos minutos, mientras que los archivos multimedia grandes van mejor por cable o red local." },
      { question: "¿Es segura la transferencia de archivos por QR?", answer: "No hay servidor de por medio y nada que interceptar en la red, pero los datos son visibles como códigos QR para cualquiera con visión clara de la pantalla emisora — un espectador o una cámara pueden filmar los fotogramas y reconstruir el archivo. Usa la herramienta en entornos de confianza y privados, sobre todo con contraseñas o claves de recuperación." },
    ],
  },
};
