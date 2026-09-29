import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> A live wallpaper is just a seamless-looping video used as your desktop or phone background. You can make one free in your browser: pick one of 12 generative 3D scenes (galaxy, waves, aurora, code rain and more), match your screen resolution, and export a 4K MP4 — no app install, nothing uploaded. A 10–20 second loop with calm, dark motion looks best and saves battery.</p>
      </aside>

      <section>
        <h2>What Is a Live Wallpaper?</h2>
        <p>A live wallpaper replaces the static image behind your icons with an animated video that loops forever. Done well, it adds depth and personality without distracting from your icons and widgets. Support varies by platform: Windows needs a wallpaper app to play video backgrounds, most Android phones can set video wallpapers directly or through launchers, and the iPhone only supports animated lock screens through Live Photos.</p>
        <p>The good news: you don&apos;t need design skills or paid apps to create one. Everything comes down to a well-made looping video file.</p>
      </section>

      <section>
        <h2>What Makes a Good Looping Wallpaper</h2>
        <p><strong>Seamless loop.</strong> The last frame must flow into the first with no visible jump. This is the single biggest difference between an amateur and a professional result — even a beautiful animation becomes annoying if it visibly restarts every few seconds.</p>
        <p><strong>Right length and pace.</strong> 10–20 seconds works best. Shorter loops feel repetitive; longer files use more memory. Calm, slow motion reads as &quot;ambient&quot; while fast motion pulls attention away from your work.</p>
        <p><strong>Dark, low-contrast palettes.</strong> Dark backgrounds make icons and text easier to read, and on OLED screens they measurably save battery. Leave the center of the frame relatively quiet so desktop icons stay legible.</p>
        <p><strong>Compatible format and exact resolution.</strong> MP4 with H.264 video plays everywhere. Match the video resolution to your screen — a 1080p video stretched to a 4K display looks soft.</p>
      </section>

      <section>
        <h2>Make One in Your Browser (Free)</h2>
        <p>The easiest route is a <Link href="/tools/live-wallpaper-generator" className="text-blue-400 hover:text-blue-300">free live wallpaper generator</Link> that renders everything locally with WebGL:</p>
        <ul>
          <li><strong>Pick a scene</strong> — 12 generative 3D styles: spiral galaxy, flowing waves, geometry field, nebula, dotted globe, neon tunnel, aurora, fireflies, snowfall, code rain, synth grid or night rain.</li>
          <li><strong>Choose colors and seed</strong> — 12 curated palettes or a custom 4-color set; the seed makes the exact look reproducible.</li>
          <li><strong>Match your screen</strong> — desktop, phone and tablet presets up to 4K, or a custom size.</li>
          <li><strong>Export</strong> — a seamless-looping MP4 (H.264, with WebM fallback) encoded offline, frame by frame, right in the browser. Nothing is uploaded to a server.</li>
        </ul>
        <p>If your device only accepts static images, the sibling <Link href="/tools/wallpaper-generator" className="text-blue-400 hover:text-blue-300">wallpaper generator</Link> exports matching still PNGs in full resolution instead.</p>
        <ToolCTA name="Live Wallpaper Generator" href="/tools/live-wallpaper-generator" description="Generate seamless-looping 3D video wallpapers in 12 scenes, export 4K MP4/WebM. Runs entirely in your browser — private and free." />
      </section>

      <section>
        <h2>Set It as Your Wallpaper</h2>
        <p><strong>Windows 10 / 11:</strong> Windows can&apos;t play video wallpapers natively, so use a wallpaper app and load your MP4 into it. Keep the file in H.264 MP4 for maximum compatibility.</p>
        <p><strong>Android:</strong> Many launchers and system themes accept video wallpapers directly — look for &quot;Video wallpaper&quot; or &quot;Live wallpaper&quot; in your wallpaper picker, then choose the downloaded MP4.</p>
        <p><strong>iPhone:</strong> iOS has no true video wallpaper. Export a still frame as your wallpaper, or convert a short clip into a Live Photo with a third-party app — it will then animate when you long-press the lock screen.</p>
      </section>

      <section>
        <h2>Keep It Smooth and Battery-Friendly</h2>
        <p>Live wallpapers trade a little battery for a lot of personality. To keep the cost low: export at 30fps instead of 60, prefer dark scenes, pick slower ambient motion over flashy effects, and use a shorter loop on laptops and phones. On OLED displays, dark palettes are dramatically more efficient.</p>
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>太长不看：</strong>动态壁纸本质是一段无缝循环的视频，用作电脑或手机背景。用浏览器即可免费制作：从 12 种程序化 3D 场景（星系、波浪、极光、代码雨等）中选一款，匹配屏幕分辨率，导出 4K MP4——无需安装软件，文件不上传服务器。10-20 秒、运动平缓的深色场景观感最好且更省电。</p>
      </aside>

      <section>
        <h2>什么是动态壁纸</h2>
        <p>动态壁纸用一段永远循环的动画视频，替代图标背后的静态图片。做得好，它能为桌面增加纵深和个性，又不会干扰图标和小组件。各平台支持不同：Windows 需要借助壁纸应用播放视频背景，多数安卓手机可以直接或通过启动器设置视频壁纸，而 iPhone 只能通过实况照片实现动画锁屏。</p>
        <p>好消息是：你既不需要设计功底，也不需要付费应用。一切的关键就是一段制作精良的循环视频。</p>
      </section>

      <section>
        <h2>好的循环壁纸长什么样</h2>
        <p><strong>无缝循环。</strong>最后一帧必须平滑接回第一帧，没有可见跳变。这是业余与专业效果最大的差别——再漂亮的动画，如果每隔几秒就明显&ldquo;重来&rdquo;一次，也会让人烦躁。</p>
        <p><strong>合适的长度与节奏。</strong>10-20 秒最合适。太短显得重复，太长占用更多内存。平缓慢速的运动给人&ldquo;氛围感&rdquo;，剧烈运动则会分散工作注意力。</p>
        <p><strong>深色低对比配色。</strong>深色背景让图标和文字更易读，在 OLED 屏幕上还能实打实省电。画面中央尽量保持安静，桌面图标才不显得杂乱。</p>
        <p><strong>兼容格式与精确分辨率。</strong>H.264 编码的 MP4 到处都能播放。视频分辨率要与屏幕一致——1080p 拉伸到 4K 显示器会发虚。</p>
      </section>

      <section>
        <h2>在浏览器里免费制作</h2>
        <p>最简单的办法是用<Link href="/tools/live-wallpaper-generator" className="text-blue-400 hover:text-blue-300">免费动态壁纸生成器</Link>，它用 WebGL 在本地完成全部渲染：</p>
        <ul>
          <li><strong>选场景</strong>——12 种程序化 3D 风格：旋涡星系、流动波浪、几何阵列、星云、点阵星球、霓虹隧道、极光、萤火虫、飘雪、代码雨、赛博网格、雨夜。</li>
          <li><strong>选配色与种子</strong>——12 套精选色板或自定义 4 色；种子让同一效果可以精确复现。</li>
          <li><strong>匹配屏幕</strong>——桌面、手机、平板预设最高 4K，也支持自定义尺寸。</li>
          <li><strong>导出</strong>——离线逐帧编码出无缝循环 MP4（H.264，带 WebM 兜底），全程在浏览器完成，不上传任何服务器。</li>
        </ul>
        <p>如果设备只接受静态图片，同门的<Link href="/tools/wallpaper-generator" className="text-blue-400 hover:text-blue-300">静态壁纸生成器</Link>可以按相同风格导出全分辨率 PNG。</p>
        <ToolCTA name="动态壁纸生成器" href="/tools/live-wallpaper-generator" description="12 种场景生成无缝循环的 3D 视频壁纸，导出 4K MP4/WebM。完全在浏览器中运行——私密且免费。" />
      </section>

      <section>
        <h2>设置到设备</h2>
        <p><strong>Windows 10 / 11：</strong>Windows 原生不支持视频壁纸，需要借助壁纸应用，把 MP4 导入即可。保持 H.264 MP4 格式兼容性最好。</p>
        <p><strong>安卓：</strong>许多启动器和系统主题直接支持视频壁纸——在壁纸选择器里找&ldquo;视频壁纸&rdquo;或&ldquo;动态壁纸&rdquo;，然后选择下载好的 MP4。</p>
        <p><strong>iPhone：</strong>iOS 不支持真正的视频壁纸。可以导出静帧作为壁纸，或用第三方应用把短视频转成实况照片——长按锁屏即可播放动画。</p>
      </section>

      <section>
        <h2>流畅又省电的几个要点</h2>
        <p>动态壁纸用一点续航换来满满个性。想降低开销：导出 30fps 而不是 60fps、优先深色场景、选慢速氛围运动而非炫光特效、笔记本和手机用更短的循环。OLED 屏幕上，深色配色的省电效果尤其显著。</p>
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="要約" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>要約：</strong>ライブ壁紙の正体は、デスクトップやスマホの背景に使う「シームレスにループする動画」です。ブラウザだけで無料で作れます。12 種類のジェネラティブ 3D シーン（銀河・波・オーロラ・デジタルレインなど）から選び、画面解像度に合わせて 4K MP4 を書き出すだけ。アプリのインストールもアップロードも不要です。10〜20 秒のゆったりした暗めのループが一番見栄えし、バッテリーにもやさしくなります。</p>
      </aside>

      <section>
        <h2>ライブ壁紙とは</h2>
        <p>ライブ壁紙は、アイコンの背後にある静止画を、永遠にループするアニメーション動画に置き換えるものです。うまく作れば、アイコンやウィジェットの邪魔をせずに、デスクトップに奥行きと個性を加えられます。対応状況はプラットフォームごとに異なります。Windows は壁紙アプリ経由で動画背景を再生し、Android の多くは標準機能やランチャーで動画壁紙を設定でき、iPhone はライブフォト経由でのみロック画面をアニメーションできます。</p>
        <p>嬉しいことに、デザインのスキルも有料アプリも不要です。すべてのカギは、よく作られたループ動画ファイル一つに集約されます。</p>
      </section>

      <section>
        <h2>良いループ壁紙の条件</h2>
        <p><strong>シームレスなループ。</strong>最後のフレームが最初のフレームに自然につながること。これが素人とプロの最大の違いです。どれほど美しいアニメーションも、数秒ごとに「最初から」が見えてしまうと一気に幻滅します。</p>
        <p><strong>適切な長さとテンポ。</strong>10〜20 秒がベストです。短すぎると単調で、長すぎるとメモリーを消費します。ゆったりした動きは「環境音」のように心地よく、激しい動きは仕事の注意を奪います。</p>
        <p><strong>暗めの低コントラスト配色。</strong>暗い背景はアイコンや文字を読みやすくし、OLED 画面ではバッテリーも節約できます。画面中央を比較的静かにして、デスクトップアイコンの視認性を保ちましょう。</p>
        <p><strong>互換性のある形式と正確な解像度。</strong>H.264 の MP4 ならどこでも再生できます。動画の解像度は画面に合わせましょう。1080p を 4K ディスプレイに引き伸ばすとにじんで見えます。</p>
      </section>

      <section>
        <h2>ブラウザで無料で作る</h2>
        <p>いちばん手軽なのは、WebGL でローカル完結レンダリングする<Link href="/tools/live-wallpaper-generator" className="text-blue-400 hover:text-blue-300">無料ライブ壁紙ジェネレーター</Link>です。</p>
        <ul>
          <li><strong>シーンを選ぶ</strong>——12 種類のジェネラティブ 3D スタイル：渦巻銀河・流れる波・ジオメトリ・星雲・点陣の惑星・ネオントンネル・オーロラ・蛍・雪・デジタルレイン・シンセグリッド・雨。</li>
          <li><strong>色とシードを選ぶ</strong>——厳選 12 パレットまたは 4 色カスタム。シードで同じ見た目を正確に再現できます。</li>
          <li><strong>画面に合わせる</strong>——デスクトップ・スマホ・タブレットのプリセットは最大 4K、カスタムサイズにも対応。</li>
          <li><strong>書き出す</strong>——オフラインでフレームごとにエンコードしたシームレス MP4（H.264、WebM フォールバック付き）。サーバーへのアップロードは一切ありません。</li>
        </ul>
        <p>静止画しか設定できない端末なら、姉妹ツールの<Link href="/tools/wallpaper-generator" className="text-blue-400 hover:text-blue-300">壁紙ジェネレーター</Link>で同じテイストのフル解像度 PNG を書き出せます。</p>
        <ToolCTA name="ライブ壁紙ジェネレーター" href="/tools/live-wallpaper-generator" description="12 シーンでシームレスループする 3D 動画壁紙を生成し、4K MP4/WebM を書き出し。完全ブラウザ動作でプライベートかつ無料。" />
      </section>

      <section>
        <h2>端末ごとの設定方法</h2>
        <p><strong>Windows 10 / 11：</strong>Windows は標準では動画壁紙に対応しないため、壁紙アプリを導入して MP4 を読み込みます。互換性重視なら H.264 MP4 のまま使いましょう。</p>
        <p><strong>Android：</strong>多くのランチャーやシステムテーマは動画壁紙に直接対応しています。壁紙ピッカーの「動画壁紙」や「ライブ壁紙」からダウンロードした MP4 を選んでください。</p>
        <p><strong>iPhone：</strong>iOS に本物の動画壁紙はありません。静止画を書き出して壁紙にするか、サードパーティ製アプリで短いクリップをライブフォトに変換すれば、ロック画面を長押ししたときにアニメーションします。</p>
      </section>

      <section>
        <h2>快適さと省電力のポイント</h2>
        <p>ライブ壁紙は少しのバッテリーと引き換えに大きな個性を手に入れられます。負荷を抑えるには：60fps ではなく 30fps で書き出す、暗めのシーンを選ぶ、派手な演出よりゆったりした動きにする、ノート PC やスマホでは短めのループにする。OLED ディスプレイでは暗い配色が特に効率的です。</p>
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>요약:</strong> 라이브 배경화면의 정체는 데스크톱이나 휴대폰 배경에 쓰는 &apos;끊김 없이 반복되는 동영상&apos;입니다. 브라우저에서 무료로 만들 수 있습니다. 12가지 절차적 3D 장면(은하, 파도, 오로라, 코드 레인 등) 중 하나를 고르고, 화면 해상도에 맞춰 4K MP4로 내보내기만 하면 됩니다. 앱 설치도 업로드도 필요 없습니다. 10~20초 길이의 느리고 어두운 루프가 가장 보기 좋고 배터리에도 유리합니다.</p>
      </aside>

      <section>
        <h2>라이브 배경화면이란?</h2>
        <p>라이브 배경화면은 아이콘 뒤의 정지 이미지를 영원히 반복 재생되는 애니메이션 영상으로 바꾼 것입니다. 잘 만들면 아이콘과 위젯을 방해하지 않으면서 데스크톱에 깊이와 개성을 더합니다. 플랫폼별 지원은 다릅니다. Windows는 배경화면 앱을 통해 영상 배경을 재생하고, 대부분의 Android 폰은 기본 기능이나 런처로 동영상 배경화면을 설정할 수 있으며, iPhone은 라이브 포토를 통해서만 잠금 화면 애니메이션이 가능합니다.</p>
        <p>다행히 디자인 실력이나 유료 앱이 필요하지 않습니다. 모든 것은 잘 만들어진 루프 영상 파일 하나로 귀결됩니다.</p>
      </section>

      <section>
        <h2>좋은 루프 배경화면의 조건</h2>
        <p><strong>끊김 없는 루프.</strong> 마지막 프레임이 첫 프레임으로 자연스럽게 이어져야 합니다. 이것이 아마추어와 프로 결과물의 가장 큰 차이입니다. 아무리 아름다운 애니메이션도 몇 초마다 &apos;처음으로&apos; 돌아가는 게 보이면 금세 질리게 됩니다.</p>
        <p><strong>적절한 길이와 템포.</strong> 10~20초가 가장 좋습니다. 너무 짧으면 단조롭고, 너무 길면 메모리를 더 씁니다. 느리고 잔잔한 움직임은 &apos;앰비언트&apos;처럼 느껴지는 반면, 빠른 움직임은 작업 집중을 빼앗습니다.</p>
        <p><strong>어둡고 대비가 낮은 배색.</strong> 어두운 배경은 아이콘과 글자를 더 잘 읽게 해주고, OLED 화면에서는 배터리도 실제로 아낍니다. 화면 중앙을 비교적 조용히 유지해야 데스크톱 아이콘 가독성이 살아납니다.</p>
        <p><strong>호환되는 형식과 정확한 해상도.</strong> H.264 코덱의 MP4는 어디서든 재생됩니다. 영상 해상도는 화면에 맞추세요. 1080p 영상을 4K 모니터에 늘리면 흐릿해 보입니다.</p>
      </section>

      <section>
        <h2>브라우저에서 무료로 만들기</h2>
        <p>가장 쉬운 방법은 WebGL로 로컬에서 전부 렌더링하는 <Link href="/tools/live-wallpaper-generator" className="text-blue-400 hover:text-blue-300">무료 라이브 배경화면 생성기</Link>를 사용하는 것입니다.</p>
        <ul>
          <li><strong>장면 선택</strong> — 12가지 절차적 3D 스타일: 나선 은하, 흐르는 파도, 지오메트리, 성운, 점 구름 행성, 네온 터널, 오로라, 반딧불, 눈, 코드 레인, 신스 그리드, 비.</li>
          <li><strong>색과 시드 선택</strong> — 엄선된 12가지 팔레트 또는 4색 커스텀. 시드 덕분에 같은 결과를 정확히 재현할 수 있습니다.</li>
          <li><strong>화면에 맞추기</strong> — 데스크톱·휴대폰·태블릿 프리셋은 최대 4K, 사용자 지정 크기도 가능.</li>
          <li><strong>내보내기</strong> — 오프라인으로 프레임 단위 인코딩한 끊김 없는 MP4(H.264, WebM 폴백 포함). 전 과정이 브라우저에서 이뤄지며 서버 업로드는 없습니다.</li>
        </ul>
        <p>정지 이미지만 설정할 수 있는 기기라면 자매 도구인 <Link href="/tools/wallpaper-generator" className="text-blue-400 hover:text-blue-300">배경화면 생성기</Link>로 같은 무드의 풀 해상도 PNG를 내보낼 수 있습니다.</p>
        <ToolCTA name="라이브 배경화면 생성기" href="/tools/live-wallpaper-generator" description="12가지 장면으로 끊김 없이 반복되는 3D 영상 배경화면을 만들고 4K MP4/WebM으로 내보내세요. 완전 브라우저 실행으로 프라이버시를 지키고 무료입니다." />
      </section>

      <section>
        <h2>기기별 설정 방법</h2>
        <p><strong>Windows 10 / 11:</strong> Windows는 기본적으로 동영상 배경화면을 지원하지 않으므로 배경화면 앱을 설치하고 MP4를 불러오면 됩니다. 호환성을 위해 H.264 MP4 형식을 유지하세요.</p>
        <p><strong>Android:</strong> 많은 런처와 시스템 테마가 동영상 배경화면을 직접 지원합니다. 배경화면 선택기에서 &quot;동영상 배경화면&quot; 또는 &quot;라이브 배경화면&quot;을 찾아 다운로드한 MP4를 고르세요.</p>
        <p><strong>iPhone:</strong> iOS는 진짜 동영상 배경화면을 지원하지 않습니다. 정지 프레임을 내보내 배경화면으로 쓰거나, 서드파티 앱으로 짧은 클립을 라이브 포토로 변환하면 잠금 화면을 길게 누를 때 애니메이션이 재생됩니다.</p>
      </section>

      <section>
        <h2>부드럽고 배터리 친화적으로</h2>
        <p>라이브 배경화면은 약간의 배터리로 큰 개성을 얻는 교환입니다. 부담을 줄이려면: 60fps 대신 30fps로 내보내고, 어두운 장면을 고르고, 화려한 연출보다 느린 앰비언트 모션을 택하고, 노트북과 휴대폰에서는 더 짧은 루프를 쓰세요. OLED 디스플레이에서는 어두운 배색이 특히 효율적입니다.</p>
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "Do live wallpapers drain battery?", answer: "Yes, more than a static image, because the GPU renders every frame. Dark, slow scenes exported at 30fps and a shorter loop reduce the impact. On OLED screens, dark palettes save the most power." },
      { question: "Does Windows 11 support video wallpapers natively?", answer: "No. Windows needs a third-party wallpaper app to play video backgrounds. Export an MP4 in H.264 from a browser tool and load it into your wallpaper app of choice." },
      { question: "What format should a live wallpaper be?", answer: "MP4 with H.264 video is the most compatible across wallpaper apps and Android devices. Some Android launchers also accept WebM. Match the video resolution to your screen to avoid soft, upscaled-looking output." },
      { question: "How long should the loop be?", answer: "10–20 seconds works best. Shorter loops feel repetitive and longer files use more memory. A seamless loop matters more than length — the last frame must flow into the first with no visible jump." },
      { question: "Can I use a live wallpaper on iPhone?", answer: "iOS doesn't support true video wallpapers. Export a still frame as a static wallpaper, or convert a short clip into a Live Photo with a third-party app — it then animates when you long-press the lock screen." },
    ],
    zh: [
      { question: "动态壁纸费电吗？", answer: "比静态图费电，因为 GPU 每帧都要渲染。选深色慢速场景、以 30fps 导出并使用较短循环可以降低开销。OLED 屏幕上深色配色最省电。" },
      { question: "Windows 11 原生支持视频壁纸吗？", answer: "不支持。Windows 需要第三方壁纸应用才能播放视频背景。用浏览器工具导出 H.264 MP4，再导入你喜欢的壁纸应用即可。" },
      { question: "动态壁纸用什么格式最好？", answer: "H.264 编码的 MP4 兼容性最好，各类壁纸应用和安卓设备都认。部分安卓启动器也接受 WebM。视频分辨率应与屏幕一致，避免拉伸后发虚。" },
      { question: "循环时长多长合适？", answer: "10-20 秒最合适。太短显得重复，太长占用更多内存。无缝循环比长度更重要——最后一帧必须平滑接回第一帧，不能有可见跳变。" },
      { question: "iPhone 能用动态壁纸吗？", answer: "iOS 不支持真正的视频壁纸。可以导出静帧作为静态壁纸，或用第三方应用把短视频转成实况照片——长按锁屏时即可播放动画。" },
    ],
    ja: [
      { question: "ライブ壁紙はバッテリーを消しますか？", answer: "静止画より消費します。GPU が毎フレーム描画するためです。暗めのゆったりしたシーンを 30fps で書き出し、短めのループにすると負荷を減らせます。OLED 画面では暗い配色が最も省電力です。" },
      { question: "Windows 11 は動画壁紙に標準対応していますか？", answer: "いいえ。Windows で動画背景を再生するにはサードパーティ製の壁紙アプリが必要です。ブラウザツールで H.264 MP4 を書き出し、お好みの壁紙アプリに読み込んでください。" },
      { question: "ライブ壁紙にはどの形式が最適ですか？", answer: "H.264 エンコードの MP4 が最も互換性が高く、各種壁紙アプリや Android 端末で再生できます。WebM を受け付けるランチャーもあります。引き伸ばしによるにじみを防ぐため、解像度は画面に合わせましょう。" },
      { question: "ループの長さはどれくらいがいいですか？", answer: "10〜20 秒がベストです。短すぎると単調で、長いファイルはメモリーを消費します。長さよりもシームレスなループのほうが重要です。最後のフレームが最初のフレームに自然につながる必要があります。" },
      { question: "iPhone でもライブ壁紙は使えますか？", answer: "iOS は本物の動画壁紙に対応していません。静止画を書き出して壁紙にするか、サードパーティ製アプリで短いクリップをライブフォトに変換すると、ロック画面を長押ししたときにアニメーションします。" },
    ],
    ko: [
      { question: "라이브 배경화면은 배터리를 많이 쓰나요?", answer: "정지 이미지보다 더 씁니다. GPU가 매 프레임을 렌더링하기 때문입니다. 어두운 느린 장면을 30fps로 내보내고 짧은 루프를 쓰면 부담을 줄일 수 있습니다. OLED 화면에서는 어두운 배색이 가장 전력을 아낍니다." },
      { question: "Windows 11은 동영상 배경화면을 기본 지원하나요?", answer: "아니요. Windows에서 영상 배경을 재생하려면 서드파티 배경화면 앱이 필요합니다. 브라우저 도구로 H.264 MP4를 내보낸 뒤 원하는 배경화면 앱에 불러오세요." },
      { question: "라이브 배경화면에는 어떤 형식이 좋나요?", answer: "H.264 코덱의 MP4가 배경화면 앱과 Android 기기에서 가장 호환성이 좋습니다. WebM을 받는 런처도 있습니다. 늘어나서 흐릿해 보이지 않도록 영상 해상도를 화면에 맞추세요." },
      { question: "루프 길이는 어느 정도가 적당한가요?", answer: "10~20초가 가장 좋습니다. 너무 짧으면 단조롭고 긴 파일은 메모리를 더 씁니다. 길이보다 끊김 없는 루프가 더 중요합니다. 마지막 프레임이 첫 프레임으로 자연스럽게 이어져야 합니다." },
      { question: "iPhone에서도 라이브 배경화면을 쓸 수 있나요?", answer: "iOS는 진짜 동영상 배경화면을 지원하지 않습니다. 정지 프레임을 내보내 배경화면으로 쓰거나, 서드파티 앱으로 짧은 클립을 라이브 포토로 변환하면 잠금 화면을 길게 누를 때 애니메이션이 재생됩니다." },
    ],
  },
};
