import type { ReactNode } from "react";
import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> Video files are large because they store thousands of frames at high resolution. Compress by reducing CRF (quality level), lowering resolution if appropriate, and using H.264 codec. Medium compression (CRF 28) typically cuts file size by 60-80% with minimal visible quality loss. Use a browser-based compressor to keep your videos private.</p>
      </aside>

      <section>
        <h2>Why Videos Are So Large</h2>
        <p>A one-minute 1080p video at 30fps contains 1,800 individual frames. Each uncompressed frame is roughly 6 MB, making one minute of raw video over 10 GB. Video codecs like H.264 compress this dramatically by storing only the differences between frames, but even compressed video files can be hundreds of megabytes for longer content.</p>
        <p>The main factors that determine video file size are <strong>resolution</strong> (1080p vs 4K), <strong>bitrate</strong> (how much data per second), <strong>duration</strong>, and <strong>codec efficiency</strong>.</p>
      </section>

      <section>
        <h2>Understanding Compression Settings</h2>
        <p><strong>CRF (Constant Rate Factor)</strong> is the most important setting. It tells the encoder how much quality to preserve. Think of it as a quality dial from 0 (perfect) to 51 (terrible). For most purposes, CRF 23-28 gives excellent results with major file size reduction.</p>
        <p><strong>Resolution</strong> has a huge impact on file size. Dropping from 4K to 1080p can reduce file size by 75%. If your video will only be viewed on phones or shared on social media, 720p is often sufficient.</p>
        <p><strong>Preset speed</strong> controls how much time the encoder spends optimizing. Slower presets produce smaller files at the same quality but take longer. For quick compression, &quot;ultrafast&quot; or &quot;fast&quot; presets are fine.</p>
      </section>

      <section>
        <h2>Best Settings for Common Uses</h2>
        <ul>
          <li><strong>Email attachments (under 25 MB):</strong> CRF 28-32, 720p resolution. Most email providers cap at 25 MB.</li>
          <li><strong>Discord (under 25 MB free, 50 MB Nitro):</strong> CRF 28, 720p for free users. Keep videos under 60 seconds.</li>
          <li><strong>Social media upload:</strong> CRF 22-24, keep original resolution. Platforms re-encode anyway, so start with good quality.</li>
          <li><strong>Archival/backup:</strong> CRF 18-20 for near-lossless. Larger files but preserves maximum quality.</li>
        </ul>
      </section>

      <section>
        <h2>Compress Videos for Free</h2>
        <p>Our <Link href="/tools/video-compressor" className="text-blue-400 hover:text-blue-300">free Video Compressor</Link> runs entirely in your browser using FFmpeg WebAssembly. Upload your video, choose quality and resolution settings, and download the compressed result. No upload to any server, no signup, no file size limits.</p>
        <ToolCTA name="Video Compressor" href="/tools/video-compressor" description="Compress videos by up to 90% with adjustable quality and resolution. Uses FFmpeg WebAssembly — your video never leaves your device." />
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>太长不看：</strong>视频文件之所以大，是因为它存储了数千帧高分辨率画面。压缩的关键是：降低 CRF（质量等级）、适当降低分辨率、使用 H.264 编码。中等压缩（CRF 28）通常可在肉眼几乎无差别的情况下将文件体积减小 60-80%。使用基于浏览器的压缩工具，视频不上传服务器，隐私无忧。</p>
      </aside>

      <section>
        <h2>为什么视频文件这么大</h2>
        <p>一段 30fps 的 1080p 一分钟视频包含 1800 帧画面。每帧未压缩时约 6 MB，也就是说一分钟的原始视频超过 10 GB。H.264 等视频编码器通过只存储帧之间的差异来大幅压缩，但即便是压缩后的视频，长视频仍可能有数百 MB。</p>
        <p>决定视频文件大小的主要因素是<strong>分辨率</strong>（1080p 与 4K）、<strong>码率</strong>（每秒数据量）、<strong>时长</strong>以及<strong>编码器效率</strong>。</p>
      </section>

      <section>
        <h2>理解压缩设置</h2>
        <p><strong>CRF（恒定质量因子）</strong>是最重要的设置。它告诉编码器保留多少画质，可以理解为从 0（完美）到 51（极差）的质量旋钮。大多数场景下 CRF 23-28 就能在明显减小体积的同时获得出色画质。</p>
        <p><strong>分辨率</strong>对文件大小影响巨大。从 4K 降到 1080p 可减少约 75% 的体积。如果视频只在手机观看或用于社交媒体分享，720p 通常已足够。</p>
        <p><strong>预设速度</strong>控制编码器花多少时间优化。较慢的预设可在相同画质下产出更小的文件，但耗时更长。快速压缩时使用 &quot;ultrafast&quot; 或 &quot;fast&quot; 预设即可。</p>
      </section>

      <section>
        <h2>常见场景的最佳设置</h2>
        <ul>
          <li><strong>邮件附件（25 MB 以内）：</strong>CRF 28-32，720p。多数邮箱限制附件 25 MB。</li>
          <li><strong>Discord（免费用户 25 MB，Nitro 50 MB）：</strong>CRF 28，720p，视频控制在 60 秒以内。</li>
          <li><strong>社交媒体上传：</strong>CRF 22-24，保持原始分辨率。平台会二次转码，源头画质好即可。</li>
          <li><strong>归档/备份：</strong>CRF 18-20，接近无损。文件较大但保留最高画质。</li>
        </ul>
      </section>

      <section>
        <h2>免费压缩视频</h2>
        <p>我们的<Link href="/tools/video-compressor" className="text-blue-400 hover:text-blue-300">免费视频压缩器</Link>完全在浏览器中运行，基于 FFmpeg WebAssembly。上传视频、选择画质和分辨率设置，即可下载压缩结果。无需上传到任何服务器、无需注册、无文件大小限制。</p>
        <ToolCTA name="视频压缩器" href="/tools/video-compressor" description="可调画质与分辨率，压缩率最高达 90%。基于 FFmpeg WebAssembly，视频不会离开你的设备。" />
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="要約" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>要約：</strong>動画ファイルが大きいのは、高解像度のフレームを何千枚も保存しているためです。CRF（品質レベル）を下げ、必要に応じて解像度を下げ、H.264 コーデックを使うことで圧縮できます。中程度の圧縮（CRF 28）なら、画質の劣化がほぼ目立たないままファイルサイズを 60〜80% 削減できるのが一般的です。プライバシーを守るには、ブラウザ内で完結する圧縮ツールを使いましょう。</p>
      </aside>

      <section>
        <h2>動画ファイルが大きい理由</h2>
        <p>30fps の 1080p 動画 1 分間には 1,800 枚のフレームが含まれます。1 フレームの無圧縮データは約 6 MB なので、1 分間の生データは 10 GB を超えます。H.264 などのコーデックはフレーム間の差分だけを保存することで劇的に圧縮しますが、それでも長い動画では数百 MB になることがあります。</p>
        <p>ファイルサイズを決める主な要素は、<strong>解像度</strong>（1080p と 4K）、<strong>ビットレート</strong>（1 秒あたりのデータ量）、<strong>時間</strong>、<strong>コーデックの効率</strong>です。</p>
      </section>

      <section>
        <h2>圧縮設定を理解する</h2>
        <p><strong>CRF（固定品質係数）</strong>は最も重要な設定です。エンコーダーにどの程度の画質を保持するかを指示します。0（完璧）から 51（非常に劣る）までの品質ダイヤルと考えてください。ほとんどの用途では CRF 23〜28 で、ファイルサイズを大幅に減らしながら優れた画質が得られます。</p>
        <p><strong>解像度</strong>はファイルサイズに大きな影響を与えます。4K から 1080p に落とすと約 75% 削減できます。スマホで見るだけ、または SNS で共有するだけなら 720p で十分なことが多いです。</p>
        <p><strong>プリセット速度</strong>はエンコーダーが最適化に費やす時間を制御します。遅いプリセットは同じ画質でより小さいファイルを作れますが時間がかかります。手早く圧縮するなら &quot;ultrafast&quot; や &quot;fast&quot; で十分です。</p>
      </section>

      <section>
        <h2>用途別のおすすめ設定</h2>
        <ul>
          <li><strong>メール添付（25 MB 未満）：</strong>CRF 28〜32、720p。多くのメールサービスは 25 MB までです。</li>
          <li><strong>Discord（無料 25 MB、Nitro 50 MB）：</strong>無料ユーザーは CRF 28、720p。動画は 60 秒以内に。</li>
          <li><strong>SNS アップロード：</strong>CRF 22〜24、元の解像度を維持。プラットフォーム側で再エンコードされるので、元の品質を高く保ちましょう。</li>
          <li><strong>アーカイブ・バックアップ：</strong>CRF 18〜20 でほぼ無劣化。ファイルは大きくなりますが最大の画質を保てます。</li>
        </ul>
      </section>

      <section>
        <h2>動画を無料で圧縮する</h2>
        <p>当サイトの<Link href="/tools/video-compressor" className="text-blue-400 hover:text-blue-300">無料動画圧縮ツール</Link>は、FFmpeg WebAssembly を使ってブラウザ内で完全に処理します。動画をアップロードし、画質と解像度を選ぶだけで圧縮結果をダウンロードできます。サーバーへのアップロードも登録もファイルサイズ制限もありません。</p>
        <ToolCTA name="動画圧縮ツール" href="/tools/video-compressor" description="画質と解像度を調整でき、最大 90% 圧縮可能。FFmpeg WebAssembly を使用するため、動画が端末から出ることはありません。" />
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>요약:</strong> 동영상 파일이 큰 이유는 고해상도 프레임을 수천 장 저장하기 때문입니다. CRF(품질 수준)를 낮추고, 필요하면 해상도를 낮추고, H.264 코덱을 사용하면 됩니다. 중간 수준 압축(CRF 28)은 눈에 띄는 화질 저하 없이 파일 크기를 60~80% 줄여주는 경우가 일반적입니다. 브라우저 기반 압축기를 사용하면 동영상이 서버로 전송되지 않아 프라이버시가 보호됩니다.</p>
      </aside>

      <section>
        <h2>동영상 파일이 큰 이유</h2>
        <p>30fps의 1080p 동영상 1분에는 1,800개의 프레임이 들어 있습니다. 압축되지 않은 프레임 하나는 약 6MB이므로, 1분 분량의 원본 데이터는 10GB를 넘습니다. H.264 같은 코덱은 프레임 간 차이만 저장해 크게 압축하지만, 길이가 긴 영상은 압축 후에도 수백 MB가 될 수 있습니다.</p>
        <p>파일 크기를 결정하는 주요 요인은 <strong>해상도</strong>(1080p vs 4K), <strong>비트레이트</strong>(초당 데이터량), <strong>길이</strong>, <strong>코덱 효율</strong>입니다.</p>
      </section>

      <section>
        <h2>압축 설정 이해하기</h2>
        <p><strong>CRF(고정 품질 계수)</strong>가 가장 중요한 설정입니다. 인코더가 얼마나 많은 화질을 보존할지를 결정하며, 0(완벽)부터 51(매우 나쁨)까지의 품질 다이얼로 생각하면 됩니다. 대부분의 용도에서는 CRF 23~28이면 파일 크기를 크게 줄이면서도 우수한 화질을 얻을 수 있습니다.</p>
        <p><strong>해상도</strong>는 파일 크기에 큰 영향을 줍니다. 4K에서 1080p로 낮추면 약 75%가 줄어듭니다. 휴대폰에서만 보거나 SNS에 공유할 영상이라면 720p면 충분한 경우가 많습니다.</p>
        <p><strong>프리셋 속도</strong>는 인코더가 최적화에 쓰는 시간을 조절합니다. 느린 프리셋은 같은 화질에서 더 작은 파일을 만들지만 시간이 더 걸립니다. 빠르게 압축할 때는 &quot;ultrafast&quot; 또는 &quot;fast&quot; 프리셋으로 충분합니다.</p>
      </section>

      <section>
        <h2>용도별 최적 설정</h2>
        <ul>
          <li><strong>이메일 첨부(25MB 미만):</strong> CRF 28~32, 720p. 대부분의 이메일 서비스는 25MB로 제한됩니다.</li>
          <li><strong>Discord(무료 25MB, Nitro 50MB):</strong> 무료 사용자는 CRF 28, 720p. 영상은 60초 이내로.</li>
          <li><strong>SNS 업로드:</strong> CRF 22~24, 원본 해상도 유지. 플랫폼에서 다시 인코딩하므로 원본 품질이 좋아야 합니다.</li>
          <li><strong>보관/백업:</strong> CRF 18~20으로 거의 무손실. 파일은 커지지만 최대 화질을 보존합니다.</li>
        </ul>
      </section>

      <section>
        <h2>동영상 무료로 압축하기</h2>
        <p>당사의<Link href="/tools/video-compressor" className="text-blue-400 hover:text-blue-300">무료 동영상 압축기</Link>는 FFmpeg WebAssembly를 사용해 브라우저 안에서 완전히 실행됩니다. 동영상을 업로드하고 화질과 해상도를 선택하면 압축 결과를 다운로드할 수 있습니다. 서버 업로드도, 가입도, 파일 크기 제한도 없습니다.</p>
        <ToolCTA name="동영상 압축기" href="/tools/video-compressor" description="화질과 해상도를 조절해 최대 90%까지 압축합니다. FFmpeg WebAssembly 기반이라 동영상이 기기를 떠나지 않습니다." />
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "How much can I compress a video?", answer: "Typically 50-90% depending on the original quality and settings. A 100 MB video can often be compressed to 10-30 MB at medium quality with barely noticeable difference. The key factors are resolution, bitrate, and codec efficiency." },
      { question: "What is CRF and how does it affect quality?", answer: "CRF (Constant Rate Factor) controls quality in H.264 encoding. Lower CRF = higher quality and larger file. CRF 18 is visually lossless, 23 is the default, 28 is good for most web use, and 35+ is noticeable compression. Each 6-point increase roughly halves the file size." },
      { question: "Should I reduce resolution when compressing?", answer: "Only if the video will be viewed on smaller screens. A 4K video compressed to 1080p will be much smaller with minimal quality loss on phones and laptops. But if the video will be viewed on large screens or projected, keep the original resolution and use CRF compression instead." },
      { question: "What is the best video codec for compression?", answer: "H.264 (AVC) is the most compatible and widely supported. H.265 (HEVC) offers 30-50% better compression but slower encoding and less device support. VP9 (WebM) is good for web. For maximum compatibility, stick with H.264 in an MP4 container." },
      { question: "Is it safe to compress videos online?", answer: "It depends on the tool. Cloud-based compressors upload your video to a server, which raises privacy concerns for personal or confidential content. Browser-based tools like ToolkitLife process everything locally on your device — your video never leaves your computer." },
    ],
    zh: [
      { question: "视频最多能压缩多少？", answer: "取决于原始画质和设置，通常可压缩 50-90%。100 MB 的视频在中等等画质下通常可压缩到 10-30 MB，且差别几乎看不出来。关键因素是分辨率、码率和编码器效率。" },
      { question: "什么是 CRF？它如何影响画质？", answer: "CRF（恒定质量因子）控制 H.264 编码的画质。CRF 越低画质越高、文件越大。CRF 18 视觉无损，23 是默认值，28 适合大多数网页用途，35+ 压缩痕迹明显。CRF 每提高 6 点，文件体积大约减半。" },
      { question: "压缩时应该降低分辨率吗？", answer: "只有视频在小屏幕上观看时才需要。4K 视频压缩到 1080p 后体积小很多，在手机和笔记本上画质损失几乎不可见。但如果视频会在大屏或投影上观看，请保持原始分辨率，改用 CRF 压缩。" },
      { question: "哪种视频编码器压缩效果最好？", answer: "H.264（AVC）兼容性最好、支持最广。H.265（HEVC）压缩率提高 30-50%，但编码更慢、设备支持更少。VP9（WebM）适合网页使用。追求最大兼容性时，用 MP4 封装 + H.264。" },
      { question: "在线压缩视频安全吗？", answer: "取决于工具。云端压缩器会把视频上传到服务器，个人或机密内容有隐私风险。ToolkitLife 这类浏览器工具完全在本地处理——视频永远不会离开你的电脑。" },
    ],
    ja: [
      { question: "動画はどれくらい圧縮できますか？", answer: "元の画質と設定によりますが、通常 50〜90% 圧縮できます。100 MB の動画は中程度の画質なら 10〜30 MB に圧縮でき、違いはほとんど目立ちません。決め手は解像度、ビットレート、コーデックの効率です。" },
      { question: "CRF とは何ですか？画質にどう影響しますか？", answer: "CRF（固定品質係数）は H.264 エンコードの画質を制御します。CRF が低いほど高画質でファイルが大きくなります。CRF 18 は視覚的に無劣化、23 がデフォルト、28 はほとんどの Web 用途に適し、35 以上は劣化が目立ちます。6 上がるごとにファイルサイズはおおよそ半分になります。" },
      { question: "圧縮するとき解像度を下げるべきですか？", answer: "動画が小さな画面で見られる場合に限ります。4K を 1080p に圧縮すれば、スマホやノート PC では画質の劣化がほとんど気にならないほど小さくなります。ただし大型ディスプレイやプロジェクターで見る場合は元の解像度を維持し、CRF 圧縮を使いましょう。" },
      { question: "圧縮に最適なコーデックは？", answer: "H.264（AVC）が最も互換性が高く、広くサポートされています。H.265（HEVC）は圧縮率が 30〜50% 向上しますが、エンコードが遅く対応デバイスが少なめです。VP9（WebM）は Web 向きです。最大の互換性を求めるなら MP4 コンテナで H.264 を使いましょう。" },
      { question: "オンラインで動画を圧縮しても安全ですか？", answer: "ツールによります。クラウド型の圧縮ツールは動画をサーバーにアップロードするため、個人情報や機密コンテンツにはプライバシーの懸念があります。ToolkitLife のようなブラウザ型ツールはすべて端末内で処理するため、動画が PC から出ることはありません。" },
    ],
    ko: [
      { question: "동영상을 얼마나 압축할 수 있나요?", answer: "원본 화질과 설정에 따라 보통 50~90%까지 압축할 수 있습니다. 100MB 동영상은 중간 화질에서 10~30MB로 압축돼도 차이를 거의 느끼지 못하는 경우가 많습니다. 핵심은 해상도, 비트레이트, 코덱 효율입니다." },
      { question: "CRF란 무엇이며 화질에 어떤 영향을 주나요?", answer: "CRF(고정 품질 계수)는 H.264 인코딩의 화질을 조절합니다. CRF가 낮을수록 화질이 좋고 파일이 커집니다. CRF 18은 시각적으로 무손실, 23이 기본값, 28은 대부분의 웹 용도에 적합하며, 35 이상은 압축이 눈에 띕니다. 6씩 높아질 때마다 파일 크기는 대략 절반으로 줄어듭니다." },
      { question: "압축할 때 해상도를 낮춰야 하나요?", answer: "작은 화면에서 볼 영상일 때만 낮추면 됩니다. 4K를 1080p로 압축하면 휴대폰과 노트북에서는 화질 손실이 거의 느껴지지 않을 만큼 작아집니다. 하지만 대형 화면이나 프로젝터로 볼 영상이라면 원본 해상도를 유지하고 CRF 압축을 사용하세요." },
      { question: "압축에 가장 좋은 코덱은 무엇인가요?", answer: "H.264(AVC)가 가장 호환성이 좋고 널리 지원됩니다. H.265(HEVC)는 압축률이 30~50% 더 좋지만 인코딩이 느리고 지원 기기가 적습니다. VP9(WebM)은 웹용으로 좋습니다. 최대 호환성을 원하면 MP4 컨테이너에 H.264를 사용하세요." },
      { question: "온라인으로 동영상을 압축해도 안전한가요?", answer: "도구에 따라 다릅니다. 클라우드 기반 압축기는 동영상을 서버에 업로드하므로 개인적이거나 기밀인 콘텐츠는 프라이버시 우려가 있습니다. ToolkitLife 같은 브라우저 기반 도구는 모든 처리를 기기에서 로컬로 수행하므로 동영상이 컴퓨터를 떠나지 않습니다." },
    ],
  },
};
