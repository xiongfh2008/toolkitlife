// One-off generator: life-scene tool-data JSON (part 2: 4 tools).
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
    slug: "answer-book",
    icon: "🔮",
    home: {
      en: { name: "Magic Answer Book", description: "Ask a question and get a random answer." },
      zh: { name: "答案之书", description: "心中默念问题，翻开书得到随机答案。" },
      ja: { name: "答えの本", description: "質問を心に浮かべて本を開くとランダムな答えが。" },
      ko: { name: "마법의 답변책", description: "질문을 떠올리고 책을 펼치면 무작위 답변이 나옵니다." },
      ru: { name: "Книга ответов", description: "Задайте вопрос и получите случайный ответ." },
    },
    tools: {
      en: {
        metaTitle: "Magic Answer Book - Get a Random Answer Online",
        metaDesc: "Free online magic answer book. Think of a question, tap the book and receive a random answer. Fun and private — everything runs in your browser.",
        title: "Magic Answer Book",
        description: "Hold a yes/no question in your mind, tap the book and let it reveal an answer at random. A fun way to break indecision.",
        keywords: ["answer book", "magic 8 ball", "random answer", "yes or no", "decision maker", "fortune book"],
        faqs: [
          { q: "Is this a real fortune teller?", a: "No — answers are picked at random. Treat it as a fun decision helper, not a prediction." },
          { q: "Can I ask again?", a: "Yes, tap the book as many times as you like. Each tap gives a new random answer." },
        ],
        related: [
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { ask: "Ask a question, then tap the book", hint: "Tap the book to reveal an answer" },
        buttons: {},
      },
      zh: {
        metaTitle: "答案之书 - 在线随机答案",
        metaDesc: "免费在线答案之书。心中默念问题，点击书籍即可获得随机答案，有趣又私密。全程在浏览器本地完成。",
        title: "答案之书",
        description: "在脑海中默念一个是否类问题，点击书页即可获得随机答案。一种有趣的做决定方式。",
        keywords: ["答案之书", "随机答案", "魔法书", "是否答案", "决策工具", "占卜书"],
        faqs: [
          { q: "这是真正的占卜吗？", a: "不是，答案完全随机。请把它当作有趣的决策辅助，而非预测。" },
          { q: "可以重复提问吗？", a: "可以，点击多少次都行，每次都会得到新的随机答案。" },
        ],
        related: [
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { ask: "心中默念问题，然后点击书籍", hint: "点击书籍获得答案" },
        buttons: {},
      },
      ja: {
        metaTitle: "答えの本 - オンラインでランダムな答え",
        metaDesc: "質問を心に浮かべて本をタップするだけでランダムな答えが得られる無料ツール。楽しくプライベート。ブラウザ内で完結。",
        title: "答えの本",
        description: "心の中でイエス/ノー質問を思い浮かべ、本をタップして答えをランダムに表示します。",
        keywords: ["答えの本", "マジック8ボール", "ランダムな答え", "イエスノー", "決断", "占い本"],
        faqs: [
          { q: "本当に占えるのですか？", a: "いいえ。答えはランダムです。面白い決断補助としてお楽しみください。" },
          { q: "何度でも聞けますか？", a: "はい。タップするたびに新しいランダムな答えが表示されます。" },
        ],
        related: [
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { ask: "質問を思い浮かべて本をタップ", hint: "本をタップして答えを見る" },
        buttons: {},
      },
      ko: {
        metaTitle: "마법의 답변책 - 온라인 무작위 답변",
        metaDesc: "질문을 떠올리고 책을 탭하면 무작위 답변이 나오는 무료 도구입니다. 재미있고 프라이빗하게 브라우저에서 완료됩니다.",
        title: "마법의 답변책",
        description: "마음속으로 예/아니오 질문을 떠올린 뒤 책을 탭하면 무작위 답변이 표시됩니다. 결정을 도와주는 재미있는 방법입니다.",
        keywords: ["답변책", "마법의 책", "무작위 답변", "예 아니오", "결정 도구", "점성술 책"],
        faqs: [
          { q: "진짜 점을 보는 건가요?", a: "아니요. 답변은 완전히 무작위입니다. 재미있는 결정 보조 도구로 즐기세요." },
          { q: "다시 질문할 수 있나요?", a: "네. 탭할 때마다 새로운 무작위 답변이 나옵니다." },
        ],
        related: [
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { ask: "질문을 떠올린 후 책을 탭하세요", hint: "책을 탭해 답변을 확인하세요" },
        buttons: {},
      },
      ru: {
        metaTitle: "Книга ответов - случайный ответ онлайн",
        metaDesc: "Бесплатная онлайн-книга ответов. Загадайте вопрос, нажмите на книгу и получите случайный ответ. Весело и приватно — всё в браузере.",
        title: "Книга ответов",
        description: "Загадайте вопрос «да/нет», нажмите на книгу, и она даст случайный ответ. Забавный способ выйти из нерешительности.",
        keywords: ["книга ответов", "магический шар", "случайный ответ", "да или нет", "помощник решений", "книга гаданий"],
        faqs: [
          { q: "Это настоящее гадание?", a: "Нет — ответы выбираются случайно. Воспринимайте это как весёлого помощника, а не предсказание." },
          { q: "Можно спросить ещё раз?", a: "Да, нажимайте сколько угодно — каждый раз появится новый случайный ответ." },
        ],
        related: [
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { ask: "Задайте вопрос и нажмите на книгу", hint: "Нажмите на книгу, чтобы получить ответ" },
        buttons: {},
      },
    },
  },
  {
    slug: "reaction-time",
    icon: "⚡",
    home: {
      en: { name: "Reaction Time Test", description: "Measure how fast you can react." },
      zh: { name: "反应速度测试", description: "测试你的反应速度有多快。" },
      ja: { name: "反応速度テスト", description: "あなたの反応速度を測定します。" },
      ko: { name: "반응 속도 테스트", description: "당신의 반응 속도를 측정합니다." },
      ru: { name: "Тест реакции", description: "Измерьте, как быстро вы реагируете." },
    },
    tools: {
      en: {
        metaTitle: "Reaction Time Test - Measure Your Reflexes Online",
        metaDesc: "Free online reaction time test. Wait for the screen to turn green, then click as fast as you can. Track your best and average times. Runs in your browser.",
        title: "Reaction Time Test",
        description: "A classic reaction test: wait for the green screen and click immediately. The last 10 results are recorded with your best and average times.",
        keywords: ["reaction time test", "reflex test", "reaction speed", "human benchmark", "click speed test", "reflex check"],
        faqs: [
          { q: "What is a good reaction time?", a: "The average human reaction time is around 250ms. Top athletes can go under 200ms." },
          { q: "Why wait for green?", a: "The random delay prevents you from anticipating the signal, giving a true reaction measurement." },
        ],
        related: [
          { name: { en: "Click Speed Test", zh: "点击速度测试", ja: "クリックスピードテスト", ko: "클릭 속도 테스트", ru: "Тест скорости кликов" }, href: "/tools/click-speed" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
          { name: { en: "Keycode Test", zh: "按键码查询", ja: "キーコード確認", ko: "키코드 확인", ru: "Коды клавиш" }, href: "/tools/keycode" },
        ],
        labels: { clickNow: "Click now!", wait: "Wait for green…", tooSoon: "Too soon! Try again", result: "ms", best: "Best", average: "Average", attempts: "Attempts" },
        buttons: {},
      },
      zh: {
        metaTitle: "反应速度测试 - 在线测试你的反应力",
        metaDesc: "免费在线反应速度测试。等屏幕变绿后立即点击，记录你的最佳和平均反应时间。全程在浏览器本地完成。",
        title: "反应速度测试",
        description: "经典反应测试：等屏幕变绿后立即点击。系统会记录最近 10 次结果并计算最佳与平均时间。",
        keywords: ["反应速度测试", "反应力测试", "反应时间", "反射测试", "反应测试", "人类基准测试"],
        faqs: [
          { q: "多少反应时间算快？", a: "人类平均反应时间约为 250 毫秒，顶级运动员可低于 200 毫秒。" },
          { q: "为什么要等变绿？", a: "随机延迟可以防止你提前预判，从而测出真实反应时间。" },
        ],
        related: [
          { name: { en: "Click Speed Test", zh: "点击速度测试", ja: "クリックスピードテスト", ko: "클릭 속도 테스트", ru: "Тест скорости кликов" }, href: "/tools/click-speed" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
          { name: { en: "Keycode Test", zh: "按键码查询", ja: "キーコード確認", ko: "키코드 확인", ru: "Коды клавиш" }, href: "/tools/keycode" },
        ],
        labels: { clickNow: "立即点击！", wait: "等待变绿…", tooSoon: "点早了！再试一次", result: "毫秒", best: "最佳", average: "平均", attempts: "次数" },
        buttons: {},
      },
      ja: {
        metaTitle: "反応速度テスト - オンラインで反射神経を測定",
        metaDesc: "画面が緑に変わったらすぐにクリックする無料の反応速度テスト。最高・平均タイムを記録します。ブラウザ内で完結。",
        title: "反応速度テスト",
        description: "定番の反応テスト。緑に変わった瞬間にクリック。直近10回の結果と最高・平均タイムを記録します。",
        keywords: ["反応速度テスト", "反射神経テスト", "反応時間", "人間ベンチマーク", "クリック速度", "反射チェック"],
        faqs: [
          { q: "どれくらいの反応時間が速いですか？", a: "人間の平均は約250ミリ秒、一流アスリートは200ミリ秒を切ります。" },
          { q: "なぜ緑を待つのですか？", a: "ランダムな遅延で先読みを防ぎ、真の反応時間を測ります。" },
        ],
        related: [
          { name: { en: "Click Speed Test", zh: "点击速度测试", ja: "クリックスピードテスト", ko: "클릭 속도 테스트", ru: "Тест скорости кликов" }, href: "/tools/click-speed" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
          { name: { en: "Keycode Test", zh: "按键码查询", ja: "キーコード確認", ko: "키코드 확인", ru: "Коды клавиш" }, href: "/tools/keycode" },
        ],
        labels: { clickNow: "今すぐクリック！", wait: "緑になるのを待つ…", tooSoon: "早すぎました！もう一度", result: "ミリ秒", best: "最高", average: "平均", attempts: "回数" },
        buttons: {},
      },
      ko: {
        metaTitle: "반응 속도 테스트 - 온라인 반사 신경 측정",
        metaDesc: "화면이 초록색으로 바뀌면 바로 클릭하는 무료 반응 속도 테스트입니다. 최고·평균 시간을 기록하며 브라우저에서 완료됩니다.",
        title: "반응 속도 테스트",
        description: "고전적인 반응 테스트: 초록 화면이 나타나면 즉시 클릭하세요. 최근 10회 결과와 최고·평균 시간을 기록합니다.",
        keywords: ["반응 속도 테스트", "반사 신경 테스트", "반응 시간", "휴먼 벤치마크", "클릭 속도", "반사 신경"],
        faqs: [
          { q: "어느 정도 반응 시간이 빠른 건가요?", a: "인간의 평균 반응 시간은 약 250ms이며, 최고 수준 선수는 200ms 이하입니다." },
          { q: "왜 초록색을 기다리나요?", a: "무작위 지연으로 미리 예측하는 것을 막아 진짜 반응 시간을 측정합니다." },
        ],
        related: [
          { name: { en: "Click Speed Test", zh: "点击速度测试", ja: "クリックスピードテスト", ko: "클릭 속도 테스트", ru: "Тест скорости кликов" }, href: "/tools/click-speed" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
          { name: { en: "Keycode Test", zh: "按键码查询", ja: "キーコード確認", ko: "키코드 확인", ru: "Коды клавиш" }, href: "/tools/keycode" },
        ],
        labels: { clickNow: "지금 클릭하세요!", wait: "초록색을 기다리세요…", tooSoon: "너무 빨랐어요! 다시 시도", result: "ms", best: "최고", average: "평균", attempts: "횟수" },
        buttons: {},
      },
      ru: {
        metaTitle: "Тест реакции - измерьте рефлексы онлайн",
        metaDesc: "Бесплатный онлайн-тест реакции. Дождитесь зелёного экрана и нажмите как можно быстрее. Отслеживайте лучший и средний результаты. Всё в браузере.",
        title: "Тест реакции",
        description: "Классический тест реакции: дождитесь зелёного экрана и сразу нажмите. Записываются последние 10 результатов с лучшим и средним временем.",
        keywords: ["тест реакции", "проверка рефлексов", "скорость реакции", "человеческий бенчмарк", "тест скорости кликов", "рефлекс"],
        faqs: [
          { q: "Какое время реакции считается хорошим?", a: "Среднее время реакции человека около 250 мс. Топ-спортсмены укладываются в 200 мс." },
          { q: "Зачем ждать зелёного?", a: "Случайная задержка не даёт предугадать сигнал, поэтому результат отражает настоящую реакцию." },
        ],
        related: [
          { name: { en: "Click Speed Test", zh: "点击速度测试", ja: "クリックスピードテスト", ko: "클릭 속도 테스트", ru: "Тест скорости кликов" }, href: "/tools/click-speed" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
          { name: { en: "Keycode Test", zh: "按键码查询", ja: "キーコード確認", ko: "키코드 확인", ru: "Коды клавиш" }, href: "/tools/keycode" },
        ],
        labels: { clickNow: "Жмите сейчас!", wait: "Ждите зелёного…", tooSoon: "Слишком рано! Ещё раз", result: "мс", best: "Лучший", average: "Средний", attempts: "Попыток" },
        buttons: {},
      },
    },
  },
  {
    slug: "click-speed",
    icon: "🖱️",
    home: {
      en: { name: "Click Speed Test", description: "Test how many clicks you can make in 10 seconds." },
      zh: { name: "点击速度测试", description: "测试你在 10 秒内能点击多少次。" },
      ja: { name: "クリックスピードテスト", description: "10秒間で何回クリックできるかテスト。" },
      ko: { name: "클릭 속도 테스트", description: "10초 동안 몇 번 클릭할 수 있는지 테스트합니다." },
      ru: { name: "Тест скорости кликов", description: "Проверьте, сколько кликов вы сделаете за 10 секунд." },
    },
    tools: {
      en: {
        metaTitle: "Click Speed Test - CPS Test in 10 Seconds",
        metaDesc: "Free click speed test. Measure your clicks per second (CPS) in a 10-second challenge. Track your best score. Runs in your browser.",
        title: "Click Speed Test",
        description: "A 10-second challenge: click as fast as you can and measure your clicks per second (CPS). Your best score is saved during the session.",
        keywords: ["click speed test", "cps test", "clicks per second", "clicker test", "10 second click test", "mouse speed test"],
        faqs: [
          { q: "What is a good CPS?", a: "A typical result is 5-7 CPS. Skilled gamers reach 10+ CPS with jitter clicking." },
          { q: "How long does a test take?", a: "Each round lasts 10 seconds, and you can retake it as many times as you want." },
        ],
        related: [
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
        ],
        labels: { timeLeft: "Time left", clicks: "Clicks", cps: "CPS", click: "Click!", best: "Best" },
        buttons: { start: "Start" },
      },
      zh: {
        metaTitle: "点击速度测试 - 10 秒 CPS 测试",
        metaDesc: "免费点击速度测试，10 秒挑战测出你的每秒点击数（CPS），并记录最佳成绩。全程在浏览器本地完成。",
        title: "点击速度测试",
        description: "10 秒挑战：以最快速度点击，测出每秒点击数（CPS）。本次会话会记录你的最佳成绩。",
        keywords: ["点击速度测试", "cps测试", "每秒点击数", "连点测试", "鼠标点击速度", "10秒点击测试"],
        faqs: [
          { q: "多少 CPS 算快？", a: "普通人约为 5-7 CPS，熟练玩家可通过抖动点击达到 10+ CPS。" },
          { q: "一次测试多久？", a: "每轮 10 秒，想测多少次都可以。" },
        ],
        related: [
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
        ],
        labels: { timeLeft: "剩余时间", clicks: "点击数", cps: "CPS", click: "点击！", best: "最佳" },
        buttons: { start: "开始" },
      },
      ja: {
        metaTitle: "クリックスピードテスト - 10秒のCPS測定",
        metaDesc: "10秒チャレンジで毎秒クリック数（CPS）を測る無料ツール。ベストスコアを記録。ブラウザ内で完結します。",
        title: "クリックスピードテスト",
        description: "10秒のチャレンジ。できるだけ速くクリックして毎秒クリック数（CPS）を測定します。",
        keywords: ["クリックスピードテスト", "cpsテスト", "毎秒クリック数", "連打テスト", "マウス速度", "10秒クリック"],
        faqs: [
          { q: "どれくらいのCPSが速いですか？", a: "一般的に5〜7 CPS、熟練プレイヤーはジタークリックで10 CPS以上です。" },
          { q: "テスト時間は？", a: "1ラウンド10秒で、何度でも挑戦できます。" },
        ],
        related: [
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
        ],
        labels: { timeLeft: "残り時間", clicks: "クリック数", cps: "CPS", click: "クリック！", best: "最高" },
        buttons: { start: "開始" },
      },
      ko: {
        metaTitle: "클릭 속도 테스트 - 10초 CPS 측정",
        metaDesc: "10초 동안의 클릭 횟수(CPS)를 측정하는 무료 도구입니다. 최고 기록을 저장하며 브라우저에서 완료됩니다.",
        title: "클릭 속도 테스트",
        description: "10초 챌린지: 최대한 빠르게 클릭하여 초당 클릭 수(CPS)를 측정합니다.",
        keywords: ["클릭 속도 테스트", "cps 테스트", "초당 클릭 수", "연타 테스트", "마우스 속도", "10초 클릭 테스트"],
        faqs: [
          { q: "CPS가 얼마면 빠른 건가요?", a: "보통 5-7 CPS이며, 숙련된 게이머는 지터 클릭으로 10 CPS 이상을 달성합니다." },
          { q: "테스트는 얼마나 걸리나요?", a: "1라운드 10초이며 횟수 제한 없이 다시 도전할 수 있습니다." },
        ],
        related: [
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
        ],
        labels: { timeLeft: "남은 시간", clicks: "클릭 수", cps: "CPS", click: "클릭!", best: "최고" },
        buttons: { start: "시작" },
      },
      ru: {
        metaTitle: "Тест скорости кликов - CPS за 10 секунд",
        metaDesc: "Бесплатный тест скорости кликов. Измерьте клики в секунду (CPS) за 10-секундный раунд. Лучший результат сохраняется. Всё в браузере.",
        title: "Тест скорости кликов",
        description: "Челлендж на 10 секунд: кликайте как можно быстрее и узнайте скорость в кликах в секунду (CPS). Лучший результат сохраняется в сессии.",
        keywords: ["тест скорости кликов", "cps тест", "клики в секунду", "тест кликов", "скорость мыши", "10 секунд кликов"],
        faqs: [
          { q: "Какой CPS считается хорошим?", a: "Типичный результат — 5-7 CPS. Опытные игроки достигают 10+ CPS." },
          { q: "Сколько длится тест?", a: "Каждый раунд — 10 секунд, пересдавать можно сколько угодно." },
        ],
        related: [
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Schulte Grid", zh: "舒尔特方格", ja: "シュルテ方格", ko: "슐테 그리드", ru: "Таблица Шульте" }, href: "/tools/schulte-grid" },
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
        ],
        labels: { timeLeft: "Осталось", clicks: "Кликов", cps: "CPS", click: "Кликай!", best: "Лучший" },
        buttons: { start: "Начать" },
      },
    },
  },
  {
    slug: "schulte-grid",
    icon: "🔢",
    home: {
      en: { name: "Schulte Grid", description: "Train attention by tapping numbers 1-N in order." },
      zh: { name: "舒尔特方格", description: "按顺序点击 1-N 数字，训练注意力。" },
      ja: { name: "シュルテ方格", description: "1〜Nを順番にタップして注意力を鍛えます。" },
      ko: { name: "슐테 그리드", description: "1부터 N까지 순서대로 탭하며 집중력을 훈련합니다." },
      ru: { name: "Таблица Шульте", description: "Тренируйте внимание, нажимая числа 1-N по порядку." },
    },
    tools: {
      en: {
        metaTitle: "Schulte Grid - Train Focus and Attention Online",
        metaDesc: "Free online Schulte grid trainer. Tap the numbers from 1 to N in ascending order to train peripheral vision and focus. Runs in your browser.",
        title: "Schulte Grid",
        description: "A classic attention-training grid. Numbers from 1 to N are shuffled in the grid — tap them in ascending order as fast as you can.",
        keywords: ["schulte grid", "attention training", "focus training", "peripheral vision", "schulte table", "mind training"],
        faqs: [
          { q: "What sizes are available?", a: "From 3x3 (1-9) up to 8x8 (1-64). Start small and increase the size as you improve." },
          { q: "How do I get faster?", a: "Regular practice trains your peripheral vision and visual scanning speed. Track your best time and try to beat it." },
        ],
        related: [
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Click Speed Test", zh: "点击速度测试", ja: "クリックスピードテスト", ko: "클릭 속도 테스트", ru: "Тест скорости кликов" }, href: "/tools/click-speed" },
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
        ],
        labels: { size: "Grid size", time: "Time", best: "Best", next: "Next" },
        buttons: { start: "Start" },
      },
      zh: {
        metaTitle: "舒尔特方格 - 在线注意力训练",
        metaDesc: "免费在线舒尔特方格训练器，按从小到大的顺序点击 1-N 数字，训练周边视觉与专注力。全程在浏览器本地完成。",
        title: "舒尔特方格",
        description: "经典的注意力训练方格：1-N 的数字被打乱排列，按升序尽快点击即可。",
        keywords: ["舒尔特方格", "注意力训练", "专注力训练", "周边视觉", "舒尔特表", "脑力训练"],
        faqs: [
          { q: "支持哪些规格？", a: "从 3×3（1-9）到 8×8（1-64），建议从小规格开始，随水平提高逐渐加大。" },
          { q: "怎样才能更快？", a: "坚持练习可以提升周边视觉与视觉扫描速度。记录最佳时间并不断挑战。" },
        ],
        related: [
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Click Speed Test", zh: "点击速度测试", ja: "クリックスピードテスト", ko: "클릭 속도 테스트", ru: "Тест скорости кликов" }, href: "/tools/click-speed" },
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
        ],
        labels: { size: "方格规格", time: "用时", best: "最佳", next: "下一个" },
        buttons: { start: "开始" },
      },
      ja: {
        metaTitle: "シュルテ方格 - オンライン注意力トレーニング",
        metaDesc: "1〜Nを順番にタップして注意力と周辺視を鍛える無料ツール。ブラウザ内で完結します。",
        title: "シュルテ方格",
        description: "定番の注意力トレーニング。1〜Nが並べられた数字を昇順にできるだけ速くタップします。",
        keywords: ["シュルテ方格", "注意力トレーニング", "集中力", "周辺視野", "シュルテ表", "脳トレ"],
        faqs: [
          { q: "どんなサイズがありますか？", a: "3×3（1〜9）から8×8（1〜64）まで。小さいサイズから始めて徐々に大きくしましょう。" },
          { q: "速くなるには？", a: "継続的な練習で周辺視と走査速度が向上します。ベストタイムを更新しましょう。" },
        ],
        related: [
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Click Speed Test", zh: "点击速度测试", ja: "クリックスピードテスト", ko: "클릭 속도 테스트", ru: "Тест скорости кликов" }, href: "/tools/click-speed" },
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
        ],
        labels: { size: "サイズ", time: "時間", best: "最高", next: "次" },
        buttons: { start: "開始" },
      },
      ko: {
        metaTitle: "슐테 그리드 - 온라인 집중력 훈련",
        metaDesc: "1부터 N까지 순서대로 탭하며 주변 시야와 집중력을 훈련하는 무료 도구입니다. 브라우저에서 완료됩니다.",
        title: "슐테 그리드",
        description: "고전적인 집중력 훈련 그리드입니다. 섞인 숫자 1부터 N까지를 오름차순으로 최대한 빨리 탭하세요.",
        keywords: ["슐테 그리드", "집중력 훈련", "주의력 훈련", "주변 시야", "슐테 표", "두뇌 훈련"],
        faqs: [
          { q: "어떤 크기를 지원하나요?", a: "3×3(1-9)부터 8×8(1-64)까지. 작은 크기부터 시작해 실력에 따라 키우세요." },
          { q: "어떻게 하면 빨라지나요?", a: "꾸준한 연습으로 주변 시야와 시각 탐색 속도가 향상됩니다. 최고 기록을 경신해 보세요." },
        ],
        related: [
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Click Speed Test", zh: "点击速度测试", ja: "クリックスピードテスト", ko: "클릭 속도 테스트", ru: "Тест скорости кликов" }, href: "/tools/click-speed" },
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
        ],
        labels: { size: "그리드 크기", time: "시간", best: "최고", next: "다음" },
        buttons: { start: "시작" },
      },
      ru: {
        metaTitle: "Таблица Шульте - тренировка внимания онлайн",
        metaDesc: "Бесплатный онлайн-тренажёр Шульте. Нажимайте числа от 1 до N по возрастанию, тренируя периферийное зрение и концентрацию. Всё в браузере.",
        title: "Таблица Шульте",
        description: "Классическая таблица для тренировки внимания. Числа от 1 до N перемешаны — нажимайте их по возрастанию как можно быстрее.",
        keywords: ["таблица шульте", "тренировка внимания", "тренировка фокуса", "периферийное зрение", "тренажёр мозга", "внимание"],
        faqs: [
          { q: "Какие размеры доступны?", a: "От 3×3 (1-9) до 8×8 (1-64). Начните с маленькой и увеличивайте размер по мере прогресса." },
          { q: "Как стать быстрее?", a: "Регулярные тренировки улучшают периферийное зрение и скорость сканирования. Побивайте свой рекорд." },
        ],
        related: [
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Click Speed Test", zh: "点击速度测试", ja: "クリックスピードテスト", ko: "클릭 속도 테스트", ru: "Тест скорости кликов" }, href: "/tools/click-speed" },
          { name: { en: "Typing Speed Test", zh: "打字速度测试", ja: "タイピング速度テスト", ko: "타이핑 속도 테스트", ru: "Тест скорости печати" }, href: "/tools/typing-speed-test" },
        ],
        labels: { size: "Размер сетки", time: "Время", best: "Лучший", next: "Далее" },
        buttons: { start: "Начать" },
      },
    },
  },
];

const dir = join(process.cwd(), "scripts", "tool-data");
for (const entry of TOOLS) {
  writeFileSync(join(dir, `${entry.slug}.json`), JSON.stringify(build(entry), null, 2) + "\n", "utf8");
  console.log(`wrote ${entry.slug}.json`);
}
