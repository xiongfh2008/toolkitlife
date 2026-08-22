import fs from "fs";
import path from "path";

/**
 * Add the 4 new low-cost tools (morse-code, reverse-text, px-to-rem,
 * password-strength) to every locale message file:
 *   - home.tools.<slug>   → homepage directory card
 *   - tools.<slug>        → tool detail bundle (metadata/keywords/faqs/...)
 *
 * Idempotent: skips a slug per locale when it already exists.
 */
const LOCALES = ["en", "zh", "ja", "ko", "ru"];

// home.tools card per locale
const HOME = {
  "morse-code": {
    en: { name: "Morse Code Translator", description: "Translate text to Morse code and back instantly", category: "Text", icon: "📡" },
    zh: { name: "摩尔斯电码翻译器", description: "将文本与摩尔斯电码即时互转", category: "Text", icon: "📡" },
    ja: { name: "モールス信号翻訳ツール", description: "テキストとモールス信号を即時相互変換", category: "Text", icon: "📡" },
    ko: { name: "모스 부호 번역기", description: "텍스트와 모스 부호를 즉시 상호 변환", category: "Text", icon: "📡" },
    ru: { name: "Переводчик азбуки Морзе", description: "Перевод текста в азбуку Морзе и обратно мгновенно", category: "Text", icon: "📡" },
  },
  "reverse-text": {
    en: { name: "Reverse Text Generator", description: "Reverse characters, words or lines instantly", category: "Text", icon: "↔" },
    zh: { name: "文本反转生成器", description: "即时反转字符、单词或行序", category: "Text", icon: "↔" },
    ja: { name: "テキスト反転ツール", description: "文字・単語・行を即座に反転", category: "Text", icon: "↔" },
    ko: { name: "텍스트 뒤집기 도구", description: "문자·단어·줄을 즉시 뒤집기", category: "Text", icon: "↔" },
    ru: { name: "Разворот текста", description: "Разверните символы, слова или строки мгновенно", category: "Text", icon: "↔" },
  },
  "px-to-rem": {
    en: { name: "PX to REM Converter", description: "Convert pixels to rem and back with a custom base font size", category: "Developer", icon: "Rem" },
    zh: { name: "PX 转 REM 换算器", description: "像素与 rem 互转，支持自定义基准字号", category: "Developer", icon: "Rem" },
    ja: { name: "PX⇔REM 変換ツール", description: "px と rem を相互変換、基準サイズもカスタム可", category: "Developer", icon: "Rem" },
    ko: { name: "PX↔REM 변환기", description: "px와 rem 상호 변환, 기준 글꼴 크기 커스텀", category: "Developer", icon: "Rem" },
    ru: { name: "Конвертер PX в REM", description: "Перевод пикселей в rem и обратно с настраиваемой базой", category: "Developer", icon: "Rem" },
  },
  "password-strength": {
    en: { name: "Password Strength Checker", description: "Test password strength with an instant score and tips", category: "Utility", icon: "🔒" },
    zh: { name: "密码强度检测器", description: "即时检测密码强度并给出评分与建议", category: "Utility", icon: "🔒" },
    ja: { name: "パスワード強度チェッカー", description: "パスワードの強度を即時スコアで判定", category: "Utility", icon: "🔒" },
    ko: { name: "비밀번호 강도 검사기", description: "비밀번호 강도를 즉시 점수로 평가", category: "Utility", icon: "🔒" },
    ru: { name: "Проверка надёжности пароля", description: "Мгновенная оценка надёжности пароля", category: "Utility", icon: "🔒" },
  },
};

// Full tool detail bundle per locale
const TOOL = {
  "morse-code": {
    en: {
      metadata: { title: "Morse Code Translator", description: "Translate text to Morse code and Morse code back to text instantly. Free, private and runs entirely in your browser.", category: "Text" },
      keywords: ["morse code translator", "morse code converter", "text to morse code", "morse code to text", "morse encoder", "morse decoder", "sos morse code", "morse code alphabet"],
      faqs: [
        { question: "What is Morse code?", answer: "Morse code is a method of encoding text as sequences of dots (.) and dashes (-). Each letter and digit has a unique pattern, and words are separated by a slash (/)." },
        { question: "How do I convert text to Morse code?", answer: "Type or paste your text in the input box. The Morse output updates instantly — letters are separated by spaces and words by slashes." },
        { question: "How do I convert Morse code back to text?", answer: "Switch to the \u201CDecode\u201D mode and paste the Morse code using dots, dashes and spaces (words separated by \u201C/\u201D). The decoded text appears instantly." },
        { question: "What is the SOS signal?", answer: "SOS is one of the best-known Morse signals: ... --- ... (three dots, three dashes, three dots). It is used as a distress signal." },
        { question: "Is this tool free?", answer: "Yes, completely free. All conversion happens in your browser — nothing is uploaded." },
      ],
      relatedTools: [
        { name: "Text Case Converter", href: "/tools/text-case-converter" },
        { name: "Reverse Text Generator", href: "/tools/reverse-text" },
        { name: "Word Counter", href: "/tools/word-counter" },
      ],
      labels: {
        textToEncode: "Text to encode",
        morseToDecode: "Morse code to decode",
        output: "Output",
        enterText: "Type or paste text",
        enterMorse: "Enter Morse code (dots, dashes, spaces)",
        invalidMorse: "Invalid Morse code — use only dots, dashes, spaces and slashes.",
        hint: "Letters are separated by spaces, words by \u201C/\u201D. Unsupported characters are skipped.",
      },
      buttons: { encode: "Encode", decode: "Decode" },
      guide: {
        intro: {
          title: "What is a Morse Code Translator?",
          paragraphs: ["A Morse code translator is a free online tool that converts text into Morse code and decodes Morse code back into readable text. It works entirely in your browser, so your messages stay private."],
        },
        sections: [
          { title: "How to use", items: ["Open the tool in your browser", "Type or paste your text, or switch to Decode mode and paste Morse code", "Copy the result with one click"] },
          { title: "Key features", items: ["Completely free, no signup required", "Instant conversion in both directions", "Runs locally in your browser for privacy", "Supports letters A\u2013Z and digits 0\u20139"] },
        ],
      },
    },
    zh: {
      metadata: { title: "摩尔斯电码翻译器", description: "将文本与摩尔斯电码互转，即时、免费、在浏览器本地运行。", category: "Text" },
      keywords: ["摩尔斯电码翻译", "摩尔斯电码转换", "文本转摩尔斯", "摩尔斯转文本", "摩斯密码", "摩斯电码翻译器", "SOS摩斯电码", "电报码"],
      faqs: [
        { question: "什么是摩尔斯电码？", answer: "摩尔斯电码是一种用点（.）和划（-）的序列来编码文本的方法。每个字母和数字都有唯一的编码，单词之间用斜杠（/）分隔。" },
        { question: "如何把文本转成摩尔斯电码？", answer: "在输入框中输入或粘贴文字，摩尔斯电码会即时生成——字母间以空格分隔，单词间以斜杠分隔。" },
        { question: "如何把摩尔斯电码转回文本？", answer: "切换到“解码”模式，粘贴由点、划和空格组成的摩尔斯电码（单词间用“/”分隔）即可，解码结果即时显示。" },
        { question: "什么是 SOS 信号？", answer: "SOS 是最著名的摩尔斯信号之一：... --- ...（三点、三划、三点），通常用作遇险求救信号。" },
        { question: "这个工具免费吗？", answer: "完全免费。所有转换都在浏览器本地完成，内容不会被上传。" },
      ],
      relatedTools: [
        { name: "文本大小写转换器", href: "/tools/text-case-converter" },
        { name: "文本反转生成器", href: "/tools/reverse-text" },
        { name: "单词计数器", href: "/tools/word-counter" },
      ],
      labels: {
        textToEncode: "要编码的文本",
        morseToDecode: "要解码的摩尔斯电码",
        output: "输出结果",
        enterText: "输入或粘贴文字",
        enterMorse: "输入摩尔斯电码（点、划、空格）",
        invalidMorse: "摩尔斯电码无效——只能使用点、划、空格和斜杠。",
        hint: "字母之间用空格分隔，单词之间用“/”分隔。不支持的字符将被忽略。",
      },
      buttons: { encode: "编码", decode: "解码" },
      guide: {
        intro: {
          title: "什么是摩尔斯电码翻译器？",
          paragraphs: ["摩尔斯电码翻译器是一款免费在线工具，可以将文本转换为摩尔斯电码，也可以将摩尔斯电码解码为可读文本。全部在浏览器本地运行，内容安全私密。"],
        },
        sections: [
          { title: "使用方法", items: ["打开浏览器中的工具", "输入或粘贴文字；或切换到解码模式粘贴摩尔斯电码", "一键复制结果"] },
          { title: "主要特点", items: ["完全免费，无需注册", "双向即时转换", "本地运行保护隐私", "支持字母 A–Z 和数字 0–9"] },
        ],
      },
    },
    ja: {
      metadata: { title: "モールス信号翻訳ツール", description: "テキストとモールス信号を相互変換。即時・無料・ブラウザ内で完結。", category: "Text" },
      keywords: ["モールス信号変換", "モールス符号変換", "テキストをモールスに", "モールスをテキストに", "モールス翻訳", "モールス符号", "SOSモールス", "電信符号"],
      faqs: [
        { question: "モールス信号とは？", answer: "モールス信号は、点（.）と線（-）の組み合わせで文字を表現する符号化方式です。各文字と数字に固有のパターンがあり、単語はスラッシュ（/）で区切ります。" },
        { question: "テキストをモールス信号に変換するには？", answer: "入力欄にテキストを入力・貼り付けます。モールス信号が即座に表示され、文字はスペース、単語はスラッシュで区切られます。" },
        { question: "モールス信号をテキストに戻すには？", answer: "「デコード」モードに切り替えて、点・線・スペースで書かれたモールス信号（単語は「/」区切り）を貼り付けます。即座にテキストに変換されます。" },
        { question: "SOS信号とは？", answer: "SOSは最も有名なモールス信号の一つで、... --- ...（点3・線3・点3）と表します。遭難信号として使われます。" },
        { question: "このツールは無料ですか？", answer: "はい、完全無料です。すべてブラウザ内で処理されるため、データが外部に送信されることはありません。" },
      ],
      relatedTools: [
        { name: "テキスト大文字小文字変換", href: "/tools/text-case-converter" },
        { name: "テキスト反転ツール", href: "/tools/reverse-text" },
        { name: "ワードカウンター", href: "/tools/word-counter" },
      ],
      labels: {
        textToEncode: "エンコードするテキスト",
        morseToDecode: "デコードするモールス信号",
        output: "出力",
        enterText: "テキストを入力または貼り付け",
        enterMorse: "モールス信号を入力（点・線・スペース）",
        invalidMorse: "モールス信号が無効です。点・線・スペース・スラッシュのみ使用できます。",
        hint: "文字はスペース、単語は「/」で区切ります。対応しない文字はスキップされます。",
      },
      buttons: { encode: "エンコード", decode: "デコード" },
      guide: {
        intro: {
          title: "モールス信号翻訳ツールとは？",
          paragraphs: ["モールス信号翻訳ツールは、テキストをモールス信号に変換し、モールス信号を読みやすいテキストに戻す無料のオンラインツールです。すべてブラウザ内で動作するため、データが外部に送信されることはありません。"],
        },
        sections: [
          { title: "使い方", items: ["ブラウザでツールを開く", "テキストを入力するか、デコードモードに切り替えてモールス信号を貼り付ける", "ワンクリックで結果をコピー"] },
          { title: "主な特徴", items: ["完全無料・登録不要", "双方向の即時変換", "プライバシー保護のためブラウザ内で処理", "英字 A–Z と数字 0–9 に対応"] },
        ],
      },
    },
    ko: {
      metadata: { title: "모스 부호 번역기", description: "텍스트와 모스 부호를 즉시 상호 변환합니다. 무료, 브라우저에서 완전히 처리됩니다.", category: "Text" },
      keywords: ["모스 부호 번역", "모스 부호 변환", "텍스트를 모스 부호로", "모스 부호를 텍스트로", "모스 인코더", "모스 디코더", "SOS 모스 부호", "전신 부호"],
      faqs: [
        { question: "모스 부호란 무엇인가요?", answer: "모스 부호는 점(.)과 선(-)의 조합으로 문자를 표현하는 부호화 방식입니다. 각 문자와 숫자에는 고유한 패턴이 있으며, 단어는 슬래시(/)로 구분합니다." },
        { question: "텍스트를 모스 부호로 어떻게 변환하나요?", answer: "입력란에 텍스트를 입력하거나 붙여넣으세요. 문자는 공백, 단어는 슬래시로 구분된 모스 부호가 즉시 표시됩니다." },
        { question: "모스 부호를 텍스트로 어떻게 되돌리나요?", answer: "“디코드” 모드로 전환한 뒤 점·선·공백으로 된 모스 부호(단어는 “/”로 구분)를 붙여넣으면 즉시 텍스트로 변환됩니다." },
        { question: "SOS 신호란 무엇인가요?", answer: "SOS는 가장 잘 알려진 모스 신호 중 하나로 ... --- ...(점 3·선 3·점 3)으로 표기하며 조난 신호로 사용됩니다." },
        { question: "이 도구는 무료인가요?", answer: "네, 완전 무료입니다. 모든 처리는 브라우저에서 이루어지므로 데이터가 업로드되지 않습니다." },
      ],
      relatedTools: [
        { name: "텍스트 대소문자 변환기", href: "/tools/text-case-converter" },
        { name: "텍스트 뒤집기 도구", href: "/tools/reverse-text" },
        { name: "단어 수 세기", href: "/tools/word-counter" },
      ],
      labels: {
        textToEncode: "인코딩할 텍스트",
        morseToDecode: "디코딩할 모스 부호",
        output: "결과",
        enterText: "텍스트 입력 또는 붙여넣기",
        enterMorse: "모스 부호 입력(점·선·공백)",
        invalidMorse: "모스 부호가 잘못되었습니다. 점·선·공백·슬래시만 사용할 수 있습니다.",
        hint: "문자는 공백, 단어는 “/”로 구분됩니다. 지원하지 않는 문자는 건너뜁니다.",
      },
      buttons: { encode: "인코딩", decode: "디코딩" },
      guide: {
        intro: {
          title: "모스 부호 번역기란?",
          paragraphs: ["모스 부호 번역기는 텍스트를 모스 부호로 변환하고 모스 부호를 읽을 수 있는 텍스트로 되돌리는 무료 온라인 도구입니다. 모든 처리가 브라우저에서 이루어져 메시지가 외부로 전송되지 않습니다."],
        },
        sections: [
          { title: "사용 방법", items: ["브라우저에서 도구 열기", "텍스트 입력 또는 디코드 모드로 전환해 모스 부호 붙여넣기", "결과를 한 번에 복사"] },
          { title: "주요 기능", items: ["완전 무료, 회원가입 불필요", "양방향 즉시 변환", "브라우저 내 처리로 개인정보 보호", "영문 A–Z 및 숫자 0–9 지원"] },
        ],
      },
    },
    ru: {
      metadata: { title: "Переводчик азбуки Морзе", description: "Переводите текст в азбуку Морзе и обратно мгновенно. Бесплатно и конфиденциально — всё работает в браузере.", category: "Text" },
      keywords: ["переводчик азбуки морзе", "конвертер азбуки морзе", "текст в морзе", "морзе в текст", "код морзе", "шифр морзе", "sos морзе", "азбука морзе алфавит"],
      faqs: [
        { question: "Что такое азбука Морзе?", answer: "Азбука Морзе — это способ кодирования текста последовательностями точек (.) и тире (-). Каждая буква и цифра имеет свой код, а слова разделяются слэшем (/)." },
        { question: "Как перевести текст в азбуку Морзе?", answer: "Введите или вставьте текст в поле ввода. Код Морзе появится мгновенно: буквы разделяются пробелами, слова — слэшами." },
        { question: "Как перевести азбуку Морзе обратно в текст?", answer: "Переключитесь в режим «Декодировать» и вставьте код из точек, тире и пробелов (слова через «/»). Текст появится мгновенно." },
        { question: "Что такое сигнал SOS?", answer: "SOS — один из самых известных сигналов Морзе: ... --- ... (три точки, три тире, три точки). Он используется как сигнал бедствия." },
        { question: "Этот инструмент бесплатен?", answer: "Да, полностью бесплатен. Вся обработка происходит в вашем браузере — ничего не загружается на сервер." },
      ],
      relatedTools: [
        { name: "Конвертер регистра текста", href: "/tools/text-case-converter" },
        { name: "Разворот текста", href: "/tools/reverse-text" },
        { name: "Счётчик слов", href: "/tools/word-counter" },
      ],
      labels: {
        textToEncode: "Текст для кодирования",
        morseToDecode: "Код Морзе для декодирования",
        output: "Результат",
        enterText: "Введите или вставьте текст",
        enterMorse: "Введите код Морзе (точки, тире, пробелы)",
        invalidMorse: "Неверный код Морзе — используйте только точки, тире, пробелы и слэши.",
        hint: "Буквы разделяются пробелами, слова — символом «/». Неподдерживаемые символы пропускаются.",
      },
      buttons: { encode: "Кодировать", decode: "Декодировать" },
      guide: {
        intro: {
          title: "Что такое переводчик азбуки Морзе?",
          paragraphs: ["Переводчик азбуки Морзе — это бесплатный онлайн-инструмент, который преобразует текст в код Морзе и обратно в читаемый текст. Всё работает в вашем браузере, поэтому сообщения остаются конфиденциальными."],
        },
        sections: [
          { title: "Как использовать", items: ["Откройте инструмент в браузере", "Введите текст или переключитесь в режим декодирования и вставьте код Морзе", "Скопируйте результат в один клик"] },
          { title: "Основные возможности", items: ["Полностью бесплатно, без регистрации", "Мгновенное преобразование в обе стороны", "Работает локально в браузере — конфиденциально", "Поддерживает буквы A–Z и цифры 0–9"] },
        ],
      },
    },
  },
  "reverse-text": {
    en: {
      metadata: { title: "Reverse Text Generator", description: "Reverse any text instantly — reverse characters, word order or line order. Free and private.", category: "Text" },
      keywords: ["reverse text", "reverse text generator", "text reverser", "reverse string", "reverse words", "flip text", "backwards text", "reverse letters"],
      faqs: [
        { question: "How do I reverse text?", answer: "Paste your text in the input box and choose a mode — the reversed result appears instantly." },
        { question: "What modes are supported?", answer: "Three modes: reverse characters, reverse word order, and reverse line order." },
        { question: "Is this tool free?", answer: "Yes, completely free. Everything runs in your browser." },
        { question: "Why isn\u2019t my emoji reversed?", answer: "Emoji are made of multiple Unicode code points, so they may not be reversed character-by-character in all browsers." },
      ],
      relatedTools: [
        { name: "Text Case Converter", href: "/tools/text-case-converter" },
        { name: "Morse Code Translator", href: "/tools/morse-code" },
        { name: "Word Counter", href: "/tools/word-counter" },
      ],
      labels: {
        input: "Text to reverse",
        output: "Reversed result",
        enterText: "Type or paste your text",
      },
      buttons: { chars: "Reverse characters", words: "Reverse words", lines: "Reverse lines" },
      guide: {
        intro: {
          title: "What is a Reverse Text Generator?",
          paragraphs: ["A reverse text generator is a free online tool that flips text in different ways: it can reverse the order of characters, words or lines. All processing happens in your browser."],
        },
        sections: [
          { title: "How to use", items: ["Paste your text, choose a mode", "Copy the result with one click"] },
          { title: "Key features", items: ["Three reverse modes", "Instant results while you type", "No upload — private by design", "Free and works on any device"] },
        ],
      },
    },
    zh: {
      metadata: { title: "文本反转生成器", description: "即时反转任意文本——可反转字符、单词或行序。免费且私密。", category: "Text" },
      keywords: ["文本反转", "文字反转", "文本倒序", "反转字符串", "反转单词", "翻转文字", "反向文本", "倒序文字"],
      faqs: [
        { question: "如何反转文本？", answer: "在输入框中粘贴文字并选择模式，反转结果会即时显示。" },
        { question: "支持哪些模式？", answer: "支持三种模式：反转字符顺序、反转单词顺序、反转行顺序。" },
        { question: "这个工具免费吗？", answer: "完全免费，所有处理都在浏览器本地完成。" },
        { question: "为什么我的表情符号没有反转？", answer: "表情符号由多个 Unicode 码点组成，部分浏览器可能无法逐字符反转。" },
      ],
      relatedTools: [
        { name: "文本大小写转换器", href: "/tools/text-case-converter" },
        { name: "摩尔斯电码翻译器", href: "/tools/morse-code" },
        { name: "单词计数器", href: "/tools/word-counter" },
      ],
      labels: {
        input: "要反转的文本",
        output: "反转结果",
        enterText: "输入或粘贴文字",
      },
      buttons: { chars: "反转字符", words: "反转单词", lines: "反转行序" },
      guide: {
        intro: {
          title: "什么是文本反转生成器？",
          paragraphs: ["文本反转生成器是一款免费在线工具，可以按不同方式翻转文本：反转字符顺序、单词顺序或行顺序。所有处理都在浏览器本地完成。"],
        },
        sections: [
          { title: "使用方法", items: ["粘贴文字，选择模式", "一键复制结果"] },
          { title: "主要特点", items: ["三种反转模式", "输入即出结果，实时显示", "无需上传，天然保护隐私", "免费，支持任何设备"] },
        ],
      },
    },
    ja: {
      metadata: { title: "テキスト反転ツール", description: "文字・単語・行の順序を即座に反転できる無料ツール。プライバシー保護。", category: "Text" },
      keywords: ["テキスト反転", "文字を反転", "文字列反転", "単語の順序を反転", "テキスト逆順", "文字順逆転", "テキストを逆さに", "文字列を逆に"],
      faqs: [
        { question: "テキストを反転するには？", answer: "入力欄にテキストを貼り付け、モードを選択すると、反転結果が即座に表示されます。" },
        { question: "どのモードがありますか？", answer: "文字の順序を反転、単語の順序を反転、行の順序を反転の3種類があります。" },
        { question: "このツールは無料ですか？", answer: "はい、完全無料です。すべてブラウザ内で処理されます。" },
        { question: "絵文字が反転されないのはなぜ？", answer: "絵文字は複数のUnicodeコードポイントで構成されるため、ブラウザによっては1文字ずつ反転できない場合があります。" },
      ],
      relatedTools: [
        { name: "テキスト大文字小文字変換", href: "/tools/text-case-converter" },
        { name: "モールス信号翻訳ツール", href: "/tools/morse-code" },
        { name: "ワードカウンター", href: "/tools/word-counter" },
      ],
      labels: {
        input: "反転するテキスト",
        output: "反転結果",
        enterText: "テキストを入力または貼り付け",
      },
      buttons: { chars: "文字を反転", words: "単語を反転", lines: "行を反転" },
      guide: {
        intro: {
          title: "テキスト反転ツールとは？",
          paragraphs: ["テキスト反転ツールは、文字・単語・行の順序をさまざまな形で反転できる無料のオンラインツールです。すべてブラウザ内で処理されます。"],
        },
        sections: [
          { title: "使い方", items: ["テキストを貼り付けてモードを選択", "ワンクリックで結果をコピー"] },
          { title: "主な特徴", items: ["3種類の反転モード", "入力と同時に結果を表示", "アップロード不要でプライバシー保護", "無料でどんな端末でも利用可能"] },
        ],
      },
    },
    ko: {
      metadata: { title: "텍스트 뒤집기 도구", description: "문자·단어·줄 순서를 즉시 뒤집는 무료 도구입니다. 개인정보 보호.", category: "Text" },
      keywords: ["텍스트 뒤집기", "문자 반전", "문자열 반전", "단어 순서 반전", "글자 역순", "뒤집힌 텍스트", "텍스트 반전", "단어 뒤집기"],
      faqs: [
        { question: "텍스트를 어떻게 뒤집나요?", answer: "입력란에 텍스트를 붙여넣고 모드를 선택하면 결과가 즉시 표시됩니다." },
        { question: "어떤 모드가 있나요?", answer: "문자 순서 반전, 단어 순서 반전, 줄 순서 반전의 세 가지 모드가 있습니다." },
        { question: "이 도구는 무료인가요?", answer: "네, 완전 무료이며 모든 처리가 브라우저에서 이루어집니다." },
        { question: "이모지가 뒤집히지 않는 이유는?", answer: "이모지는 여러 유니코드 코드 포인트로 구성되어 있어 브라우저에 따라 문자 단위로 뒤집지 못할 수 있습니다." },
      ],
      relatedTools: [
        { name: "텍스트 대소문자 변환기", href: "/tools/text-case-converter" },
        { name: "모스 부호 번역기", href: "/tools/morse-code" },
        { name: "단어 수 세기", href: "/tools/word-counter" },
      ],
      labels: {
        input: "뒤집을 텍스트",
        output: "뒤집힌 결과",
        enterText: "텍스트 입력 또는 붙여넣기",
      },
      buttons: { chars: "문자 반전", words: "단어 반전", lines: "줄 반전" },
      guide: {
        intro: {
          title: "텍스트 뒤집기 도구란?",
          paragraphs: ["텍스트 뒤집기 도구는 문자·단어·줄의 순서를 다양하게 뒤집을 수 있는 무료 온라인 도구입니다. 모든 처리가 브라우저에서 이루어집니다."],
        },
        sections: [
          { title: "사용 방법", items: ["텍스트를 붙여넣고 모드 선택", "결과를 한 번에 복사"] },
          { title: "주요 기능", items: ["3가지 뒤집기 모드", "입력 즉시 결과 표시", "업로드 없이 개인정보 보호", "무료, 모든 기기 지원"] },
        ],
      },
    },
    ru: {
      metadata: { title: "Разворот текста", description: "Разверните любой текст мгновенно: символы, слова или строки в обратном порядке. Бесплатно и приватно.", category: "Text" },
      keywords: ["развернуть текст", "реверс текста", "перевернуть текст", "обратный порядок слов", "развернуть строку", "перевернуть буквы", "текст задом наперёд", "reverse text"],
      faqs: [
        { question: "Как развернуть текст?", answer: "Вставьте текст в поле ввода и выберите режим — результат появится мгновенно." },
        { question: "Какие режимы поддерживаются?", answer: "Три режима: разворот символов, разворот порядка слов и разворот порядка строк." },
        { question: "Этот инструмент бесплатен?", answer: "Да, полностью бесплатен. Всё выполняется в вашем браузере." },
        { question: "Почему эмодзи не разворачиваются?", answer: "Эмодзи состоят из нескольких кодовых точек Unicode, поэтому не все браузеры могут развернуть их посимвольно." },
      ],
      relatedTools: [
        { name: "Конвертер регистра текста", href: "/tools/text-case-converter" },
        { name: "Переводчик азбуки Морзе", href: "/tools/morse-code" },
        { name: "Счётчик слов", href: "/tools/word-counter" },
      ],
      labels: {
        input: "Текст для разворота",
        output: "Результат",
        enterText: "Введите или вставьте текст",
      },
      buttons: { chars: "Развернуть символы", words: "Развернуть слова", lines: "Развернуть строки" },
      guide: {
        intro: {
          title: "Что такое разворот текста?",
          paragraphs: ["Разворот текста — это бесплатный онлайн-инструмент, который переворачивает текст разными способами: меняет порядок символов, слов или строк. Вся обработка выполняется в вашем браузере."],
        },
        sections: [
          { title: "Как использовать", items: ["Вставьте текст и выберите режим", "Скопируйте результат в один клик"] },
          { title: "Основные возможности", items: ["Три режима разворота", "Мгновенный результат при вводе", "Без загрузки данных — конфиденциально", "Бесплатно и работает на любом устройстве"] },
        ],
      },
    },
  },
  "px-to-rem": {
    en: {
      metadata: { title: "PX to REM Converter", description: "Convert pixels (px) to rem and rem to pixels with a custom base font size. Free CSS unit converter.", category: "Developer" },
      keywords: ["px to rem", "rem to px", "px rem converter", "css unit converter", "root font size", "responsive typography", "pixel to rem", "rem calculator"],
      faqs: [
        { question: "What is rem?", answer: "rem is a CSS unit relative to the root element\u2019s font size (usually html). Unlike em, it isn\u2019t affected by parent font sizes." },
        { question: "What is the base font size?", answer: "The default base is 16px — the browser default — and you can switch to 14, 15, 17, 18 or 20px." },
        { question: "How do I convert px to rem?", answer: "Divide the pixel value by the base font size: 16px ÷ 16 = 1rem. The tool does this instantly." },
        { question: "Why use rem instead of px?", answer: "rem scales with the root font size, which makes responsive layouts easier and respects the user\u2019s browser font-size setting." },
      ],
      relatedTools: [
        { name: "Binary Converter", href: "/tools/binary-converter" },
        { name: "Unit Converter", href: "/tools/unit-converter" },
        { name: "CSS Minifier", href: "/tools/css-minifier" },
      ],
      labels: {
        baseFontSize: "Base font size",
        pxToRem: "Pixels (px) → rem",
        remToPx: "rem → pixels (px)",
        hint: "1rem equals {base}px at the current base size. Change the base size above.",
      },
      guide: {
        intro: {
          title: "What is a PX to REM Converter?",
          paragraphs: ["A px to rem converter is a free online tool that converts pixel values to rem units and back, using a configurable base font size. It helps developers build responsive, accessible layouts."],
        },
        sections: [
          { title: "How to use", items: ["Choose the base font size (default 16px)", "Type a value in either field — the conversion happens instantly in the other", "Copy the resulting value into your CSS"] },
          { title: "Key features", items: ["Instant two-way conversion", "Configurable root font size", "Works with decimal values", "Free and runs entirely in your browser"] },
        ],
      },
    },
    zh: {
      metadata: { title: "PX 转 REM 换算器", description: "在像素（px）与 rem 之间换算，支持自定义根字号。免费的 CSS 单位转换工具。", category: "Developer" },
      keywords: ["px转rem", "rem转px", "px和rem换算", "css单位换算", "根字号", "响应式排版", "像素转rem", "rem计算器"],
      faqs: [
        { question: "什么是 rem？", answer: "rem 是相对于根元素（通常是 html）字号的 CSS 单位。与 em 不同，它不受父元素字号影响。" },
        { question: "基准字号是多少？", answer: "默认基准为 16px（浏览器默认值），也可以切换到 14、15、17、18 或 20px。" },
        { question: "如何把 px 换算成 rem？", answer: "用像素值除以基准字号即可：16px ÷ 16 = 1rem。本工具会即时计算。" },
        { question: "为什么要用 rem 而不是 px？", answer: "rem 会随根字号缩放，便于构建响应式布局，同时尊重用户浏览器设置的字号。" },
      ],
      relatedTools: [
        { name: "进制转换器", href: "/tools/binary-converter" },
        { name: "单位换算器", href: "/tools/unit-converter" },
        { name: "CSS 压缩工具", href: "/tools/css-minifier" },
      ],
      labels: {
        baseFontSize: "基准字号",
        pxToRem: "像素（px）→ rem",
        remToPx: "rem → 像素（px）",
        hint: "当前基准字号下 1rem = {base}px。可在上方切换基准字号。",
      },
      guide: {
        intro: {
          title: "什么是 PX 转 REM 换算器？",
          paragraphs: ["PX 转 REM 换算器是一款免费在线工具，可在像素与 rem 单位之间互相换算，并支持自定义基准字号，帮助开发者构建响应式、无障碍的布局。"],
        },
        sections: [
          { title: "使用方法", items: ["选择基准字号（默认 16px）", "在任一输入框中输入数值，另一侧即时显示换算结果", "将结果复制到你的 CSS 中"] },
          { title: "主要特点", items: ["双向即时换算", "可配置根字号", "支持小数", "免费，完全在浏览器中运行"] },
        ],
      },
    },
    ja: {
      metadata: { title: "PX⇔REM 変換ツール", description: "ピクセル（px）と rem を相互変換。ルートフォントサイズもカスタム可能な無料の CSS 単位変換ツール。", category: "Developer" },
      keywords: ["pxをremに変換", "remをpxに変換", "px rem 変換", "css単位変換", "ルートフォントサイズ", "レスポンシブタイポグラフィ", "ピクセルからrem", "rem計算"],
      faqs: [
        { question: "rem とは何ですか？", answer: "rem はルート要素（通常は html）のフォントサイズを基準とする CSS の単位です。親要素のフォントサイズの影響を受ける em とは異なります。" },
        { question: "基準フォントサイズは？", answer: "既定値はブラウザ標準の 16px で、14、15、17、18、20px に切り替えられます。" },
        { question: "px を rem に変換するには？", answer: "ピクセル値を基準フォントサイズで割ります：16px ÷ 16 = 1rem。このツールが即座に計算します。" },
        { question: "なぜ px ではなく rem を使うのですか？", answer: "rem はルートフォントサイズに合わせて拡大縮小するため、レスポンシブレイアウトが作りやすく、ユーザーのブラウザ設定も尊重できます。" },
      ],
      relatedTools: [
        { name: "進数変換ツール", href: "/tools/binary-converter" },
        { name: "単位換算ツール", href: "/tools/unit-converter" },
        { name: "CSS ミニファイア", href: "/tools/css-minifier" },
      ],
      labels: {
        baseFontSize: "基準フォントサイズ",
        pxToRem: "ピクセル（px）→ rem",
        remToPx: "rem → ピクセル（px）",
        hint: "現在の基準では 1rem = {base}px です。上で基準を変更できます。",
      },
      guide: {
        intro: {
          title: "PX⇔REM 変換ツールとは？",
          paragraphs: ["PX⇔REM 変換ツールは、ピクセル値と rem 単位を、設定可能な基準フォントサイズで相互変換できる無料のオンラインツールです。レスポンシブでアクセシブルなレイアウト作りに役立ちます。"],
        },
        sections: [
          { title: "使い方", items: ["基準フォントサイズを選択（既定 16px）", "どちらかの欄に値を入力すると、もう一方に即時変換", "結果を CSS にコピー"] },
          { title: "主な特徴", items: ["双方向の即時変換", "ルートフォントサイズを変更可能", "小数にも対応", "無料・ブラウザ内で完結"] },
        ],
      },
    },
    ko: {
      metadata: { title: "PX↔REM 변환기", description: "픽셀(px)과 rem을 상호 변환합니다. 기준 글꼴 크기를 직접 설정할 수 있는 무료 CSS 단위 변환 도구입니다.", category: "Developer" },
      keywords: ["px를 rem으로", "rem을 px로", "px rem 변환", "css 단위 변환", "루트 폰트 크기", "반응형 타이포그래피", "픽셀을 rem으로", "rem 계산기"],
      faqs: [
        { question: "rem이란 무엇인가요?", answer: "rem은 루트 요소(보통 html)의 글꼴 크기를 기준으로 하는 CSS 단위입니다. 부모 요소의 글꼴 크기에 영향받는 em과 다릅니다." },
        { question: "기준 글꼴 크기는?", answer: "기본값은 브라우저 기본값인 16px이며 14, 15, 17, 18, 20px로 변경할 수 있습니다." },
        { question: "px를 rem으로 어떻게 변환하나요?", answer: "픽셀 값을 기준 글꼴 크기로 나누면 됩니다: 16px ÷ 16 = 1rem. 이 도구가 즉시 계산합니다." },
        { question: "px 대신 rem을 쓰는 이유는?", answer: "rem은 루트 글꼴 크기에 맞춰 조정되므로 반응형 레이아웃을 만들기 쉽고 사용자 브라우저의 글꼴 설정을 존중합니다." },
      ],
      relatedTools: [
        { name: "진법 변환기", href: "/tools/binary-converter" },
        { name: "단위 변환기", href: "/tools/unit-converter" },
        { name: "CSS 압축기", href: "/tools/css-minifier" },
      ],
      labels: {
        baseFontSize: "기준 글꼴 크기",
        pxToRem: "픽셀(px) → rem",
        remToPx: "rem → 픽셀(px)",
        hint: "현재 기준에서 1rem = {base}px입니다. 위에서 기준을 변경할 수 있습니다.",
      },
      guide: {
        intro: {
          title: "PX↔REM 변환기란?",
          paragraphs: ["PX↔REM 변환기는 기준 글꼴 크기를 설정해 픽셀 값과 rem 단위를 서로 변환하는 무료 온라인 도구입니다. 반응형·접근성 좋은 레이아웃을 만드는 데 도움이 됩니다."],
        },
        sections: [
          { title: "사용 방법", items: ["기준 글꼴 크기 선택(기본 16px)", "한쪽에 값을 입력하면 반대쪽에 즉시 변환", "결과를 CSS에 복사"] },
          { title: "주요 기능", items: ["양방향 즉시 변환", "루트 글꼴 크기 설정 가능", "소수점 지원", "무료, 브라우저에서 완전 처리"] },
        ],
      },
    },
    ru: {
      metadata: { title: "Конвертер PX в REM", description: "Переводите пиксели (px) в rem и обратно с настраиваемым базовым размером шрифта. Бесплатный конвертер CSS-единиц.", category: "Developer" },
      keywords: ["px в rem", "rem в px", "конвертер px rem", "конвертер css единиц", "базовый размер шрифта", "адаптивная типографика", "пиксели в rem", "калькулятор rem"],
      faqs: [
        { question: "Что такое rem?", answer: "rem — это CSS-единица, зависящая от размера шрифта корневого элемента (обычно html). В отличие от em, на неё не влияет размер шрифта родителя." },
        { question: "Какой базовый размер шрифта?", answer: "По умолчанию 16px — стандарт браузера; можно переключиться на 14, 15, 17, 18 или 20px." },
        { question: "Как перевести px в rem?", answer: "Разделите значение в пикселях на базовый размер шрифта: 16px ÷ 16 = 1rem. Инструмент делает это мгновенно." },
        { question: "Зачем использовать rem вместо px?", answer: "rem масштабируется вместе с корневым размером шрифта, что упрощает адаптивную вёрстку и учитывает настройки шрифта в браузере пользователя." },
      ],
      relatedTools: [
        { name: "Конвертер систем счисления", href: "/tools/binary-converter" },
        { name: "Конвертер единиц", href: "/tools/unit-converter" },
        { name: "Минификатор CSS", href: "/tools/css-minifier" },
      ],
      labels: {
        baseFontSize: "Базовый размер шрифта",
        pxToRem: "Пиксели (px) → rem",
        remToPx: "rem → пиксели (px)",
        hint: "При текущем базовом размере 1rem = {base}px. Выше можно изменить базовый размер.",
      },
      guide: {
        intro: {
          title: "Что такое конвертер PX в REM?",
          paragraphs: ["Конвертер PX в REM — это бесплатный онлайн-инструмент для перевода пикселей в rem и обратно с настраиваемым базовым размером шрифта. Он помогает разработчикам создавать адаптивные и доступные макеты."],
        },
        sections: [
          { title: "Как использовать", items: ["Выберите базовый размер шрифта (по умолчанию 16px)", "Введите значение в любое поле — в другом оно появится мгновенно", "Скопируйте результат в свой CSS"] },
          { title: "Основные возможности", items: ["Мгновенное двустороннее преобразование", "Настраиваемый корневой размер шрифта", "Поддержка десятичных значений", "Бесплатно, полностью в браузере"] },
        ],
      },
    },
  },
  "password-strength": {
    en: {
      metadata: { title: "Password Strength Checker", description: "Test how strong your password is with an instant score, checklist and tips. Runs entirely in your browser.", category: "Utility" },
      keywords: ["password strength", "password strength checker", "password test", "strong password", "password security", "password score", "check password strength", "password entropy"],
      faqs: [
        { question: "How is the strength calculated?", answer: "The score combines length and character variety: uppercase, lowercase, digits and symbols each add points." },
        { question: "What makes a strong password?", answer: "At least 12 characters, a mix of upper/lowercase letters, digits and symbols, and no common words or personal info." },
        { question: "Is my password sent anywhere?", answer: "No. Everything runs in your browser — your password never leaves your device." },
        { question: "What is a good score?", answer: "Aim for \u201CGood\u201D or \u201CStrong\u201D. If you see \u201CWeak\u201D or \u201CFair\u201D, make the password longer and add more character types." },
      ],
      relatedTools: [
        { name: "Password Generator", href: "/tools/password-generator" },
        { name: "Random Number Generator", href: "/tools/random-number-generator" },
        { name: "QR Code Generator", href: "/tools/qr-code-generator" },
      ],
      labels: {
        password: "Password",
        enterPassword: "Type a password to test",
        strength: "Strength",
        empty: "—",
        weak: "Weak",
        fair: "Fair",
        good: "Good",
        strong: "Strong",
        privacy: "Your password is analyzed locally in your browser and never sent anywhere.",
        criteria: {
          length: "At least 8 characters",
          upper: "Uppercase letters (A–Z)",
          lower: "Lowercase letters (a–z)",
          digit: "Numbers (0–9)",
          symbol: "Symbols (!@#$…)",
        },
      },
      guide: {
        intro: {
          title: "What is a Password Strength Checker?",
          paragraphs: ["A password strength checker is a free tool that analyzes your password and shows how resistant it is to guessing or brute-force attacks. The analysis happens locally in your browser."],
        },
        sections: [
          { title: "How to use", items: ["Open the tool and type your password", "Watch the strength bar and checklist update in real time", "Use the suggestions to create a stronger password"] },
          { title: "Key features", items: ["Instant real-time scoring", "Clear visual checklist", "100% local analysis — nothing is uploaded", "Free, no signup required"] },
        ],
      },
    },
    zh: {
      metadata: { title: "密码强度检测器", description: "即时检测密码强度，给出评分、检查清单与改进建议。所有分析都在浏览器本地完成。", category: "Utility" },
      keywords: ["密码强度", "密码强度检测", "密码强度测试", "强密码", "密码安全", "密码评分", "密码检测工具", "密码复杂度"],
      faqs: [
        { question: "强度是如何计算的？", answer: "评分综合密码长度与字符多样性：大写字母、小写字母、数字和符号都会增加分数。" },
        { question: "什么样的密码才算强？", answer: "至少 12 位，包含大小写字母、数字与符号的混合，且不使用常见单词或个人信息。" },
        { question: "我的密码会被发送出去吗？", answer: "不会。所有分析都在浏览器本地完成，密码不会离开你的设备。" },
        { question: "什么样的评分算好？", answer: "目标是“良好”或“强”。如果显示“弱”或“一般”，请加长密码并增加更多字符类型。" },
      ],
      relatedTools: [
        { name: "密码生成器", href: "/tools/password-generator" },
        { name: "随机数生成器", href: "/tools/random-number-generator" },
        { name: "二维码生成器", href: "/tools/qr-code-generator" },
      ],
      labels: {
        password: "密码",
        enterPassword: "输入要检测的密码",
        strength: "强度",
        empty: "—",
        weak: "弱",
        fair: "一般",
        good: "良好",
        strong: "强",
        privacy: "你的密码仅在浏览器本地分析，绝不会发送到任何地方。",
        criteria: {
          length: "至少 8 位",
          upper: "大写字母（A–Z）",
          lower: "小写字母（a–z）",
          digit: "数字（0–9）",
          symbol: "符号（!@#$…）",
        },
      },
      guide: {
        intro: {
          title: "什么是密码强度检测器？",
          paragraphs: ["密码强度检测器是一款免费工具，可分析你的密码并显示它对猜测或暴力破解的抵抗能力。分析在浏览器本地完成。"],
        },
        sections: [
          { title: "使用方法", items: ["打开工具并输入密码", "实时查看强度条与检查清单的变化", "根据建议创建更安全的密码"] },
          { title: "主要特点", items: ["实时评分", "清晰的视觉检查清单", "100% 本地分析，不上传任何数据", "免费，无需注册"] },
        ],
      },
    },
    ja: {
      metadata: { title: "パスワード強度チェッカー", description: "パスワードの強度を即時に判定。スコア・チェックリスト・改善のヒントを表示します。すべてブラウザ内で処理。", category: "Utility" },
      keywords: ["パスワード強度", "パスワードチェッカー", "パスワード強度テスト", "強いパスワード", "パスワードセキュリティ", "パスワードスコア", "パスワード判定", "パスワードの強さ"],
      faqs: [
        { question: "強度はどうやって計算されますか？", answer: "長さと文字種（大文字・小文字・数字・記号）のバランスを組み合わせてスコアを算出します。" },
        { question: "強いパスワードとは？", answer: "12文字以上で、大文字・小文字・数字・記号を組み合わせ、一般的な単語や個人情報を避けたものです。" },
        { question: "パスワードが送信されることはありますか？", answer: "ありません。すべてブラウザ内で処理され、パスワードがデバイス外に送信されることはありません。" },
        { question: "どのスコアが良いですか？", answer: "「良好」または「強い」を目指しましょう。「弱い」や「普通」の場合は、長さを増やし文字種を追加してください。" },
      ],
      relatedTools: [
        { name: "パスワード生成ツール", href: "/tools/password-generator" },
        { name: "乱数生成ツール", href: "/tools/random-number-generator" },
        { name: "QRコード生成ツール", href: "/tools/qr-code-generator" },
      ],
      labels: {
        password: "パスワード",
        enterPassword: "判定するパスワードを入力",
        strength: "強度",
        empty: "—",
        weak: "弱い",
        fair: "普通",
        good: "良好",
        strong: "強い",
        privacy: "パスワードはブラウザ内でのみ分析され、外部に送信されることはありません。",
        criteria: {
          length: "8文字以上",
          upper: "大文字（A–Z）",
          lower: "小文字（a–z）",
          digit: "数字（0–9）",
          symbol: "記号（!@#$…）",
        },
      },
      guide: {
        intro: {
          title: "パスワード強度チェッカーとは？",
          paragraphs: ["パスワード強度チェッカーは、パスワードを分析し、推測やブルートフォース攻撃への耐性を表示する無料ツールです。分析はブラウザ内で行われます。"],
        },
        sections: [
          { title: "使い方", items: ["ツールを開いてパスワードを入力", "強度バーとチェックリストがリアルタイムで更新", "提案を参考に強いパスワードを作成"] },
          { title: "主な特徴", items: ["リアルタイムのスコア表示", "分かりやすいチェックリスト", "100%ローカル分析・送信なし", "無料・登録不要"] },
        ],
      },
    },
    ko: {
      metadata: { title: "비밀번호 강도 검사기", description: "비밀번호의 강도를 즉시 평가합니다. 점수, 체크리스트, 개선 팁을 제공하며 모든 분석은 브라우저에서 이루어집니다.", category: "Utility" },
      keywords: ["비밀번호 강도", "비밀번호 검사", "비밀번호 강도 테스트", "강한 비밀번호", "비밀번호 보안", "비밀번호 점수", "비밀번호 확인", "비밀번호 복잡도"],
      faqs: [
        { question: "강도는 어떻게 계산되나요?", answer: "길이와 문자 다양성(대문자·소문자·숫자·기호)을 조합해 점수를 산출합니다." },
        { question: "강한 비밀번호란 무엇인가요?", answer: "12자 이상, 대소문자·숫자·기호의 혼합, 그리고 일반적인 단어나 개인정보를 피한 비밀번호입니다." },
        { question: "비밀번호가 전송되나요?", answer: "아니요. 모든 분석이 브라우저에서 이루어지며 비밀번호가 기기를 벗어나지 않습니다." },
        { question: "어떤 점수가 좋은가요?", answer: "“좋음” 또는 “강함”을 목표로 하세요. “약함”이나 “보통”이면 길이를 늘리고 문자 유형을 추가하세요." },
      ],
      relatedTools: [
        { name: "비밀번호 생성기", href: "/tools/password-generator" },
        { name: "난수 생성기", href: "/tools/random-number-generator" },
        { name: "QR 코드 생성기", href: "/tools/qr-code-generator" },
      ],
      labels: {
        password: "비밀번호",
        enterPassword: "검사할 비밀번호 입력",
        strength: "강도",
        empty: "—",
        weak: "약함",
        fair: "보통",
        good: "좋음",
        strong: "강함",
        privacy: "비밀번호는 브라우저에서만 분석되며 외부로 전송되지 않습니다.",
        criteria: {
          length: "8자 이상",
          upper: "대문자(A–Z)",
          lower: "소문자(a–z)",
          digit: "숫자(0–9)",
          symbol: "기호(!@#$…)",
        },
      },
      guide: {
        intro: {
          title: "비밀번호 강도 검사기란?",
          paragraphs: ["비밀번호 강도 검사기는 비밀번호를 분석해 추측이나 무차별 대입 공격에 대한 저항력을 보여주는 무료 도구입니다. 분석은 브라우저에서 이루어집니다."],
        },
        sections: [
          { title: "사용 방법", items: ["도구를 열고 비밀번호 입력", "강도 막대와 체크리스트가 실시간으로 갱신", "제안을 참고해 더 강한 비밀번호 생성"] },
          { title: "주요 기능", items: ["실시간 점수", "명확한 시각 체크리스트", "100% 로컬 분석, 전송 없음", "무료, 회원가입 불필요"] },
        ],
      },
    },
    ru: {
      metadata: { title: "Проверка надёжности пароля", description: "Мгновенно проверьте надёжность пароля: оценка, чек-лист и советы. Всё выполняется в вашем браузере.", category: "Utility" },
      keywords: ["надёжность пароля", "проверка пароля", "тест пароля", "надёжный пароль", "безопасность пароля", "оценка пароля", "проверка надёжности пароля", "сложность пароля"],
      faqs: [
        { question: "Как рассчитывается надёжность?", answer: "Оценка учитывает длину и разнообразие символов: прописные, строчные буквы, цифры и символы добавляют баллы." },
        { question: "Какой пароль считается надёжным?", answer: "Не менее 12 символов, сочетание букв в разных регистрах, цифр и символов, без распространённых слов и личных данных." },
        { question: "Отправляется ли мой пароль куда-либо?", answer: "Нет. Всё выполняется в вашем браузере — пароль никогда не покидает ваше устройство." },
        { question: "Какая оценка хорошая?", answer: "Стремитесь к «Хорошо» или «Отлично». Если видите «Слабо» или «Средне», увеличьте длину и добавьте типы символов." },
      ],
      relatedTools: [
        { name: "Генератор паролей", href: "/tools/password-generator" },
        { name: "Генератор случайных чисел", href: "/tools/random-number-generator" },
        { name: "Генератор QR-кодов", href: "/tools/qr-code-generator" },
      ],
      labels: {
        password: "Пароль",
        enterPassword: "Введите пароль для проверки",
        strength: "Надёжность",
        empty: "—",
        weak: "Слабо",
        fair: "Средне",
        good: "Хорошо",
        strong: "Отлично",
        privacy: "Ваш пароль анализируется только в браузере и никуда не отправляется.",
        criteria: {
          length: "Не менее 8 символов",
          upper: "Прописные буквы (A–Z)",
          lower: "Строчные буквы (a–z)",
          digit: "Цифры (0–9)",
          symbol: "Символы (!@#$…)",
        },
      },
      guide: {
        intro: {
          title: "Что такое проверка надёжности пароля?",
          paragraphs: ["Проверка надёжности пароля — это бесплатный инструмент, который анализирует пароль и показывает его устойчивость к подбору или атакам перебором. Анализ выполняется локально в браузере."],
        },
        sections: [
          { title: "Как использовать", items: ["Откройте инструмент и введите пароль", "Следите за шкалой надёжности и чек-листом в реальном времени", "Используйте подсказки для создания более надёжного пароля"] },
          { title: "Основные возможности", items: ["Мгновенная оценка в реальном времени", "Наглядный чек-лист", "100% локальный анализ — ничего не отправляется", "Бесплатно, без регистрации"] },
        ],
      },
    },
  },
};

const messagesDir = path.join(process.cwd(), "messages");

for (const locale of LOCALES) {
  const file = path.join(messagesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));

  let added = 0;
  for (const slug of Object.keys(HOME)) {
    if (data.home.tools[slug]) continue; // idempotent
    data.home.tools[slug] = HOME[slug][locale];
    added++;
  }
  for (const slug of Object.keys(TOOL)) {
    if (data.tools[slug]) continue; // idempotent
    data.tools[slug] = TOOL[slug][locale];
    added++;
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`${locale}.json: +${added} blocks`);
}

// Structural parity check across locales
const base = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf-8"));
for (const locale of LOCALES.slice(1)) {
  const d = JSON.parse(fs.readFileSync(path.join(messagesDir, `${locale}.json`), "utf-8"));
  for (const slug of Object.keys(TOOL)) {
    const a = JSON.stringify(base.tools[slug]);
    const b = JSON.stringify(d.tools[slug]);
    if (!b) throw new Error(`${locale} missing tools.${slug}`);
    // Compare key shapes, not values
    const shape = (o) => JSON.stringify(o, (k, v) => (typeof v === "string" ? "" : v));
    if (shape(JSON.parse(a)) !== shape(JSON.parse(b))) {
      throw new Error(`${locale} tools.${slug} shape mismatch`);
    }
  }
  if (Object.keys(d.home.tools).length !== Object.keys(base.home.tools).length) {
    throw new Error(`${locale} home.tools count mismatch`);
  }
}
console.log("parity OK: all locales match en shapes & home.tools counts");
