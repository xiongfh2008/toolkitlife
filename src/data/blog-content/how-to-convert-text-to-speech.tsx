import type { ReactNode } from "react";
import Link from "next/link";
import { ToolCTA } from "@/components/BlogLayout";
import type { BlogContent } from "./index";

export const content: BlogContent = {
  en: (
    <>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> Text to speech converts written text into spoken audio using your browser&apos;s built-in speech engine. It&apos;s free, works offline, supports multiple languages, and is useful for proofreading, accessibility, language learning, and multitasking. Adjust speed and pitch to match your preference.</p>
      </aside>

      <section>
        <h2>Who Uses Text to Speech</h2>
        <p><strong>People with visual impairments or reading disabilities</strong> rely on TTS to access written content. It&apos;s a core accessibility feature.</p>
        <p><strong>Writers and editors</strong> use TTS to proofread. Hearing your text read aloud catches errors your eyes skip over — awkward phrasing, missing words, and rhythm issues.</p>
        <p><strong>Language learners</strong> use it to hear correct pronunciation in their target language.</p>
        <p><strong>Multitaskers</strong> convert articles and emails to speech so they can listen while doing other things.</p>
      </section>

      <section>
        <h2>How Browser TTS Works</h2>
        <p>Modern browsers include the <strong>Web Speech API</strong>, which provides text-to-speech without any server. Your text stays on your device and is processed by your operating system&apos;s speech engine.</p>
        <p>The voices available depend on your OS. macOS includes high-quality voices like Samantha and Alex. Windows has Microsoft voices. ChromeOS and Android have Google voices. You can install additional voices in your system settings.</p>
      </section>

      <section>
        <h2>Getting Better Voice Quality</h2>
        <ul>
          <li><strong>Install premium voices:</strong> On macOS, go to System Settings &gt; Accessibility &gt; Spoken Content and download enhanced voices. On Windows, go to Settings &gt; Time &amp; Language &gt; Speech.</li>
          <li><strong>Use Chrome:</strong> Chrome includes Google&apos;s online voices which tend to sound more natural than default system voices.</li>
          <li><strong>Adjust speed:</strong> Slightly slower speeds (0.8-0.9x) often sound more natural. Faster speeds (1.2-1.5x) are good for skimming content.</li>
          <li><strong>Match the language:</strong> Select a voice that matches the language of your text for correct pronunciation.</li>
        </ul>
      </section>

      <section>
        <h2>Convert Text to Speech for Free</h2>
        <p>Our <Link href="/tools/text-to-speech" className="text-blue-400 hover:text-blue-300">free Text to Speech tool</Link> reads any text aloud using your browser&apos;s built-in voices. Multiple languages, adjustable speed and pitch, pause and resume. No signup, no server processing, 100% private.</p>
        <ToolCTA name="Text to Speech" href="/tools/text-to-speech" description="Convert text to natural speech in your browser. Multiple languages and voices, adjustable speed and pitch. Free and private." />
      </section>
    </>
  ),

  zh: (
    <>
      <aside aria-label="摘要" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>太长不看：</strong>文字转语音（TTS）利用浏览器内置的语音引擎把书面文字朗读出来。它免费、可离线使用、支持多种语言，适合校对、无障碍访问、语言学习和多任务处理。你可以按喜好调节语速和音调。</p>
      </aside>

      <section>
        <h2>谁在使用文字转语音</h2>
        <p><strong>有视力障碍或阅读障碍的人</strong>依赖 TTS 来获取书面内容。这是一项核心无障碍功能。</p>
        <p><strong>作家和编辑</strong>用 TTS 来校对。听朗读能抓住眼睛扫过的错误——拗口的措辞、漏字和节奏问题。</p>
        <p><strong>语言学习者</strong>用它来听目标语言的正确发音。</p>
        <p><strong>多任务处理者</strong>把文章和邮件转成语音，在做其他事情时收听。</p>
      </section>

      <section>
        <h2>浏览器 TTS 的工作原理</h2>
        <p>现代浏览器内置 <strong>Web Speech API</strong>，无需任何服务器就能提供文字转语音功能。你的文字停留在设备上，由操作系统自带的语音引擎处理。</p>
        <p>可用的声音取决于你的操作系统。macOS 自带 Samantha 和 Alex 等高质量声音。Windows 有 Microsoft 的声音。ChromeOS 和 Android 有 Google 的声音。你还可以在系统设置里安装更多声音。</p>
      </section>

      <section>
        <h2>获得更好的声音质量</h2>
        <ul>
          <li><strong>安装高级声音：</strong>macOS 上前往"系统设置 &gt; 辅助功能 &gt; 朗读内容"下载增强声音。Windows 上前往"设置 &gt; 时间和语言 &gt; 语音"。</li>
          <li><strong>使用 Chrome：</strong>Chrome 包含 Google 的在线语音，通常比系统默认语音更自然。</li>
          <li><strong>调整语速：</strong>稍慢的语速（0.8-0.9 倍）往往更自然。较快的语速（1.2-1.5 倍）适合快速浏览内容。</li>
          <li><strong>匹配语言：</strong>选择与文本语言匹配的声音，确保发音正确。</li>
        </ul>
      </section>

      <section>
        <h2>免费把文字转成语音</h2>
        <p>我们的<Link href="/tools/text-to-speech" className="text-blue-400 hover:text-blue-300">免费文字转语音工具</Link>使用浏览器内置的声音朗读任意文字。支持多种语言、可调语速和音调、支持暂停和继续。无需注册、无服务器处理、100% 私密。</p>
        <ToolCTA name="文字转语音" href="/tools/text-to-speech" description="在浏览器中把文字转成自然的语音。多种语言和声音，可调语速和音调。免费且私密。" />
      </section>
    </>
  ),

  ja: (
    <>
      <aside aria-label="要約" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>要約：</strong>テキスト読み上げ（TTS）は、ブラウザ標準の音声エンジンを使って書かれたテキストを音声に変換します。無料でオフラインでも動作し、複数の言語に対応。校正、アクセシビリティ、語学学習、ながら作業に便利です。速度とピッチは好みに合わせて調整できます。</p>
      </aside>

      <section>
        <h2>テキスト読み上げを利用する人</h2>
        <p><strong>視覚障害や読字障害のある人</strong>は、書かれたコンテンツにアクセスする手段として TTS に依存しています。これは不可欠なアクセシビリティ機能です。</p>
        <p><strong>ライターや編集者</strong>は校正に TTS を使います。音読を聞くと、目では見落としがちな誤り——不自然な言い回し、抜けている単語、リズムの問題——に気づけます。</p>
        <p><strong>語学学習者</strong>は、目標言語の正しい発音を聞くために使います。</p>
        <p><strong>ながら作業をする人</strong>は、記事やメールを音声に変換して、別のことをしながら聴きます。</p>
      </section>

      <section>
        <h2>ブラウザ TTS の仕組み</h2>
        <p>最新のブラウザには <strong>Web Speech API</strong> が組み込まれており、サーバーなしでテキスト読み上げができます。テキストは端末に留まったまま、OS の音声エンジンで処理されます。</p>
        <p>利用できる音声は OS によって異なります。macOS には Samantha や Alex などの高品質な音声が含まれ、Windows には Microsoft の音声があります。ChromeOS と Android には Google の音声があります。システム設定から追加の音声をインストールすることもできます。</p>
      </section>

      <section>
        <h2>音質を良くする方法</h2>
        <ul>
          <li><strong>プレミアム音声をインストールする：</strong>macOS では「システム設定 &gt; アクセシビリティ &gt; 読み上げコンテンツ」から拡張音声をダウンロードできます。Windows では「設定 &gt; 時刻と言語 &gt; 音声」です。</li>
          <li><strong>Chrome を使う：</strong>Chrome には Google のオンライン音声が含まれており、システムのデフォルト音声より自然に聞こえる傾向があります。</li>
          <li><strong>速度を調整する：</strong>やや遅め（0.8〜0.9 倍）のほうが自然に聞こえることが多いです。速め（1.2〜1.5 倍）は内容を流し読みするのに向いています。</li>
          <li><strong>言語を合わせる：</strong>テキストの言語に合った音声を選ぶと、発音が正確になります。</li>
        </ul>
      </section>

      <section>
        <h2>テキストを無料で音声に変換する</h2>
        <p>当サイトの<Link href="/tools/text-to-speech" className="text-blue-400 hover:text-blue-300">無料テキスト読み上げツール</Link>は、ブラウザ内蔵の音声で任意のテキストを読み上げます。複数言語対応、速度とピッチの調整、一時停止・再開が可能。登録不要、サーバー処理なし、100% プライベートです。</p>
        <ToolCTA name="テキスト読み上げ" href="/tools/text-to-speech" description="ブラウザでテキストを自然な音声に変換。複数の言語と音声、速度・ピッチ調整に対応。無料でプライベート。" />
      </section>
    </>
  ),

  ko: (
    <>
      <aside aria-label="요약" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>요약:</strong> 텍스트 음성 변환(TTS)은 브라우저에 내장된 음성 엔진을 사용해 작성된 텍스트를 음성으로 바꿔줍니다. 무료이고 오프라인에서도 작동하며 여러 언어를 지원합니다. 교정, 접근성, 언어 학습, 멀티태스킹에 유용합니다. 속도와 음높이는 취향에 맞게 조절하세요.</p>
      </aside>

      <section>
        <h2>텍스트 음성 변환을 사용하는 사람들</h2>
        <p><strong>시각 장애나 난독증이 있는 사람</strong>은 TTS에 의존해 글 콘텐츠에 접근합니다. 핵심적인 접근성 기능입니다.</p>
        <p><strong>작가와 편집자</strong>는 교정을 위해 TTS를 사용합니다. 글이 소리 내어 읽히면 눈이 놓치기 쉬운 오류(어색한 표현, 누락된 단어, 리듬 문제)를 잡아낼 수 있습니다.</p>
        <p><strong>언어 학습자</strong>는 목표 언어의 정확한 발음을 듣기 위해 사용합니다.</p>
        <p><strong>멀티태스커</strong>는 기사와 이메일을 음성으로 변환해 다른 일을 하면서 들을 수 있습니다.</p>
      </section>

      <section>
        <h2>브라우저 TTS 작동 방식</h2>
        <p>최신 브라우저에는 <strong>Web Speech API</strong>가 내장되어 있어 서버 없이도 텍스트 음성 변환을 제공합니다. 텍스트는 기기에 남아 운영 체제의 음성 엔진으로 처리됩니다.</p>
        <p>사용 가능한 음성은 OS에 따라 다릅니다. macOS에는 Samantha와 Alex 같은 고품질 음성이 있고, Windows에는 Microsoft 음성이 있습니다. ChromeOS와 Android에는 Google 음성이 있습니다. 시스템 설정에서 추가 음성을 설치할 수 있습니다.</p>
      </section>

      <section>
        <h2>더 나은 음질 얻기</h2>
        <ul>
          <li><strong>프리미엄 음성 설치:</strong> macOS에서는 시스템 설정 &gt; 손쉬운 사용 &gt; 음성 콘텐츠에서 향상된 음성을 다운로드하세요. Windows에서는 설정 &gt; 시간 및 언어 &gt; 음성입니다.</li>
          <li><strong>Chrome 사용:</strong> Chrome에는 Google의 온라인 음성이 포함되어 있어 기본 시스템 음성보다 더 자연스럽게 들리는 경우가 많습니다.</li>
          <li><strong>속도 조절:</strong> 약간 느린 속도(0.8~0.9배)가 더 자연스럽게 들리는 경우가 많습니다. 빠른 속도(1.2~1.5배)는 내용 훑어보기에 좋습니다.</li>
          <li><strong>언어 맞추기:</strong> 텍스트의 언어와 일치하는 음성을 선택하면 발음이 정확해집니다.</li>
        </ul>
      </section>

      <section>
        <h2>텍스트를 음성으로 무료 변환하기</h2>
        <p>당사의 <Link href="/tools/text-to-speech" className="text-blue-400 hover:text-blue-300">무료 텍스트 음성 변환 도구</Link>는 브라우저 내장 음성으로 모든 텍스트를 소리 내어 읽어줍니다. 여러 언어, 속도와 음높이 조절, 일시정지 및 재개 지원. 가입 없이, 서버 처리 없이 100% 비공개로 작동합니다.</p>
        <ToolCTA name="텍스트 음성 변환" href="/tools/text-to-speech" description="브라우저에서 텍스트를 자연스러운 음성으로 변환하세요. 여러 언어와 음성, 속도·음높이 조절을 지원합니다. 무료이고 비공개입니다." />
      </section>
    </>
  ),

  faqs: {
    en: [
      { question: "Is text to speech free?", answer: "Yes. Modern browsers include the Web Speech API which provides text-to-speech for free with no limits. The voices are built into your operating system. No server processing, no signup required." },
      { question: "What languages are supported?", answer: "Most browsers support 20+ languages including English, Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Italian, and more. The exact voices depend on your OS." },
      { question: "Can I download the audio?", answer: "The Web Speech API is designed for real-time listening, not file export. For downloadable audio files, you need a server-side TTS service. Browser-based TTS is best for proofreading, accessibility, and learning." },
      { question: "Why do some voices sound robotic?", answer: "Browsers include both basic and premium voices. Premium voices (like Apple's Siri voices or Google's WaveNet voices) sound more natural but may need to be downloaded first in your OS settings." },
    ],
    zh: [
      { question: "文字转语音免费吗？", answer: "免费。现代浏览器内置 Web Speech API，提供无限制的免费文字转语音功能。声音内置在你的操作系统中，无需服务器处理，也无需注册。" },
      { question: "支持哪些语言？", answer: "大多数浏览器支持 20 多种语言，包括英语、西班牙语、法语、德语、中文、日语、韩语、葡萄牙语、意大利语等。具体可用的声音取决于你的操作系统。" },
      { question: "可以下载音频吗？", answer: "Web Speech API 是为实时收听设计的，不支持导出文件。要获得可下载的音频文件，需要服务端 TTS 服务。浏览器 TTS 最适合校对、无障碍访问和学习用途。" },
      { question: "为什么有些声音听起来很机械？", answer: "浏览器既包含基础声音也包含高级声音。高级声音（如 Apple 的 Siri 声音或 Google 的 WaveNet 声音）更自然，但可能需要先在系统设置中下载。" },
    ],
    ja: [
      { question: "テキスト読み上げは無料ですか？", answer: "はい。最新のブラウザには Web Speech API が組み込まれており、制限なしで無料のテキスト読み上げを利用できます。音声は OS に内蔵されており、サーバー処理も登録も不要です。" },
      { question: "対応言語は？", answer: "ほとんどのブラウザは英語、スペイン語、フランス語、ドイツ語、中国語、日本語、韓国語、ポルトガル語、イタリア語など 20 以上の言語に対応しています。実際に使える音声は OS によって異なります。" },
      { question: "音声をダウンロードできますか？", answer: "Web Speech API はリアルタイム再生向けに設計されており、ファイル書き出しには対応していません。ダウンロード可能な音声ファイルが必要な場合は、サーバーサイドの TTS サービスが必要です。ブラウザ型 TTS は校正、アクセシビリティ、学習に最適です。" },
      { question: "一部の音声が機械的に聞こえるのはなぜですか？", answer: "ブラウザには基本音声とプレミアム音声の両方が含まれています。プレミアム音声（Apple の Siri 音声や Google の WaveNet 音声など）はより自然ですが、OS 設定で先にダウンロードする必要がある場合があります。" },
    ],
    ko: [
      { question: "텍스트 음성 변환은 무료인가요?", answer: "네. 최신 브라우저에는 제한 없이 무료로 텍스트 음성 변환을 제공하는 Web Speech API가 내장되어 있습니다. 음성은 운영 체제에 내장되어 있으며, 서버 처리나 가입이 필요 없습니다." },
      { question: "어떤 언어를 지원하나요?", answer: "대부분의 브라우저는 영어, 스페인어, 프랑스어, 독일어, 중국어, 일본어, 한국어, 포르투갈어, 이탈리아어 등 20개 이상의 언어를 지원합니다. 실제 사용 가능한 음성은 OS에 따라 다릅니다." },
      { question: "오디오를 다운로드할 수 있나요?", answer: "Web Speech API는 실시간 청취를 위해 설계되었으며 파일 내보내기는 지원하지 않습니다. 다운로드 가능한 오디오 파일이 필요하다면 서버 측 TTS 서비스가 필요합니다. 브라우저 기반 TTS는 교정, 접근성, 학습에 가장 적합합니다." },
      { question: "어떤 음성은 왜 로봇처럼 들리나요?", answer: "브라우저에는 기본 음성과 프리미엄 음성이 모두 포함되어 있습니다. 프리미엄 음성(Apple의 Siri 음성이나 Google의 WaveNet 음성 등)은 더 자연스럽지만 OS 설정에서 먼저 다운로드해야 할 수 있습니다." },
    ],
  },
};
