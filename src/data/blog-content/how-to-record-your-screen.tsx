import type { ReactNode } from "react";
import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> You can record your screen directly in your browser with no software to install. Choose to capture your full screen, a window, or a browser tab. Add system audio and microphone if needed. The recording saves as a WebM file with no watermark and no time limit.</p>
      </aside>

      <section>
        <h2>Why Record Your Screen</h2>
        <p>Screen recording is essential for tutorials, bug reports, presentations, remote work demos, and content creation. Instead of writing long explanations, show exactly what you mean. A 30-second screen recording often replaces a page of documentation.</p>
      </section>

      <section>
        <h2>Browser-Based vs Desktop Apps</h2>
        <p><strong>Browser-based recorders</strong> use the built-in MediaRecorder API. No download, no install, works on any OS. The tradeoff is WebM output (not MP4) and limited editing options.</p>
        <p><strong>Desktop apps</strong> like OBS, Loom, or Camtasia offer more features — scene switching, editing, MP4 output — but require installation and often have watermarks or time limits on free tiers.</p>
        <p>For quick recordings without fuss, browser-based is the way to go. For professional production, desktop apps are better.</p>
      </section>

      <section>
        <h2>How to Capture Audio</h2>
        <p><strong>Tab audio:</strong> When you share a browser tab, you get the option to include tab audio. This captures any sound playing in that tab — videos, music, web apps.</p>
        <p><strong>System audio:</strong> When sharing your entire screen, audio capture depends on your OS. Windows supports it in Chrome. macOS requires you to grant screen recording permissions in System Settings.</p>
        <p><strong>Microphone:</strong> Enable microphone capture separately to add voiceover narration to your recording. This is great for tutorials and walkthroughs.</p>
      </section>

      <section>
        <h2>Tips for Better Recordings</h2>
        <ul>
          <li><strong>Clean your desktop:</strong> Close unnecessary windows and notifications before recording.</li>
          <li><strong>Use a consistent resolution:</strong> Record at 1080p for a good balance of quality and file size.</li>
          <li><strong>Zoom in on important areas:</strong> Use your OS zoom (Ctrl/Cmd + scroll) to make small UI elements visible.</li>
          <li><strong>Keep it short:</strong> Break long recordings into shorter clips. Viewers drop off after 2-3 minutes.</li>
        </ul>
      </section>

      <section>
        <h2>Record Your Screen for Free</h2>
        <p>Our <Link href="/tools/screen-recorder" className="text-blue-400 hover:text-blue-300">free Screen Recorder</Link> captures your screen, webcam, or browser tab with audio. No watermark, no time limit, no signup. Works in Chrome, Edge, and Firefox.</p>
        <ToolCTA name="Screen Recorder" href="/tools/screen-recorder" description="Record your screen, webcam, or browser tab with audio. No watermark, no time limit — runs entirely in your browser." />
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>太长不看：</strong>你可以直接在浏览器里录屏，无需安装任何软件。选择录制整个屏幕、某个窗口或某个浏览器标签页即可。需要时还可以加入系统声音和麦克风。录制结果以 WebM 格式保存，无水印、无时长限制。</p>
      </aside>

      <section>
        <h2>为什么要录屏</h2>
        <p>录屏在教程、Bug 反馈、演示、远程工作展示和内容创作中都不可或缺。与其写长篇大论的解释，不如直接展示你想表达的内容。一段 30 秒的录屏往往能顶一页文档。</p>
      </section>

      <section>
        <h2>浏览器录屏 vs 桌面软件</h2>
        <p><strong>浏览器录屏工具</strong>使用内置的 MediaRecorder API。无需下载、无需安装，任何操作系统都能用。代价是只能输出 WebM（而非 MP4），且编辑功能有限。</p>
        <p><strong>桌面软件</strong>如 OBS、Loom 或 Camtasia 功能更丰富——场景切换、剪辑、MP4 输出——但需要安装，而且免费版往往有水印或时长限制。</p>
        <p>想快速录屏、不想折腾，浏览器方案是首选。专业制作则桌面软件更合适。</p>
      </section>

      <section>
        <h2>如何录制声音</h2>
        <p><strong>标签页声音：</strong>分享浏览器标签页时，可以选择同时录制该标签页的声音。标签页中播放的任何声音——视频、音乐、网页应用——都会被录下来。</p>
        <p><strong>系统声音：</strong>录制整个屏幕时，能否捕获系统声音取决于操作系统。Windows 在 Chrome 中支持，macOS 需要先在系统设置中授予屏幕录制权限。</p>
        <p><strong>麦克风：</strong>单独开启麦克风采集，可以为录制内容加上旁白解说。做教程和操作演示时非常有用。</p>
      </section>

      <section>
        <h2>让录制效果更好的技巧</h2>
        <ul>
          <li><strong>清理桌面：</strong>录制前关掉无关的窗口和通知。</li>
          <li><strong>使用稳定的分辨率：</strong>以 1080p 录制，画质和文件大小能达到良好平衡。</li>
          <li><strong>放大关键区域：</strong>用系统缩放（Ctrl/Cmd + 滚轮）让细小的界面元素清晰可见。</li>
          <li><strong>保持简短：</strong>把长录制拆成多个短视频。观众在 2-3 分钟后就会流失。</li>
        </ul>
      </section>

      <section>
        <h2>免费录屏</h2>
        <p>我们的<Link href="/tools/screen-recorder" className="text-blue-400 hover:text-blue-300">免费录屏工具</Link>可以录制屏幕、摄像头或浏览器标签页并带声音。无水印、无时长限制、无需注册。支持 Chrome、Edge 和 Firefox。</p>
        <ToolCTA name="录屏工具" href="/tools/screen-recorder" description="录制屏幕、摄像头或浏览器标签页并带声音。无水印、无时长限制——完全在浏览器中运行。" />
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="要約" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>要約：</strong>ブラウザ内でソフトをインストールせずに画面を録画できます。フルスクリーン、ウィンドウ、ブラウザタブのいずれかを選んでキャプチャしましょう。必要に応じてシステム音声やマイクも追加できます。録画は WebM 形式で保存され、ウォーターマークも時間制限もありません。</p>
      </aside>

      <section>
        <h2>画面録画が役立つ場面</h2>
        <p>画面録画は、チュートリアル、バグ報告、プレゼン、リモートワークのデモ、コンテンツ制作に欠かせません。長い説明を書く代わりに、言いたいことをそのまま見せましょう。30 秒の録画がドキュメント 1 ページ分の代わりになることもよくあります。</p>
      </section>

      <section>
        <h2>ブラウザ型 vs デスクトップアプリ</h2>
        <p><strong>ブラウザ型レコーダー</strong>は内蔵の MediaRecorder API を使用します。ダウンロードもインストールも不要で、どの OS でも動作します。代償として出力が WebM（MP4 ではない）で、編集機能は限られます。</p>
        <p><strong>デスクトップアプリ</strong>（OBS、Loom、Camtasia など）は、シーン切り替え、編集、MP4 出力など豊富な機能を備えますが、インストールが必要で、無料プランにはウォーターマークや時間制限があることが多いです。</p>
        <p>手間なく手早く録画したいならブラウザ型がおすすめです。本格的な制作にはデスクトップアプリが適しています。</p>
      </section>

      <section>
        <h2>音声を録音する方法</h2>
        <p><strong>タブの音声：</strong>ブラウザタブを共有すると、タブの音声を含めるオプションが選べます。そのタブで再生されている動画や音楽、Web アプリの音など、あらゆる音を録音できます。</p>
        <p><strong>システム音声：</strong>画面全体を共有する場合、音声のキャプチャは OS に依存します。Windows では Chrome が対応しています。macOS ではシステム設定で画面収録の権限を許可する必要があります。</p>
        <p><strong>マイク：</strong>マイクを別途有効にすると、録画にナレーションを追加できます。チュートリアルや操作解説に最適です。</p>
      </section>

      <section>
        <h2>より良い録画のコツ</h2>
        <ul>
          <li><strong>デスクトップを片付ける：</strong>録画前に不要なウィンドウや通知を閉じましょう。</li>
          <li><strong>解像度を一定に保つ：</strong>画質とファイルサイズのバランスが良い 1080p で録画しましょう。</li>
          <li><strong>重要な部分を拡大する：</strong>OS のズーム（Ctrl/Cmd + スクロール）で小さい UI 要素を見やすくしましょう。</li>
          <li><strong>短くまとめる：</strong>長い録画は短いクリップに分割しましょう。視聴者は 2〜3 分で離脱します。</li>
        </ul>
      </section>

      <section>
        <h2>画面を無料で録画する</h2>
        <p>当サイトの<Link href="/tools/screen-recorder" className="text-blue-400 hover:text-blue-300">無料画面録画ツール</Link>は、画面・ウェブカメラ・ブラウザタブを音声付きで録画できます。ウォーターマークなし、時間制限なし、登録不要。Chrome、Edge、Firefox に対応しています。</p>
        <ToolCTA name="画面録画ツール" href="/tools/screen-recorder" description="画面・ウェブカメラ・ブラウザタブを音声付きで録画。ウォーターマークなし、時間制限なしでブラウザ内で完結します。" />
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>요약:</strong> 설치할 소프트웨어 없이 브라우저에서 바로 화면을 녹화할 수 있습니다. 전체 화면, 창, 브라우저 탭 중 하나를 선택해 캡처하세요. 필요하면 시스템 오디오와 마이크도 추가할 수 있습니다. 녹화본은 워터마크와 시간 제한 없이 WebM 파일로 저장됩니다.</p>
      </aside>

      <section>
        <h2>화면 녹화가 유용한 이유</h2>
        <p>화면 녹화는 튜토리얼, 버그 리포트, 프레젠테이션, 원격 근무 데모, 콘텐츠 제작에 꼭 필요합니다. 긴 설명을 쓰는 대신 말하고 싶은 내용을 그대로 보여주세요. 30초짜리 화면 녹화가 문서 한 페이지를 대신하는 경우가 많습니다.</p>
      </section>

      <section>
        <h2>브라우저 기반 vs 데스크톱 앱</h2>
        <p><strong>브라우저 기반 레코더</strong>는 내장된 MediaRecorder API를 사용합니다. 다운로드도 설치도 필요 없고 어떤 OS에서도 작동합니다. 단점은 출력이 WebM(MP4 아님)이고 편집 옵션이 제한적이라는 점입니다.</p>
        <p><strong>데스크톱 앱</strong>(OBS, Loom, Camtasia 등)은 장면 전환, 편집, MP4 출력 등 더 많은 기능을 제공하지만 설치가 필요하고, 무료 버전에는 워터마크나 시간 제한이 있는 경우가 많습니다.</p>
        <p>번거로움 없이 빠르게 녹화하려면 브라우저 기반이 정답입니다. 전문적인 제작에는 데스크톱 앱이 더 좋습니다.</p>
      </section>

      <section>
        <h2>오디오를 녹음하는 방법</h2>
        <p><strong>탭 오디오:</strong> 브라우저 탭을 공유하면 탭 오디오 포함 옵션을 선택할 수 있습니다. 그 탭에서 재생되는 모든 소리(동영상, 음악, 웹 앱)를 캡처합니다.</p>
        <p><strong>시스템 오디오:</strong> 전체 화면을 공유할 때 오디오 캡처는 OS에 따라 다릅니다. Windows는 Chrome에서 지원하고, macOS는 시스템 설정에서 화면 녹화 권한을 허용해야 합니다.</p>
        <p><strong>마이크:</strong> 마이크 캡처를 별도로 켜면 녹화물에 나레이션을 추가할 수 있습니다. 튜토리얼과 설명 영상에 좋습니다.</p>
      </section>

      <section>
        <h2>더 좋은 녹화를 위한 팁</h2>
        <ul>
          <li><strong>데스크톱을 정리하세요:</strong> 녹화 전에 불필요한 창과 알림을 닫으세요.</li>
          <li><strong>일정한 해상도를 사용하세요:</strong> 화질과 파일 크기의 균형이 좋은 1080p로 녹화하세요.</li>
          <li><strong>중요한 영역을 확대하세요:</strong> OS 확대(Ctrl/Cmd + 스크롤)를 사용해 작은 UI 요소를 보이게 하세요.</li>
          <li><strong>짧게 유지하세요:</strong> 긴 녹화는 짧은 클립으로 나누세요. 시청자는 2~3분이 지나면 이탈합니다.</li>
        </ul>
      </section>

      <section>
        <h2>화면 무료로 녹화하기</h2>
        <p>당사의<Link href="/tools/screen-recorder" className="text-blue-400 hover:text-blue-300">무료 화면 녹화기</Link>로 화면, 웹캠, 브라우저 탭을 오디오와 함께 캡처할 수 있습니다. 워터마크 없음, 시간 제한 없음, 가입 불필요. Chrome, Edge, Firefox에서 작동합니다.</p>
        <ToolCTA name="화면 녹화기" href="/tools/screen-recorder" description="화면, 웹캠, 브라우저 탭을 오디오와 함께 녹화합니다. 워터마크 없음, 시간 제한 없음 — 브라우저 안에서 완전히 실행됩니다." />
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "Can I record my screen for free without a watermark?", answer: "Yes. Browser-based screen recorders use the MediaRecorder API built into your browser. They produce watermark-free recordings with no time limit, no signup, and no software to install." },
      { question: "Can I record system audio?", answer: "Yes, when sharing a browser tab. System audio capture when sharing an entire screen depends on your OS. macOS requires additional permissions. Windows supports it natively in most browsers." },
      { question: "What format are recordings saved in?", answer: "Browser-based recorders save in WebM format. This plays in all modern browsers and VLC. You can convert to MP4 using a video converter if needed for compatibility with older software." },
      { question: "Is there a time limit?", answer: "No. Browser-based recorders have no time limit. The recording is stored in your browser's memory, so very long recordings (multiple hours) may use significant RAM." },
    ],
    zh: [
      { question: "可以免费录屏且不带水印吗？", answer: "可以。浏览器录屏工具使用浏览器内置的 MediaRecorder API，录制结果无水印、无时长限制、无需注册，也无需安装任何软件。" },
      { question: "能录制系统声音吗？", answer: "分享浏览器标签页时可以。录制整个屏幕时能否捕获系统声音取决于操作系统：macOS 需要额外授权，Windows 在大多数浏览器中原生支持。" },
      { question: "录制结果保存为什么格式？", answer: "浏览器录屏工具保存为 WebM 格式，所有现代浏览器和 VLC 都能播放。如果需要兼容旧软件，可以用视频转换工具转成 MP4。" },
      { question: "有录制时长限制吗？", answer: "没有。浏览器录屏工具没有时长限制。不过录制内容存储在浏览器内存中，超长录制（数小时）可能会占用大量内存。" },
    ],
    ja: [
      { question: "ウォーターマークなしで無料の画面録画はできますか？", answer: "できます。ブラウザ型のレコーダーはブラウザ内蔵の MediaRecorder API を使用するため、ウォーターマークなし、時間制限なし、登録不要で、ソフトのインストールも不要です。" },
      { question: "システム音声も録音できますか？", answer: "ブラウザタブを共有する場合は録音できます。画面全体を共有する場合のシステム音声キャプチャは OS に依存します。macOS は追加の権限が必要で、Windows はほとんどのブラウザでネイティブ対応しています。" },
      { question: "録画は何形式で保存されますか？", answer: "ブラウザ型レコーダーは WebM 形式で保存します。これは最新のブラウザと VLC ならすべて再生できます。古いソフトとの互換性が必要なら、動画変換ツールで MP4 に変換できます。" },
      { question: "時間制限はありますか？", answer: "ありません。ブラウザ型レコーダーに時間制限はありません。録画はブラウザのメモリに保存されるため、数時間におよぶ長い録画はメモリを大きく消費することがあります。" },
    ],
    ko: [
      { question: "워터마크 없이 무료로 화면을 녹화할 수 있나요?", answer: "네. 브라우저 기반 화면 녹화기는 브라우저에 내장된 MediaRecorder API를 사용합니다. 워터마크 없는 녹화물을 시간 제한, 가입, 설치할 소프트웨어 없이 만들 수 있습니다." },
      { question: "시스템 오디오도 녹음할 수 있나요?", answer: "브라우저 탭을 공유할 때는 가능합니다. 전체 화면을 공유할 때 시스템 오디오 캡처는 OS에 따라 다릅니다. macOS는 추가 권한이 필요하고, Windows는 대부분의 브라우저에서 기본으로 지원합니다." },
      { question: "녹화물은 어떤 형식으로 저장되나요?", answer: "브라우저 기반 녹화기는 WebM 형식으로 저장합니다. 모든 최신 브라우저와 VLC에서 재생됩니다. 오래된 소프트웨어와의 호환이 필요하면 동영상 변환기를 사용해 MP4로 변환할 수 있습니다." },
      { question: "시간 제한이 있나요?", answer: "없습니다. 브라우저 기반 녹화기에는 시간 제한이 없습니다. 녹화물은 브라우저 메모리에 저장되므로, 수 시간에 이르는 아주 긴 녹화는 상당한 RAM을 사용할 수 있습니다." },
    ],
  },
};
