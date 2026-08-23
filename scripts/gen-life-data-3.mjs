// One-off generator: life-scene tool-data JSON (part 3: 4 tools).
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const LOCALES = ["en", "zh", "ja", "ko", "ru"];
const CAT = {
  en: "Life Tools",
  zh: "生活工具",
  ja: "生活ツール",
  ko: "생활 도구",
  ru: "Повседневные инструменты",
};

function build(entry) {
  const out = { slug: entry.slug, icon: entry.icon, home: {}, tools: {} };
  for (const loc of LOCALES) {
    const h = entry.home[loc];
    const t = entry.tools[loc];
    out.home[loc] = { name: h.name, description: h.description, category: CAT[loc] };
    out.tools[loc] = {
      metadata: { title: t.metaTitle, description: t.metaDesc },
      title: t.title,
      description: t.description,
      category: CAT[loc],
      keywords: t.keywords,
      faqs: t.faqs,
      relatedTools: t.related.map((r) => ({ name: r.name[loc], href: r.href })),
      labels: t.labels,
      buttons: t.buttons,
    };
  }
  return out;
}

const TOOLS = [
  {
    slug: "keycode",
    icon: "⌨️",
    home: {
      en: { name: "Keycode Tester", description: "Press any key to see its key code and event info." },
      zh: { name: "按键码查询", description: "按下任意按键查看 keyCode 与按键事件信息。" },
      ja: { name: "キーコード確認", description: "任意のキーを押すとキーコードとイベント情報を表示。" },
      ko: { name: "키코드 확인", description: "아무 키나 누르면 키코드와 이벤트 정보를 확인합니다." },
      ru: { name: "Коды клавиш", description: "Нажмите любую клавишу, чтобы увидеть её код и данные события." },
    },
    tools: {
      en: {
        metaTitle: "Keycode Tester - Identify Any Keyboard Key Online",
        metaDesc: "Free online keycode tester. Press any key to instantly see its event.key, event.code, keyCode and location. Perfect for developers. Runs in your browser.",
        title: "Keycode Tester",
        description: "Press any key on your keyboard and instantly see its key, code, keyCode and location. A handy reference for web developers.",
        keywords: ["keycode", "key code tester", "event key", "javascript keycode", "keyboard event", "key press test"],
        faqs: [
          { q: "What is the difference between key and code?", a: "key is the character produced (e.g. \"a\" or \"A\"), while code is the physical key location (e.g. \"KeyA\"), independent of layout." },
          { q: "Do I need to install anything?", a: "No. Everything runs in your browser and no data is sent anywhere." },
        ],
        related: [
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
          { name: { en: "Character Counter", zh: "字数统计", ja: "文字数カウント", ko: "글자 수 세기", ru: "Счётчик символов" }, href: "/tools/character-counter" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
        ],
        labels: { key: "Key", code: "Code", location: "Location", pressAny: "Press any key…" },
        buttons: {},
      },
      zh: {
        metaTitle: "按键码查询 - 在线识别键盘按键",
        metaDesc: "免费在线按键码查询工具，按下任意按键即可查看 event.key、event.code、keyCode 与位置信息，方便开发者调试。全程在浏览器本地完成。",
        title: "按键码查询",
        description: "按下键盘上的任意按键，即可查看它的 key、code、keyCode 与位置信息，是 Web 开发者的常用参考工具。",
        keywords: ["按键码", "keycode", "按键测试", "键盘事件", "按键值查询", "javascript按键"],
        faqs: [
          { q: "key 和 code 有什么区别？", a: "key 是产生的字符（如 \"a\" 或 \"A\"），code 是物理按键位置（如 \"KeyA\"），与输入法布局无关。" },
          { q: "需要安装任何东西吗？", a: "不需要。所有功能都在浏览器本地运行，不会上传任何数据。" },
        ],
        related: [
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
          { name: { en: "Character Counter", zh: "字数统计", ja: "文字数カウント", ko: "글자 수 세기", ru: "Счётчик символов" }, href: "/tools/character-counter" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
        ],
        labels: { key: "按键", code: "代码", location: "位置", pressAny: "请按下任意按键…" },
        buttons: {},
      },
      ja: {
        metaTitle: "キーコード確認 - キーボードのキーを識別",
        metaDesc: "任意のキーを押すと event.key・event.code・keyCode・位置を即表示する無料ツール。開発者向け。ブラウザ内で完結。",
        title: "キーコード確認",
        description: "キーボードの任意のキーを押すと、key、code、keyCode、位置が即座に表示されます。",
        keywords: ["キーコード", "keycode", "キー確認", "キーボードイベント", "javascriptキー", "キー押下テスト"],
        faqs: [
          { q: "key と code の違いは？", a: "key は生成される文字（例 \"a\"）、code は物理キーの位置（例 \"KeyA\"）でレイアウトに依存しません。" },
          { q: "何かインストールは必要ですか？", a: "いいえ。ブラウザ内で完結し、データはどこにも送信されません。" },
        ],
        related: [
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
          { name: { en: "Character Counter", zh: "字数统计", ja: "文字数カウント", ko: "글자 수 세기", ru: "Счётчик символов" }, href: "/tools/character-counter" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
        ],
        labels: { key: "キー", code: "コード", location: "位置", pressAny: "任意のキーを押してください…" },
        buttons: {},
      },
      ko: {
        metaTitle: "키코드 확인 - 키보드 키 식별 온라인",
        metaDesc: "아무 키나 누르면 event.key, event.code, keyCode, 위치를 즉시 표시하는 무료 도구입니다. 개발자에게 유용하며 브라우저에서 완료됩니다.",
        title: "키코드 확인",
        description: "키보드의 아무 키나 누르면 key, code, keyCode, 위치 정보가 즉시 표시됩니다.",
        keywords: ["키코드", "keycode", "키 테스트", "키보드 이벤트", "자바스크립트 키코드", "키 입력 확인"],
        faqs: [
          { q: "key와 code의 차이는 무엇인가요?", a: "key는 생성된 문자(예: \"a\")이고 code는 물리적 키 위치(예: \"KeyA\")로 레이아웃과 무관합니다." },
          { q: "설치할 것이 있나요?", a: "없습니다. 브라우저에서만 실행되며 어떤 데이터도 전송되지 않습니다." },
        ],
        related: [
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
          { name: { en: "Character Counter", zh: "字数统计", ja: "文字数カウント", ko: "글자 수 세기", ru: "Счётчик символов" }, href: "/tools/character-counter" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
        ],
        labels: { key: "키", code: "코드", location: "위치", pressAny: "아무 키나 누르세요…" },
        buttons: {},
      },
      ru: {
        metaTitle: "Коды клавиш - определить клавишу онлайн",
        metaDesc: "Бесплатный онлайн-тест клавиш. Нажмите любую клавишу и мгновенно увидите event.key, event.code, keyCode и location. Для разработчиков. Всё в браузере.",
        title: "Коды клавиш",
        description: "Нажмите любую клавишу и сразу увидите её key, code, keyCode и location. Удобный справочник для веб-разработчиков.",
        keywords: ["коды клавиш", "keycode", "тест клавиш", "событие клавиатуры", "javascript keycode", "нажатие клавиши"],
        faqs: [
          { q: "Чем key отличается от code?", a: "key — это символ (например «a» или «A»), а code — физическое расположение клавиши (например «KeyA»), не зависящее от раскладки." },
          { q: "Нужно ли что-то устанавливать?", a: "Нет. Всё работает в браузере, данные никуда не отправляются." },
        ],
        related: [
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
          { name: { en: "Character Counter", zh: "字数统计", ja: "文字数カウント", ko: "글자 수 세기", ru: "Счётчик символов" }, href: "/tools/character-counter" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
        ],
        labels: { key: "Клавиша", code: "Код", location: "Расположение", pressAny: "Нажмите любую клавишу…" },
        buttons: {},
      },
    },
  },
  {
    slug: "monte-carlo-pi",
    icon: "📐",
    home: {
      en: { name: "Monte Carlo Pi", description: "Estimate pi by throwing random points on a circle." },
      zh: { name: "蒙特卡洛圆周率", description: "通过向圆形随机撒点估算圆周率。" },
      ja: { name: "モンテカルロ円周率", description: "円にランダムに点を打って円周率を推定します。" },
      ko: { name: "몬테카를로 파이", description: "원 안에 무작위 점을 던져 원주율을 추정합니다." },
      ru: { name: "Монте-Карло π", description: "Оцените число π, бросая случайные точки в круг." },
    },
    tools: {
      en: {
        metaTitle: "Monte Carlo Pi - Estimate π with Random Points",
        metaDesc: "Estimate pi by throwing random points into a circle and counting how many land inside the quarter circle. A fun visual demo. Runs in your browser.",
        title: "Monte Carlo Pi",
        description: "Drop random points into a square and count how many fall inside the quarter circle. The ratio approximates π/4, so the estimate converges to π.",
        keywords: ["monte carlo pi", "estimate pi", "pi simulation", "random points pi", "monte carlo method", "pi approximation"],
        faqs: [
          { q: "Why does this work?", a: "The quarter circle covers π/4 of the square. With enough random points, the fraction inside the circle approaches π/4, giving an estimate of π." },
          { q: "How accurate is it?", a: "Accuracy grows with the number of points. With 200,000 points you typically get π correct to about 2-3 decimal places." },
        ],
        related: [
          { name: { en: "Pi Digits", zh: "圆周率查询", ja: "円周率検索", ko: "원주율 검색", ru: "Цифры числа π" }, href: "/tools/pi-digits" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { points: "Points", estimate: "π estimate", inside: "Inside circle", accuracy: "Accuracy" },
        buttons: { run: "Run Simulation" },
      },
      zh: {
        metaTitle: "蒙特卡洛圆周率 - 用随机点估算 π",
        metaDesc: "通过向正方形内随机撒点，统计落入四分之一圆的点数来估算圆周率，可视化演示有趣又直观。全程在浏览器本地完成。",
        title: "蒙特卡洛圆周率",
        description: "向正方形随机撒点，统计落在四分之一圆内的比例。该比例趋近 π/4，由此估算圆周率 π。",
        keywords: ["蒙特卡洛圆周率", "估算圆周率", "圆周率模拟", "随机撒点", "蒙特卡洛方法", "圆周率近似"],
        faqs: [
          { q: "为什么这样能算出圆周率？", a: "四分之一圆占正方形的 π/4。随机点足够多时，落入圆内的比例趋近 π/4，从而估算出 π。" },
          { q: "精度有多高？", a: "精度随点数增加而提高。20 万点时通常可精确到 2-3 位小数。" },
        ],
        related: [
          { name: { en: "Pi Digits", zh: "圆周率查询", ja: "円周率検索", ko: "원주율 검색", ru: "Цифры числа π" }, href: "/tools/pi-digits" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { points: "点数", estimate: "π 估算值", inside: "圆内点数", accuracy: "精度" },
        buttons: { run: "运行模拟" },
      },
      ja: {
        metaTitle: "モンテカルロ円周率 - ランダム点でπを推定",
        metaDesc: "正方形にランダムに点を打ち、四分円に入った割合から円周率を推定する視覚的なデモ。ブラウザ内で完結。",
        title: "モンテカルロ円周率",
        description: "正方形にランダムに点を打ち、四分円の内側に入った割合を数えます。この割合はπ/4に近づくため、πを推定できます。",
        keywords: ["モンテカルロ法", "円周率", "π推定", "ランダム点", "円周率近似", "シミュレーション"],
        faqs: [
          { q: "なぜこれでπが求まるのですか？", a: "四分円は正方形のπ/4を占めます。ランダム点が十分多ければ円内の割合がπ/4に近づき、πを推定できます。" },
          { q: "精度はどのくらい？", a: "点数が多いほど正確になります。20万点でおよそ小数2〜3桁まで正確です。" },
        ],
        related: [
          { name: { en: "Pi Digits", zh: "圆周率查询", ja: "円周率検索", ko: "원주율 검색", ru: "Цифры числа π" }, href: "/tools/pi-digits" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { points: "点数", estimate: "π推定値", inside: "円内の点数", accuracy: "精度" },
        buttons: { run: "シミュレーション実行" },
      },
      ko: {
        metaTitle: "몬테카를로 파이 - 무작위 점으로 π 추정",
        metaDesc: "정사각형에 무작위로 점을 던져 4분원 안에 들어온 비율로 원주율을 추정하는 시각적 데모입니다. 브라우저에서 완료됩니다.",
        title: "몬테카를로 파이",
        description: "정사각형에 무작위 점을 던지고 4분원 안에 들어온 점의 비율을 셉니다. 이 비율은 π/4에 수렴하므로 π를 추정할 수 있습니다.",
        keywords: ["몬테카를로 파이", "원주율 추정", "π 시뮬레이션", "무작위 점", "몬테카를로 방법", "원주율 근사"],
        faqs: [
          { q: "왜 이 방법이 통하나요?", a: "4분원은 정사각형의 π/4를 차지합니다. 점이 충분히 많으면 원 안의 비율이 π/4에 수렴해 π를 추정할 수 있습니다." },
          { q: "정확도는 어느 정도인가요?", a: "점 수가 많을수록 정확해지며, 20만 점이면 보통 소수 2-3자리까지 정확합니다." },
        ],
        related: [
          { name: { en: "Pi Digits", zh: "圆周率查询", ja: "円周率検索", ko: "원주율 검색", ru: "Цифры числа π" }, href: "/tools/pi-digits" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { points: "점 수", estimate: "π 추정값", inside: "원 안 점", accuracy: "정확도" },
        buttons: { run: "시뮬레이션 실행" },
      },
      ru: {
        metaTitle: "Монте-Карло π - оценить число π случайными точками",
        metaDesc: "Оцените число π, бросая случайные точки в квадрат и считая попадания в четверть круга. Наглядная демонстрация. Всё в браузере.",
        title: "Монте-Карло π",
        description: "Бросайте случайные точки в квадрат и считайте, сколько попало в четверть круга. Доля попаданий стремится к π/4, поэтому оценка сходится к π.",
        keywords: ["монте-карло π", "оценить π", "моделирование π", "случайные точки", "метод монте-карло", "приближение π"],
        faqs: [
          { q: "Почему это работает?", a: "Четверть круга занимает π/4 площади квадрата. При большом числе точек доля попаданий стремится к π/4, что даёт оценку π." },
          { q: "Насколько это точно?", a: "Точность растёт с числом точек. При 200 000 точках π обычно верно до 2-3 знаков после запятой." },
        ],
        related: [
          { name: { en: "Pi Digits", zh: "圆周率查询", ja: "円周率検索", ko: "원주율 검색", ru: "Цифры числа π" }, href: "/tools/pi-digits" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { points: "Точки", estimate: "Оценка π", inside: "Внутри круга", accuracy: "Точность" },
        buttons: { run: "Запустить" },
      },
    },
  },
  {
    slug: "pi-digits",
    icon: "🥧",
    home: {
      en: { name: "Pi Digits", description: "Generate and search millions of pi digits." },
      zh: { name: "圆周率查询", description: "生成并搜索圆周率百万位数字。" },
      ja: { name: "円周率検索", description: "円周率の桁を生成・検索します。" },
      ko: { name: "원주율 검색", description: "원주율의 자릿수를 생성하고 검색합니다." },
      ru: { name: "Цифры числа π", description: "Генерируйте и ищите миллионы цифр числа π." },
    },
    tools: {
      en: {
        metaTitle: "Pi Digits - Generate and Search Pi Online",
        metaDesc: "Generate up to 100,000 digits of pi in your browser, search for number sequences inside them, and download the digits as a text file.",
        title: "Pi Digits",
        description: "Generate anywhere from 10 to 100,000 digits of π right in your browser using a spigot algorithm, then search for any digit sequence inside the result.",
        keywords: ["pi digits", "pi search", "search pi", "pi calculator", "digits of pi", "pi sequence"],
        faqs: [
          { q: "How are the digits generated?", a: "A BigInt spigot algorithm computes the digits on the fly in your browser — no server or database is involved." },
          { q: "How many digits can I generate?", a: "From 10 up to 100,000 digits per run. Larger requests take a few seconds." },
        ],
        related: [
          { name: { en: "Monte Carlo Pi", zh: "蒙特卡洛圆周率", ja: "モンテカルロ円周率", ko: "몬테카를로 파이", ru: "Монте-Карло π" }, href: "/tools/monte-carlo-pi" },
          { name: { en: "Hash Generator", zh: "哈希生成", ja: "ハッシュ生成", ko: "해시 생성", ru: "Генератор хэша" }, href: "/tools/hash-generator" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
        ],
        labels: { digits: "Digits", searchPlaceholder: "Search a number sequence…", notFound: "Not found", found: "First occurrence at position" },
        buttons: { generate: "Generate", search: "Search", download: "Download .txt" },
      },
      zh: {
        metaTitle: "圆周率查询 - 在线生成与搜索圆周率",
        metaDesc: "在浏览器中生成最多 10 万位圆周率，可搜索数字序列并下载为文本文件。全程本地计算，无需服务器。",
        title: "圆周率查询",
        description: "使用 spigot 算法在浏览器中生成 10 到 10 万位圆周率，并可在结果中搜索任意数字序列。",
        keywords: ["圆周率", "圆周率查询", "π搜索", "圆周率计算", "π位数", "圆周率数字"],
        faqs: [
          { q: "数字是如何生成的？", a: "使用 BigInt spigot 算法在浏览器中实时计算，无需服务器或数据库。" },
          { q: "最多能生成多少位？", a: "每次可生成 10 到 10 万位，更大的请求需要几秒钟。" },
        ],
        related: [
          { name: { en: "Monte Carlo Pi", zh: "蒙特卡洛圆周率", ja: "モンテカルロ円周率", ko: "몬테카를로 파이", ru: "Монте-Карло π" }, href: "/tools/monte-carlo-pi" },
          { name: { en: "Hash Generator", zh: "哈希生成", ja: "ハッシュ生成", ko: "해시 생성", ru: "Генератор хэша" }, href: "/tools/hash-generator" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
        ],
        labels: { digits: "位数", searchPlaceholder: "搜索数字序列…", notFound: "未找到", found: "首次出现位置" },
        buttons: { generate: "生成", search: "搜索", download: "下载 .txt" },
      },
      ja: {
        metaTitle: "円周率検索 - オンラインで生成・検索",
        metaDesc: "ブラウザ内で最大10万桁の円周率を生成し、数字列を検索・テキストファイルとしてダウンロードできます。",
        title: "円周率検索",
        description: "spigot アルゴリズムでブラウザ内に10〜10万桁の円周率を生成し、結果の中から任意の数字列を検索できます。",
        keywords: ["円周率", "円周率検索", "πの桁", "円周率計算", "π検索", "数字列検索"],
        faqs: [
          { q: "桁はどうやって生成されますか？", a: "BigInt による spigot アルゴリズムがブラウザ内で即時計算します。サーバーやデータベースは不要です。" },
          { q: "何桁まで生成できますか？", a: "1回で10〜10万桁まで。大きいリクエストは数秒かかります。" },
        ],
        related: [
          { name: { en: "Monte Carlo Pi", zh: "蒙特卡洛圆周率", ja: "モンテカルロ円周率", ko: "몬테카를로 파이", ru: "Монте-Карло π" }, href: "/tools/monte-carlo-pi" },
          { name: { en: "Hash Generator", zh: "哈希生成", ja: "ハッシュ生成", ko: "해시 생성", ru: "Генератор хэша" }, href: "/tools/hash-generator" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
        ],
        labels: { digits: "桁数", searchPlaceholder: "数字列を検索…", notFound: "見つかりません", found: "最初の出現位置" },
        buttons: { generate: "生成", search: "検索", download: "ダウンロード .txt" },
      },
      ko: {
        metaTitle: "원주율 검색 - 온라인 생성 및 검색",
        metaDesc: "브라우저에서 최대 10만 자리의 원주율을 생성하고 숫자열을 검색하거나 텍스트 파일로 다운로드할 수 있습니다.",
        title: "원주율 검색",
        description: "spigot 알고리즘으로 브라우저에서 10~10만 자리의 원주율을 생성하고, 결과에서 원하는 숫자열을 검색할 수 있습니다.",
        keywords: ["원주율", "원주율 검색", "π 자릿수", "원주율 계산", "π 검색", "숫자열 검색"],
        faqs: [
          { q: "자릿수는 어떻게 생성되나요?", a: "BigInt spigot 알고리즘이 브라우저에서 즉시 계산합니다. 서버나 데이터베이스가 필요 없습니다." },
          { q: "몇 자리까지 생성할 수 있나요?", a: "한 번에 10~10만 자리까지. 큰 요청은 몇 초가 걸립니다." },
        ],
        related: [
          { name: { en: "Monte Carlo Pi", zh: "蒙特卡洛圆周率", ja: "モンテカルロ円周率", ko: "몬테카를로 파이", ru: "Монте-Карло π" }, href: "/tools/monte-carlo-pi" },
          { name: { en: "Hash Generator", zh: "哈希生成", ja: "ハッシュ生成", ko: "해시 생성", ru: "Генератор хэша" }, href: "/tools/hash-generator" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
        ],
        labels: { digits: "자릿수", searchPlaceholder: "숫자열 검색…", notFound: "찾을 수 없음", found: "첫 번째 위치" },
        buttons: { generate: "생성", search: "검색", download: "다운로드 .txt" },
      },
      ru: {
        metaTitle: "Цифры числа π - генерировать и искать онлайн",
        metaDesc: "Сгенерируйте до 100 000 цифр числа π прямо в браузере, ищите последовательности и скачивайте результат в виде текстового файла.",
        title: "Цифры числа π",
        description: "Сгенерируйте от 10 до 100 000 цифр числа π прямо в браузере с помощью алгоритма-краника, затем ищите любую последовательность в результате.",
        keywords: ["цифры π", "поиск π", "число пи", "калькулятор π", "цифры числа пи", "последовательность π"],
        faqs: [
          { q: "Как генерируются цифры?", a: "Алгоритм-краник на BigInt вычисляет цифры на лету в вашем браузере — без сервера и базы данных." },
          { q: "Сколько цифр можно получить?", a: "От 10 до 100 000 цифр за раз. Более крупные запросы занимают несколько секунд." },
        ],
        related: [
          { name: { en: "Monte Carlo Pi", zh: "蒙特卡洛圆周率", ja: "モンテカルロ円周率", ko: "몬테카를로 파이", ru: "Монте-Карло π" }, href: "/tools/monte-carlo-pi" },
          { name: { en: "Hash Generator", zh: "哈希生成", ja: "ハッシュ生成", ko: "해시 생성", ru: "Генератор хэша" }, href: "/tools/hash-generator" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
        ],
        labels: { digits: "Цифр", searchPlaceholder: "Поиск последовательности…", notFound: "Не найдено", found: "Первое вхождение на позиции" },
        buttons: { generate: "Сгенерировать", search: "Поиск", download: "Скачать .txt" },
      },
    },
  },
  {
    slug: "color-blindness-test",
    icon: "👁️",
    home: {
      en: { name: "Color Blindness Test", description: "Self-test with Ishihara-style color plates." },
      zh: { name: "色盲测试", description: "通过石原式色觉测试图进行自测。" },
      ja: { name: "色覚テスト", description: "石原式カラープレートで自己チェック。" },
      ko: { name: "색각 이상 테스트", description: "이시하라식 컬러 플레이트로 자가 테스트합니다." },
      ru: { name: "Тест на дальтонизм", description: "Самотест с таблицами в стиле Исихары." },
    },
    tools: {
      en: {
        metaTitle: "Color Blindness Test - Ishihara Style Plates Online",
        metaDesc: "Free online color blindness self-test. Numbers are hidden in Ishihara-style color plates — try to read them. A quick screening, not a medical diagnosis. Runs in your browser.",
        title: "Color Blindness Test",
        description: "Numbers are hidden inside Ishihara-style color plates. Try to read each number, then check whether your answer is correct. A quick self-screening only.",
        keywords: ["color blindness test", "ishihara test", "color vision test", "daltonism test", "color blind check", "eye test"],
        faqs: [
          { q: "Can this diagnose color blindness?", a: "No. It is a fun self-screening based on the Ishihara style. For a real diagnosis please see an eye care professional." },
          { q: "Which color plates are used?", a: "The tool generates two plate types: red-green and green-red patterns, which are commonly used to screen for red-green deficiencies." },
        ],
        related: [
          { name: { en: "Hearing Test", zh: "听力测试", ja: "聴力テスト", ko: "청력 테스트", ru: "Тест слуха" }, href: "/tools/hearing-test" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
        ],
        labels: { none: "I can't see a number", correct: "Correct!", wrong: "Incorrect", score: "Score", hint: "Plate colors may vary by screen — this is not a diagnosis" },
        buttons: { next: "Next Plate" },
      },
      zh: {
        metaTitle: "色盲测试 - 在线石原式色觉自测",
        metaDesc: "免费在线色盲自测：石原式色觉测试图中隐藏着数字，尝试读出即可。仅作快速筛查，不能替代医学诊断。全程在浏览器本地完成。",
        title: "色盲测试",
        description: "数字隐藏在石原式色觉测试图中。尝试读出每个数字并核对答案，仅作快速自测。",
        keywords: ["色盲测试", "石原测试", "色觉测试", "色弱测试", "色盲自测", "色觉检查"],
        faqs: [
          { q: "这个能诊断色盲吗？", a: "不能。它只是基于石原式的趣味自测，真实诊断请咨询眼科专业人士。" },
          { q: "使用哪些色板？", a: "工具会生成红绿与绿红两种图板，常用于筛查红绿色觉异常。" },
        ],
        related: [
          { name: { en: "Hearing Test", zh: "听力测试", ja: "聴力テスト", ko: "청력 테스트", ru: "Тест слуха" }, href: "/tools/hearing-test" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
        ],
        labels: { none: "看不到数字", correct: "正确！", wrong: "不正确", score: "得分", hint: "屏幕颜色可能存在偏差，本测试不能作为诊断依据" },
        buttons: { next: "下一张" },
      },
      ja: {
        metaTitle: "色覚テスト - 石原式カラープレート",
        metaDesc: "石原式カラープレートに隠れた数字を読む無料の色覚自己テスト。簡易スクリーニングであり、診断ではありません。ブラウザ内で完結。",
        title: "色覚テスト",
        description: "石原式カラープレートに数字が隠れています。数字を読み取り、正解かどうかを確認する簡易自己テストです。",
        keywords: ["色覚テスト", "色盲テスト", "石原テスト", "色覚異常", "カラービジョンテスト", "色覚チェック"],
        faqs: [
          { q: "色盲を診断できますか？", a: "いいえ。石原式スタイルの簡易自己スクリーニングです。診断は眼科医に相談してください。" },
          { q: "どのカラープレートを使いますか？", a: "赤緑と緑赤の2種類のパターンを生成し、赤緑色覚異常のスクリーニングによく使われます。" },
        ],
        related: [
          { name: { en: "Hearing Test", zh: "听力测试", ja: "聴力テスト", ko: "청력 테스트", ru: "Тест слуха" }, href: "/tools/hearing-test" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
        ],
        labels: { none: "数字が見えない", correct: "正解！", wrong: "不正解", score: "スコア", hint: "画面の色は環境により異なります。診断ではありません" },
        buttons: { next: "次のプレート" },
      },
      ko: {
        metaTitle: "색각 이상 테스트 - 이시하라식 컬러 플레이트",
        metaDesc: "이시하라식 컬러 플레이트에 숨겨진 숫자를 읽는 무료 색각 자가 테스트입니다. 간단한 선별일 뿐 진단이 아닙니다. 브라우저에서 완료됩니다.",
        title: "색각 이상 테스트",
        description: "이시하라식 컬러 플레이트에 숫자가 숨겨져 있습니다. 숫자를 읽고 정답 여부를 확인하는 빠른 자가 테스트입니다.",
        keywords: ["색각 이상 테스트", "색맹 테스트", "이시하라 테스트", "색각 검사", "색맹 자가 진단", "색각 확인"],
        faqs: [
          { q: "색맹을 진단할 수 있나요?", a: "아니요. 이시하라 스타일의 재미있는 자가 선별일 뿐입니다. 진단은 안과 전문의와 상담하세요." },
          { q: "어떤 플레이트를 사용하나요?", a: "적녹/녹적 두 가지 패턴을 생성하며, 적녹 색각 이상 선별에 흔히 쓰입니다." },
        ],
        related: [
          { name: { en: "Hearing Test", zh: "听力测试", ja: "聴力テスト", ko: "청력 테스트", ru: "Тест слуха" }, href: "/tools/hearing-test" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
        ],
        labels: { none: "숫자가 안 보여요", correct: "정답!", wrong: "오답", score: "점수", hint: "화면 색상에 따라 차이가 있을 수 있습니다. 진단이 아닙니다" },
        buttons: { next: "다음 플레이트" },
      },
      ru: {
        metaTitle: "Тест на дальтонизм - таблицы в стиле Исихары",
        metaDesc: "Бесплатный онлайн-тест на дальтонизм. В таблицах в стиле Исихары спрятаны цифры — попробуйте прочитать их. Быстрый скрининг, не диагноз. Всё в браузере.",
        title: "Тест на дальтонизм",
        description: "Внутри таблиц в стиле Исихары спрятаны цифры. Прочитайте каждую и проверьте свой ответ. Только быстрый самоконтроль.",
        keywords: ["тест на дальтонизм", "тест исихары", "проверка цветового зрения", "дальтонизм", "проверка зрения", "цветовосприятие"],
        faqs: [
          { q: "Может ли этот тест поставить диагноз?", a: "Нет. Это развлекательный самоконтроль в стиле Исихары. Для реального диагноза обратитесь к офтальмологу." },
          { q: "Какие таблицы используются?", a: "Генерируются два типа таблиц — красно-зелёные и зелёно-красные, типичные для проверки на красно-зелёную слепоту." },
        ],
        related: [
          { name: { en: "Hearing Test", zh: "听力测试", ja: "聴力テスト", ko: "청력 테스트", ru: "Тест слуха" }, href: "/tools/hearing-test" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
        ],
        labels: { none: "Не вижу цифру", correct: "Верно!", wrong: "Неверно", score: "Счёт", hint: "Цвета зависят от экрана — это не диагноз" },
        buttons: { next: "Следующая таблица" },
      },
    },
  },
];

const dir = join(process.cwd(), "scripts", "tool-data");
for (const entry of TOOLS) {
  writeFileSync(join(dir, `${entry.slug}.json`), JSON.stringify(build(entry), null, 2) + "\n", "utf8");
  console.log(`wrote ${entry.slug}.json`);
}
