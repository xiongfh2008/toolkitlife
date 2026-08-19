import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> Removing a background is fastest with AI mode for people and products, and color mode for solid-color backgrounds like white or green screen. Upload a high-contrast photo, zoom in to check the edges, and download the result as a transparent PNG. From there you can add a new background, make an ID photo, or drop the cutout into any design.</p>
      </aside>

      <section>
        <h2>Why Remove Image Backgrounds</h2>
        <p>You need a clean product photo for your online store. You want a professional headshot for your resume or social media. You&apos;re building a presentation and a plain background keeps clashing with your slides. These are all moments where removing the background turns an ordinary photo into a reusable asset.</p>
        <p>A removed background gives you a transparent image that works anywhere: white product shots for e-commerce, cutouts for posters and thumbnails, and profile photos with a solid or blurred backdrop of your choice.</p>
      </section>

      <section>
        <h2>How Background Removal Works</h2>
        <p><strong>AI mode:</strong> A neural network analyzes the image, detects the main subject, and separates it from the background automatically. It handles complex edges like hair and fur best and needs just one click. This is the right choice for people, animals, and detailed product shots.</p>
        <p><strong>Color mode:</strong> You click a color in the image and the tool removes all pixels that match it. Tolerance controls how wide a range of similar colors gets removed, and feather softens the edge. This is the cleanest approach for solid-color backgrounds such as white studio backdrops or green screens.</p>
      </section>

      <section>
        <h2>Step-by-Step: Remove a Background for Free</h2>
        <ol>
          <li><strong>Open the Background Remover tool.</strong> It runs entirely in your browser — nothing is uploaded to a server.</li>
          <li><strong>Upload your image.</strong> Drag and drop or click to choose a JPG, PNG, or WebP file.</li>
          <li><strong>Choose a mode.</strong> Use AI for automatic subject detection, or Color to click the background color you want to erase.</li>
          <li><strong>Fine-tune the result.</strong> In color mode, adjust tolerance and feather until the edges look clean.</li>
          <li><strong>Download the transparent PNG.</strong> You can then add a new background or paste the cutout into any design.</li>
        </ol>
      </section>

      <section>
        <h2>Tips for Clean Edges</h2>
        <ul>
          <li><strong>Start with high contrast.</strong> A subject that clearly stands out from its background removes much more cleanly.</li>
          <li><strong>Use AI mode for hair and fur.</strong> Neural networks handle fine edges like hair strands far better than color matching.</li>
          <li><strong>Use color mode for solid backdrops.</strong> White studio backgrounds and green screens erase perfectly with a single color pick.</li>
          <li><strong>Zoom in and check the edges.</strong> Small background specks near the subject are easiest to catch up close.</li>
        </ul>
      </section>

      <section>
        <h2>Common Use Cases</h2>
        <ul>
          <li><strong>E-commerce product shots.</strong> Clean white-background images are the standard for marketplaces and storefronts.</li>
          <li><strong>Profile and resume photos.</strong> A neutral or blurred backdrop looks far more professional.</li>
          <li><strong>ID photos.</strong> Combine background removal with an ID photo generator for compliant passport or visa photos.</li>
          <li><strong>Design assets.</strong> Transparent cutouts can be dropped into posters, slides, videos, and thumbnails.</li>
        </ul>
      </section>

      <section>
        <h2>Remove Backgrounds for Free</h2>
        <p>Our <Link href="/tools/background-remover" className="text-blue-400 hover:text-blue-300">free Background Remover</Link> offers both AI and color-based removal. Everything runs locally in your browser, so your photos never leave your device. No signup, no watermarks, no limits.</p>
        <ToolCTA name="Background Remover" href="/tools/background-remover" description="Remove image backgrounds instantly with AI or color matching. 100% free, no upload, runs in your browser." />
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>太长不看：</strong>去除背景，人物和产品图用 AI 模式最快，纯色背景（白底、绿幕）用颜色模式最干净。上传一张主体与背景对比明显的照片，放大检查边缘，下载透明背景的 PNG 即可。之后可以换背景、做证件照，或把抠图放进任何设计里。</p>
      </aside>

      <section>
        <h2>为什么要去除图片背景</h2>
        <p>你的网店需要一张干净的产品图。你想为简历或社交媒体准备一张专业的头像。你在做演示文稿，普通背景总是和幻灯片冲突。这些时候，去掉背景就能把一张普通照片变成可复用的素材。</p>
        <p>去除背景后，你会得到一张透明背景的图片，可以放在任何地方：电商的白底产品图、海报和缩略图的抠图素材，以及自选纯色或虚化背景的头像照片。</p>
      </section>

      <section>
        <h2>去背景的原理</h2>
        <p><strong>AI 模式：</strong>神经网络分析图片、识别主体并自动与背景分离。它最擅长处理头发、毛发这类复杂边缘，只需一键。适合人物、动物和细节丰富的产品图。</p>
        <p><strong>颜色模式：</strong>点击图片中的某个颜色，工具就会删除所有匹配的像素。容差控制删除的相近颜色范围，羽化让边缘更柔和。这是白色影棚背景或绿幕这类纯色背景最干净的去除方式。</p>
      </section>

      <section>
        <h2>分步教程：免费去除背景</h2>
        <ol>
          <li><strong>打开背景去除工具。</strong>全部在浏览器内完成——图片不会上传到任何服务器。</li>
          <li><strong>上传图片。</strong>拖拽或点击选择 JPG、PNG 或 WebP 文件。</li>
          <li><strong>选择模式。</strong>AI 模式自动识别主体，颜色模式点击要删除的背景颜色。</li>
          <li><strong>微调结果。</strong>颜色模式下调整容差和羽化，直到边缘干净。</li>
          <li><strong>下载透明 PNG。</strong>之后可以换新背景，或把抠图放进任何设计。</li>
        </ol>
      </section>

      <section>
        <h2>让边缘更干净的技巧</h2>
        <ul>
          <li><strong>从高对比度开始。</strong>主体与背景区分明显的图片，去背景效果要好得多。</li>
          <li><strong>头发和毛发用 AI 模式。</strong>神经网络处理发丝这类精细边缘，远好于颜色匹配。</li>
          <li><strong>纯色背景用颜色模式。</strong>白色背景和绿幕只需一次取色就能完美去除。</li>
          <li><strong>放大检查边缘。</strong>主体附近残留的小色块，放大后最容易发现。</li>
        </ul>
      </section>

      <section>
        <h2>常见用途</h2>
        <ul>
          <li><strong>电商产品图。</strong>干净的白底图是各大平台和店铺的标准要求。</li>
          <li><strong>头像和简历照片。</strong>中性或虚化背景看起来专业得多。</li>
          <li><strong>证件照。</strong>把去背景和证件照生成器结合，可制作合规的护照或签证照片。</li>
          <li><strong>设计素材。</strong>透明抠图可以直接放进海报、幻灯片、视频和缩略图。</li>
        </ul>
      </section>

      <section>
        <h2>免费去除背景</h2>
        <p>我们的<Link href="/tools/background-remover" className="text-blue-400 hover:text-blue-300">免费背景去除工具</Link>同时支持 AI 和颜色两种模式。所有处理都在本地浏览器完成，照片永远不会离开你的设备。无需注册、无水印、无限制。</p>
        <ToolCTA name="背景去除器" href="/tools/background-remover" description="用 AI 或颜色匹配即时去除图片背景。100% 免费，无需上传，浏览器内完成。" />
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="要約" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>要約：</strong>背景削除は、人物や商品には AI モードが最速、白背景やグリーンバックなどの単色背景にはカラーモードが最もきれいです。被写体と背景のコントラストが高い写真をアップロードし、エッジを拡大して確認し、透明な PNG でダウンロードしましょう。あとは背景を変更したり、証明写真にしたり、切り抜きをデザインに配置したりできます。</p>
      </aside>

      <section>
        <h2>画像の背景を削除する理由</h2>
        <p>オンラインストア用にきれいな商品写真が必要。履歴書や SNS 用にプロフェッショナルなヘッドショットが欲しい。プレゼン資料を作っていて、普通の背景がスライドとどうしても合わない。こうした場面で背景を削除すると、普通の写真が再利用可能なアセットになります。</p>
        <p>背景を削除すると透明な画像になり、どこでも使えます。EC 用の白背景の商品写真、ポスターやサムネイル用の切り抜き、好みの単色やぼかし背景のプロフィール写真など。</p>
      </section>

      <section>
        <h2>背景削除の仕組み</h2>
        <p><strong>AI モード：</strong>ニューラルネットワークが画像を分析し、主要な被写体を検出して背景から自動的に分離します。髪や毛皮のような複雑なエッジを最も得意とし、ワンクリックで完了します。人物、動物、細部の多い商品写真に適しています。</p>
        <p><strong>カラーモード：</strong>画像内の色をクリックすると、一致するすべてのピクセルを削除します。許容値は削除する類似色の範囲を制御し、フェザーはエッジを柔らかくします。白いスタジオ背景やグリーンバックなどの単色背景に最もきれいな方法です。</p>
      </section>

      <section>
        <h2>ステップバイステップ：背景を無料で削除する</h2>
        <ol>
          <li><strong>背景除去ツールを開く。</strong>処理はすべてブラウザ内で完結します——画像がサーバーにアップロードされることはありません。</li>
          <li><strong>画像をアップロードする。</strong>ドラッグ＆ドロップまたはクリックで JPG・PNG・WebP ファイルを選択します。</li>
          <li><strong>モードを選ぶ。</strong>AI モードは被写体を自動検出、カラーモードは削除したい背景色をクリックします。</li>
          <li><strong>結果を微調整する。</strong>カラーモードでは許容値とフェザーを調整してエッジをきれいにします。</li>
          <li><strong>透明 PNG をダウンロードする。</strong>あとは新しい背景を追加したり、切り抜きをデザインに配置したりできます。</li>
        </ol>
      </section>

      <section>
        <h2>きれいなエッジにするコツ</h2>
        <ul>
          <li><strong>コントラストの高い写真から始める。</strong>背景からはっきり浮き出る被写体は、はるかにきれいに削除できます。</li>
          <li><strong>髪や毛は AI モードを使う。</strong>ニューラルネットワークは毛束のような細かいエッジを、色マッチングよりはるかにうまく処理します。</li>
          <li><strong>単色背景にはカラーモード。</strong>白い背景やグリーンバックは、一度のカラーピックで完璧に消せます。</li>
          <li><strong>拡大してエッジを確認する。</strong>被写体の近くに残る小さな背景の斑点は、拡大すると見つけやすいです。</li>
        </ul>
      </section>

      <section>
        <h2>よくある使用例</h2>
        <ul>
          <li><strong>EC 商品写真。</strong>きれいな白背景画像は、マーケットプレイスやショップの標準です。</li>
          <li><strong>プロフィール写真と履歴書写真。</strong>ニュートラルまたはぼかし背景のほうがはるかにプロフェッショナルに見えます。</li>
          <li><strong>証明写真。</strong>背景除去と証明写真ジェネレーターを組み合わせれば、規定に沿ったパスポートやビザ写真を作れます。</li>
          <li><strong>デザイン素材。</strong>透明な切り抜きは、ポスター、スライド、動画、サムネイルに配置できます。</li>
        </ul>
      </section>

      <section>
        <h2>背景を無料で削除する</h2>
        <p>当サイトの<Link href="/tools/background-remover" className="text-blue-400 hover:text-blue-300">無料背景除去ツール</Link>は、AI とカラー両方のモードに対応しています。処理はすべてブラウザ内で完結するため、写真が端末の外に出ることはありません。登録不要、ウォーターマークなし、制限なし。</p>
        <ToolCTA name="背景除去ツール" href="/tools/background-remover" description="AI またはカラーマッチングで画像の背景を瞬時に削除。100% 無料、アップロード不要、ブラウザ内で完結。" />
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>요약:</strong> 배경 제거는 사람과 제품 사진에는 AI 모드가 가장 빠르고, 흰 배경이나 그린 스크린 같은 단색 배경에는 색상 모드가 가장 깔끔합니다. 피사체와 배경의 대비가 뚜렷한 사진을 업로드하고, 가장자리를 확대해 확인한 뒤 투명 PNG로 다운로드하세요. 이후 배경을 바꾸거나 증명사진을 만들거나 잘라낸 이미지를 디자인에 활용할 수 있습니다.</p>
      </aside>

      <section>
        <h2>이미지 배경을 제거해야 하는 이유</h2>
        <p>온라인 스토어에 깔끔한 제품 사진이 필요합니다. 이력서나 소셜 미디어에 쓸 전문적인 헤드샷이 필요합니다. 프레젠테이션을 만드는데 평범한 배경이 슬라이드와 계속 어울리지 않습니다. 이런 순간에 배경을 제거하면 평범한 사진이 재사용 가능한 자산이 됩니다.</p>
        <p>배경을 제거하면 투명한 이미지가 되어 어디서든 쓸 수 있습니다. 전자상거래의 흰 배경 제품 사진, 포스터와 썸네일용 컷아웃, 원하는 단색이나 흐림 배경의 프로필 사진 등이 가능합니다.</p>
      </section>

      <section>
        <h2>배경 제거의 원리</h2>
        <p><strong>AI 모드:</strong> 신경망이 이미지를 분석해 주요 피사체를 감지하고 배경에서 자동으로 분리합니다. 머리카락이나 털 같은 복잡한 가장자리를 가장 잘 처리하며, 클릭 한 번이면 됩니다. 사람, 동물, 디테일이 많은 제품 사진에 적합합니다.</p>
        <p><strong>색상 모드:</strong> 이미지에서 색상을 클릭하면 일치하는 모든 픽셀을 제거합니다. 허용 오차는 제거할 유사 색상의 범위를, 페더는 가장자리를 부드럽게 합니다. 흰색 스튜디오 배경이나 그린 스크린 같은 단색 배경에 가장 깔끔한 방법입니다.</p>
      </section>

      <section>
        <h2>단계별 가이드: 무료로 배경 제거하기</h2>
        <ol>
          <li><strong>배경 제거 도구를 엽니다.</strong> 모든 처리가 브라우저 안에서 이루어집니다 — 이미지가 서버로 업로드되지 않습니다.</li>
          <li><strong>이미지를 업로드합니다.</strong> 드래그 앤 드롭하거나 클릭해 JPG, PNG, WebP 파일을 선택합니다.</li>
          <li><strong>모드를 선택합니다.</strong> AI 모드는 피사체를 자동 감지하고, 색상 모드는 제거할 배경색을 클릭합니다.</li>
          <li><strong>결과를 미세 조정합니다.</strong> 색상 모드에서는 허용 오차와 페더를 조정해 가장자리를 깔끔하게 만듭니다.</li>
          <li><strong>투명 PNG를 다운로드합니다.</strong> 이후 새 배경을 추가하거나 컷아웃을 어떤 디자인에든 배치할 수 있습니다.</li>
        </ol>
      </section>

      <section>
        <h2>깔끔한 가장자리를 위한 팁</h2>
        <ul>
          <li><strong>대비가 높은 사진으로 시작하세요.</strong> 배경에서 또렷하게 구분되는 피사체가 훨씬 깔끔하게 제거됩니다.</li>
          <li><strong>머리카락과 털은 AI 모드를 사용하세요.</strong> 신경망은 머리카락 같은 미세한 가장자리를 색상 매칭보다 훨씬 잘 처리합니다.</li>
          <li><strong>단색 배경에는 색상 모드를 사용하세요.</strong> 흰색 배경과 그린 스크린은 한 번의 색상 선택으로 완벽하게 지워집니다.</li>
          <li><strong>확대해서 가장자리를 확인하세요.</strong> 피사체 주변에 남은 작은 배경 점들은 확대하면 가장 쉽게 발견됩니다.</li>
        </ul>
      </section>

      <section>
        <h2>일반적인 사용 사례</h2>
        <ul>
          <li><strong>전자상거래 제품 사진.</strong> 깨끗한 흰 배경 이미지는 마켓플레이스와 스토어의 표준입니다.</li>
          <li><strong>프로필 및 이력서 사진.</strong> 중립적이거나 흐린 배경이 훨씬 전문적으로 보입니다.</li>
          <li><strong>증명사진.</strong> 배경 제거와 증명사진 생성기를 결합하면 규정에 맞는 여권·비자 사진을 만들 수 있습니다.</li>
          <li><strong>디자인 자산.</strong> 투명 컷아웃은 포스터, 슬라이드, 영상, 썸네일에 바로 배치할 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2>무료로 배경 제거하기</h2>
        <p>당사의<Link href="/tools/background-remover" className="text-blue-400 hover:text-blue-300">무료 배경 제거 도구</Link>는 AI와 색상 기반 제거를 모두 지원합니다. 모든 처리가 브라우저 안에서 실행되므로 사진이 기기를 떠나지 않습니다. 가입 없음, 워터마크 없음, 제한 없음.</p>
        <ToolCTA name="배경 제거 도구" href="/tools/background-remover" description="AI 또는 색상 매칭으로 이미지 배경을 즉시 제거합니다. 100% 무료, 업로드 없음, 브라우저에서 실행." />
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "Can I remove a background without damaging the subject?", answer: "Yes. AI mode is designed to keep the main subject intact while erasing the background. Use high-contrast source images and check the edges after processing. For solid-color backgrounds, color mode with a low tolerance setting removes only the matched color, leaving the subject untouched." },
      { question: "What image format should I use for a transparent background?", answer: "PNG supports full transparency, so always download your result as a PNG when you need a transparent background. JPG flattens transparency to white and WebP supports transparency but is less widely supported by older editors and platforms." },
      { question: "Is AI background removal really free and private?", answer: "Yes. The Background Remover runs entirely in your browser — the AI model and color algorithm execute locally on your device. No image is uploaded to a server, no account is required, and nothing is stored." },
      { question: "How do I get clean edges on hair and fur?", answer: "Use AI mode, which is trained to handle fine, complex edges like hair strands and fur. Avoid color mode for these cases, since color matching cannot distinguish similar-colored hair from the background." },
    ],
    zh: [
      { question: "去除背景会损伤主体吗？", answer: "不会。AI 模式的设计目标就是在擦除背景的同时保留主体完整。尽量使用主体与背景对比明显的源图，处理完成后检查边缘。对于纯色背景，颜色模式配合较低的容差只会删除匹配的颜色，主体不受影响。" },
      { question: "透明背景应该用什么图片格式？", answer: "PNG 支持完整透明通道，需要透明背景时务必下载 PNG。JPG 会把透明区域压平成白色，WebP 支持透明但兼容性不如 PNG 广泛。" },
      { question: "AI 去背景真的免费且私密吗？", answer: "是的。背景去除工具完全在浏览器内运行——AI 模型和颜色算法都在本地设备上执行。图片不会上传到服务器，无需账号，也不存储任何内容。" },
      { question: "头发和毛发边缘怎么处理才干净？", answer: "使用 AI 模式，它专门训练过处理发丝、毛发这类精细复杂的边缘。这类情况不要用颜色模式，因为颜色匹配无法区分与背景颜色相近的头发。" },
    ],
    ja: [
      { question: "被写体を傷つけずに背景を削除できますか？", answer: "はい。AI モードは背景を消しながら主要な被写体を保つように設計されています。コントラストの高い元画像を使い、処理後にエッジを確認してください。単色背景には、許容値の低いカラーモードを使えばマッチした色だけが削除され、被写体は影響を受けません。" },
      { question: "透明背景にはどの画像形式を使うべきですか？", answer: "PNG は完全な透明をサポートしているため、透明背景が必要な場合は必ず結果を PNG でダウンロードしてください。JPG は透明を白に潰し、WebP は透明に対応していますが、古いエディタやプラットフォームでは対応が限られます。" },
      { question: "AI 背景削除は本当に無料でプライベートですか？", answer: "はい。背景除去ツールは完全にブラウザ内で動作します——AI モデルとカラーアルゴリズムはローカル端末上で実行されます。画像がサーバーにアップロードされることはなく、アカウント不要、保存されるデータもありません。" },
      { question: "髪や毛のエッジをきれいにするには？", answer: "髪の毛の束のような細かく複雑なエッジを処理できるよう訓練された AI モードを使用してください。色マッチングでは背景と似た色の髪を区別できないため、こうしたケースではカラーモードを避けましょう。" },
    ],
    ko: [
      { question: "피사체를 손상시키지 않고 배경을 제거할 수 있나요?", answer: "네. AI 모드는 배경을 지우면서 주요 피사체를 온전히 유지하도록 설계되었습니다. 피사체와 배경의 대비가 높은 원본을 사용하고, 처리 후 가장자리를 확인하세요. 단색 배경에는 낮은 허용 오차의 색상 모드를 사용하면 매칭된 색만 제거되어 피사체는 그대로 남습니다." },
      { question: "투명 배경에는 어떤 이미지 형식을 사용해야 하나요?", answer: "PNG는 완전한 투명도를 지원하므로 투명 배경이 필요할 때는 반드시 결과를 PNG로 다운로드하세요. JPG는 투명 영역을 흰색으로 평탄화하며, WebP는 투명도를 지원하지만 구형 편집기나 플랫폼에서는 지원이 제한적입니다." },
      { question: "AI 배경 제거는 정말 무료이고 프라이빗한가요?", answer: "네. 배경 제거 도구는 완전히 브라우저 안에서 실행됩니다 — AI 모델과 색상 알고리즘이 로컬 기기에서 실행됩니다. 이미지가 서버로 업로드되지 않고, 계정이 필요 없으며, 어떤 것도 저장되지 않습니다." },
      { question: "머리카락과 털 가장자리를 깔끔하게 하려면 어떻게 하나요?", answer: "머리카락 가닥이나 털 같은 미세하고 복잡한 가장자리를 처리하도록 훈련된 AI 모드를 사용하세요. 색상 매칭은 배경과 비슷한 색의 머리카락을 구분할 수 없으므로 이런 경우에는 색상 모드를 피하세요." },
    ],
  },
};
