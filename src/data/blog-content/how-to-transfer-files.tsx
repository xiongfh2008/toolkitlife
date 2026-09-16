import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

const tableCls = "w-full text-sm border-collapse my-6";
const thCls = "border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-left font-semibold";
const tdCls = "border border-zinc-700 px-3 py-2 align-top";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> The fastest cable-free way to move files between your phone and laptop is a browser-based peer-to-peer transfer: both devices open the same page, type a 6-character code, and files travel directly between them. There is no cloud upload, no account, no file size limit, and the connection is end-to-end encrypted. It takes under a minute to set up.</p>
      </aside>

      <img src="/blog/how-to-transfer-files.jpg" alt="Phone and laptop exchanging files over an encrypted peer-to-peer connection" width={1600} height={900} className="mb-8 w-full h-auto rounded-xl" />

      <section>
        <h2>What Is the Best Way to Transfer Files Without a Cable?</h2>
        <p>For most people, a browser-based peer-to-peer transfer is the best all-round option: it needs no cable, no account, and has no size limit, and files never leave your devices. Here is how the five common methods compare.</p>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>Method</th>
              <th className={thCls}>Cable needed</th>
              <th className={thCls}>Size limit</th>
              <th className={thCls}>Files leave your devices</th>
              <th className={thCls}>Setup</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdCls}><strong>Browser P2P (File Transfer)</strong></td>
              <td className={tdCls}>No</td>
              <td className={tdCls}>None</td>
              <td className={tdCls}>No — end-to-end encrypted</td>
              <td className={tdCls}>Open page, share 6-char code</td>
            </tr>
            <tr>
              <td className={tdCls}>USB cable</td>
              <td className={tdCls}>Yes</td>
              <td className={tdCls}>None</td>
              <td className={tdCls}>No</td>
              <td className={tdCls}>Cable + permission prompts</td>
            </tr>
            <tr>
              <td className={tdCls}>Cloud drive</td>
              <td className={tdCls}>No</td>
              <td className={tdCls}>2–15 GB free tiers</td>
              <td className={tdCls}>Yes — uploaded to provider</td>
              <td className={tdCls}>Account on both devices</td>
            </tr>
            <tr>
              <td className={tdCls}>Messaging app</td>
              <td className={tdCls}>No</td>
              <td className={tdCls}>Typically 100 MB–2 GB, often recompressed</td>
              <td className={tdCls}>Yes — stored on servers</td>
              <td className={tdCls}>App + account on both devices</td>
            </tr>
            <tr>
              <td className={tdCls}>Email attachment</td>
              <td className={tdCls}>No</td>
              <td className={tdCls}>20–25 MB</td>
              <td className={tdCls}>Yes — stored on servers</td>
              <td className={tdCls}>Account required</td>
            </tr>
          </tbody>
        </table>
        <p>USB is fine for a one-off sync at your desk. Cloud and messengers are convenient but copy your files to third-party servers and often cap or recompress them. Peer-to-peer in the browser gives you the speed of a direct connection with none of the storage trade-offs.</p>
      </section>

      <section>
        <h2>How to Send Files from Phone to Laptop with Your Browser</h2>
        <p>Our free <Link href="/tools/file-transfer" className="text-blue-400 hover:text-blue-300">File Transfer tool</Link> connects any two devices with a modern browser — Android to Windows, iPhone to Mac, tablet to PC — in four steps. Both devices need to be online at the same time.</p>
        <ol>
          <li>Open the tool on the sending device and click <strong>Create a room</strong>. You get a 6-character code and a QR code.</li>
          <li>On the receiving device, scan the QR code, open the shared link, or type the code into <strong>Join a room</strong>.</li>
          <li>Wait until both devices show as connected.</li>
          <li>Drag files into the drop area or tap to choose them. The transfer starts immediately and the file downloads on the other device.</li>
        </ol>
        <ToolCTA name="File Transfer" href="/tools/file-transfer" description="Send files directly between your devices over an encrypted peer-to-peer connection — phone to laptop, tablet to PC. No upload, no signup, no file size limits." />
      </section>

      <section>
        <h2>Is Browser-Based File Transfer Safe?</h2>
        <p>Yes, for moving files between your own devices it is a private method. The transfer uses WebRTC, the same technology that carries video calls, and WebRTC mandates end-to-end encryption — the data stream can only be decrypted by the two connected devices. A relaying service helps the devices find each other, but it never sees the file contents, and nothing is written to any server. Close the page and the room disappears.</p>
        <p>One practical caution: only share the room code with the device you intend to pair. Anyone who enters the code while the room is open can join, so treat the code like a one-time password.</p>
      </section>

      <section>
        <h2>When Should You Still Use a Cable or the Cloud?</h2>
        <p>A USB cable remains the right choice for full phone backups and multi-gigabyte video libraries, because it does not depend on both devices staying awake and online. A cloud drive is hard to beat when you want files synced continuously across more than two devices or need a link to share with other people. For everything else — photos from tonight, a contract PDF, a voice memo — a direct browser transfer is the quickest path from one device to the other.</p>
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>太长不看：</strong>手机和笔记本之间最快的免数据线传文件方式是浏览器点对点直传：两台设备打开同一页面，输入 6 位房间码，文件直接在设备之间传输。不上传云端、无需账号、没有大小限制，连接端到端加密。准备不到一分钟。</p>
      </aside>

      <img src="/blog/how-to-transfer-files.jpg" alt="手机与笔记本通过加密点对点连接互传文件" width={1600} height={900} className="mb-8 w-full h-auto rounded-xl" />

      <section>
        <h2>不用数据线，哪种传文件方式最好？</h2>
        <p>对大多数人来说，浏览器点对点直传是最均衡的选择：不需要数据线、不需要账号、没有大小限制，文件也不会离开你的设备。五种常见方式对比如下。</p>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>方式</th>
              <th className={thCls}>需要数据线</th>
              <th className={thCls}>大小限制</th>
              <th className={thCls}>文件是否离开你的设备</th>
              <th className={thCls}>准备步骤</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdCls}><strong>浏览器 P2P（文件传输）</strong></td>
              <td className={tdCls}>否</td>
              <td className={tdCls}>无</td>
              <td className={tdCls}>否 — 端到端加密</td>
              <td className={tdCls}>打开页面，共享 6 位房间码</td>
            </tr>
            <tr>
              <td className={tdCls}>USB 数据线</td>
              <td className={tdCls}>是</td>
              <td className={tdCls}>无</td>
              <td className={tdCls}>否</td>
              <td className={tdCls}>连线 + 权限授权</td>
            </tr>
            <tr>
              <td className={tdCls}>云盘</td>
              <td className={tdCls}>否</td>
              <td className={tdCls}>免费空间 2–15 GB</td>
              <td className={tdCls}>是 — 上传到服务商</td>
              <td className={tdCls}>两台设备都要登录账号</td>
            </tr>
            <tr>
              <td className={tdCls}>即时通讯软件</td>
              <td className={tdCls}>否</td>
              <td className={tdCls}>通常 100 MB–2 GB，且常被压缩</td>
              <td className={tdCls}>是 — 存储在服务器</td>
              <td className={tdCls}>双方都要装 App 并登录</td>
            </tr>
            <tr>
              <td className={tdCls}>邮件附件</td>
              <td className={tdCls}>否</td>
              <td className={tdCls}>20–25 MB</td>
              <td className={tdCls}>是 — 存储在服务器</td>
              <td className={tdCls}>需要账号</td>
            </tr>
          </tbody>
        </table>
        <p>USB 适合在工位上偶尔同步一次；云盘和聊天软件方便，但文件会被复制到第三方服务器，还常被限量或压缩。浏览器点对点直传既有直连的速度，又没有存储方面的代价。</p>
      </section>

      <section>
        <h2>如何用浏览器把手机文件传到电脑？</h2>
        <p>我们的免费<Link href="/tools/file-transfer" className="text-blue-400 hover:text-blue-300">文件传输工具</Link>四步连接任意两台装有现代浏览器的设备——安卓到 Windows、iPhone 到 Mac、平板到 PC 都可以。两台设备需要同时在线。</p>
        <ol>
          <li>在发送设备上打开工具，点击<strong>创建房间</strong>，会得到一个 6 位房间码和二维码。</li>
          <li>在接收设备上扫描二维码、打开分享链接，或在<strong>加入房间</strong>中输入房间码。</li>
          <li>等待页面显示两台设备已连接。</li>
          <li>把文件拖入投放区或点击选择，传输立即开始，文件在另一台设备上直接下载。</li>
        </ol>
        <ToolCTA name="文件传输" href="/tools/file-transfer" description="在你的设备之间通过加密点对点连接直接传文件——手机到笔记本、平板到 PC。不上传、无需注册、没有文件大小限制。" />
      </section>

      <section>
        <h2>浏览器传文件安全吗？</h2>
        <p>在自家设备之间互传，这是很私密的方式。传输使用 WebRTC——视频通话背后的同一技术，WebRTC 强制端到端加密：数据流只有两台已连接的设备能解密。中继服务只帮设备互相找到对方，看不到文件内容，任何服务器上都不会留存任何东西。关闭页面，房间即消失。</p>
        <p>一个实用提醒：房间码只告诉你要配对的那台设备。房间开着时任何人拿到码都能加入，所以要把房间码当作一次性密码来对待。</p>
      </section>

      <section>
        <h2>什么情况下仍该用数据线或云盘？</h2>
        <p>整机备份和几十 GB 的视频库仍适合 USB 线，因为它不依赖两台设备一直保持唤醒和在线。想在超过两台设备间持续同步文件、或要把链接发给别人时，云盘依然难以替代。其余场景——今晚拍的照片、一份合同 PDF、一段语音备忘——浏览器直传都是从这台设备到那台设备最快的路。</p>
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="要約" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>要約：</strong>スマホとノート PC の間でケーブルなしでファイルを動かす最速の方法は、ブラウザのピアツーピア転送です。2 台のデバイスで同じページを開き、6 桁のコードを入力すれば、ファイルはデバイス間を直接移動します。クラウドへのアップロードもアカウント登録もサイズ制限もなく、接続はエンドツーエンドで暗号化されます。準備は 1 分足りません。</p>
      </aside>

      <img src="/blog/how-to-transfer-files.jpg" alt="スマホとノート PC が暗号化されたピアツーピア接続でファイルをやり取りする様子" width={1600} height={900} className="mb-8 w-full h-auto rounded-xl" />

      <section>
        <h2>ケーブルなしでファイルを転送する最良の方法は？</h2>
        <p>ほとんどの人にとって、ブラウザのピアツーピア転送が最もバランスの取れた選択肢です。ケーブルもアカウントも不要で、サイズ制限はなく、ファイルがデバイスの外に出ることもありません。代表的な 5 つの方法を比較します。</p>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>方法</th>
              <th className={thCls}>ケーブル</th>
              <th className={thCls}>サイズ制限</th>
              <th className={thCls}>デバイス外に保存される</th>
              <th className={thCls}>準備</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdCls}><strong>ブラウザ P2P（ファイル転送）</strong></td>
              <td className={tdCls}>不要</td>
              <td className={tdCls}>なし</td>
              <td className={tdCls}>いいえ — エンドツーエンドで暗号化</td>
              <td className={tdCls}>ページを開き 6 桁コードを共有</td>
            </tr>
            <tr>
              <td className={tdCls}>USB ケーブル</td>
              <td className={tdCls}>必要</td>
              <td className={tdCls}>なし</td>
              <td className={tdCls}>いいえ</td>
              <td className={tdCls}>接続 + 許可の操作</td>
            </tr>
            <tr>
              <td className={tdCls}>クラウドドライブ</td>
              <td className={tdCls}>不要</td>
              <td className={tdCls}>無料枠 2〜15 GB</td>
              <td className={tdCls}>はい — プロバイダーにアップロード</td>
              <td className={tdCls}>両デバイスでアカウント登録</td>
            </tr>
            <tr>
              <td className={tdCls}>メッセージアプリ</td>
              <td className={tdCls}>不要</td>
              <td className={tdCls}>通常 100 MB〜2 GB、再圧縮あり</td>
              <td className={tdCls}>はい — サーバーに保存</td>
              <td className={tdCls}>両デバイスにアプリとアカウント</td>
            </tr>
            <tr>
              <td className={tdCls}>メール添付</td>
              <td className={tdCls}>不要</td>
              <td className={tdCls}>20〜25 MB</td>
              <td className={tdCls}>はい — サーバーに保存</td>
              <td className={tdCls}>アカウントが必要</td>
            </tr>
          </tbody>
        </table>
        <p>USB は机での一度きりの同期に向きます。クラウドやメッセンジャーは便利ですが、ファイルは第三者のサーバーにコピーされ、容量制限や再圧縮の対象になります。ブラウザのピアツーピアは、直接接続の速さを保存先のリスクなしで得られます。</p>
      </section>

      <section>
        <h2>ブラウザでスマホから PC へファイルを送る方法</h2>
        <p>無料の<Link href="/tools/file-transfer" className="text-blue-400 hover:text-blue-300">ファイル転送ツール</Link>は、最新ブラウザがあれば Android と Windows、iPhone と Mac、タブレットと PC など、どの組み合わせでも 4 ステップで接続できます。両デバイスを同時にオンラインにしてください。</p>
        <ol>
          <li>送信側デバイスでツールを開き、<strong>ルームを作成</strong>をクリックします。6 桁のコードと QR コードが表示されます。</li>
          <li>受信側デバイスで QR コードを読み取るか、共有リンクを開くか、<strong>ルームに参加</strong>にコードを入力します。</li>
          <li>両デバイスが接続された表示になるのを待ちます。</li>
          <li>ファイルをドロップエリアにドラッグするか、タップして選択します。転送はすぐに始まり、相手のデバイスでそのままダウンロードされます。</li>
        </ol>
        <ToolCTA name="ファイル転送" href="/tools/file-transfer" description="暗号化されたピアツーピア接続でデバイス間直接ファイル送信 — スマホからノート PC、タブレットから PC へ。アップロード不要、登録不要、サイズ制限なし。" />
      </section>

      <section>
        <h2>ブラウザでのファイル転送は安全？</h2>
        <p>自分のデバイス間でファイルを移す分には、非常にプライベートな方法です。転送にはビデオ通話と同じ WebRTC 技術を使い、WebRTC はエンドツーエンド暗号化が必須のため、データは接続された 2 台のデバイスでしか復号できません。中継サーバーはデバイスが互いを見つけるのを助けるだけで、ファイルの中身は見えず、サーバーには何も残りません。ページを閉じればルームは消えます。</p>
        <p>実用上の注意：ルームコードはペアリングしたいデバイスにだけ教えてください。ルームが開いている間は、コードを知る人は誰でも参加できます。コードはワンタイムパスワード扱いにしましょう。</p>
      </section>

      <section>
        <h2>ケーブルやクラウドがまだ良い場合は？</h2>
        <p>端末全体のバックアップや数十 GB の動画ライブラリには、今も USB ケーブルが最適です。両デバイスが起きてオンラインである必要がないためです。3 台以上のデバイスで継続的に同期したい、リンクを他の人と共有したい場合はクラウドが有利です。それ以外 — 今夜撮った写真、契約書の PDF、ボイスメモ — には、ブラウザ直伝が最短ルートです。</p>
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>요약:</strong> 휴대폰과 노트북 사이에 케이블 없이 파일을 옮기는 가장 빠른 방법은 브라우저 기반 P2P 전송입니다. 두 기기에서 같은 페이지를 열고 6자리 코드를 입력하면 파일이 기기 사이를 직접 이동합니다. 클라우드 업로드도, 계정도, 용량 제한도 없으며 연결은 종단 간 암호화됩니다. 준비 시간은 1분 미만입니다.</p>
      </aside>

      <img src="/blog/how-to-transfer-files.jpg" alt="휴대폰과 노트북이 암호화된 P2P 연결로 파일을 주고받는 모습" width={1600} height={900} className="mb-8 w-full h-auto rounded-xl" />

      <section>
        <h2>케이블 없이 파일을 전송하는 가장 좋은 방법은?</h2>
        <p>대부분에게 브라우저 P2P 전송이 가장 균형 잡힌 선택입니다. 케이블도 계정도 필요 없고, 용량 제한이 없으며, 파일이 기기를 떠나지도 않습니다. 다섯 가지 일반적인 방법을 비교해 보겠습니다.</p>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>방법</th>
              <th className={thCls}>케이블 필요</th>
              <th className={thCls}>용량 제한</th>
              <th className={thCls}>기기 밖으로 나감</th>
              <th className={thCls}>준비</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdCls}><strong>브라우저 P2P(파일 전송)</strong></td>
              <td className={tdCls}>아니요</td>
              <td className={tdCls}>없음</td>
              <td className={tdCls}>아니요 — 종단 간 암호화</td>
              <td className={tdCls}>페이지 열고 6자리 코드 공유</td>
            </tr>
            <tr>
              <td className={tdCls}>USB 케이블</td>
              <td className={tdCls}>예</td>
              <td className={tdCls}>없음</td>
              <td className={tdCls}>아니요</td>
              <td className={tdCls}>연결 + 권한 승인</td>
            </tr>
            <tr>
              <td className={tdCls}>클라우드 드라이브</td>
              <td className={tdCls}>아니요</td>
              <td className={tdCls}>무료 2–15 GB</td>
              <td className={tdCls}>예 — 업체 서버에 업로드</td>
              <td className={tdCls}>양쪽 기기 계정 필요</td>
            </tr>
            <tr>
              <td className={tdCls}>메신저 앱</td>
              <td className={tdCls}>아니요</td>
              <td className={tdCls}>보통 100 MB–2 GB, 재압축됨</td>
              <td className={tdCls}>예 — 서버에 저장</td>
              <td className={tdCls}>양쪽에 앱 + 계정</td>
            </tr>
            <tr>
              <td className={tdCls}>이메일 첨부</td>
              <td className={tdCls}>아니요</td>
              <td className={tdCls}>20–25 MB</td>
              <td className={tdCls}>예 — 서버에 저장</td>
              <td className={tdCls}>계정 필요</td>
            </tr>
          </tbody>
        </table>
        <p>USB는 책상에서 가끔 동기화할 때 적합합니다. 클라우드와 메신저는 편리하지만 파일이 제3자 서버에 복사되고 용량 제한이나 재압축을 겪기도 합니다. 브라우저 P2P는 직접 연결의 속도를 저장 리스크 없이 얻는 방법입니다.</p>
      </section>

      <section>
        <h2>브라우저로 휴대폰 파일을 노트북으로 보내는 방법</h2>
        <p>무료 <Link href="/tools/file-transfer" className="text-blue-400 hover:text-blue-300">파일 전송 도구</Link>는 최신 브라우저만 있으면 안드로이드-Windows, 아이폰-Mac, 태블릿-PC 등 어떤 조합이든 4단계로 연결합니다. 두 기기가 동시에 온라인이어야 합니다.</p>
        <ol>
          <li>보내는 기기에서 도구를 열고 <strong>방 만들기</strong>를 클릭합니다. 6자리 코드와 QR 코드가 표시됩니다.</li>
          <li>받는 기기에서 QR 코드를 스캔하거나, 공유 링크를 열거나, <strong>방 참여</strong>에 코드를 입력합니다.</li>
          <li>두 기기가 연결 표시될 때까지 기다립니다.</li>
          <li>파일을 드롭 영역으로 끌거나 탭해서 선택합니다. 전송이 즉시 시작되고 상대 기기에서 바로 다운로드됩니다.</li>
        </ol>
        <ToolCTA name="파일 전송" href="/tools/file-transfer" description="암호화된 P2P 연결으로 기기 간 파일을 직접 전송 — 휴대폰에서 노트북으로, 태블릿에서 PC로. 업로드 없음, 가입 없음, 용량 제한 없음." />
      </section>

      <section>
        <h2>브라우저 파일 전송은 안전한가요?</h2>
        <p>내 기기들 사이에서 파일을 옮기는 것이라면 매우 사적입니다. 전송에는 화상 통화와 같은 WebRTC 기술이 쓰이며, WebRTC는 종단 간 암호화가 의무라 데이터 스트림은 연결된 두 기기만 해독할 수 있습니다. 중계 서버는 기기들이 서로를 찾도록 돕지만 파일 내용은 볼 수 없고, 어떤 서버에도 아무것도 저장되지 않습니다. 페이지를 닫으면 방이 사라집니다.</p>
        <p>실용적인 주의점: 방 코드는 페어링하려는 기기에만 알려주세요. 방이 열려 있는 동안 코드를 아는 사람은 누구나 참여할 수 있으니 코드를 일회용 비밀번호처럼 다루세요.</p>
      </section>

      <section>
        <h2>케이블이나 클라우드를 써야 할 때는?</h2>
        <p>전체 백업이나 수십 GB 영상 라이브러리에는 여전히 USB 케이블이 맞습니다. 두 기기가 깨어 있고 온라인 상태여야 할 필요가 없기 때문입니다. 세 대 이상의 기기에서 지속 동기화가 필요하거나 링크로 다른 사람과 공유하려면 클라우드가 유리합니다. 그 외 — 오늘 찍은 사진, 계약서 PDF, 음성 메모 — 에는 브라우저 직접 전송이 가장 빠른 길입니다.</p>
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "Does browser file transfer work between Android and iPhone?", answer: "Yes. It works across any devices with a modern browser — Android, iPhone, iPad, Windows, Mac or Linux. Nothing needs to be installed on either side." },
      { question: "Is there a file size limit?", answer: "No. Because files travel directly from one device to the other, there is no server imposing a size cap. Practical limits come only from your devices' storage and connection speed." },
      { question: "Do both devices need to be online at the same time?", answer: "Yes. Peer-to-peer transfer is a live direct connection, so both devices must have the page open at once. It is designed for moving a file now, not for leaving files for later." },
      { question: "Are my files stored on a server?", answer: "No. The transfer is end-to-end encrypted and goes straight between the devices. The coordinating service only helps the devices find each other and never sees the file contents." },
    ],
    zh: [
      { question: "浏览器传文件在安卓和 iPhone 之间能用吗？", answer: "可以。只要有现代浏览器就行——安卓、iPhone、iPad、Windows、Mac、Linux 均可，双方都不需要安装任何东西。" },
      { question: "有文件大小限制吗？", answer: "没有。文件直接从一台设备传到另一台，没有服务器设上限。实际限制只来自设备存储和网速。" },
      { question: "两台设备必须同时在线吗？", answer: "是。点对点传输是实时直连，两台设备必须同时打开页面。它适合现在就传，不适合留言留到以后。" },
      { question: "文件会存在服务器上吗？", answer: "不会。传输端到端加密、设备间直达。协调服务只帮设备互相找到对方，看不到文件内容。" },
    ],
    ja: [
      { question: "ブラウザのファイル転送は Android と iPhone の間でも使えますか？", answer: "使えます。最新のブラウザがあれば Android、iPhone、iPad、Windows、Mac、Linux などどの組み合わせでも動作し、両側にインストールは不要です。" },
      { question: "ファイルサイズの上限はありますか？", answer: "ありません。ファイルはデバイス間を直接移動するため、サーバーによる上限が存在しません。実質的な制限はデバイスの保存容量と回線速度だけです。" },
      { question: "両方のデバイスを同時にオンラインにする必要がありますか？", answer: "はい。ピアツーピア転送はリアルタイムの直接接続なので、両デバイスでページを同時に開く必要があります。後で受け取る用途には向きません。" },
      { question: "ファイルはサーバーに保存されますか？", answer: "保存されません。転送はエンドツーエンドで暗号化され、デバイス間を直接流れます。仲介サービスはデバイスの発見を助けるだけで、中身は見られません。" },
    ],
    ko: [
      { question: "브라우저 파일 전송은 안드로이드와 아이폰 사이에서도 되나요?", answer: "됩니다. 최신 브라우저만 있으면 안드로이드, 아이폰, iPad, Windows, Mac, Linux 등 어떤 조합이든 작동하며, 양쪽 모두 설치가 필요 없습니다." },
      { question: "파일 용량 제한이 있나요?", answer: "없습니다. 파일이 기기에서 기기로 직접 이동하므로 서버가 용량 상한을 두지 않습니다. 실질적 한계는 기기 저장 공간과 연결 속도뿐입니다." },
      { question: "두 기기가 동시에 온라인이어야 하나요?", answer: "네. P2P 전송은 실시간 직접 연결이므로 두 기기가 동시에 페이지를 열어 있어야 합니다. 지금 바로 옮기는 용도이지 나중을 위해 남겨두는 용도가 아닙니다." },
      { question: "파일이 서버에 저장되나요?", answer: "저장되지 않습니다. 전송은 종단 간 암호화되어 기기 사이를 직접 흐릅니다. 중계 서비스는 기기 탐색만 돕고 파일 내용은 볼 수 없습니다." },
    ],
  },
};
