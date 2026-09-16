import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> Fill your screen with solid colors to expose panel defects. Pure black in a dark room reveals backlight bleed; pure white reveals dead pixels; red, green and blue expose stuck sub-pixels. Test before the return window closes — a five-minute check with a free browser tool is all it takes.</p>
      </aside>

      <img src="/blog/how-to-check-dead-pixels.jpg" alt="Laptop screen showing a solid red test pattern with a magnified view of a dead pixel and a stuck pixel" width={1600} height={900} className="mb-8 w-full h-auto rounded-xl" />

      <section>
        <h2>Dead Pixels vs. Stuck Pixels</h2>
        <p>A <strong>dead pixel</strong> is permanently black: the transistor that powers it has failed, so it never lights up. It is most visible against a white or bright background. A <strong>stuck pixel</strong> is the opposite — one of its three sub-pixels (red, green or blue) is locked in the &ldquo;on&rdquo; position, so the pixel shows a tiny colored dot that never changes. Stuck pixels only show up on certain colors, which is why you have to cycle through the primary colors to find them.</p>
        <p>Neither is caused by software. If a dot appears in photos, videos and solid-color test screens alike, at the same position every time, it is a hardware defect of the panel.</p>
      </section>

      <section>
        <h2>What Backlight Bleed Looks Like</h2>
        <p>Most LCD screens are lit from behind by an LED backlight. Where the panel and frame do not seal perfectly, light leaks through — usually along the edges or in the corners. On a pure black screen in a dark room this shows up as a bright, cloudy patch or glow.</p>
        <p>A small amount of bleed is normal for LCD technology; you will find it on most laptops if you look hard enough. It only matters when it is visible in everyday use, like dark movie scenes. Note that <strong>OLED screens have no backlight</strong>, so they cannot bleed — but they can suffer burn-in, a different defect entirely.</p>
      </section>

      <section>
        <h2>How to Test Your Screen</h2>
        <p>The test itself takes five minutes and needs no installation. Our <Link href="/tools/screen-color-test" className="text-blue-400 hover:text-blue-300">Screen Color Test</Link> fills the browser with pure test colors, entirely client-side:</p>
        <ol>
          <li>Set brightness to 100% and turn off night mode or any color filter.</li>
          <li>Open the tool and click <strong>Start fullscreen test</strong> — the screen fills with pure black.</li>
          <li>Look at the edges and corners in a dark room for bright patches (backlight bleed).</li>
          <li>Click or press <strong>Space</strong> to cycle to white, then red, green and blue. Sweep your eyes across the whole panel each time, hunting for dots that differ from the background.</li>
          <li>Finish with the grayscale gradient to check for banding and uneven brightness.</li>
        </ol>
        <p>Press <strong>Esc</strong> at any time to exit. The tool keeps your screen awake while you inspect and never uploads anything — there is nothing to upload, it is just a colored page.</p>
        <ToolCTA name="Screen Color Test" href="/tools/screen-color-test" description="Fill your screen with pure test colors to find dead pixels, stuck pixels and backlight bleed. Runs fullscreen in your browser — nothing installed, nothing uploaded." />
      </section>

      <section>
        <h2>What Manufacturers Consider &ldquo;Normal&rdquo;</h2>
        <p>Almost every brand grades panels against a dead-pixel policy rather than promising perfection. The common ISO 9241-style classes allow a handful of defects before a panel counts as faulty, and many manufacturers exchange a screen only when defects exceed the count in their published table — for example &ldquo;2 dead pixels or 5 stuck sub-pixels&rdquo;.</p>
        <p>Practical takeaway: count and note the exact defects before you contact support or the seller. A single dead pixel is often within spec, but a brand-new laptop showing a cluster of them is worth exchanging immediately — within the return window you do not need to argue policy at all.</p>
      </section>

      <section>
        <h2>Can Defects Be Fixed?</h2>
        <p>Dead pixels cannot be revived by software — the hardware no longer responds. Stuck pixels occasionally recover: rapidly cycling colors for a while (a &ldquo;pixel fixer&rdquo;) can jolt a sub-pixel back into switching, but success is hit-or-miss and pressure-based tricks risk damaging the panel.</p>
        <p>Backlight bleed likewise has no software fix. Some users reduce its visibility by lowering brightness or loosening an over-tightened bezel screw (at their own risk), but a clearly uneven panel is a warranty matter.</p>
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>太长不看：</strong>用纯色填满屏幕即可暴露面板缺陷。暗房中的纯黑显漏光，纯白显坏点（暗点），红绿蓝三原色显坏线像素。趁退货期内测完——用免费浏览器工具五分钟就能查完。</p>
      </aside>

      <img src="/blog/how-to-check-dead-pixels.jpg" alt="笔记本屏幕显示纯红色测试画面，放大镜中可见坏点与坏线像素" width={1600} height={900} className="mb-8 w-full h-auto rounded-xl" />

      <section>
        <h2>坏点 vs 坏线像素</h2>
        <p><strong>坏点（dead pixel）</strong>是永远黑色的像素：给它供电的晶体管坏了，再也点不亮。在白色或明亮背景下最明显。<strong>坏线像素（stuck pixel）</strong>恰好相反——它的红、绿、蓝三个子像素之一被卡在“常开”状态，于是屏幕上出现一个永不变化的小色点。坏线像素只在特定颜色下可见，所以必须逐个切换三原色才能找全。</p>
        <p>两者都不是软件问题。如果同一个位置的点在照片、视频和纯色测试屏上都出现，那就是面板的硬件缺陷。</p>
      </section>

      <section>
        <h2>漏光是什么样子</h2>
        <p>大多数 LCD 屏幕靠背后的 LED 背光层照亮。面板与边框密封不严的地方，光就会漏出来——通常在边缘或四角。在暗房中的纯黑屏幕上，它表现为一块明亮、云雾状的光斑或辉光。</p>
        <p>轻微漏光是 LCD 技术的正常现象，仔细看大多数笔记本都有。只有在日常使用中可见（比如看暗场景电影时）才需要在意。注意 <strong>OLED 屏幕没有背光层</strong>，所以不存在漏光——但可能有烧屏，那是完全不同的缺陷。</p>
      </section>

      <section>
        <h2>如何测试屏幕</h2>
        <p>测试本身只要五分钟，无需安装任何东西。我们的<Link href="/tools/screen-color-test" className="text-blue-400 hover:text-blue-300">屏幕纯色测试</Link>用纯色填满浏览器，完全在本地运行：</p>
        <ol>
          <li>把亮度调到 100%，关闭夜间模式和一切色彩滤镜。</li>
          <li>打开工具，点击<strong>一键全屏测试</strong>——屏幕被纯黑填满。</li>
          <li>在暗房中观察边缘和四角，寻找明亮光斑（漏光）。</li>
          <li>点击或按<strong>空格</strong>依次切到白、红、绿、蓝。每次都扫视整个面板，寻找与背景不同的点。</li>
          <li>最后用灰度渐变检查色带和亮度不均。</li>
        </ol>
        <p>随时按 <strong>Esc</strong> 退出。工具会在检查期间保持屏幕常亮，且不上传任何东西——本来就没什么可上传的，它只是一张纯色页面。</p>
        <ToolCTA name="屏幕纯色测试" href="/tools/screen-color-test" description="用纯色填满屏幕，检测坏点、坏像素和漏光。浏览器内全屏运行——无需安装，不上传任何数据。" />
      </section>

      <section>
        <h2>厂商眼中的“正常”是什么标准</h2>
        <p>几乎所有品牌都按坏点保修政策给面板分级，而不是承诺完美。常见的 ISO 9241 式等级允许少量缺陷存在，许多厂商只有当缺陷超过其公布表格中的数量（例如“2 个坏点或 5 个坏子像素”）才认定屏幕故障并换屏。</p>
        <p>实用建议：联系售后或卖家之前，先数清并记下确切的缺陷。单个坏点通常在规格范围内；但新买的笔记本若成串出现坏点，应立即换货——在退货期内根本不需要争论保修政策。</p>
      </section>

      <section>
        <h2>这些缺陷能修吗？</h2>
        <p>坏点无法靠软件救活——硬件已经不应答了。坏线像素偶尔能恢复：让颜色高速循环一段时间（“像素修复器”）有时能唤醒卡住的子像素，但成功率看运气，按压类偏方则有压坏面板的风险。</p>
        <p>漏光同样没有软件解法。有人通过调低亮度或松开过紧的边框螺丝（风险自负）来减轻观感，但明显不均的面板属于保修问题。</p>
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="要約" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>要約：</strong>画面を単色で埋めればパネルの欠陥が浮き彫りになります。暗い部屋での純黒は光漏れを、純白はデッドピクセルを、赤・緑・青は張り付いたサブピクセルを暴きます。返品期間のうちにテストを——無料のブラウザツールで5分で済みます。</p>
      </aside>

      <img src="/blog/how-to-check-dead-pixels.jpg" alt="ノート PC の画面に赤い単色テストが表示され、拡大鏡の中にデッドピクセルとドット抜けが見える" width={1600} height={900} className="mb-8 w-full h-auto rounded-xl" />

      <section>
        <h2>デッドピクセルとドット抜けの違い</h2>
        <p><strong>デッドピクセル</strong>は永久に黒いままのピクセルです。駆動するトランジスタが故障したため、二度と点灯しません。白や明るい背景で最も目立ちます。<strong>ドット抜け（stuck pixel）</strong>はその逆で、赤・緑・青のサブピクセルの1つが「点灯したまま」に固着し、決って変わらない小さな色点として見えます。ドット抜けは特定の色でしか見えないため、3原色を順に切り替えて探す必要があります。</p>
        <p>どちらもソフトウェアが原因ではありません。写真・動画・単色テスト画面のすべてで同じ位置に点が見えるなら、それはパネルのハードウェア欠陥です。</p>
      </section>

      <section>
        <h2>光漏れの見た目</h2>
        <p>多くの液晶は裏側の LED バックライトで照らされています。パネルとフレームの密閉が不完全な箇所から光が漏れ出ます——主に縁や四角です。暗い部屋で純黒の画面にすると、明るい雲状の斑やグローとして現れます。</p>
        <p>わずかな光漏れは液晶技術としては正常で、探せば大半のノート PC にあります。日常使用（暗い映画シーンなど）で目立つ場合にだけ問題になります。<strong>OLED にはバックライトがない</strong>ため光漏れは起きませんが、焼き付きという別の欠陥はあります。</p>
      </section>

      <section>
        <h2>画面のテスト方法</h2>
        <p>テスト自体は5分、インストール不要です。<Link href="/tools/screen-color-test" className="text-blue-400 hover:text-blue-300">画面カラーテスト</Link>はブラウザを純色で埋めるツールで、すべてローカルで動作します：</p>
        <ol>
          <li>輝度を 100% にし、ナイトモードやカラーフィルターをオフにします。</li>
          <li>ツールを開いて<strong>全画面テストを開始</strong>をクリック——画面が純黒で埋まります。</li>
          <li>暗い部屋で縁と四隅の明るい斑（光漏れ）を確認します。</li>
          <li>クリックまたは<strong>Space</strong>で白→赤→緑→青へ順に切り替え、そのたびにパネル全体を目で舐め、背景と異なる点を探します。</li>
          <li>最後にグレースケールのグラデーションで色の飛びと輝度ムラを確認します。</li>
        </ol>
        <p>いつでも <strong>Esc</strong> で終了できます。ツールは確認中のスリープを防ぎ、何もアップロードしません——ただの単色ページなので、アップロードするものがそもそもありません。</p>
        <ToolCTA name="画面カラーテスト" href="/tools/screen-color-test" description="画面を純色で埋めて、デッドピクセル・ドット抜け・光漏れをチェック。ブラウザで全画面動作——インストール不要、アップロードもなし。" />
      </section>

      <section>
        <h2>メーカーが「正常」とみなす基準</h2>
        <p>ほぼすべてのブランドは完全な無欠陥ではなく、ドット抜けポリシーに基づいてパネルを等級付けしています。一般的な ISO 9241 方式の等級では、一定数以下の欠陥は許容され、「デッド2個またはサブピクセル抜け5個」のような表を超えて初めて故障扱いで交換の対象になります。</p>
        <p>実用的なポイント：サポートや販売者に連絡する前に、欠陥の数と位置を正確に記録しましょう。デッドピクセル1個は規定内のことが多く、新購入ノートに簇状の欠陥がある場合は返品期間内なら政策を議論するまでもなく即交換を求められます。</p>
      </section>

      <section>
        <h2>欠陥は直る？</h2>
        <p>デッドピクセルをソフトウェアで復活させることはできません——ハードウェアがもう応答しないからです。ドット抜けは稀に回復します：色を高速で巡回させる「ピクセルフィクサー」でサブピクセルが復帰することがありますが、成功率は運次第で、押す系の民間療法はパネルを傷めるリスクがあります。</p>
        <p>光漏れもソフトウェアでの解決策はありません。輝度を下げたり、締めすぎたベゼルのネジを緩めたり（自己責任）で目立ちにくくすることはありますが、明らかにムラのあるパネルは保証の対象です。</p>
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>요약:</strong> 화면을 단색으로 채우면 패널 결함이 드러납니다. 어두운 방의 순수한 검정은 빛샘을, 순수한 흰색은 데드 픽셀을, 빨강·초록·파랑은 붙은 서브픽셀을 밝혀냅니다. 반품 기간 내에 테스트하세요 — 무료 브라우저 도구로 5분이면 충분합니다.</p>
      </aside>

      <img src="/blog/how-to-check-dead-pixels.jpg" alt="노트북 화면에 빨간 단색 테스트가 표시되고, 돋보기 안에 데드 픽셀과 붙은 픽셀이 보입니다" width={1600} height={900} className="mb-8 w-full h-auto rounded-xl" />

      <section>
        <h2>데드 픽셀 vs 붙은 픽셀</h2>
        <p><strong>데드 픽셀</strong>은 영구적으로 검은 픽셀입니다. 구동 트랜지스터가 고장 나 다시 켜지지 않습니다. 흰색이나 밝은 배경에서 가장 잘 보입니다. <strong>붙은 픽셀(stuck pixel)</strong>은 반대로 빨강·초록·파랑 서브픽셀 중 하나가 &ldquo;켜짐&rdquo; 상태에 고정되어, 절대 변하지 않는 작은 색 점으로 나타납니다. 붙은 픽셀은 특정 색에서만 보이므로 세 가지 원색을 모두 순회해야 찾을 수 있습니다.</p>
        <p>둘 다 소프트웨어 문제가 아닙니다. 사진, 동영상, 단색 테스트 화면 모두에서 같은 위치에 점이 보인다면 패널의 하드웨어 결함입니다.</p>
      </section>

      <section>
        <h2>빛샘은 어떻게 보이나</h2>
        <p>대부분의 LCD는 뒤에서 LED 백라이트로 빛냅니다. 패널과 프레임이 완전히 밀착되지 않은 곳으로 빛이 새어 나옵니다 — 주로 가장자리나 모서리에서요. 어두운 방의 순수한 검은 화면에서는 밝고 뿌연 얼룩이나 글로우로 나타납니다.</p>
        <p>약간의 빛샘은 LCD 기술상 정상이며, 꼼꼼히 보면 대부분의 노트북에 있습니다. 어두운 영화 장면처럼 일상에서 보일 때만 문제가 됩니다. <strong>OLED는 백라이트가 없어</strong> 빛샘이 생기지 않지만, 잔상이라는 별개의 결함이 있을 수 있습니다.</p>
      </section>

      <section>
        <h2>화면 테스트 방법</h2>
        <p>테스트 자체는 5분이면 끝나고 설치가 필요 없습니다. <Link href="/tools/screen-color-test" className="text-blue-400 hover:text-blue-300">화면 단색 테스트</Link> 도구가 브라우저를 순수한 테스트 색으로 채우며, 모두 로컬에서 동작합니다:</p>
        <ol>
          <li>밝기를 100%로 올리고 야간 모드와 색상 필터를 끕니다.</li>
          <li>도구를 열고 <strong>전체 화면 테스트 시작</strong>을 클릭 — 화면이 순수한 검정으로 채워집니다.</li>
          <li>어두운 방에서 가장자리와 모서리의 밝은 얼룩(빛샘)을 확인합니다.</li>
          <li>클릭 또는 <strong>Space</strong>로 흰색 → 빨강 → 초록 → 파랑으로 전환하며, 매번 패널 전체를 훑어 배경과 다른 점을 찾습니다.</li>
          <li>마지막으로 회색조 그라데이션으로 색 밴딩과 휘도 불균형을 확인합니다.</li>
        </ol>
        <p>언제든 <strong>Esc</strong>로 종료할 수 있습니다. 도구는 확인하는 동안 화면이 꺼지지 않게 유지하며 아무것도 업로드하지 않습니다 — 단색 페이지일 뿐이라 업로드할 것 자체가 없습니다.</p>
        <ToolCTA name="화면 단색 테스트" href="/tools/screen-color-test" description="화면을 순수한 테스트 색으로 채워 데드 픽셀, 붙은 픽셀, 빛샘을 검사합니다. 브라우저에서 전체 화면으로 동작 — 설치도 업로드도 없습니다." />
      </section>

      <section>
        <h2>제조사가 보는 &ldquo;정상&rdquo; 기준</h2>
        <p>거의 모든 브랜드가 완벽함이 아니라 불량화점 정책으로 패널을 등급 매깁니다. 일반적인 ISO 9241 방식 등급에서는 일정 수 이하의 결함이 허용되며, &ldquo;데드 2개 또는 서브픽셀 5개&rdquo; 같은 공표된 기준을 초과해야 불량으로 인정해 교체합니다.</p>
        <p>실용적인 팁: 지원팀이나 판매자에 연락하기 전에 결함의 수와 위치를 정확히 기록하세요. 데드 픽셀 1개는 규정 내인 경우가 많지만, 새 노트북에 결함이 무리 지어 있다면 반품 기간 내에는 정책을 따질 필요 없이 바로 교환을 요구할 수 있습니다.</p>
      </section>

      <section>
        <h2>결함은 고칠 수 있나?</h2>
        <p>데드 픽셀은 소프트웨어로 살릴 수 없습니다 — 하드웨어가 이미 반응하지 않습니다. 붙은 픽셀은 가끔 회복됩니다. 색을 빠르게 순환시키는 &ldquo;픽셀 픽서&rdquo;가 고정된 서브픽셀을 깨워주는 경우가 있지만 성공률은 운에 달렸고, 누르는 민간요법은 패널을 손상시킬 위험이 있습니다.</p>
        <p>빛샘도 소프트웨어적 해결책이 없습니다. 밝기를 낮추거나 과하게 조인 베젤 나사를 풀어(본인 책임) 눈에 덜 띄게 하는 사례는 있지만, 뚜렷하게 불균형한 패널은 보증 대상입니다.</p>
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "How many dead pixels are acceptable?", answer: "It depends on the manufacturer's policy. Most brands allow a small number (often 1-3 dead pixels, more for lower panel grades) before a screen qualifies for replacement. A brand-new device within its return window can be exchanged regardless of policy." },
      { question: "Can I test a screen before buying?", answer: "Yes. On a display model, open a browser-based screen test like ToolkitLife's Screen Color Test and cycle through black, white and the RGB primaries. It runs on any phone or laptop browser with nothing installed." },
      { question: "Is backlight bleed a defect?", answer: "A trace of bleed is inherent to LCD technology and is not usually covered by warranty. It counts as a defect when it is clearly visible in normal use. OLED screens are immune because they have no backlight." },
      { question: "Do stuck pixels spread?", answer: "No. A dead or stuck pixel is an isolated hardware fault of a single sub-pixel and does not spread to neighbors. Panels that develop one defect are statistically not more likely to develop more." },
    ],
    zh: [
      { question: "多少个坏点算可以接受？", answer: "取决于厂商政策。多数品牌允许少量坏点（通常 1-3 个，低等级面板更多）存在，超过才换屏。但退货期内的新设备无需受政策约束，可直接退换。" },
      { question: "买之前能测屏幕吗？", answer: "可以。在卖场样机上，用 ToolkitLife 的屏幕纯色测试这类浏览器工具，依次过一遍黑、白和红绿蓝即可。任何手机或电脑浏览器都能打开，无需安装。" },
      { question: "漏光算质量问题吗？", answer: "轻微漏光是 LCD 技术固有的，通常不在保修范围内。只有日常使用中清晰可见才算缺陷。OLED 没有背光层，天然免疫漏光。" },
      { question: "坏线像素会扩散吗？", answer: "不会。坏点/坏线像素是单个子像素的孤立硬件故障，不会传染给邻近像素。出现一处缺陷的面板在统计上并不会更容易出现更多缺陷。" },
    ],
    ja: [
      { question: "デッドピクセルは何個まで許容？", answer: "メーカーのポリシー次第です。多くのブランドは少人数（多くは1〜3個、グレードの低いパネルはもっと）まで許容し、超えて初めて交換対象にします。返品期間内の新製品ならポリシーに関係なく交換できます。" },
      { question: "購入前に画面をテストできる？", answer: "できます。店頭の展示機で ToolkitLife の画面カラーテストのようなブラウザツールを開き、黒・白・RGB3原色を順に確認します。インストール不要で、スマホでもノート PC でも動きます。" },
      { question: "光漏れは欠陥なの？", answer: "わずかな光漏れは液晶技術に固有のもので、通常は保証対象外です。日常使用で明らかに見える場合にのみ欠陥とみなされます。OLED はバックライトがないため光漏れとは無縁です。" },
      { question: "ドット抜けは広がる？", answer: "広がりません。デッド/ドット抜けは単一サブピクセルの孤立したハードウェア故障で、隣に伝染しません。1箇所欠陥が出たパネルが統計的にさらに欠陥を生みやすいわけでもありません。" },
    ],
    ko: [
      { question: "데드 픽셀 몇 개까지 괜찮나요?", answer: "제조사 정책에 따라 다릅니다. 대부분 브랜드는 소수(보통 1~3개, 낮은 등급 패널은 그 이상)까지 허용하며 초과해야 교체 대상이 됩니다. 반품 기간 내의 새 기기는 정책과 무관하게 교환할 수 있습니다." },
      { question: "구매 전에 화면을 테스트할 수 있나요?", answer: "가능합니다. 매장 전시기기에서 ToolkitLife 화면 단색 테스트 같은 브라우저 도구를 열고 검정, 흰색, RGB 원색을 차례로 확인하세요. 설치 없이 어떤 브라우저에서나 동작합니다." },
      { question: "빛샘은 결함인가요?", answer: "약간의 빛샘은 LCD 기술에 원래 있는 것으로 보증 대상이 아닌 경우가 많습니다. 일상 사용에서 뚜렷이 보일 때만 결함으로 칩니다. OLED는 백라이트가 없어 빛샘이 생기지 않습니다." },
      { question: "붙은 픽셀은 번지나요?", answer: "아니요. 데드/붙은 픽셀은 단일 서브픽셀의 고립된 하드웨어 고장으로 이웃에 퍼지지 않습니다. 결함이 하나 생긴 패널이 통계적으로 더 많은 결함을 낼 가능성이 높은 것도 아닙니다." },
    ],
  },
};
