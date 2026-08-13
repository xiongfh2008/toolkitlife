import type { ReactNode } from "react";
import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> A strong resume is one page, reverse-chronological, and tailored to each job. Lead with a professional summary, quantify your achievements, use keywords from the job posting for ATS compatibility, and keep formatting clean and simple. Skip objective statements, photos, and fancy graphics. Use a free resume builder to get the formatting right without fighting with Word templates.</p>
      </aside>

      <nav aria-label="Table of contents" className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Table of Contents</h2>
        <ol className="space-y-1.5 text-sm">
          <li><Link href="#format" className="text-blue-400 hover:text-blue-300">Choose the Right Format</Link></li>
          <li><Link href="#sections" className="text-blue-400 hover:text-blue-300">Essential Resume Sections</Link></li>
          <li><Link href="#bullets" className="text-blue-400 hover:text-blue-300">Writing Strong Bullet Points</Link></li>
          <li><Link href="#ats" className="text-blue-400 hover:text-blue-300">ATS Optimization</Link></li>
          <li><Link href="#mistakes" className="text-blue-400 hover:text-blue-300">Common Mistakes to Avoid</Link></li>
          <li><Link href="#tools" className="text-blue-400 hover:text-blue-300">Free Tools to Build Your Resume</Link></li>
          <li><Link href="#faq" className="text-blue-400 hover:text-blue-300">FAQ</Link></li>
        </ol>
      </nav>

      <section id="format">
        <h2>Choose the Right Format</h2>
        <p>There are three standard resume formats. <strong>Reverse-chronological</strong> is the most common and preferred by recruiters. It lists your most recent job first and works backward. This is the default choice for most job seekers.</p>
        <p><strong>Functional resumes</strong> focus on skills rather than timeline. These work for career changers or people with employment gaps, but many recruiters dislike them because they obscure your work history. <strong>Combination resumes</strong> blend both approaches but often run long. Stick with reverse-chronological unless you have a specific reason not to.</p>
      </section>

      <section id="sections">
        <h2>Essential Resume Sections</h2>
        <p>Every resume needs these sections, in this order:</p>
        <ul>
          <li><strong>Header:</strong> Name, phone, email, city/state (full address not needed), LinkedIn URL if relevant.</li>
          <li><strong>Professional Summary:</strong> 2-3 sentences summarizing your experience level, key skills, and value proposition. Replace the outdated &quot;Objective&quot; statement.</li>
          <li><strong>Work Experience:</strong> Job title, company, dates, and 3-5 bullet points per role. Most recent first.</li>
          <li><strong>Education:</strong> Degree, school, graduation year. GPA only if above 3.5 and you graduated within the last 3 years.</li>
          <li><strong>Skills:</strong> Technical skills, tools, certifications. Match these to the job posting.</li>
        </ul>
      </section>

      <section id="bullets">
        <h2>Writing Strong Bullet Points</h2>
        <p><strong>The single biggest improvement most people can make is quantifying their achievements.</strong> Compare these two bullet points:</p>
        <ul>
          <li>Weak: &quot;Responsible for managing social media accounts&quot;</li>
          <li>Strong: &quot;Grew Instagram following from 5K to 45K in 8 months, increasing engagement rate by 340%&quot;</li>
        </ul>
        <p>Start every bullet with a strong action verb: led, built, increased, reduced, launched, designed, implemented, optimized. Then add the result. Numbers, percentages, dollar amounts, and timeframes make your impact concrete and memorable.</p>
      </section>

      <section id="ats">
        <h2>ATS Optimization</h2>
        <p>Most companies use Applicant Tracking Systems to filter resumes before a human sees them. To pass ATS screening:</p>
        <ul>
          <li>Use standard section headers (Experience, Education, Skills) not creative alternatives.</li>
          <li>Include keywords from the job description naturally in your bullet points.</li>
          <li>Avoid tables, columns, text boxes, headers/footers, and images.</li>
          <li>Use a standard font (Arial, Calibri, Helvetica) at 10-12pt.</li>
          <li>Save as PDF unless told otherwise.</li>
        </ul>
      </section>

      <section id="mistakes">
        <h2>Common Mistakes to Avoid</h2>
        <ul>
          <li><strong>Including a photo</strong> unless applying in countries where it&apos;s expected (not the US, UK, or Canada).</li>
          <li><strong>Using &quot;References available upon request.&quot;</strong> This is assumed. It wastes space.</li>
          <li><strong>Listing every job you&apos;ve ever had.</strong> Focus on the last 10-15 years of relevant experience.</li>
          <li><strong>Using generic descriptions</strong> instead of specific achievements with numbers.</li>
          <li><strong>Typos and inconsistent formatting.</strong> Have someone else proofread it.</li>
        </ul>
      </section>

      <section id="tools">
        <h2>Free Tools to Build Your Resume</h2>
        <p>You don&apos;t need to fight with Word templates or pay for a subscription service. Our <Link href="/tools/resume-builder" className="text-blue-400 hover:text-blue-300">free Resume Builder</Link> lets you fill in your details, choose from multiple templates, preview your resume in real time, and download as PDF. Everything runs in your browser with no signup required.</p>
        <ToolCTA name="Resume Builder" href="/tools/resume-builder" description="Build a professional resume with live preview, multiple templates, and PDF download. No signup, no watermark — runs entirely in your browser." />
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>太长不看：</strong>一份优秀的简历应为一页、按时间倒序排列，并针对每个职位进行定制。以专业概述开头，量化你的成就，使用招聘信息中的关键词以通过 ATS 筛选，保持版式干净简洁。不要写求职目标陈述、不放照片、不用花哨的图形。使用免费简历生成器，无需再与 Word 模板搏斗。</p>
      </aside>

      <nav aria-label="目录" className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">目录</h2>
        <ol className="space-y-1.5 text-sm">
          <li><Link href="#format" className="text-blue-400 hover:text-blue-300">选择合适的格式</Link></li>
          <li><Link href="#sections" className="text-blue-400 hover:text-blue-300">简历必备板块</Link></li>
          <li><Link href="#bullets" className="text-blue-400 hover:text-blue-300">写出有力的工作要点</Link></li>
          <li><Link href="#ats" className="text-blue-400 hover:text-blue-300">ATS 优化</Link></li>
          <li><Link href="#mistakes" className="text-blue-400 hover:text-blue-300">需要避免的常见错误</Link></li>
          <li><Link href="#tools" className="text-blue-400 hover:text-blue-300">免费制作简历的工具</Link></li>
          <li><Link href="#faq" className="text-blue-400 hover:text-blue-300">常见问题</Link></li>
        </ol>
      </nav>

      <section id="format">
        <h2>选择合适的格式</h2>
        <p>简历有三种标准格式。<strong>时间倒序式</strong>最常见，也最受招聘官青睐。它把最近的工作经历放在最前面，依次往前排列。这是大多数求职者的默认选择。</p>
        <p><strong>功能式简历</strong>侧重技能而非时间线，适合转行者或工作经历有断档的人，但很多招聘官不喜欢它，因为这种方式掩盖了你的工作经历。<strong>混合式简历</strong>结合了两种方式，但往往篇幅过长。除非有特殊理由，否则坚持使用时间倒序式。</p>
      </section>

      <section id="sections">
        <h2>简历必备板块</h2>
        <p>每份简历都需要按以下顺序包含这些板块：</p>
        <ul>
          <li><strong>页眉：</strong>姓名、电话、邮箱、城市/州（无需完整地址），如适用可附上 LinkedIn 链接。</li>
          <li><strong>专业概述：</strong>用 2-3 句话概括你的经验水平、核心技能和价值主张，取代过时的 &quot;Objective&quot; 求职目标陈述。</li>
          <li><strong>工作经历：</strong>职位名称、公司、起止时间，以及每个职位的 3-5 条要点。最近的放在最前面。</li>
          <li><strong>教育背景：</strong>学位、学校、毕业年份。GPA 仅在 3.5 以上且毕业不超过 3 年时列出。</li>
          <li><strong>技能：</strong>专业技能、工具、证书，与招聘信息中的要求对齐。</li>
        </ul>
      </section>

      <section id="bullets">
        <h2>写出有力的工作要点</h2>
        <p><strong>大多数人能做出的最大改进就是量化自己的成就。</strong>对比下面两条工作要点：</p>
        <ul>
          <li>弱：&quot;负责管理社交媒体账号&quot;</li>
          <li>强：&quot;8 个月内将 Instagram 粉丝从 5K 增长到 45K，互动率提升 340%&quot;</li>
        </ul>
        <p>每条要点都以有力的动作动词开头：led（领导）、built（构建）、increased（提升）、reduced（降低）、launched（推出）、designed（设计）、implemented（实施）、optimized（优化）。然后补充结果。数字、百分比、金额和时间范围能让你的贡献具体可感、令人印象深刻。</p>
      </section>

      <section id="ats">
        <h2>ATS 优化</h2>
        <p>大多数公司会使用求职者追踪系统（Applicant Tracking Systems）在人工筛选之前先过滤简历。要通过 ATS 筛选：</p>
        <ul>
          <li>使用标准板块标题（Experience、Education、Skills），不要用标新立异的写法。</li>
          <li>在要点中自然地融入职位描述中的关键词。</li>
          <li>避免使用表格、分栏、文本框、页眉/页脚和图片。</li>
          <li>使用标准字体（Arial、Calibri、Helvetica），字号 10-12pt。</li>
          <li>除非另有说明，否则保存为 PDF。</li>
        </ul>
      </section>

      <section id="mistakes">
        <h2>需要避免的常见错误</h2>
        <ul>
          <li><strong>附上照片</strong>，除非求职国家有这一惯例（美国、英国、加拿大不需要）。</li>
          <li><strong>写 &quot;References available upon request&quot;（备索证明人）。</strong>这是默认约定，只会浪费篇幅。</li>
          <li><strong>把所有做过的工作都列出来。</strong>只聚焦最近 10-15 年的相关经历。</li>
          <li><strong>用泛泛的描述</strong>代替带数字的具体成就。</li>
          <li><strong>错别字和格式不一致。</strong>请别人帮你校对一遍。</li>
        </ul>
      </section>

      <section id="tools">
        <h2>免费制作简历的工具</h2>
        <p>你无需与 Word 模板搏斗，也不必为订阅服务付费。我们的<Link href="/tools/resume-builder" className="text-blue-400 hover:text-blue-300">免费简历生成器</Link>让你填写个人信息、从多个模板中选择、实时预览简历并下载为 PDF。一切都在浏览器中完成，无需注册。</p>
        <ToolCTA name="简历生成器" href="/tools/resume-builder" description="实时预览、多模板、PDF 下载，制作专业简历。无需注册、无水印——完全在浏览器中运行。" />
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="要約" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>要約：</strong>優れた履歴書は 1 ページにまとめ、新しい順（逆時系列）に書き、応募先ごとに調整したものです。冒頭にプロフェッショナルサマリーを置き、実績は数値で示し、ATS 対策として求人票のキーワードを使い、フォーマットはシンプルに保ちましょう。志望動機（Objective）や写真、凝ったグラフィックは不要です。無料の履歴書作成ツールを使えば、Word テンプレートに苦労することなく見栄えの良いフォーマットを整えられます。</p>
      </aside>

      <nav aria-label="目次" className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">目次</h2>
        <ol className="space-y-1.5 text-sm">
          <li><Link href="#format" className="text-blue-400 hover:text-blue-300">正しいフォーマットを選ぶ</Link></li>
          <li><Link href="#sections" className="text-blue-400 hover:text-blue-300">履歴書の必須セクション</Link></li>
          <li><Link href="#bullets" className="text-blue-400 hover:text-blue-300">効果的な箇条書きを書く</Link></li>
          <li><Link href="#ats" className="text-blue-400 hover:text-blue-300">ATS 対策</Link></li>
          <li><Link href="#mistakes" className="text-blue-400 hover:text-blue-300">避けるべきよくあるミス</Link></li>
          <li><Link href="#tools" className="text-blue-400 hover:text-blue-300">無料で履歴書を作成するツール</Link></li>
          <li><Link href="#faq" className="text-blue-400 hover:text-blue-300">よくある質問（FAQ）</Link></li>
        </ol>
      </nav>

      <section id="format">
        <h2>正しいフォーマットを選ぶ</h2>
        <p>履歴書の標準フォーマットは 3 種類あります。<strong>逆時系列</strong>が最も一般的で、採用担当者にも好まれます。最も新しい職歴を先頭に置き、過去へさかのぼって並べます。ほとんどの求職者にとってのデフォルトの選択です。</p>
        <p><strong>機能型フォーマット</strong>は時系列ではなくスキルに焦点を当てます。キャリアチェンジや空白期間がある人に向いていますが、職歴が分かりにくくなるため採用担当者に敬遠されることも少なくありません。<strong>複合型フォーマット</strong>は両方を組み合わせますが、長くなりがちです。特別な理由がない限り、逆時系列を選びましょう。</p>
      </section>

      <section id="sections">
        <h2>履歴書の必須セクション</h2>
        <p>どの履歴書にも、以下のセクションをこの順番で入れましょう。</p>
        <ul>
          <li><strong>ヘッダー：</strong>氏名、電話番号、メールアドレス、市区町村（完全な住所は不要）、必要に応じて LinkedIn の URL。</li>
          <li><strong>プロフェッショナルサマリー：</strong>経験レベル、主要スキル、価値提案を 2〜3 文でまとめます。時代遅れの &quot;Objective&quot; に代わるものです。</li>
          <li><strong>職歴：</strong>役職、会社名、期間、各職務につき箇条書き 3〜5 項目。新しい順に並べます。</li>
          <li><strong>学歴：</strong>学位、学校名、卒業年。GPA は 3.5 以上かつ卒業から 3 年以内の場合のみ記載します。</li>
          <li><strong>スキル：</strong>専門スキル、ツール、資格。求人票の内容に合わせましょう。</li>
        </ul>
      </section>

      <section id="bullets">
        <h2>効果的な箇条書きを書く</h2>
        <p><strong>ほとんどの人が改善できる最大のポイントは、実績を数値で示すことです。</strong>次の 2 つの箇条書きを比べてみてください。</p>
        <ul>
          <li>弱い例：&quot;ソーシャルメディアアカウントの管理を担当&quot;</li>
          <li>強い例：&quot;Instagram のフォロワーを 8 か月で 5K から 45K に増やし、エンゲージメント率を 340% 向上&quot;</li>
        </ul>
        <p>各項目は led（率いた）、built（構築した）、increased（増加させた）、reduced（削減した）、launched（立ち上げた）、designed（設計した）、implemented（実装した）、optimized（最適化した）などの強い動詞で始めましょう。その後に結果を付け加えます。数字、割合、金額、期間は実績を具体的で印象的なものにします。</p>
      </section>

      <section id="ats">
        <h2>ATS 対策</h2>
        <p>多くの企業は、人間が確認する前に応募者追跡システム（ATS）で履歴書をフィルタリングします。ATS の選考を通過するには：</p>
        <ul>
          <li>標準的なセクション見出し（Experience、Education、Skills）を使い、凝った代替表現は避ける。</li>
          <li>職務経歴の箇条書きに、求人票のキーワードを自然に取り入れる。</li>
          <li>表、段組み、テキストボックス、ヘッダー/フッター、画像を避ける。</li>
          <li>標準フォント（Arial、Calibri、Helvetica）を 10〜12pt で使う。</li>
          <li>特に指示がない限り PDF で保存する。</li>
        </ul>
      </section>

      <section id="mistakes">
        <h2>避けるべきよくあるミス</h2>
        <ul>
          <li><strong>写真を載せること</strong>（写真が慣例の国で応募する場合を除く。米国・英国・カナダでは不要）。</li>
          <li><strong>&quot;References available upon request.&quot; と書くこと。</strong>当たり前のことなので、スペースの無駄です。</li>
          <li><strong>これまでに就いたすべての仕事を列挙すること。</strong>直近 10〜15 年の関連経験に絞りましょう。</li>
          <li><strong>ありきたりな説明を使うこと。</strong>数字を交えた具体的な実績にしましょう。</li>
          <li><strong>誤字脱字やフォーマットの不統一。</strong>誰かに校正を頼みましょう。</li>
        </ul>
      </section>

      <section id="tools">
        <h2>無料で履歴書を作成するツール</h2>
        <p>Word テンプレートに苦労したり、有料サービスに加入する必要はありません。当サイトの<Link href="/tools/resume-builder" className="text-blue-400 hover:text-blue-300">無料の履歴書作成ツール</Link>なら、情報を入力して複数のテンプレートから選び、リアルタイムでプレビューして PDF でダウンロードできます。すべてブラウザ内で完結し、登録も不要です。</p>
        <ToolCTA name="履歴書作成ツール" href="/tools/resume-builder" description="ライブプレビュー、複数テンプレート、PDF ダウンロードでプロ仕様の履歴書を作成。登録不要・透かしなし、ブラウザ内で完結します。" />
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>요약:</strong> 좋은 이력서는 한 페이지 분량이고, 최신 경력이 맨 위에 오는 역시간순으로 작성하며, 지원하는 직무에 맞게 조정합니다. 전문 요약으로 시작하고, 성과는 숫자로 정량화하고, ATS 호환을 위해 채용 공고의 키워드를 사용하며, 서식은 깔끔하고 단순하게 유지하세요. 목표(Objective) 진술, 사진, 화려한 그래픽은 넣지 마세요. 무료 이력서 작성기를 사용하면 Word 템플릿과 씨름하지 않고도 서식을 제대로 갖출 수 있습니다.</p>
      </aside>

      <nav aria-label="목차" className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">목차</h2>
        <ol className="space-y-1.5 text-sm">
          <li><Link href="#format" className="text-blue-400 hover:text-blue-300">올바른 형식 선택하기</Link></li>
          <li><Link href="#sections" className="text-blue-400 hover:text-blue-300">이력서 필수 섹션</Link></li>
          <li><Link href="#bullets" className="text-blue-400 hover:text-blue-300">강력한 불릿 포인트 작성법</Link></li>
          <li><Link href="#ats" className="text-blue-400 hover:text-blue-300">ATS 최적화</Link></li>
          <li><Link href="#mistakes" className="text-blue-400 hover:text-blue-300">피해야 할 흔한 실수</Link></li>
          <li><Link href="#tools" className="text-blue-400 hover:text-blue-300">이력서 작성 무료 도구</Link></li>
          <li><Link href="#faq" className="text-blue-400 hover:text-blue-300">FAQ</Link></li>
        </ol>
      </nav>

      <section id="format">
        <h2>올바른 형식 선택하기</h2>
        <p>표준 이력서 형식은 세 가지가 있습니다. <strong>역시간순(Reverse-chronological)</strong>이 가장 흔하며 채용 담당자도 선호합니다. 가장 최근 직장이 맨 위에 오고 이전 경력 순으로 나열됩니다. 대부분의 구직자에게 기본 선택입니다.</p>
        <p><strong>기능 중심 이력서(Functional)</strong>는 시간순이 아니라 기술에 초점을 맞춥니다. 경력 전환이나 이력 공백이 있는 사람에게 적합하지만, 업무 경력을 흐리게 만든다는 이유로 채용 담당자들이 선호하지 않는 경우가 많습니다. <strong>복합형 이력서(Combination)</strong>는 두 방식을 결합하지만 길어지기 쉽습니다. 특별한 이유가 없다면 역시간순을 사용하세요.</p>
      </section>

      <section id="sections">
        <h2>이력서 필수 섹션</h2>
        <p>모든 이력서에는 다음 섹션이 이 순서대로 필요합니다.</p>
        <ul>
          <li><strong>헤더:</strong> 이름, 전화번호, 이메일, 도시/주(전체 주소는 불필요), 해당된다면 LinkedIn URL.</li>
          <li><strong>전문 요약:</strong> 경력 수준, 핵심 기술, 가치 제안을 2~3문장으로 요약합니다. 시대에 뒤떨어진 &quot;Objective&quot; 문구를 대체합니다.</li>
          <li><strong>경력:</strong> 직함, 회사명, 기간, 각 직무당 불릿 3~5개. 최근 경력이 먼저 옵니다.</li>
          <li><strong>학력:</strong> 학위, 학교, 졸업 연도. GPA는 3.5 이상이고 최근 3년 내 졸업한 경우에만 기재.</li>
          <li><strong>기술:</strong> 전문 기술, 도구, 자격증. 채용 공고와 맞춰 기재하세요.</li>
        </ul>
      </section>

      <section id="bullets">
        <h2>강력한 불릿 포인트 작성법</h2>
        <p><strong>대부분의 사람이 할 수 있는 가장 큰 개선은 성과를 숫자로 정량화하는 것입니다.</strong> 다음 두 불릿을 비교해 보세요.</p>
        <ul>
          <li>약한 예: &quot;소셜 미디어 계정 관리 담당&quot;</li>
          <li>강한 예: &quot;8개월 만에 Instagram 팔로워를 5K에서 45K로 늘리고 참여율을 340% 향상&quot;</li>
        </ul>
        <p>모든 불릿은 led(주도), built(구축), increased(증가), reduced(감소), launched(출시), designed(설계), implemented(구현), optimized(최적화) 같은 강력한 행동 동사로 시작하세요. 그런 다음 결과를 덧붙입니다. 숫자, 비율, 금액, 기간이 성과를 구체적이고 기억에 남게 만듭니다.</p>
      </section>

      <section id="ats">
        <h2>ATS 최적화</h2>
        <p>대부분의 회사는 사람이 검토하기 전에 지원자 추적 시스템(ATS)으로 이력서를 필터링합니다. ATS 심사를 통과하려면:</p>
        <ul>
          <li>표준 섹션 헤더(Experience, Education, Skills)를 사용하고 창의적인 대체 명칭은 피할 것.</li>
          <li>불릿 포인트에 채용 공고의 키워드를 자연스럽게 포함할 것.</li>
          <li>표, 다단, 텍스트 상자, 머리글/바닥글, 이미지는 피할 것.</li>
          <li>표준 글꼴(Arial, Calibri, Helvetica)을 10~12pt로 사용할 것.</li>
          <li>특별한 지시가 없다면 PDF로 저장할 것.</li>
        </ul>
      </section>

      <section id="mistakes">
        <h2>피해야 할 흔한 실수</h2>
        <ul>
          <li><strong>사진 포함</strong> (사진이 관례인 국가에 지원하는 경우 제외. 미국, 영국, 캐나다에서는 불필요).</li>
          <li><strong>&quot;References available upon request.&quot;라고 쓰기.</strong> 당연한 것이므로 공간 낭비일 뿐입니다.</li>
          <li><strong>해왔던 모든 일자리를 나열하기.</strong> 최근 10~15년의 관련 경력에 집중하세요.</li>
          <li><strong>일반적인 설명 사용.</strong> 숫자가 포함된 구체적인 성과로 바꾸세요.</li>
          <li><strong>오타와 일관되지 않은 서식.</strong> 다른 사람에게 교정을 받으세요.</li>
        </ul>
      </section>

      <section id="tools">
        <h2>이력서 작성 무료 도구</h2>
        <p>Word 템플릿과 씨름하거나 유료 서비스를 이용할 필요가 없습니다. 당사의 <Link href="/tools/resume-builder" className="text-blue-400 hover:text-blue-300">무료 이력서 작성기</Link>는 정보를 입력하고 여러 템플릿 중에서 선택한 뒤 실시간으로 미리보고 PDF로 다운로드할 수 있습니다. 모든 것이 브라우저에서 실행되며 가입이 필요 없습니다.</p>
        <ToolCTA name="이력서 작성기" href="/tools/resume-builder" description="라이브 미리보기, 다양한 템플릿, PDF 다운로드로 전문적인 이력서를 만드세요. 가입 없이, 워터마크 없이 브라우저에서 완전히 실행됩니다." />
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "How long should a resume be?", answer: "One page for early to mid-career professionals (0-10 years of experience). Two pages are acceptable for senior roles with extensive experience. Recruiters spend an average of 6-7 seconds on initial resume screening, so keep it concise and put your strongest qualifications first." },
      { question: "What resume format is best for ATS?", answer: "Use a simple, single-column layout with standard section headers (Experience, Education, Skills). Avoid tables, text boxes, headers/footers, and graphics. Use standard fonts like Arial or Calibri. Save as PDF unless the application specifically requests .doc format. ATS systems parse clean, text-based resumes most accurately." },
      { question: "Should I include an objective statement?", answer: "Objective statements are outdated. Instead, use a professional summary — 2-3 sentences that highlight your experience level, key skills, and what you bring to the role. A summary tells the recruiter why you're a fit. An objective just tells them what you want." },
      { question: "How far back should my work experience go?", answer: "Generally 10-15 years. Older experience is rarely relevant unless it directly relates to the role. For recent graduates, include internships, part-time jobs, and relevant projects. Focus on roles that demonstrate skills applicable to the position you're applying for." },
      { question: "Do I need a different resume for every job?", answer: "You don't need to rewrite from scratch, but you should tailor each resume. Adjust your summary, reorder bullet points to match the job description, and include keywords from the posting. This takes 15-20 minutes per application and significantly improves your response rate." },
    ],
    zh: [
      { question: "简历应该多长？", answer: "初级到中级职场人士（0-10 年经验）一页即可。经验丰富的资深岗位可以两页。招聘官初次筛选简历平均只花 6-7 秒，所以务必简洁，把最亮眼的资历放在最前面。" },
      { question: "哪种简历格式最适合 ATS？", answer: "使用简单的单栏布局和标准板块标题（Experience、Education、Skills）。避免表格、文本框、页眉/页脚和图形。使用 Arial 或 Calibri 等标准字体。除非申请系统明确要求 .doc 格式，否则保存为 PDF。ATS 对干净、纯文本的简历解析最准确。" },
      { question: "应该写求职目标陈述吗？", answer: "求职目标陈述已经过时了。改用专业概述——用 2-3 句话突出你的经验水平、核心技能和你能为岗位带来什么。概述告诉招聘官你为什么合适，目标陈述只是在告诉对方你想要什么。" },
      { question: "工作经历要回溯多久？", answer: "一般是 10-15 年。更早的经历除非与目标岗位直接相关，否则很少有用。应届毕业生可以包括实习、兼职和相关项目。重点放在能体现与所申请职位相关技能的岗位上。" },
      { question: "每个职位都需要不同的简历吗？", answer: "不需要从头重写，但应该逐份定制。调整概述、按职位描述重新排序要点、纳入招聘信息中的关键词。每份申请只需 15-20 分钟，却能显著提高回复率。" },
    ],
    ja: [
      { question: "履歴書の長さはどのくらいが適切ですか？", answer: "キャリア初期〜中期（経験 0〜10 年）なら 1 ページです。経験豊富なシニア職なら 2 ページでも構いません。採用担当者が最初のスクリーニングに割く時間は平均 6〜7 秒なので、簡潔にまとめ、最も強い実績を先頭に置きましょう。" },
      { question: "ATS に最適な履歴書フォーマットは？", answer: "標準的なセクション見出し（Experience、Education、Skills）を使ったシンプルな 1 カラムレイアウトにしましょう。表、テキストボックス、ヘッダー/フッター、グラフィックは避けます。Arial や Calibri などの標準フォントを使い、応募先が特に .doc 形式を求めない限り PDF で保存します。ATS は文字ベースの整った履歴書を最も正確に解析できます。" },
      { question: "Objective（志望動機）は書くべきですか？", answer: "Objective は時代遅れです。代わりにプロフェッショナルサマリー——経験レベル、主要スキル、その職に貢献できることを 2〜3 文で強調する文章を使いましょう。サマリーは「なぜ自分が適任か」を伝え、Objective は「自分が何を望むか」を伝えるだけです。" },
      { question: "職歴はどこまでさかのぼって書くべきですか？", answer: "一般的には 10〜15 年です。それより古い経験は、応募する職に直接関係する場合を除いてほとんど役に立ちません。新卒の場合はインターンシップやアルバイト、関連プロジェクトを含めましょう。応募先の職に活かせるスキルを示す職務に絞ってください。" },
      { question: "応募先ごとに別の履歴書が必要ですか？", answer: "ゼロから書き直す必要はありませんが、応募先に合わせて調整しましょう。サマリーを修正し、箇条書きを求人内容に合わせて並べ替え、求人票のキーワードを含めます。1 回あたり 15〜20 分で済み、応答率が大幅に向上します。" },
    ],
    ko: [
      { question: "이력서는 어느 정도 길이가 적당한가요?", answer: "주니어~미드레벨 경력자(경력 0~10년)는 한 페이지입니다. 경력이 풍부한 시니어 직군은 두 페이지도 괜찮습니다. 채용 담당자는 초기 서류 검토에 평균 6~7초를 씁니다. 간결하게 유지하고 가장 강력한 자격을 앞에 배치하세요." },
      { question: "ATS에 가장 좋은 이력서 형식은 무엇인가요?", answer: "표준 섹션 헤더(Experience, Education, Skills)를 사용한 단순한 단일 단 레이아웃을 사용하세요. 표, 텍스트 상자, 머리글/바닥글, 그래픽은 피하세요. Arial이나 Calibri 같은 표준 글꼴을 사용하세요. 지원처에서 특별히 .doc 형식을 요구하지 않는 한 PDF로 저장하세요. ATS는 깔끔하고 텍스트 기반인 이력서를 가장 정확하게 파싱합니다." },
      { question: "목표(Objective) 문구를 넣어야 하나요?", answer: "목표 문구는 시대에 뒤떨어졌습니다. 대신 전문 요약(professional summary)을 사용하세요. 경력 수준, 핵심 기술, 그리고 이 직무에 기여할 수 있는 점을 강조하는 2~3문장입니다. 요약은 채용 담당자에게 왜 적합한지 알려주지만, 목표 문구는 단지 무엇을 원하는지만 알려줍니다." },
      { question: "경력은 얼마나 과거까지 포함해야 하나요?", answer: "일반적으로 10~15년입니다. 그보다 오래된 경력은 직무와 직접 관련되지 않는 한 거의 관련이 없습니다. 최근 졸업자는 인턴십, 아르바이트, 관련 프로젝트를 포함하세요. 지원하는 직무에 적용 가능한 기술을 보여주는 경력을 중심으로 작성하세요." },
      { question: "직무마다 다른 이력서가 필요한가요?", answer: "처음부터 다시 쓸 필요는 없지만, 각 이력서를 맞춤화해야 합니다. 요약을 조정하고, 불릿 순서를 직무 설명에 맞게 바꾸고, 공고의 키워드를 포함하세요. 지원당 15~20분이 걸리며 답변율을 크게 높여줍니다." },
    ],
  },
};
