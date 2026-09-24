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
        <p><strong>TL;DR:</strong> To shrink a photo by 70–90%, export it as JPEG or WebP at quality 75–85 — the file collapses in size while the picture stays visually identical for almost every use. Need a precise target like 100 KB for a form? Use an exact-size compressor. Everything runs in your browser; no upload required.</p>
      </aside>

      <img src="/blog/how-to-compress-images.jpg" alt="A 5.2 MB photo compressed to 310 KB at quality 80, shown side by side" width={1600} height={900} className="mb-8 w-full h-auto rounded-xl" />

      <section>
        <h2>What Does Image Compression Actually Do?</h2>
        <p>Compression reduces the number of bytes an image file needs, not the number of pixels. There are two families. <strong>Lossless</strong> compression (PNG, lossless WebP) rewrites the file more efficiently — every pixel survives, but savings are modest, typically 5–30%. <strong>Lossy</strong> compression (JPEG, lossy WebP, AVIF) discards detail the human eye barely registers, which is where the big 70–90% savings come from.</p>
        <p>Why can lossy shrink so aggressively? Formats like JPEG store brightness precisely but color approximately, because your eyes are far more sensitive to brightness changes. Combined with the fact that photos are full of smooth gradients that compress well, a quality-80 JPEG of a typical phone photo looks identical to the original at normal viewing size — at a fraction of the size.</p>
      </section>

      <section>
        <h2>Which Image Format Should You Compress To?</h2>
        <p>Match the format to the content, not habit. This table covers the four formats you will meet in 2026.</p>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>Format</th>
              <th className={thCls}>Best for</th>
              <th className={thCls}>Typical result</th>
              <th className={thCls}>Transparency</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdCls}><strong>JPEG</strong></td>
              <td className={tdCls}>Photos, the universal default</td>
              <td className={tdCls}>70–90% smaller at quality 75–85</td>
              <td className={tdCls}>No</td>
            </tr>
            <tr>
              <td className={tdCls}><strong>PNG</strong></td>
              <td className={tdCls}>Screenshots, logos, sharp text and flat colors</td>
              <td className={tdCls}>Lossless; larger than JPEG for photos</td>
              <td className={tdCls}>Yes</td>
            </tr>
            <tr>
              <td className={tdCls}><strong>WebP</strong></td>
              <td className={tdCls}>Web images, photos and graphics</td>
              <td className={tdCls}>~25–35% smaller than JPEG at equal quality</td>
              <td className={tdCls}>Yes</td>
            </tr>
            <tr>
              <td className={tdCls}><strong>AVIF</strong></td>
              <td className={tdCls}>Next-generation web photos</td>
              <td className={tdCls}>Up to ~50% smaller than JPEG</td>
              <td className={tdCls}>Yes</td>
            </tr>
          </tbody>
        </table>
        <p>For photos you email or post, JPEG at quality 80 is the safe default. For your own website, convert to WebP or AVIF — every modern browser supports both. Reserve PNG for screenshots and graphics with crisp edges, where lossy compression would blur text.</p>
      </section>

      <section>
        <h2>How to Compress an Image to a Target File Size (e.g. 100 KB)</h2>
        <p>Many forms, visa applications and upload portals demand an exact ceiling, not just &ldquo;smaller&rdquo;. Two free browser tools cover both cases:</p>
        <ol>
          <li>Open the <Link href="/tools/image-compressor" className="text-blue-400 hover:text-blue-300">Image Compressor</Link> and drop your image in. Pick the output format — keep the original or switch to WebP for extra savings.</li>
          <li>Drag the quality slider. Start at 80; go lower only if you need more savings. The tool shows the resulting file size live.</li>
          <li>If you must hit a precise ceiling such as 100 KB, use the <Link href="/tools/image-file-size" className="text-blue-400 hover:text-blue-300">Image File Size tool</Link> instead: type the target in KB and it recompresses without changing the dimensions.</li>
          <li>Download the result. Nothing was uploaded — the compression ran locally on your device.</li>
        </ol>
        <ToolCTA name="Image Compressor" href="/tools/image-compressor" description="Compress images by up to 90% with an adjustable quality slider and JPG, PNG, WebP or AVIF output. No upload, runs in your browser." />
      </section>

      <section>
        <h2>Does Compressing an Image Reduce Its Quality?</h2>
        <p>Lossless compression: no, not by a single pixel. Lossy compression: yes in principle, but the practical answer is &ldquo;not visibly&rdquo; if you stay in the quality 75–85 range. Below roughly 60, JPEG artifacts — blocky patches and halos around sharp edges — start to become visible, and there is no reason to go there for photos.</p>
        <p>One rule protects you: compress once, from the original. Every re-compress of an already-compressed file compounds the losses. Keep your originals and export compressed copies.</p>
      </section>

      <section>
        <h2>Compress or Resize — Which One Do You Need?</h2>
        <p>The two solve different problems. Compression cuts <strong>file size</strong> (bytes) so pages load fast and uploads pass limits. Resizing changes <strong>dimensions</strong> (pixels) so the image fits a layout. A 4000-px photo shown at 400 px wide is wasting both bandwidth and pixels — resize it first with the <Link href="/tools/image-resizer" className="text-blue-400 hover:text-blue-300">Image Resizer</Link>, then compress the result. Doing both, in that order, gives the smallest useful file.</p>
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>太长不看：</strong>想把照片体积减 70–90%，导出为 JPEG 或 WebP、质量设 75–85 即可——文件大幅缩小，正常观看几乎无差别。如果表单要求精确到 100 KB 这类上限，用“目标文件大小”工具直接压到指定 KB。全部在浏览器内完成，无需上传。</p>
      </aside>

      <img src="/blog/how-to-compress-images.jpg" alt="一张 5.2 MB 的照片以质量 80 压缩到 310 KB 的前后对比" width={1600} height={900} className="mb-8 w-full h-auto rounded-xl" />

      <section>
        <h2>图片压缩到底压缩了什么？</h2>
        <p>压缩减少的是文件的字节数，不是像素数。它分两大家族：<strong>无损压缩</strong>（PNG、无损 WebP）只是更高效地重写文件——每个像素都保留，但省得有限，通常 5–30%；<strong>有损压缩</strong>（JPEG、有损 WebP、AVIF）会丢弃人眼几乎察觉不到的细节，70–90% 的大幅节省正来自这里。</p>
        <p>为什么有损能压得这么狠？JPEG 这类格式精确存储亮度、近似存储色彩，因为人眼对亮度变化远比色彩敏感。加上照片充满平滑过渡、天然好压缩，一张手机照片在质量 80 的 JPEG 下，正常尺寸观看与原图几乎无异——体积却只有零头。</p>
      </section>

      <section>
        <h2>应该压成哪种格式？</h2>
        <p>按内容选格式，而不是凭习惯。2026 年你会遇到的四种格式如下。</p>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>格式</th>
              <th className={thCls}>最适合</th>
              <th className={thCls}>典型效果</th>
              <th className={thCls}>透明通道</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdCls}><strong>JPEG</strong></td>
              <td className={tdCls}>照片，通用默认选项</td>
              <td className={tdCls}>质量 75–85 时小 70–90%</td>
              <td className={tdCls}>无</td>
            </tr>
            <tr>
              <td className={tdCls}><strong>PNG</strong></td>
              <td className={tdCls}>截图、Logo、锐利文字和纯色块</td>
              <td className={tdCls}>无损；存照片比 JPEG 大</td>
              <td className={tdCls}>有</td>
            </tr>
            <tr>
              <td className={tdCls}><strong>WebP</strong></td>
              <td className={tdCls}>网页图片，照片和图形都行</td>
              <td className={tdCls}>同等画质比 JPEG 再小约 25–35%</td>
              <td className={tdCls}>有</td>
            </tr>
            <tr>
              <td className={tdCls}><strong>AVIF</strong></td>
              <td className={tdCls}>下一代网页照片</td>
              <td className={tdCls}>最多比 JPEG 小约 50%</td>
              <td className={tdCls}>有</td>
            </tr>
          </tbody>
        </table>
        <p>发邮件、发帖子的照片，JPEG 质量 80 是稳妥默认。自己的网站则转成 WebP 或 AVIF——主流浏览器已全部支持。截图和边缘锐利的图形留给 PNG，有损压缩会把文字压糊。</p>
      </section>

      <section>
        <h2>如何把图片压到指定大小（比如 100 KB）？</h2>
        <p>很多表单、签证申请和上传入口要的是精确上限，而不是“小一点就行”。两个免费浏览器工具分别覆盖两种需求：</p>
        <ol>
          <li>打开<Link href="/tools/image-compressor" className="text-blue-400 hover:text-blue-300">图片压缩</Link>，拖入图片。选择输出格式——保持原格式，或转 WebP 进一步缩小。</li>
          <li>拖动质量滑杆。从 80 开始；只有还需要更小才往下调。工具会实时显示压缩后的文件大小。</li>
          <li>如果必须命中 100 KB 这样的精确上限，改用<Link href="/tools/image-file-size" className="text-blue-400 hover:text-blue-300">图片文件大小工具</Link>：输入目标 KB，它在不改变尺寸的前提下重压到该大小。</li>
          <li>下载结果。全程没有上传——压缩就在你的设备上完成。</li>
        </ol>
        <ToolCTA name="图片压缩" href="/tools/image-compressor" description="可调质量滑杆，最高压缩 90%，支持输出 JPG、PNG、WebP 或 AVIF。无需上传，浏览器内运行。" />
      </section>

      <section>
        <h2>压缩会降低画质吗？</h2>
        <p>无损压缩：不会，一个像素都不变。有损压缩：理论上会，但只要质量保持在 75–85 区间，实际答案是“肉眼看不出”。低于大约 60 时，JPEG 伪影——块状斑和锐利边缘周围的光晕——开始变得可见，而存照片完全没必要压到那个程度。</p>
        <p>一条铁律能保护你：从原图压一次。每对已压缩文件再压一次，损失都会叠加。保留原图，导出压缩副本。</p>
      </section>

      <section>
        <h2>该压缩还是该缩放？</h2>
        <p>两者解决不同问题。压缩削减的是<strong>文件体积</strong>（字节），让页面加载快、上传过审；缩放改变的是<strong>尺寸</strong>（像素），让图片适配版面。一张 4000 像素的照片只显示 400 像素宽，带宽和像素都浪费了——先用<Link href="/tools/image-resizer" className="text-blue-400 hover:text-blue-300">图片缩放</Link>改尺寸，再压缩结果。按这个顺序做完两步，才能得到既小又好用的文件。</p>
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="要約" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>要約：</strong>写真を 70〜90% 小さくするには、JPEG または WebP で品質 75〜85 に書き出します。ファイルは大幅に小さくなり、通常の閲覧ではまず違いが分かりません。申請書類など「100 KB 以下」の厳密な上限が必要なら、サイズ指定圧縮ツールを使います。すべてブラウザ内で完結し、アップロード不要です。</p>
      </aside>

      <img src="/blog/how-to-compress-images.jpg" alt="5.2 MB の写真を品質 80 で 310 KB に圧縮したビフォーアフター" width={1600} height={900} className="mb-8 w-full h-auto rounded-xl" />

      <section>
        <h2>画像圧縮とは何をしているのか？</h2>
        <p>圧縮が減らすのはファイルのバイト数で、ピクセル数ではありません。方法は 2 系統あります。<strong>可逆圧縮</strong>（PNG、ロスレス WebP）はファイルを効率よく書き直すだけですべてのピクセルが残りますが、節約は控えめで通常 5〜30%。<strong>非可逆圧縮</strong>（JPEG、ロッシー WebP、AVIF）は目がほとんど気づかない細部を切り捨て、70〜90% という大きな節約はここから生まれます。</p>
        <p>なぜそこまで圧縮できるのか。JPEG などの形式は輝度を正確に、色を近似して保存します。人間の目は色の変化より輝度の変化にはるかに敏感だからです。写真は滑らかなグラデーションだらけで元々圧縮しやすく、品質 80 の JPEG は通常サイズの閲覧では元画像と区別がつきません——サイズはほんの一部なのに。</p>
      </section>

      <section>
        <h2>どの形式に圧縮すべき？</h2>
        <p>形式は習慣ではなく内容で選びます。2026 年に出会う 4 形式の比較です。</p>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>形式</th>
              <th className={thCls}>適した用途</th>
              <th className={thCls}>典型的な結果</th>
              <th className={thCls}>透過</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdCls}><strong>JPEG</strong></td>
              <td className={tdCls}>写真。万能のデフォルト</td>
              <td className={tdCls}>品質 75〜85 で 70〜90% 小</td>
              <td className={tdCls}>不可</td>
            </tr>
            <tr>
              <td className={tdCls}><strong>PNG</strong></td>
              <td className={tdCls}>スクリーンショット、ロゴ、シャープな文字と flat な色</td>
              <td className={tdCls}>可逆。写真では JPEG より大きい</td>
              <td className={tdCls}>可</td>
            </tr>
            <tr>
              <td className={tdCls}><strong>WebP</strong></td>
              <td className={tdCls}>Web 画像。写真にもグラフィックにも</td>
              <td className={tdCls}>同画質で JPEG より約 25〜35% 小</td>
              <td className={tdCls}>可</td>
            </tr>
            <tr>
              <td className={tdCls}><strong>AVIF</strong></td>
              <td className={tdCls}>次世代の Web 写真</td>
              <td className={tdCls}>JPEG より最大約 50% 小</td>
              <td className={tdCls}>可</td>
            </tr>
          </tbody>
        </table>
        <p>メールや投稿用の写真は JPEG 品質 80 が安全な定番です。自分のサイトなら WebP か AVIF に変換しましょう。主要ブラウザはすべて対応済みです。スクショや輪郭の鋭い図形は PNG の守備範囲——非可逆圧縮では文字がにじみます。</p>
      </section>

      <section>
        <h2>画像を目標サイズ（例：100 KB）まで圧縮する方法</h2>
        <p>申請フォームやアップロード画面の多くは「小さく」ではなく正確な上限を求めます。2 つの無料ブラウザツールで両方に対応できます。</p>
        <ol>
          <li><Link href="/tools/image-compressor" className="text-blue-400 hover:text-blue-300">画像圧縮ツール</Link>を開いて画像をドロップします。出力形式はそのままでも、さらに小さくしたいなら WebP に切り替えます。</li>
          <li>品質スライダーを動かします。まず 80 から。もっと小さくしたい時だけ下げます。結果のファイルサイズはリアルタイムで表示されます。</li>
          <li>100 KB など厳密な上限を守る必要があるなら、<Link href="/tools/image-file-size" className="text-blue-400 hover:text-blue-300">ファイルサイズ指定ツール</Link>を使います。目標 KB を入力すると、寸法を変えずにそのサイズへ再圧縮します。</li>
          <li>ダウンロードして完了。アップロードは一切なく、圧縮は端末上で実行されました。</li>
        </ol>
        <ToolCTA name="画像圧縮" href="/tools/image-compressor" description="品質スライダーで最大 90% 圧縮。JPG・PNG・WebP・AVIF 出力対応。アップロード不要、ブラウザ内で動作。" />
      </section>

      <section>
        <h2>圧縮すると画質は落ちる？</h2>
        <p>可逆圧縮なら 1 ピクセルも変わりません。非可逆圧縮なら原理的には落ちますが、品質 75〜85 の範囲にいれば実質「見た目は変わらない」が答えです。おおよそ 60 を下回ると、ブロック状のむらや輪郭のにじみといった JPEG ノイズが見え始めます。写真でそこまで下げる理由はありません。</p>
        <p>守るべき鉄則は 1 つ：元画像から 1 回だけ圧縮する。圧縮済みファイルをさらに圧縮するたびに劣化は積み重なります。オリジナルを保管し、圧縮コピーを書き出しましょう。</p>
      </section>

      <section>
        <h2>圧縮とリサイズ、どっちが必要？</h2>
        <p>この 2 つは別の問題を解決します。圧縮は<strong>ファイルサイズ</strong>（バイト）を減らし、ページの読み込みを速くしてアップロード制限を通します。リサイズは<strong>寸法</strong>（ピクセル）を変え、レイアウトに合わせます。4000 px の写真を 400 px 幅で表示するなら帯域もピクセルも無駄です。まず<Link href="/tools/image-resizer" className="text-blue-400 hover:text-blue-300">画像リサイズ</Link>で寸法を整え、その結果を圧縮する。この順で両方行うのが、最小で実用的なファイルへの最短ルートです。</p>
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>요약:</strong> 사진을 70~90% 줄이려면 JPEG 또는 WebP로 품질 75~85에 내보내세요. 파일 크기는 크게 줄지만 일반적인 화면에서는 차이가 거의 보이지 않습니다. 서류 양식처럼 &ldquo;100 KB 이하&rdquo; 같은 정확한 상한이 필요하면 목표 크기 지정 도구를 쓰면 됩니다. 모두 브라우저에서 실행되고 업로드는 없습니다.</p>
      </aside>

      <img src="/blog/how-to-compress-images.jpg" alt="5.2 MB 사진을 품질 80으로 310 KB까지 압축한 전후 비교" width={1600} height={900} className="mb-8 w-full h-auto rounded-xl" />

      <section>
        <h2>이미지 압축은 무엇을 줄이는 걸까요?</h2>
        <p>압축이 줄이는 것은 파일의 바이트 수이지 픽셀 수가 아닙니다. 방식은 두 가지입니다. <strong>무손실 압축</strong>(PNG, 무손실 WebP)은 파일을 더 효율적으로 다시 쓰는 것이라 모든 픽셀이 살아있지만 절약은 미미해 보통 5~30%입니다. <strong>손실 압축</strong>(JPEG, 손실 WebP, AVIF)은 눈이 거의 못 알아차는 디테일을 버리는데, 70~90%라는 큰 절약이 바로 여기서 나옵니다.</p>
        <p>손실 압축이 어떻게 이렇게까지 줄일 수 있을까요? JPEG 같은 형식은 밝기는 정확히, 색은 근사해서 저장합니다. 사람의 눈이 색 변화보다 밝기 변화에 훨씬 민감하기 때문입니다. 게다가 사진은 부드러운 그라데이션으로 가득해 압축이 잘 되는 탓에, 품질 80 JPEG는 보통 크기로 보면 원본과 구별이 안 됩니다 — 크기는 몇 분의 일인데도요.</p>
      </section>

      <section>
        <h2>어떤 형식으로 압축해야 하나요?</h2>
        <p>형식은 습관이 아니라 내용에 맞춰 고르세요. 2026년에 만나게 될 네 가지 형식의 비교입니다.</p>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>형식</th>
              <th className={thCls}>적합한 용도</th>
              <th className={thCls}>일반적인 결과</th>
              <th className={thCls}>투명 배경</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdCls}><strong>JPEG</strong></td>
              <td className={tdCls}>사진, 만능 기본값</td>
              <td className={tdCls}>품질 75~85에서 70~90% 감소</td>
              <td className={tdCls}>불가</td>
            </tr>
            <tr>
              <td className={tdCls}><strong>PNG</strong></td>
              <td className={tdCls}>스크린샷, 로고, 선명한 텍스트와 단색</td>
              <td className={tdCls}>무손실. 사진은 JPEG보다 큼</td>
              <td className={tdCls}>가능</td>
            </tr>
            <tr>
              <td className={tdCls}><strong>WebP</strong></td>
              <td className={tdCls}>웹 이미지, 사진과 그래픽 모두</td>
              <td className={tdCls}>같은 화질에서 JPEG보다 약 25~35% 작음</td>
              <td className={tdCls}>가능</td>
            </tr>
            <tr>
              <td className={tdCls}><strong>AVIF</strong></td>
              <td className={tdCls}>차세대 웹 사진</td>
              <td className={tdCls}>JPEG보다 최대 약 50% 작음</td>
              <td className={tdCls}>가능</td>
            </tr>
          </tbody>
        </table>
        <p>이메일이나 게시용 사진은 JPEG 품질 80이 안전한 기본값입니다. 자신의 웹사이트라면 WebP나 AVIF로 변환하세요. 주요 브라우저가 모두 지원합니다. 스크린샷과 날카로운 윤곽의 그래픽은 PNG 영역입니다 — 손실 압축은 글자를 흐리게 만듭니다.</p>
      </section>

      <section>
        <h2>이미지를 목표 크기(예: 100 KB)로 압축하는 방법</h2>
        <p>많은 양식, 비자 신청, 업로드 창구는 그저 &ldquo;작게&rdquo;가 아니라 정확한 상한을 요구합니다. 두 가지 무료 브라우저 도구가 각각의 경우를 담당합니다.</p>
        <ol>
          <li><Link href="/tools/image-compressor" className="text-blue-400 hover:text-blue-300">이미지 압축기</Link>를 열고 이미지를 끌어다 놓습니다. 출력 형식은 그대로 두거나, 더 줄이려면 WebP로 전환합니다.</li>
          <li>품질 슬라이더를 움직입니다. 80에서 시작하고, 더 줄일 필요가 있을 때만 내리세요. 결과 파일 크기는 실시간으로 표시됩니다.</li>
          <li>100 KB 같은 정확한 상한을 반드시 지켜야 한다면 <Link href="/tools/image-file-size" className="text-blue-400 hover:text-blue-300">파일 크기 지정 도구</Link>를 쓰세요. 목표 KB를 입력하면 크기(해상도)는 바꾸지 않고 그 크기로 다시 압축합니다.</li>
          <li>다운로드하면 끝. 업로드는 없었고 압축은 내 기기에서 실행됐습니다.</li>
        </ol>
        <ToolCTA name="이미지 압축기" href="/tools/image-compressor" description="품질 슬라이더로 최대 90%까지 압축. JPG, PNG, WebP, AVIF 출력 지원. 업로드 없이 브라우저에서 실행." />
      </section>

      <section>
        <h2>압축하면 화질이 떨어지나요?</h2>
        <p>무손실 압축이라면 픽셀 하나 바뀌지 않습니다. 손실 압축이라면 원칙적으로는 예이지만, 품질 75~85 범위에 있으면 실질적인 답은 &ldquo;눈에는 안 보인다&rdquo;입니다. 대략 60 아래로 내려가면 블록 무늬와 윤곽 주변 번짐 같은 JPEG 노이즈가 드러나기 시작하는데, 사진에서 그렇게까지 내릴 이유는 없습니다.</p>
        <p>지켜야 할 원칙 하나: 원본에서 한 번만 압축할 것. 이미 압축된 파일을 다시 압축할 때마다 손실이 쌓입니다. 원본은 보관하고, 압축본을 따로 내보내세요.</p>
      </section>

      <section>
        <h2>압축과 리사이즈, 무엇이 필요한가요?</h2>
        <p>둘은 다른 문제를 해결합니다. 압축은 <strong>파일 크기</strong>(바이트)를 줄여 페이지 로딩을 빠르게 하고 업로드 제한을 통과하게 합니다. 리사이즈는 <strong>크기</strong>(픽셀)를 바꿔 레이아웃에 맞춥니다. 4000 px 사진을 400 px 폭으로 보여 준다면 대역폭과 픽셀을 둘 다 낭비하는 것입니다. 먼저 <Link href="/tools/image-resizer" className="text-blue-400 hover:text-blue-300">이미지 리사이저</Link>로 크기를 줄이고, 그 결과를 압축하세요. 이 순서로 둘 다 하면 가장 작고 쓸 만한 파일이 나옵니다.</p>
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "How do I compress an image to 100 KB?", answer: "Compress to JPEG or WebP at quality 80 and check the resulting size; lower quality slightly if you are still over. For an exact ceiling, use an exact-size compressor that recompresses to a target in KB without changing the image dimensions." },
      { question: "Which is smaller, PNG or JPEG?", answer: "For photos, JPEG is dramatically smaller — 70–90% less than the same image saved as PNG. PNG is lossless and best for screenshots, logos and sharp text, where it can actually be smaller than JPEG while keeping edges crisp." },
      { question: "Can I compress an image without any quality loss?", answer: "Yes, losslessly — PNG optimization or lossless WebP typically saves 5–30%. The big savings of 70–90% require lossy compression, but at quality 75–85 the difference is not visible at normal viewing sizes." },
      { question: "Does compressing an image change its resolution?", answer: "No. Compression reduces file size (bytes); resizing changes dimensions (pixels). They are independent operations — you can compress a 4000-pixel photo and keep every pixel, or do both if the image is also larger than it needs to be." },
    ],
    zh: [
      { question: "怎么把图片压到 100 KB？", answer: "先压成 JPEG 或 WebP、质量 80，看结果大小；还超的话再小幅调低质量。要精确命中上限，就用“目标文件大小”类工具：输入目标 KB，它在不改变图片尺寸的前提下重压到该大小。" },
      { question: "PNG 和 JPEG 哪个更小？", answer: "存照片时 JPEG 小得多——比同图的 PNG 小 70–90%。PNG 是无损格式，适合截图、Logo 和锐利文字，这类图它反而可能比 JPEG 更小且边缘清晰。" },
      { question: "有没有完全不损画质的压缩？", answer: "有，即无损压缩——PNG 优化或无损 WebP 通常能省 5–30%。想省 70–90% 就必须用有损压缩，但质量 75–85 时正常观看尺寸下看不出差别。" },
      { question: "压缩会改变分辨率吗？", answer: "不会。压缩减少的是文件体积（字节），缩放改变的是尺寸（像素），两者互不影响。4000 像素的照片可以只压体积、像素一个不少；如果尺寸也过大，可以两步都做。" },
    ],
    ja: [
      { question: "画像を 100 KB まで圧縮するには？", answer: "まず JPEG か WebP の品質 80 で圧縮してサイズを確認し、超えていれば品質を少し下げます。厳密な上限が求められる場合は、寸法を変えずに目標 KB に再圧縮するサイズ指定ツールを使ってください。" },
      { question: "PNG と JPEG はどちらが小さい？", answer: "写真なら JPEG が圧倒的に小さく、同じ画像の PNG より 70〜90% 小さくなります。PNG は可逆形式でスクリーンショット・ロゴ・シャープな文字向きで、その用途ではむしろ JPEG より小さく輪郭も鮮明です。" },
      { question: "画質を一切落とさずに圧縮できますか？", answer: "できます。PNG 最適化やロスレス WebP なら通常 5〜30% 節約できます。70〜90% という大幅な節約には非可逆圧縮が必要ですが、品質 75〜85 なら通常の閲覧サイズでは差は見えません。" },
      { question: "圧縮すると解像度は変わりますか？", answer: "変わりません。圧縮が減らすのはファイルサイズ（バイト）、リサイズが変えるのは寸法（ピクセル）で、両者は独立した処理です。4000 px の写真はピクセルを保ったまま圧縮できますし、大きすぎる場合は両方行うこともできます。" },
    ],
    ko: [
      { question: "이미지를 100 KB로 압축하려면?", answer: "먼저 JPEG 또는 WebP 품질 80으로 압축해 결과 크기를 확인하고, 초과하면 품질을 조금 내리세요. 정확한 상한을 맞춰야 한다면 크기(해상도)는 바꾸지 않고 목표 KB로 다시 압축해 주는 파일 크기 지정 도구를 쓰세요." },
      { question: "PNG와 JPEG 중 뭐가 더 작나요?", answer: "사진이라면 JPEG가 압도적으로 작아서 같은 이미지의 PNG보다 70~90% 작습니다. PNG는 무손실 형식이라 스크린샷, 로고, 선명한 텍스트에 적합하며, 그런 이미지에서는 오히려 JPEG보다 작으면서 윤곽도 선명합니다." },
      { question: "화질 저하 없이 압축할 수 있나요?", answer: "가능합니다. PNG 최적화나 무손실 WebP는 보통 5~30%를 절약합니다. 70~90%의 큰 절약은 손실 압축이 필요하지만, 품질 75~85라면 일반적인 크기에서는 차이가 보이지 않습니다." },
      { question: "압축하면 해상도가 바뀌나요?", answer: "아니요. 압축은 파일 크기(바이트)를 줄이고, 리사이즈는 크기(픽셀)를 바꿉니다. 두 작업은 서로 독립적이라 4000 px 사진을 픽셀 하나 잃지 않고 압축할 수 있고, 필요하면 둘 다 할 수도 있습니다." },
    ],
  },
};
