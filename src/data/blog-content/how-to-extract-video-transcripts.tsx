import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> You can pull the full text of almost any video in under a minute. Paste a YouTube, Bilibili, Vimeo, Dailymotion or TED link into <Link href="/tools/video-transcript" className="text-blue-400 underline">ToolkitLife&apos;s Video Transcript Extractor</Link> and get the transcript with timestamps — copy it as plain text or download it as SRT/VTT. YouTube and TED work anonymously; Vimeo and Dailymotion need the video to have captions; Bilibili requires your own SESSDATA cookie because Bilibili locks every subtitle behind login. The transcript is fetched on demand and never stored.</p>
      </aside>

      <section>
        <h2>Why Extract Video Transcripts?</h2>
        <p>Video is the slowest medium to search. You cannot Cmd+F a ten-minute tutorial, and scrubbing back and forth to catch one sentence wastes far more time than reading would. A transcript turns that same video into something you can skim, quote, translate, and index.</p>
        <p>Concrete situations where a transcript pays for itself immediately:</p>
        <ul>
          <li><strong>Research and note-taking.</strong> Extract a lecture, podcast, or conference talk and pull the three paragraphs you actually need instead of rewatching forty minutes.</li>
          <li><strong>Language learning.</strong> Read along with the audio, look up unknown words in context, and shadow the speaker with the exact wording in front of you.</li>
          <li><strong>Accessibility.</strong> Colleagues and classmates who are deaf or hard of hearing get the full content without waiting for someone to type it out.</li>
          <li><strong>Content repurposing.</strong> A single video becomes a blog post, a newsletter section, tweet threads, and show notes — the transcript is the raw material.</li>
          <li><strong>SEO.</strong> Search engines index text, not audio. Publishing a transcript under your video makes the whole thing discoverable.</li>
          <li><strong>AI workflows.</strong> Summarization, translation, and Q&amp;A over videos all start with clean text. A transcript is the input every LLM pipeline needs.</li>
          <li><strong>Quotability.</strong> Journalists, students, and analysts need exact wording, not paraphrase. Timestamped transcripts make every quote verifiable.</li>
        </ul>
        <p>The problem is that every platform hides subtitles differently, and some (like Bilibili) hide them behind authentication. This guide covers what works on each platform and how to get a clean transcript in one paste.</p>
      </section>

      <section>
        <h2>Meet the Video Transcript Extractor</h2>
        <p>ToolkitLife&apos;s <Link href="/tools/video-transcript" className="text-blue-400 underline">Video Transcript Extractor</Link> takes a video URL and returns the complete transcript, segmented with timestamps. It supports five platforms out of the box and detects which one you pasted automatically.</p>
        <ToolCTA
          name="Video Transcript Extractor"
          href="/tools/video-transcript"
          description="Paste a YouTube, Bilibili, Vimeo, Dailymotion or TED link and get the full transcript with timestamps. Copy as text or download as SRT/VTT."
        />
        <p>There is no account, no watermark, and no per-day quota. The subtitle data is fetched when you submit the link and returned straight to your browser — transcripts are not stored on any server.</p>
      </section>

      <section>
        <h2>Platform Support at a Glance</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">Platform</th>
                <th className="py-2 pr-4">Subtitle source</th>
                <th className="py-2 pr-4">Login needed?</th>
                <th className="py-2">Coverage</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">YouTube</td>
                <td className="py-2 pr-4">Uploader captions + auto-captions</td>
                <td className="py-2 pr-4">Usually no</td>
                <td className="py-2">Very high — most videos have at least auto-captions</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Bilibili</td>
                <td className="py-2 pr-4">AI subtitles + uploader CC</td>
                <td className="py-2 pr-4">Yes (SESSDATA)</td>
                <td className="py-2">High when logged in; anonymous requests always see zero subtitles</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">TED</td>
                <td className="py-2 pr-4">Official talk transcripts</td>
                <td className="py-2 pr-4">No</td>
                <td className="py-2">Nearly every talk has a full transcript</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Dailymotion</td>
                <td className="py-2 pr-4">Uploader captions + ASR</td>
                <td className="py-2 pr-4">No</td>
                <td className="py-2">Depends on the video</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Vimeo</td>
                <td className="py-2 pr-4">Uploader caption tracks</td>
                <td className="py-2 pr-4">No</td>
                <td className="py-2">Only when the creator added captions</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Platforms such as TikTok, Douyin, Kuaishou, X (Twitter), and the major Chinese streaming services do not expose subtitle data publicly (or require signed requests), so no free tool can extract from them reliably. When a platform returns no subtitle track at all, the honest answer is &quot;this video has no accessible captions&quot; — not an error on your side.</p>
      </section>

      <section>
        <h2>YouTube: Captions, Auto-Captions, and Bot Checks</h2>
        <p>YouTube is the easiest case. Most videos carry either uploader-written captions or machine-generated auto-captions, and the extractor reads both. It prefers human captions when they exist because they contain proper punctuation and speaker intent; otherwise it falls back to auto-captions.</p>
        <p>Two things to know about auto-captions:</p>
        <ul>
          <li>They have no punctuation and occasionally mumble through proper nouns, so give them a quick proofread before quoting.</li>
          <li>Multi-language videos return the track matching the spoken audio by default; you can pick another available track when one exists.</li>
        </ul>
        <p><strong>About bot checks:</strong> occasionally YouTube challenges bulk or automated caption requests with a verification wall. The extractor routes around the common cases by switching request channels automatically, and if YouTube insists, adding your own cookie (from a logged-in browser session) in the advanced options resolves the challenge. This affects a small fraction of videos — most links just work.</p>
      </section>

      <section>
        <h2>Bilibili: Why SESSDATA Is Required</h2>
        <p>Bilibili is the one platform that fundamentally requires login. In 2025–2026, Bilibili&apos;s player API returns an empty subtitle list for every anonymous request — including videos that visibly show AI subtitles in the web player. This is a platform policy, not a tool bug: without credentials, the subtitle data simply is not in the response.</p>
        <p>With your own SESSDATA cookie, both AI-generated subtitles and uploader-provided CC tracks come back normally. Here is how to get it:</p>
        <ol>
          <li>Log in to <strong>bilibili.com</strong> in your browser as usual.</li>
          <li>Open DevTools with <strong>F12</strong> (or right-click → Inspect) and switch to the <strong>Application</strong> tab (Chrome/Edge) or <strong>Storage</strong> tab (Firefox).</li>
          <li>In the left tree, open <strong>Cookies → https://www.bilibili.com</strong>.</li>
          <li>Find the cookie named <strong>SESSDATA</strong> and copy its <em>Value</em> — it is a long comma-containing string, typically 60–120 characters.</li>
          <li>In the Video Transcript Extractor, expand <strong>Advanced options</strong>, paste the value into the SESSDATA field, and submit your Bilibili link as usual.</li>
        </ol>
        <p>Safety notes worth repeating:</p>
        <ul>
          <li>SESSDATA is a session credential — treat it like a password. Only paste it into tools you trust.</li>
          <li>The extractor sends it solely to bilibili.com with your request; it is not logged or stored.</li>
          <li>Logging out of Bilibili invalidates the old SESSDATA and issues a new one, so re-copy it after any logout/login cycle.</li>
        </ul>
        <p>The good news: the people who most want Bilibili transcripts (heavy Bilibili users) are exactly the people already logged in, so this one extra step unlocks essentially the entire platform.</p>
      </section>

      <section>
        <h2>Vimeo, Dailymotion, and TED</h2>
        <p><strong>Vimeo</strong> only exposes caption tracks the video&apos;s creator uploaded. Professional and educational content on Vimeo usually has them; casual uploads often do not. If a Vimeo link comes back empty, the video genuinely has no caption track to extract — there is nothing to unlock.</p>
        <p><strong>Dailymotion</strong> provides both uploaded captions and automatic speech recognition for many videos, all without login. Coverage depends on the video&apos;s origin and language, but popular content is generally covered.</p>
        <p><strong>TED</strong> is the sleeper hit of transcript extraction. Nearly every TED talk ships with a full, human-edited transcript — no login, no gaps, excellent punctuation. For language learning and quote-hunting, TED links are the most reliable input the extractor accepts.</p>
      </section>

      <section>
        <h2>How to Extract a Transcript, Step by Step</h2>
        <ol>
          <li><strong>Copy the video URL</strong> from your browser&apos;s address bar or the platform&apos;s share button. Shorts, youtu.be short links, and embed URLs all work.</li>
          <li><strong>Paste it</strong> into the input box on the <Link href="/tools/video-transcript" className="text-blue-400 underline">Video Transcript Extractor</Link> page and click Extract.</li>
          <li><strong>(Bilibili only)</strong> Expand Advanced options first and paste your SESSDATA cookie value.</li>
          <li><strong>Review the result.</strong> The transcript appears as timestamped segments with the video title, channel/author, and detected language on top.</li>
          <li><strong>Copy or download.</strong> Use Copy for the full text with timestamps, or download as SRT/VTT if you need a subtitle file for a player or editor.</li>
        </ol>
        <p>The whole flow takes under a minute for a typical video; extraction itself usually completes in a couple of seconds.</p>
      </section>

      <section>
        <h2>Choosing an Output Format</h2>
        <p><strong>Plain text (copy button):</strong> best for reading, quoting, and pasting into notes or an LLM. Timestamps are kept so you can jump back to the video when a line matters.</p>
        <p><strong>SRT / VTT download:</strong> best when the transcript is destined for a video player, an editor, or a translation pass. SRT is the universal subtitle format understood by virtually every player; VTT is the web-standard equivalent used by HTML5 video. Both preserve the exact per-segment timing, so they also work as a starting point for translating subtitles into another language.</p>
        <p>A practical workflow for bilingual viewers: download SRT, machine-translate the text column, and you have instant rough subtitles in your language — far faster than transcribing from scratch.</p>
      </section>

      <section>
        <h2>Seven Practical Ways to Use Transcripts</h2>
        <ul>
          <li><strong>Meeting and lecture notes:</strong> extract, then summarize the top five decisions or takeaways.</li>
          <li><strong>Blog posts from videos:</strong> a 12-minute talk is a 1,800-word article draft after light editing.</li>
          <li><strong>Language shadowing:</strong> read each line aloud with the speaker, using the timestamps to replay tricky sentences.</li>
          <li><strong>Fact-checking quotes:</strong> verify exact wording and timestamp before publishing a citation.</li>
          <li><strong>Training data for AI:</strong> clean, timestamped text pairs are ideal input for fine-tuning or retrieval systems.</li>
          <li><strong>Podcast show notes:</strong> scan the transcript for chapter markers and key quotes instead of relistening.</li>
          <li><strong>Research on foreign-language sources:</strong> extract in the original language, then translate only the paragraphs that matter.</li>
        </ul>
      </section>

      <section>
        <h2>Privacy and Limits</h2>
        <p>ToolkitLife&apos;s tools run without accounts and store nothing you submit. For transcript extraction specifically, the subtitle fetch happens server-side (platforms block cross-origin caption requests from browsers), but the transcript is returned to your browser immediately and not persisted — no transcripts, no URLs, no cookies retained after the request completes.</p>
        <p>Current limits to keep in mind:</p>
        <ul>
          <li>Videos with <strong>no caption track at all</strong> cannot be transcribed — the tool reports exactly which platforms returned data and which did not, rather than failing silently.</li>
          <li><strong>Live streams</strong> generally lack final subtitle tracks until after the stream ends.</li>
          <li>Auto-generated captions may need a light <strong>proofread</strong> before publication.</li>
        </ul>
      </section>

      <section>
        <h2>Troubleshooting</h2>
        <p><strong>&quot;No subtitles found&quot; on Bilibili:</strong> you almost certainly skipped the SESSDATA step. Anonymous Bilibili requests always return an empty subtitle list. Get your SESSDATA (see the steps above), paste it into Advanced options, and retry — the error banner in the tool links straight to the cookie panel for exactly this case.</p>
        <p><strong>&quot;No subtitles found&quot; on Vimeo:</strong> the video has no caption track uploaded by its creator. Try another video to confirm the tool works, then accept this one has nothing to extract.</p>
        <p><strong>YouTube extraction suddenly fails:</strong> usually a temporary bot-check challenge. Retry once; if it persists, add your browser cookie in Advanced options.</p>
        <p><strong>Gibberish or missing characters:</strong> rare encoding edge cases in some subtitle tracks. Downloading SRT instead of copying usually sidesteps it; if not, the track itself is likely corrupted at the source.</p>
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR：</strong>一分钟内就能拿到几乎所有视频的完整文字稿。把 YouTube、B 站、Vimeo、Dailymotion 或 TED 的链接粘贴到 <Link href="/tools/video-transcript" className="text-blue-400 underline">ToolkitLife 视频字幕提取工具</Link>，即可获得带时间戳的分段字幕——可直接复制纯文本，也可下载 SRT/VTT 字幕文件。YouTube 和 TED 无需登录；Vimeo 和 Dailymotion 取决于视频是否带字幕轨；B 站因为把所有字幕锁在登录态之后，必须填写你自己的 SESSDATA Cookie。字幕数据按需获取、绝不存储。</p>
      </aside>

      <section>
        <h2>为什么要提取视频文字稿？</h2>
        <p>视频是最难检索的媒介。你没法在一个十分钟的教程里按 Ctrl+F，来回拖进度条找一句话，远比直接阅读费时间。而一份文字稿能让同一个视频变得可以速览、引用、翻译和检索。</p>
        <p>几个文字稿立刻能派上用场的场景：</p>
        <ul>
          <li><strong>研究与笔记。</strong>提取讲座、播客或会议演讲，直接摘出真正需要的几段，而不是回看四十分钟。</li>
          <li><strong>语言学习。</strong>对照音频阅读，在语境中查生词，跟着精确的原文做跟读训练。</li>
          <li><strong>无障碍。</strong>听障同事和同学无需等待人工整理即可获得完整内容。</li>
          <li><strong>内容二次创作。</strong>一条视频可以变成博客文章、 newsletter 段落、推文串和 show notes——文字稿就是原材料。</li>
          <li><strong>SEO。</strong>搜索引擎索引的是文本而非音频，在视频下方发布文字稿能让内容被检索到。</li>
          <li><strong>AI 工作流。</strong>摘要、翻译、视频问答都始于干净的文本，文字稿是一切 LLM 流水线的输入。</li>
          <li><strong>精确引用。</strong>记者、学生和分析师需要原话而非转述，带时间戳的文字稿让每条引用都可核实。</li>
        </ul>
        <p>问题在于每个平台藏字幕的方式都不一样，有的（比如 B 站）甚至把字幕锁在登录之后。这篇指南讲清楚每个平台上什么方法有效，以及如何一次粘贴拿到干净的文字稿。</p>
      </section>

      <section>
        <h2>认识视频字幕提取工具</h2>
        <p>ToolkitLife 的<Link href="/tools/video-transcript" className="text-blue-400 underline">视频字幕提取工具</Link>接收一个视频链接，返回按时间戳分段的完整字幕。开箱即用支持五个平台，并自动识别你粘贴的是哪一家。</p>
        <ToolCTA
          name="视频字幕提取工具"
          href="/tools/video-transcript"
          description="粘贴 YouTube、B 站、Vimeo、Dailymotion 或 TED 链接，获取带时间戳的完整字幕。支持复制纯文本或下载 SRT/VTT。"
        />
        <p>无需账号、没有水印、没有每日次数限制。字幕数据在你提交链接时实时获取并直接返回浏览器——不在任何服务器上留存。</p>
      </section>

      <section>
        <h2>各平台支持一览</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">平台</th>
                <th className="py-2 pr-4">字幕来源</th>
                <th className="py-2 pr-4">需要登录？</th>
                <th className="py-2">覆盖情况</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">YouTube</td>
                <td className="py-2 pr-4">UP 主字幕 + 自动字幕</td>
                <td className="py-2 pr-4">通常不需要</td>
                <td className="py-2">很高——大部分视频至少有自动字幕</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">B 站</td>
                <td className="py-2 pr-4">AI 字幕 + UP 主 CC 字幕</td>
                <td className="py-2 pr-4">需要（SESSDATA）</td>
                <td className="py-2">登录后覆盖面很高；匿名请求永远拿到 0 条字幕</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">TED</td>
                <td className="py-2 pr-4">官方演讲文字稿</td>
                <td className="py-2 pr-4">不需要</td>
                <td className="py-2">几乎所有演讲都有完整文字稿</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Dailymotion</td>
                <td className="py-2 pr-4">上传字幕 + 语音识别</td>
                <td className="py-2 pr-4">不需要</td>
                <td className="py-2">取决于具体视频</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Vimeo</td>
                <td className="py-2 pr-4">创作者上传的字幕轨</td>
                <td className="py-2 pr-4">不需要</td>
                <td className="py-2">仅当创作者添加了字幕</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>TikTok、抖音、快手、X（推特）以及国内主流长视频平台并不公开字幕数据（或需要签名请求），所以任何免费工具都无法稳定提取。当平台完全没有字幕轨时，诚实的答案是「这个视频没有可提取的字幕」——而不是你的操作出了问题。</p>
      </section>

      <section>
        <h2>YouTube：字幕、自动字幕与人机验证</h2>
        <p>YouTube 是最简单的情况。绝大多数视频要么带 UP 主手写字幕，要么带机器生成的自动字幕，工具两者都能读取。有人工字幕时优先使用人工字幕（标点准确、语义完整），否则回退到自动字幕。</p>
        <p>关于自动字幕有两点需要了解：</p>
        <ul>
          <li>自动字幕没有标点，专有名词偶尔出错，引用前最好快速校对一遍。</li>
          <li>多语言视频默认返回与音频语言匹配的字幕轨；如果存在其他语言的字幕轨，也可以选择。</li>
        </ul>
        <p><strong>关于人机验证：</strong>偶尔 YouTube 会对批量或自动化的字幕请求弹出验证墙。工具会自动切换请求通道绕过常见情况；如果 YouTube 仍然坚持验证，在高级选项里填入你已登录浏览器的 Cookie 即可解决。只有少部分视频会遇到——大多数链接直接就能用。</p>
      </section>

      <section>
        <h2>B 站：为什么必须填 SESSDATA</h2>
        <p>B 站是唯一在机制上强制登录的平台。2025–2026 年，B 站的播放器接口对所有匿名请求一律返回空字幕列表——即使网页播放器里明明显示着 AI 字幕。这是平台策略而非工具缺陷：没有凭证，响应里根本没有字幕数据。</p>
        <p>填入你自己的 SESSDATA Cookie 后，AI 字幕和 UP 主上传的 CC 字幕都能正常取回。获取步骤：</p>
        <ol>
          <li>在浏览器里正常登录 <strong>bilibili.com</strong>。</li>
          <li>按 <strong>F12</strong> 打开开发者工具（或右键 → 检查），切换到 <strong>Application（应用）</strong>标签（Chrome/Edge）或 <strong>存储</strong>标签（Firefox）。</li>
          <li>在左侧树中展开 <strong>Cookies → https://www.bilibili.com</strong>。</li>
          <li>找到名为 <strong>SESSDATA</strong> 的 Cookie，复制它的<strong>值</strong>——一段包含逗号的长字符串，通常 60–120 个字符。</li>
          <li>在视频字幕提取工具中展开<strong>高级选项</strong>，把值粘贴到 SESSDATA 输入框，然后照常提交 B 站链接。</li>
        </ol>
        <p>几点安全提醒：</p>
        <ul>
          <li>SESSDATA 是会话凭证——请像对待密码一样对待它，只粘贴到你信任的工具里。</li>
          <li>工具只会把它随请求发送给 bilibili.com，不做任何记录或存储。</li>
          <li>退出 B 站登录会使旧 SESSDATA 失效并颁发新值，所以每次退出/登录后需要重新复制。</li>
        </ul>
        <p>好消息是：最需要 B 站文字稿的人（B 站重度用户）恰恰本来就是登录状态，所以这多出来的一步能解锁几乎整个平台。</p>
      </section>

      <section>
        <h2>Vimeo、Dailymotion 与 TED</h2>
        <p><strong>Vimeo</strong> 只暴露视频创作者上传的字幕轨。Vimeo 上的专业和教学内容通常有字幕，随手上传的往往没有。如果 Vimeo 链接返回为空，说明这个视频确实没有可提取的字幕轨——没有什么可以解锁。</p>
        <p><strong>Dailymotion</strong> 对很多视频同时提供上传字幕和自动语音识别，全程无需登录。覆盖率取决于视频的来源和语言，热门内容基本都有。</p>
        <p><strong>TED</strong> 是字幕提取里被低估的宝藏。几乎每场 TED 演讲都自带完整的人工校对文字稿——无需登录、没有缺口、标点讲究。无论学语言还是找金句，TED 链接都是这个工具能接受的最可靠输入。</p>
      </section>

      <section>
        <h2>提取文字稿的完整步骤</h2>
        <ol>
          <li><strong>复制视频链接。</strong>从浏览器地址栏或平台分享按钮复制均可，Shorts、youtu.be 短链、嵌入链接都支持。</li>
          <li><strong>粘贴到<Link href="/tools/video-transcript" className="text-blue-400 underline">视频字幕提取工具</Link>的输入框</strong>，点击提取。</li>
          <li><strong>（仅 B 站）</strong>先展开高级选项，粘贴你的 SESSDATA 值。</li>
          <li><strong>查看结果。</strong>字幕以时间戳分段呈现，顶部显示视频标题、频道/作者和识别到的语言。</li>
          <li><strong>复制或下载。</strong>用「复制」拿到带时间戳的全文，或下载 SRT/VTT 供播放器、剪辑软件使用。</li>
        </ol>
        <p>典型视频全程不到一分钟；提取本身通常几秒完成。</p>
      </section>

      <section>
        <h2>如何选择输出格式</h2>
        <p><strong>纯文本（复制按钮）：</strong>适合阅读、引用、粘贴进笔记或大模型。保留时间戳，方便在关键句处跳回视频。</p>
        <p><strong>SRT / VTT 下载：</strong>适合把文字稿送进播放器、剪辑软件或翻译流程。SRT 是几乎所有播放器都支持的通用字幕格式；VTT 是 HTML5 视频使用的 Web 标准。两者都保留精确的分段时间，因此也可以作为把字幕翻译成其他语言的起点。</p>
        <p>双语观看的实用工作流：下载 SRT，机器翻译文本列，立刻得到母语的粗略字幕——比从零听写快得多。</p>
      </section>

      <section>
        <h2>文字稿的七种实用玩法</h2>
        <ul>
          <li><strong>会议与课程笔记：</strong>先提取，再总结五个最重要的结论或要点。</li>
          <li><strong>视频转博客：</strong>一段 12 分钟的演讲稍加编辑就是 1800 字的文章草稿。</li>
          <li><strong>语言跟读：</strong>跟着字幕逐句朗读，用时间戳回放难句。</li>
          <li><strong>引用事实核查：</strong>发布引用前核对原话与时间戳。</li>
          <li><strong>AI 训练数据：</strong>干净、带时间戳的文本对是微调或检索系统的理想输入。</li>
          <li><strong>播客 show notes：</strong>扫读文字稿找章节标记和金句，不用重听。</li>
          <li><strong>外文资料研究：</strong>先用原语言提取，再只翻译真正重要的段落。</li>
        </ul>
      </section>

      <section>
        <h2>隐私与限制</h2>
        <p>ToolkitLife 的工具无需账号，不存储你提交的任何内容。就字幕提取而言，字幕抓取发生在服务端（各平台禁止浏览器跨域请求字幕），但文字稿会立即返回你的浏览器且不做持久化——请求结束后不保留任何文字稿、链接或 Cookie。</p>
        <p>当前需要留意的限制：</p>
        <ul>
          <li><strong>完全没有字幕轨</strong>的视频无法提取——工具会明确报告哪些平台返回了数据、哪些没有，而不是静默失败。</li>
          <li><strong>直播</strong>在结束之前通常没有最终字幕轨。</li>
          <li>自动生成的字幕在正式发布前可能需要简单<strong>校对</strong>。</li>
        </ul>
      </section>

      <section>
        <h2>常见问题排查</h2>
        <p><strong>B 站提示「未找到字幕」：</strong>几乎可以肯定是没有填 SESSDATA。匿名请求永远返回空字幕列表。按上面的步骤拿到 SESSDATA，粘贴到高级选项后重试——工具的报错提示会直接展开 Cookie 面板，就是为这种情况设计的。</p>
        <p><strong>Vimeo 提示「未找到字幕」：</strong>该视频的创作者没有上传字幕轨。换个视频确认工具正常后，接受这一条确实无字可提。</p>
        <p><strong>YouTube 突然提取失败：</strong>通常是临时的人机验证。重试一次；若仍然失败，在高级选项里填入浏览器 Cookie。</p>
        <p><strong>乱码或缺字：</strong>个别字幕轨存在少见的编码边缘情况。改用下载 SRT 而不是直接复制通常可以绕过；若仍有问题，多半是源字幕轨本身损坏。</p>
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="概要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> ほぼすべての動画の全文を1分以内に取得できます。YouTube、Bilibili、Vimeo、Dailymotion、TED のリンクを <Link href="/tools/video-transcript" className="text-blue-400 underline">ToolkitLife の動画文字起こしツール</Link>に貼り付けるだけで、タイムスタンプ付きの字幕を取得できます。プレーンテキストとしてコピーするか、SRT/VTT としてダウンロード可能。YouTube と TED はログイン不要。Vimeo と Dailymotion は動画に字幕トラックがある場合のみ。Bilibili はすべての字幕がログイン限定のため、自分の SESSDATA Cookie が必要です。字幕はオンデマンドで取得され、保存されません。</p>
      </aside>

      <section>
        <h2>なぜ動画の文字起こしを抽出するのか</h2>
        <p>動画は検索性が最も低いメディアです。10分のチュートリアル内を Cmd+F で検索することはできず、一言を探すために再生位置を行ったり来たりするのは、読むのに比べてはるかに時間がかかります。文字起こしがあれば、同じ動画を流し読み・引用・翻訳・インデックス可能なコンテンツに変えられます。</p>
        <p>文字起こしがすぐに役立つ具体例：</p>
        <ul>
          <li><strong>リサーチとメモ。</strong>講義やポッドキャスト、カンファレンストークを抽出し、本当に必要な数段落だけを取り出す。</li>
          <li><strong>語学学習。</strong>音声に合わせて読み、文脈の中で未知の単語を調べ、正確な原文でシャドーイングする。</li>
          <li><strong>アクセシビリティ。</strong>聴覚に障害のある同僚や同級生が、誰かが文字起こしするのを待たずに全内容を得られる。</li>
          <li><strong>コンテンツの再利用。</strong>1本の動画がブログ記事、ニュースレター、スレッド投稿、ショーノートの素材になる。</li>
          <li><strong>SEO。</strong>検索エンジンは音声ではなくテキストをインデックスする。動画の下に文字起こしを公開すれば全体が発見可能になる。</li>
          <li><strong>AI ワークフロー。</strong>要約・翻訳・動画Q&amp;Aはすべてクリーンなテキストから始まる。文字起こしはあらゆる LLM パイプラインの入力。</li>
          <li><strong>引用の正確性。</strong>ジャーナリストや学生、アナリストには言い換えではなく正確な言葉が必要。タイムスタンプ付き文字起こしはすべての引用を検証可能にする。</li>
        </ul>
        <p>問題は、プラットフォームごとに字幕の隠し方が違うこと、そして一部（Bilibili など）は字幕を認証の後ろに隠していることです。このガイドでは、各プラットフォームで有効な方法と、1回の貼り付けでクリーンな文字起こしを得る方法を解説します。</p>
      </section>

      <section>
        <h2>動画文字起こしツールの紹介</h2>
        <p>ToolkitLife の <Link href="/tools/video-transcript" className="text-blue-400 underline">動画文字起こしツール</Link>は動画 URL を受け取り、タイムスタンプ付きセグメントに分割された完全な字幕を返します。5つのプラットフォームに標準対応し、貼り付けられた URL を自動判定します。</p>
        <ToolCTA
          name="動画文字起こしツール"
          href="/tools/video-transcript"
          description="YouTube、Bilibili、Vimeo、Dailymotion、TED のリンクを貼り付けて、タイムスタンプ付きの全字幕を取得。テキストコピーにも SRT/VTT ダウンロードにも対応。"
        />
        <p>アカウント登録も透かしも回数制限もありません。字幕データはリンク送信時に取得され、ブラウザへ直接返されます。文字起こしがサーバーに保存されることはありません。</p>
      </section>

      <section>
        <h2>プラットフォーム対応一覧</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">プラットフォーム</th>
                <th className="py-2 pr-4">字幕ソース</th>
                <th className="py-2 pr-4">ログイン要否</th>
                <th className="py-2">カバレッジ</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">YouTube</td>
                <td className="py-2 pr-4">アップローダー字幕 + 自動字幕</td>
                <td className="py-2 pr-4">通常不要</td>
                <td className="py-2">非常に高い——多くの動画に自動字幕あり</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Bilibili</td>
                <td className="py-2 pr-4">AI 字幕 + CC 字幕</td>
                <td className="py-2 pr-4">必要（SESSDATA）</td>
                <td className="py-2">ログインすれば高い。匿名リクエストは常に 0 件</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">TED</td>
                <td className="py-2 pr-4">公式トーク文字起こし</td>
                <td className="py-2 pr-4">不要</td>
                <td className="py-2">ほぼすべてのトークに完全な文字起こしあり</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Dailymotion</td>
                <td className="py-2 pr-4">アップロード字幕 + ASR</td>
                <td className="py-2 pr-4">不要</td>
                <td className="py-2">動画による</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Vimeo</td>
                <td className="py-2 pr-4">制作者の字幕トラック</td>
                <td className="py-2 pr-4">不要</td>
                <td className="py-2">制作者が字幕を追加した場合のみ</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>TikTok、Douyin、Kuaishou、X（Twitter）、主要な中国動画サービスは字幕データを公開していない（または署名付きリクエストが必要）ため、無料ツールでは安定して抽出できません。字幕トラックが一切ない場合は「この動画にはアクセス可能な字幕がない」が正直な答えです。</p>
      </section>

      <section>
        <h2>YouTube：字幕・自動字幕・ボット判定</h2>
        <p>YouTube が最も簡単です。ほとんどの動画には投稿者の手書き字幕か機械生成の自動字幕があり、両方に対応しています。人間の字幕があればそちらを優先（句読点が正確）し、なければ自動字幕にフォールバックします。</p>
        <ul>
          <li>自動字幕には句読点がなく、固有名詞が崩れることがあるため、引用前に軽く校正を。</li>
          <li>多言語動画では音声言語のトラックが既定で返ります。他言語トラックがあれば選択可能。</li>
        </ul>
        <p><strong>ボット判定について：</strong>大量・自動化された字幕リクエストに YouTube が検証壁を出すことがあります。ツールは一般的なケースを自動的に別のリクエストチャネルへ切り替えて回避し、それでも要求される場合は高度なオプションでログイン済みブラウザの Cookie を追加すれば解決します。該当するのはごく一部の動画です。</p>
      </section>

      <section>
        <h2>Bilibili：SESSDATA が必要な理由</h2>
        <p>Bilibili は唯一、仕組み上ログインが必須のプラットフォームです。2025〜2026年、Bilibili のプレイヤー API は匿名リクエストに対して常に空の字幕リストを返します——ウェブプレイヤーに AI 字幕が表示されていてもです。これはプラットフォームのポリシーであり、ツールの不具合ではありません。認証情報がなければレスポンスに字幕データ自体が含まれません。</p>
        <p>自分の SESSDATA Cookie があれば、AI 生成字幕も投稿者の CC 字幕も正常に取得できます。取得手順：</p>
        <ol>
          <li>ブラウザで <strong>bilibili.com</strong> に普段どおりログインします。</li>
          <li><strong>F12</strong> で DevTools を開き（右クリック→検証でも可）、<strong>Application</strong> タブ（Chrome/Edge）または<strong>ストレージ</strong>タブ（Firefox）へ切り替えます。</li>
          <li>左のツリーで <strong>Cookies → https://www.bilibili.com</strong> を開きます。</li>
          <li><strong>SESSDATA</strong> という名前の Cookie を見つけ、<em>値</em>をコピーします。カンマを含む 60〜120 文字程度の長い文字列です。</li>
          <li>動画文字起こしツールで<strong>高度なオプション</strong>を開き、SESSDATA 欄に貼り付けて、いつもどおり Bilibili のリンクを送信します。</li>
        </ol>
        <p>安全上の注意：</p>
        <ul>
          <li>SESSDATA はセッション資格情報です。パスワードと同じように扱い、信頼できるツールにのみ貼り付けてください。</li>
          <li>ツールはリクエストとともに bilibili.com へ送るだけで、記録も保存もしません。</li>
          <li>Bilibili からログアウトすると古い SESSDATA は無効化され新しいものが発行されるため、ログアウト/ログインのたびに再コピーが必要です。</li>
        </ul>
        <p>幸い、Bilibili の文字起こしを最も必要としている人（ヘビーユーザー）は元々ログイン済みなので、この一手間でプラットフォーム全体が解放されます。</p>
      </section>

      <section>
        <h2>Vimeo・Dailymotion・TED</h2>
        <p><strong>Vimeo</strong> は動画の制作者がアップロードした字幕トラックのみ公開します。専門的・教育的コンテンツにはあることが多く、カジュアルな投稿には少ないです。空の結果が返ってきたら、その動画には本当に字幕トラックがありません。</p>
        <p><strong>Dailymotion</strong> は多くの動画でアップロード字幕と自動音声認識の両方を、ログイン不要で提供しています。カバレッジは動画の出身や言語によりますが、人気コンテンツは概ねカバーされています。</p>
        <p><strong>TED</strong> は文字起こし抽出の隠れた逸品です。ほぼすべての TED トークに人手で編集された完全な文字起こしが付属しており、ログイン不要・欠落なし・句読点も正確です。語学学習にも引用探しにも、TED リンクはこのツールが受け付ける最も信頼性の高い入力です。</p>
      </section>

      <section>
        <h2>文字起こし抽出の手順</h2>
        <ol>
          <li><strong>動画 URL をコピー。</strong>アドレスバーでも共有ボタンでもOK。Shorts、youtu.be 短縮リンク、埋め込み URL にも対応。</li>
          <li><strong><Link href="/tools/video-transcript" className="text-blue-400 underline">動画文字起こしツール</Link>の入力欄に貼り付けて</strong>抽出をクリック。</li>
          <li><strong>（Bilibili のみ）</strong>先に高度なオプションを開いて SESSDATA を貼り付け。</li>
          <li><strong>結果を確認。</strong>字幕はタイムスタンプ付きセグメントで表示され、上部に動画タイトル・チャンネル/作者・検出言語が表示されます。</li>
          <li><strong>コピーまたはダウンロード。</strong>「コピー」でタイムスタンプ付き全文を、SRT/VTT はプレイヤーや編集ソフト向けに。</li>
        </ol>
        <p>典型的な動画なら全体で1分以内。抽出自体は通常数秒で完了します。</p>
      </section>

      <section>
        <h2>出力形式の選び方</h2>
        <p><strong>プレーンテキスト（コピーボタン）：</strong>読む・引用する・ノートや LLM に貼り付けるのに最適。重要な行のときに動画へ戻れるようタイムスタンプは保持されます。</p>
        <p><strong>SRT / VTT ダウンロード：</strong>文字起こしをプレイヤー・編集ソフト・翻訳へ回すのに最適。SRT はほぼ全プレイヤーが対応する汎用字幕形式、VTT は HTML5 動画の Web 標準です。どちらもセグメント単位の正確なタイミングを保持するため、字幕を別言語へ翻訳する起点としても使えます。</p>
        <p>バイリンガル視聴の実用ワークフロー：SRT をダウンロード→テキスト列を機械翻訳→即席の母語字幕が完成。ゼロから起こすよりはるかに速い。</p>
      </section>

      <section>
        <h2>文字起こしの7つの活用法</h2>
        <ul>
          <li><strong>会議・講義のメモ：</strong>抽出して、上位5つの決定事項や要点を要約。</li>
          <li><strong>動画からブログ記事：</strong>12分のトークは軽く編集するだけで1,800語の記事の下書きに。</li>
          <li><strong>シャドーイング：</strong>字幕を読み上げながら発話者に合わせ、タイムスタンプで難しい文をリプレイ。</li>
          <li><strong>引用のファクトチェック：</strong>公開前に正確な言葉とタイムスタンプを検証。</li>
          <li><strong>AI の学習データ：</strong>クリーンでタイムスタンプ付きのテキストペアはファインチューニングや検索システムに最適。</li>
          <li><strong>ポッドキャストのショーノート：</strong>聞き直せずとも文字起こしを走査して章マーカーやキークォートを発見。</li>
          <li><strong>外国語ソースのリサーチ：</strong>元の言語で抽出し、重要な段落だけ翻訳。</li>
        </ul>
      </section>

      <section>
        <h2>プライバシーと制限</h2>
        <p>ToolkitLife のツールはアカウント不要で、送信された内容を保存しません。字幕抽出では、字幕の取得はサーバー側で行われます（プラットフォームがブラウザからのクロスオリジン字幕リクエストをブロックするため）が、文字起こしは即座にブラウザへ返され、永続化されません。文字起こし・URL・Cookie はリクエスト完了後に保持しません。</p>
        <ul>
          <li><strong>字幕トラックが一切ない動画</strong>は文字起こしできません。ツールは黙って失敗するのではなく、どのプラットフォームがデータを返したかを明示します。</li>
          <li><strong>ライブ配信</strong>は配信終了まで最終字幕トラックがないのが一般的です。</li>
          <li>自動生成字幕は公開前に軽い<strong>校正</strong>が必要な場合があります。</li>
        </ul>
      </section>

      <section>
        <h2>トラブルシューティング</h2>
        <p><strong>Bilibili で「字幕が見つかりません」：</strong>ほぼ確実に SESSDATA 未入力です。匿名リクエストは常に空の字幕リストを返します。上記の手順で SESSDATA を取得し、高度なオプションに貼り付けて再試行してください。ツールのエラー表示はこのケースのために Cookie パネルを自動で開きます。</p>
        <p><strong>Vimeo で「字幕が見つかりません」：</strong>その動画に制作者の字幕トラックがありません。別の動画でツールの動作を確認した上で、この動画には抽出対象がないと受け止めてください。</p>
        <p><strong>YouTube の抽出が突然失敗：</strong>多くは一時的なボット判定です。一度再試行し、続く場合は高度なオプションでブラウザの Cookie を追加してください。</p>
        <p><strong>文字化けや欠字：</strong>一部の字幕トラックに稀なエンコーディング問題があります。コピーではなく SRT ダウンロードで回避できることが多く、それでも駄目ならソース側の字幕トラック自体が壊れている可能性が高いです。</p>
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> 거의 모든 영상의 전체 텍스트를 1분 안에 가져올 수 있습니다. YouTube, Bilibili, Vimeo, Dailymotion, TED 링크를 <Link href="/tools/video-transcript" className="text-blue-400 underline">ToolkitLife 동영상 자막 추출기</Link>에 붙여넣으면 타임스탬프가 포함된 자막을 받을 수 있습니다 — 텍스트로 복사하거나 SRT/VTT로 다운로드하세요. YouTube와 TED는 로그인이 필요 없고, Vimeo와 Dailymotion은 영상에 자막 트랙이 있어야 하며, Bilibili는 모든 자막을 로그인 뒤에 잠가두므로 본인의 SESSDATA 쿠키가 필요합니다. 자막은 요청 시 가져오며 절대 저장되지 않습니다.</p>
      </aside>

      <section>
        <h2>영상 자막(스크립트)을 추출하는 이유</h2>
        <p>영상은 검색하기 가장 느린 매체입니다. 10분짜리 튜토리얼 안에서 Cmd+F를 할 수 없고, 한 문장을 찾으려고 재생 위치를 앞뒤로 옮기는 일은 읽는 것보다 훨씬 시간이 낭비됩니다. 스크립트가 있으면 같은 영상을 훑어보고, 인용하고, 번역하고, 색인할 수 있는 콘텐츠로 바꿀 수 있습니다.</p>
        <p>스크립트가 즉시 힘을 발휘하는 상황들:</p>
        <ul>
          <li><strong>리서치와 노트.</strong> 강연, 팟캐스트, 컨퍼런스 발표를 추출해 실제로 필요한 몇 단락만 뽑아냅니다.</li>
          <li><strong>언어 학습.</strong> 오디오를 따라 읽고, 문맥 속에서 모르는 단어를 찾고, 정확한 원문으로 쉐도잉합니다.</li>
          <li><strong>접근성.</strong> 청각장애가 있는 동료와 친구가 누군가 타이핑해 주기를 기다리지 않고 전체 내용을 얻습니다.</li>
          <li><strong>콘텐츠 재활용.</strong> 영상 하나가 블로그 글, 뉴스레터, 스레드, 쇼 노트의 원료가 됩니다.</li>
          <li><strong>SEO.</strong> 검색 엔진은 오디오가 아니라 텍스트를 색인합니다. 영상 아래 스크립트를 함께 공개하면 전체가 검색 가능해집니다.</li>
          <li><strong>AI 워크플로.</strong> 요약, 번역, 영상 Q&amp;A는 모두 깨끗한 텍스트에서 시작됩니다. 스크립트는 모든 LLM 파이프라인의 입력입니다.</li>
          <li><strong>정확한 인용.</strong> 기자, 학생, 애널리스트에는 요약이 아니라 정확한 표현이 필요합니다. 타임스탬프가 있는 스크립트는 모든 인용을 검증 가능하게 합니다.</li>
        </ul>
        <p>문제는 플랫폼마다 자막을 숨기는 방식이 다르고, 일부(예: Bilibili)는 자막을 인증 뒤에 숨긴다는 점입니다. 이 가이드는 플랫폼별로 무엇이 통하는지, 그리고 붙여넣기 한 번으로 깨끗한 스크립트를 얻는 방법을 다룹니다.</p>
      </section>

      <section>
        <h2>동영상 자막 추출기 소개</h2>
        <p>ToolkitLife의 <Link href="/tools/video-transcript" className="text-blue-400 underline">동영상 자막 추출기</Link>는 영상 URL을 받아 타임스탬프로 구간화된 전체 자막을 반환합니다. 다섯 플랫폼을 기본 지원하며 붙여넣은 링크가 어느 플랫폼인지 자동으로 판별합니다.</p>
        <ToolCTA
          name="동영상 자막 추출기"
          href="/tools/video-transcript"
          description="YouTube, Bilibili, Vimeo, Dailymotion, TED 링크를 붙여넣고 타임스탬프가 있는 전체 자막을 받으세요. 텍스트 복사와 SRT/VTT 다운로드를 모두 지원합니다."
        />
        <p>계정도, 워터마크도, 일일 제한도 없습니다. 자막 데이터는 링크를 제출할 때 가져와 브라우저로 바로 반환되며 어느 서버에도 저장되지 않습니다.</p>
      </section>

      <section>
        <h2>플랫폼 지원 한눈에 보기</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-2 pr-4">플랫폼</th>
                <th className="py-2 pr-4">자막 출처</th>
                <th className="py-2 pr-4">로그인 필요</th>
                <th className="py-2">커버리지</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">YouTube</td>
                <td className="py-2 pr-4">업로더 자막 + 자동 자막</td>
                <td className="py-2 pr-4">보통 불필요</td>
                <td className="py-2">매우 높음 — 대부분 자동 자막이라도 있음</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Bilibili</td>
                <td className="py-2 pr-4">AI 자막 + CC 자막</td>
                <td className="py-2 pr-4">필요 (SESSDATA)</td>
                <td className="py-2">로그인 시 높음. 익명 요청은 항상 0개</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">TED</td>
                <td className="py-2 pr-4">공식 강연 스크립트</td>
                <td className="py-2 pr-4">불필요</td>
                <td className="py-2">거의 모든 강연에 완전한 스크립트 존재</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-2 pr-4">Dailymotion</td>
                <td className="py-2 pr-4">업로드 자막 + ASR</td>
                <td className="py-2 pr-4">불필요</td>
                <td className="py-2">영상에 따라 다름</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Vimeo</td>
                <td className="py-2 pr-4">크리에이터 자막 트랙</td>
                <td className="py-2 pr-4">불필요</td>
                <td className="py-2">크리에이터가 자막을 올렸을 때만</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>TikTok, 도우인, 콰이쇼우, X(트위터), 중국 주요 장편 영상 서비스는 자막 데이터를 공개하지 않거나(또는 서명된 요청이 필요) 무료 도구로는 안정적으로 추출할 수 없습니다. 자막 트랙이 전혀 없으면 정직한 답은 &quot;이 영상에는 접근 가능한 자막이 없다&quot;는 것입니다.</p>
      </section>

      <section>
        <h2>YouTube: 자막, 자동 자막, 봇 판정</h2>
        <p>YouTube가 가장 쉬운 경우입니다. 대부분의 영상에는 업로더가 작성한 자막이나 기계 생성 자동 자막이 있고, 추출기는 둘 다 읽습니다. 사람이 쓴 자막이 있으면(구두점이 정확하므로) 우선 사용하고, 없으면 자동 자막으로 대체합니다.</p>
        <ul>
          <li>자동 자막에는 구두점이 없고 고유명사가 종종 흐릿하니 인용 전에 가볍게 교정하세요.</li>
          <li>다국어 영상은 기본으로 음성 언어에 맞는 트랙을 반환하며, 다른 언어 트랙이 있으면 선택할 수 있습니다.</li>
        </ul>
        <p><strong>봇 판정 관련:</strong> 대량 또는 자동화된 자막 요청에 YouTube가 가끔 인증 장벽을 내세웁니다. 추출기는 일반적인 경우를 자동으로 다른 요청 채널로 전환해 우회하고, 그래도 요구하면 고급 옵션에서 로그인된 브라우저의 쿠키를 추가하면 해결됩니다. 대부분의 링크는 그냥 동작합니다.</p>
      </section>

      <section>
        <h2>Bilibili: SESSDATA가 필요한 이유</h2>
        <p>Bilibili는 구조적으로 로그인이 필수인 유일한 플랫폼입니다. 2025~2026년 기준 Bilibili의 플레이어 API는 익명 요청에 대해 — 웹 플레이어에 AI 자막이 보이는 영상이라도 — 항상 빈 자막 목록을 반환합니다. 이는 플랫폼 정책이지 도구 버그가 아닙니다. 자격 증명이 없으면 응답 자체에 자막 데이터가 없습니다.</p>
        <p>본인의 SESSDATA 쿠키가 있으면 AI 생성 자막과 업로더의 CC 자막 모두 정상적으로 돌아옵니다. 얻는 방법:</p>
        <ol>
          <li>브라우저에서 평소처럼 <strong>bilibili.com</strong>에 로그인합니다.</li>
          <li><strong>F12</strong>로 DevTools를 열고(또는 우클릭 → 검사) <strong>Application</strong> 탭(Chrome/Edge) 또는 <strong>저장소</strong> 탭(Firefox)으로 이동합니다.</li>
          <li>왼쪽 트리에서 <strong>Cookies → https://www.bilibili.com</strong>을 엽니다.</li>
          <li><strong>SESSDATA</strong>라는 이름의 쿠키를 찾아 <em>값</em>을 복사합니다. 쉼표가 포함된 60~120자 정도의 긴 문자열입니다.</li>
          <li>동영상 자막 추출기에서 <strong>고급 옵션</strong>을 펼치고 SESSDATA 입력란에 붙여넣은 뒤 평소처럼 Bilibili 링크를 제출합니다.</li>
        </ol>
        <p>안전 참고 사항:</p>
        <ul>
          <li>SESSDATA는 세션 자격 증명입니다. 비밀번호처럼 다루고 신뢰하는 도구에만 붙여넣으세요.</li>
          <li>추출기는 요청과 함께 bilibili.com으로만 보내며 기록하거나 저장하지 않습니다.</li>
          <li>Bilibili에서 로그아웃하면 이전 SESSDATA가 무효화되고 새 값이 발급되므로, 로그아웃/로그인 사이클마다 다시 복사해야 합니다.</li>
        </ul>
        <p>다행인 점: Bilibili 스크립트를 가장 필요로 하는 사람들(중심 사용자)은 이미 로그인 상태이므로, 이 한 단계로 사실상 플랫폼 전체가 열립니다.</p>
      </section>

      <section>
        <h2>Vimeo, Dailymotion, TED</h2>
        <p><strong>Vimeo</strong>는 영상 크리에이터가 업로드한 자막 트랙만 노출합니다. 전문적·교육적 콘텐츠에는 있는 경우가 많고 가벼운 업로드에는 없는 경우가 많습니다. 결과가 비어 있으면 그 영상에는 실제로 추출할 자막 트랙이 없는 것입니다.</p>
        <p><strong>Dailymotion</strong>은 많은 영상에 대해 업로드 자막과 자동 음성 인식을 모두 로그인 없이 제공합니다. 커버리지는 영상의 출처와 언어에 따라 다르지만 인기 콘텐츠는 대체로 포함됩니다.</p>
        <p><strong>TED</strong>는 자막 추출의 숨은 보석입니다. 거의 모든 TED 강연에는 사람이 편집한 완전한 스크립트가 함께 제공됩니다 — 로그인 불필요, 빈틈 없음, 구두점도 훌륭합니다. 언어 학습이든 인용 수집이든, TED 링크는 이 추출기가 받는 가장 신뢰할 수 있는 입력입니다.</p>
      </section>

      <section>
        <h2>스크립트 추출 단계별 방법</h2>
        <ol>
          <li><strong>영상 URL을 복사합니다.</strong> 주소 표시줄이나 공유 버튼 어디든 되며, Shorts, youtu.be 단축 링크, 임베드 URL도 지원됩니다.</li>
          <li><strong><Link href="/tools/video-transcript" className="text-blue-400 underline">동영상 자막 추출기</Link> 입력란에 붙여넣고</strong> 추출을 클릭합니다.</li>
          <li><strong>(Bilibili만)</strong> 먼저 고급 옵션을 펼쳐 SESSDATA 값을 붙여넣습니다.</li>
          <li><strong>결과를 확인합니다.</strong> 자막은 타임스탬프 구간으로 표시되며 상단에 영상 제목, 채널/작성자, 감지된 언어가 함께 표시됩니다.</li>
          <li><strong>복사 또는 다운로드.</strong> 복사로 타임스탬프가 있는 전문을, 플레이어나 편집기가 필요하면 SRT/VTT로 받으세요.</li>
        </ol>
        <p>일반적인 영상 기준 전 과정이 1분 미만이고, 추출 자체는 보통 몇 초 만에 끝납니다.</p>
      </section>

      <section>
        <h2>출력 형식 선택하기</h2>
        <p><strong>일반 텍스트(복사 버튼):</strong> 읽기, 인용, 노트나 LLM에 붙여넣기에 최적입니다. 중요한 문장에서 영상으로 되돌아갈 수 있도록 타임스탬프가 유지됩니다.</p>
        <p><strong>SRT / VTT 다운로드:</strong> 스크립트를 플레이어, 편집기, 번역 작업으로 보낼 때 최적입니다. SRT는 사실상 모든 플레이어가 이해하는 범용 자막 형식이고, VTT는 HTML5 비디오의 웹 표준입니다. 둘 다 구간별 정확한 타이밍을 보존하므로 자막을 다른 언어로 번역하는 출발점으로도 쓸 수 있습니다.</p>
        <p>이중 언어 시청의 실용적인 워크플로: SRT를 받고 텍스트 열을 기계 번역하면 모국어 초안 자막이 즉시 완성 — 처음부터 받아적는 것보다 훨씬 빠릅니다.</p>
      </section>

      <section>
        <h2>스크립트 활용 7가지</h2>
        <ul>
          <li><strong>회의·강의 노트:</strong> 추출한 뒤 핵심 결정이나 요점 다섯 가지를 요약합니다.</li>
          <li><strong>영상을 블로그로:</strong> 12분짜리 강연은 가벼운 편집만으로 1,800자 글 초고가 됩니다.</li>
          <li><strong>언어 쉐도잉:</strong> 자막을 따라 소리 내어 읽고, 타임스탬프로 어려운 문장을 다시 재생합니다.</li>
          <li><strong>인용 팩트체크:</strong> 게시 전에 정확한 표현과 타임스탬프를 검증합니다.</li>
          <li><strong>AI 학습 데이터:</strong> 깨끗하고 타임스탬프가 있는 텍스트 쌍은 파인튜닝이나 검색 시스템에 이상적인 입력입니다.</li>
          <li><strong>팟캐스트 쇼 노트:</strong> 다시 듣지 않고도 스크립트를 훑어 챕터 표시와 핵심 인용을 찾습니다.</li>
          <li><strong>외국어 자료 리서치:</strong> 원어로 추출한 뒤 중요한 단락만 번역합니다.</li>
        </ul>
      </section>

      <section>
        <h2>개인정보와 한계</h2>
        <p>ToolkitLife의 도구는 계정 없이 동작하며 제출된 내용을 저장하지 않습니다. 자막 추출의 경우 자막 가져오기는 서버 측에서 발생하지만(플랫폼들이 브라우저의 교차 출처 자막 요청을 차단하므로), 스크립트는 즉시 브라우저로 반환되고 저장되지 않습니다 — 요청이 끝나면 스크립트, URL, 쿠키 모두 보관하지 않습니다.</p>
        <ul>
          <li><strong>자막 트랙이 전혀 없는 영상</strong>은 추출할 수 없습니다. 도구는 조용히 실패하는 대신 어느 플랫폼이 데이터를 반환했는지 명확히 알려줍니다.</li>
          <li><strong>라이브 스트림</strong>은 종료 전까지 최종 자막 트랙이 없는 것이 일반적입니다.</li>
          <li>자동 생성 자막은 게시 전에 가벼운 <strong>교정</strong>이 필요할 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2>문제 해결</h2>
        <p><strong>Bilibili에서 &quot;자막을 찾을 수 없음&quot;:</strong> 거의 확실히 SESSDATA를 입력하지 않은 경우입니다. 익명 요청은 항상 빈 자막 목록을 반환합니다. 위 단계대로 SESSDATA를 받아 고급 옵션에 붙여넣고 다시 시도하세요. 도구의 오류 배너는 바로 이 경우를 위해 쿠키 패널을 자동으로 펼칩니다.</p>
        <p><strong>Vimeo에서 &quot;자막을 찾을 수 없음&quot;:</strong> 해당 영상에 크리에이터가 올린 자막 트랙이 없는 것입니다. 다른 영상으로 도구가 정상 동작함을 확인한 뒤, 이 영상은 추출할 것이 없다고 받아들이면 됩니다.</p>
        <p><strong>YouTube 추출이 갑자기 실패:</strong> 대부분 일시적인 봇 판정입니다. 한 번 재시도하고, 계속되면 고급 옵션에서 브라우저 쿠키를 추가하세요.</p>
        <p><strong>깨진 글자나 누락된 문자:</strong> 일부 자막 트랙의 드문 인코딩 문제입니다. 복사 대신 SRT 다운로드로 보통 우회할 수 있고, 그래도 안 되면 소스 자막 트랙 자체가 손상되었을 가능성이 높습니다.</p>
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "Is it safe to paste my Bilibili SESSDATA cookie into the extractor?", answer: "The extractor sends SESSDATA only to bilibili.com as part of your own subtitle request; it is never logged or stored. That said, SESSDATA is a session credential, so treat it like a password — only use it in tools you trust, and log out and back in if you ever want to invalidate it." },
      { question: "Why does Bilibili always return zero subtitles without SESSDATA?", answer: "Since 2025, Bilibili's player API returns an empty subtitle list to every anonymous request, even for videos that visibly show AI subtitles in the web player. The subtitle data simply isn't in the response without login, so any tool needs your own SESSDATA cookie to read it." },
      { question: "Why can't I extract transcripts from TikTok, Douyin, or Twitter videos?", answer: "Those platforms don't expose subtitle data publicly and gate their detail APIs behind signed requests, so there is no caption track for any tool to read. Many of them don't produce subtitles at all. ToolkitLife supports the five platforms that do expose captions: YouTube, Bilibili, Vimeo, Dailymotion, and TED." },
      { question: "What's the difference between copying the text and downloading SRT/VTT?", answer: "Copying gives you the transcript as readable text with timestamps — ideal for notes, quotes, and LLM workflows. SRT/VTT downloads preserve exact per-segment timing in standard subtitle formats, which is what you want for video players, editors, or as a starting point for translating subtitles into another language." },
    ],
    zh: [
      { question: "把 B 站 SESSDATA Cookie 填进提取工具安全吗？", answer: "工具只会把 SESSDATA 随你的字幕请求发送给 bilibili.com，不做任何记录或存储。不过 SESSDATA 毕竟是会话凭证，请像对待密码一样对待它——只在信任的工具里使用，需要作废时退出再重新登录即可。" },
      { question: "为什么 B 站不填 SESSDATA 就永远提取不到字幕？", answer: "2025 年起，B 站播放器接口对所有匿名请求一律返回空字幕列表——即使网页播放器里明明显示着 AI 字幕。没有登录态时响应里根本没有字幕数据，所以任何工具都需要你自己的 SESSDATA Cookie 才能读取。" },
      { question: "为什么不能提取 TikTok、抖音或推特视频的字幕？", answer: "这些平台不公开字幕数据，详情接口也需要签名请求，任何工具都拿不到字幕轨；而且其中很多平台根本不生成字幕。ToolkitLife 支持的是真正公开字幕的五个平台：YouTube、B 站、Vimeo、Dailymotion 和 TED。" },
      { question: "复制文本和下载 SRT/VTT 有什么区别？", answer: "复制得到的是带时间戳的可读全文——适合笔记、引用和大模型工作流。SRT/VTT 下载则保留精确到分段的时序，是标准字幕格式，适合送进播放器、剪辑软件，或作为把字幕翻译成其他语言的起点。" },
    ],
    ja: [
      { question: "Bilibili の SESSDATA Cookie をツールに入力しても安全ですか？", answer: "ツールは SESSDATA をあなたの字幕リクエストの一部として bilibili.com に送るだけで、記録も保存もしません。ただし SESSDATA はセッション資格情報なので、パスワードと同じように扱ってください。信頼できるツールでのみ使い、無効化したいときは一度ログアウトして再度ログインすれば新しい値が発行されます。" },
      { question: "Bilibili は SESSDATA なしでは常に字幕がゼロになるのですか？", answer: "2025年以降、Bilibili のプレイヤー API は匿名リクエストに対して常に空の字幕リストを返します。ウェブプレイヤーに AI 字幕が表示されている動画でも同様です。ログイン状態でなければレスポンスに字幕データ自体が含まれないため、どのツールでも自分の SESSDATA Cookie が必要です。" },
      { question: "TikTok や Douyin、Twitter の動画からはなぜ抽出できないのですか？", answer: "これらのプラットフォームは字幕データを公開しておらず、詳細 API は署名付きリクエストの裏にあるため、どのツールも字幕トラックを読めません。そもそも字幕を生成しないプラットフォームも多くあります。ToolkitLife は実際に字幕を公開している5つのプラットフォーム（YouTube、Bilibili、Vimeo、Dailymotion、TED）に対応しています。" },
      { question: "テキストのコピーと SRT/VTT ダウンロードの違いは何ですか？", answer: "コピーはタイムスタンプ付きの読めるテキストを得る方法で、ノート・引用・LLM ワークフローに最適です。SRT/VTT はセグメント単位の正確なタイミングを標準字幕形式で保持するため、プレイヤーや編集ソフト、そして字幕を別の言語へ翻訳する起点として使えます。" },
    ],
    ko: [
      { question: "Bilibili SESSDATA 쿠키를 추출기에 붙여넣어도 안전한가요?", answer: "추출기는 SESSDATA를 자막 요청의 일부로 bilibili.com에만 보내며 기록하거나 저장하지 않습니다. 다만 SESSDATA는 세션 자격 증명이므로 비밀번호처럼 다루세요. 신뢰하는 도구에서만 사용하고, 무효화하고 싶으면 로그아웃 후 다시 로그인하면 됩니다." },
      { question: "Bilibili는 SESSDATA 없이는 항상 자막이 0개인가요?", answer: "2025년부터 Bilibili의 플레이어 API는 익명 요청에 대해 항상 빈 자막 목록을 반환합니다. 웹 플레이어에 AI 자막이 보이는 영상이라도 마찬가지입니다. 로그인 상태가 아니면 응답에 자막 데이터 자체가 없으므로, 어떤 도구든 본인의 SESSDATA 쿠키가 필요합니다." },
      { question: "TikTok, 도우인, 트위터 영상은 왜 추출할 수 없나요?", answer: "해당 플랫폼들은 자막 데이터를 공개하지 않고 상세 API도 서명된 요청 뒤에 있어 어떤 도구도 자막 트랙을 읽을 수 없습니다. 애초에 자막을 생성하지 않는 플랫폼도 많습니다. ToolkitLife는 실제로 자막을 공개하는 다섯 플랫폼(YouTube, Bilibili, Vimeo, Dailymotion, TED)을 지원합니다." },
      { question: "텍스트 복사와 SRT/VTT 다운로드의 차이는 무엇인가요?", answer: "복사는 타임스탬프가 있는 읽기 좋은 전문을 얻는 방식으로 노트, 인용, LLM 워크플로에 이상적입니다. SRT/VTT는 구간별 정확한 타이밍을 표준 자막 형식으로 보존하므로 플레이어, 편집기, 그리고 자막을 다른 언어로 번역하는 출발점으로 적합합니다." },
    ],
  },
};
