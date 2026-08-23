// One-off generator: life-scene tool-data JSON (part 5: 4 tools).
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
      ...(t.modes ? { modes: t.modes } : {}),
    };
  }
  return out;
}

const TOOLS = [
  {
    slug: "text-to-image",
    icon: "🖼️",
    home: {
      en: { name: "Text to Image", description: "Render multi-line text into a PNG image." },
      zh: { name: "文字转图片", description: "将多行文字渲染为 PNG 图片。" },
      ja: { name: "テキストを画像に", description: "複数行のテキストをPNG画像に変換します。" },
      ko: { name: "텍스트를 이미지로", description: "여러 줄의 텍스트를 PNG 이미지로 변환합니다." },
      ru: { name: "Текст в картинку", description: "Превратите многострочный текст в изображение PNG." },
    },
    tools: {
      en: {
        metaTitle: "Text to Image - Render Text as PNG Online",
        metaDesc: "Free online text to image converter. Turn multi-line text into a PNG with custom font size, colors, background and padding. Runs in your browser.",
        title: "Text to Image",
        description: "Type or paste multi-line text and render it into a PNG image. Adjust font size, text color, background color and padding, then download the result.",
        keywords: ["text to image", "text to png", "text image generator", "make text image", "text poster", "quote image generator"],
        faqs: [
          { q: "What can I use this for?", a: "Making quote images, sharing snippets, or creating simple text-based graphics for social media." },
          { q: "Can I customize the look?", a: "Yes — font size, max width, padding, text color and background color are all adjustable before rendering." },
        ],
        related: [
          { name: { en: "Meme Generator", zh: "表情包生成", ja: "ミーム生成", ko: "밈 생성기", ru: "Генератор мемов" }, href: "/tools/meme-generator" },
          { name: { en: "Text Logo", zh: "文字Logo", ja: "テキストロゴ", ko: "텍스트 로고", ru: "Текстовый логотип" }, href: "/tools/text-logo" },
          { name: { en: "Image to Base64", zh: "图片转Base64", ja: "画像をBase64", ko: "이미지 Base64", ru: "Изображение в Base64" }, href: "/tools/image-to-base64" },
        ],
        labels: { placeholder: "Enter your text here…", fontSize: "Font size", maxWidth: "Max width", padding: "Padding", color: "Text color", bgColor: "Background" },
        buttons: { render: "Render Image", download: "Download PNG" },
      },
      zh: {
        metaTitle: "文字转图片 - 在线将文字渲染为 PNG",
        metaDesc: "免费在线文字转图片工具，可将多行文字渲染为 PNG 图片，支持自定义字号、颜色、背景与内边距。全程在浏览器本地完成。",
        title: "文字转图片",
        description: "输入或粘贴多行文字，渲染为 PNG 图片。可调整字号、文字颜色、背景色与内边距，最后下载结果。",
        keywords: ["文字转图片", "文字转png", "文字图片生成", "制作文字图片", "文字海报", "语录图片生成"],
        faqs: [
          { q: "这个工具有什么用？", a: "可以制作语录图片、分享文字片段，或生成简单的文字图形用于社交媒体。" },
          { q: "可以自定义样式吗？", a: "可以。字号、最大宽度、内边距、文字颜色与背景色都可在渲染前调整。" },
        ],
        related: [
          { name: { en: "Meme Generator", zh: "表情包生成", ja: "ミーム生成", ko: "밈 생성기", ru: "Генератор мемов" }, href: "/tools/meme-generator" },
          { name: { en: "Text Logo", zh: "文字Logo", ja: "テキストロゴ", ko: "텍스트 로고", ru: "Текстовый логотип" }, href: "/tools/text-logo" },
          { name: { en: "Image to Base64", zh: "图片转Base64", ja: "画像をBase64", ko: "이미지 Base64", ru: "Изображение в Base64" }, href: "/tools/image-to-base64" },
        ],
        labels: { placeholder: "在此输入文字…", fontSize: "字号", maxWidth: "最大宽度", padding: "内边距", color: "文字颜色", bgColor: "背景色" },
        buttons: { render: "渲染图片", download: "下载 PNG" },
      },
      ja: {
        metaTitle: "テキストを画像に - オンラインでPNGに変換",
        metaDesc: "複数行のテキストをPNG画像に変換する無料ツール。フォントサイズ・色・背景・余白をカスタマイズ可能。ブラウザ内で完結。",
        title: "テキストを画像に",
        description: "複数行のテキストを入力してPNG画像に変換。文字サイズ、文字色、背景色、余白を調整してダウンロードできます。",
        keywords: ["テキストを画像", "テキストからpng", "文字画像生成", "テキストポスター", "引用画像", "画像変換"],
        faqs: [
          { q: "何に使えますか？", a: "引用画像の作成、テキストの共有、SNS用のシンプルな文字画像の作成に使えます。" },
          { q: "見た目はカスタマイズできますか？", a: "はい。フォントサイズ、最大幅、余白、文字色、背景色を変換前に調整できます。" },
        ],
        related: [
          { name: { en: "Meme Generator", zh: "表情包生成", ja: "ミーム生成", ko: "밈 생성기", ru: "Генератор мемов" }, href: "/tools/meme-generator" },
          { name: { en: "Text Logo", zh: "文字Logo", ja: "テキストロゴ", ko: "텍스트 로고", ru: "Текстовый логотип" }, href: "/tools/text-logo" },
          { name: { en: "Image to Base64", zh: "图片转Base64", ja: "画像をBase64", ko: "이미지 Base64", ru: "Изображение в Base64" }, href: "/tools/image-to-base64" },
        ],
        labels: { placeholder: "ここにテキストを入力…", fontSize: "文字サイズ", maxWidth: "最大幅", padding: "余白", color: "文字色", bgColor: "背景色" },
        buttons: { render: "画像を生成", download: "PNGをダウンロード" },
      },
      ko: {
        metaTitle: "텍스트를 이미지로 - 온라인 PNG 변환",
        metaDesc: "여러 줄의 텍스트를 PNG 이미지로 변환하는 무료 도구입니다. 글꼴 크기, 색상, 배경, 여백을 조정할 수 있습니다. 브라우저에서 완료됩니다.",
        title: "텍스트를 이미지로",
        description: "여러 줄의 텍스트를 입력해 PNG 이미지로 변환합니다. 글꼴 크기, 텍스트 색상, 배경색, 여백을 조정한 뒤 다운로드할 수 있습니다.",
        keywords: ["텍스트를 이미지로", "텍스트 png", "텍스트 이미지 생성", "문구 이미지", "텍스트 포스터", "인용구 이미지"],
        faqs: [
          { q: "어디에 쓸 수 있나요?", a: "인용구 이미지, 텍스트 공유, SNS용 간단한 텍스트 그래픽을 만드는 데 사용할 수 있습니다." },
          { q: "스타일을 조정할 수 있나요?", a: "네. 글꼴 크기, 최대 너비, 여백, 텍스트 색상, 배경색을 렌더링 전에 모두 조정할 수 있습니다." },
        ],
        related: [
          { name: { en: "Meme Generator", zh: "表情包生成", ja: "ミーム生成", ko: "밈 생성기", ru: "Генератор мемов" }, href: "/tools/meme-generator" },
          { name: { en: "Text Logo", zh: "文字Logo", ja: "テキストロゴ", ko: "텍스트 로고", ru: "Текстовый логотип" }, href: "/tools/text-logo" },
          { name: { en: "Image to Base64", zh: "图片转Base64", ja: "画像をBase64", ko: "이미지 Base64", ru: "Изображение в Base64" }, href: "/tools/image-to-base64" },
        ],
        labels: { placeholder: "여기에 텍스트를 입력하세요…", fontSize: "글꼴 크기", maxWidth: "최대 너비", padding: "여백", color: "텍스트 색상", bgColor: "배경색" },
        buttons: { render: "이미지 생성", download: "PNG 다운로드" },
      },
      ru: {
        metaTitle: "Текст в картинку - конвертировать в PNG онлайн",
        metaDesc: "Бесплатный онлайн-конвертер текста в изображение. Превратите многострочный текст в PNG с настраиваемым шрифтом, цветами, фоном и полями. Всё в браузере.",
        title: "Текст в картинку",
        description: "Введите или вставьте многострочный текст и превратите его в изображение PNG. Настройте размер шрифта, цвет, фон и поля, затем скачайте результат.",
        keywords: ["текст в картинку", "текст в png", "генератор текстовых картинок", "текстовый плакат", "цитата в картинке", "текст в изображение"],
        faqs: [
          { q: "Для чего это нужно?", a: "Для создания картинок с цитатами, обмена фрагментами текста или простых текстовых графиков для соцсетей." },
          { q: "Можно ли настроить вид?", a: "Да — размер шрифта, ширина, поля, цвет текста и фона настраиваются до рендеринга." },
        ],
        related: [
          { name: { en: "Meme Generator", zh: "表情包生成", ja: "ミーム生成", ko: "밈 생성기", ru: "Генератор мемов" }, href: "/tools/meme-generator" },
          { name: { en: "Text Logo", zh: "文字Logo", ja: "テキストロゴ", ko: "텍스트 로고", ru: "Текстовый логотип" }, href: "/tools/text-logo" },
          { name: { en: "Image to Base64", zh: "图片转Base64", ja: "画像をBase64", ko: "이미지 Base64", ru: "Изображение в Base64" }, href: "/tools/image-to-base64" },
        ],
        labels: { placeholder: "Введите текст здесь…", fontSize: "Размер шрифта", maxWidth: "Ширина", padding: "Поля", color: "Цвет текста", bgColor: "Фон" },
        buttons: { render: "Создать", download: "Скачать PNG" },
      },
    },
  },
  {
    slug: "calendar",
    icon: "🗓️",
    home: {
      en: { name: "Year Calendar", description: "Generate a full-year calendar as an image." },
      zh: { name: "全年日历", description: "生成全年日历图片，可下载打印。" },
      ja: { name: "年間カレンダー", description: "1年分のカレンダー画像を生成します。" },
      ko: { name: "연간 달력", description: "1년치 달력 이미지를 생성합니다." },
      ru: { name: "Годовой календарь", description: "Создайте календарь на весь год в виде изображения." },
    },
    tools: {
      en: {
        metaTitle: "Year Calendar - Generate a Full-Year Calendar Image",
        metaDesc: "Free online year calendar generator. Render a full year (12 months) as a printable PNG image with weekends highlighted. Runs in your browser.",
        title: "Year Calendar",
        description: "Pick a year and render all 12 months on a single canvas. Weekends are highlighted, and you can download the calendar as a PNG image.",
        keywords: ["year calendar", "calendar generator", "printable calendar", "2026 calendar", "full year calendar", "calendar image"],
        faqs: [
          { q: "Can I choose any year?", a: "Yes — enter any year and the tool builds the correct month layouts, including leap years." },
          { q: "Can I print it?", a: "Yes. Download the PNG and print it, or use it as a wallpaper or planner insert." },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
        ],
        labels: {},
        buttons: { render: "Render Calendar", download: "Download PNG" },
      },
      zh: {
        metaTitle: "全年日历 - 在线生成全年日历图片",
        metaDesc: "免费在线全年日历生成器，将 12 个月渲染为一张 PNG 图片，周末高亮，可下载打印。全程在浏览器本地完成。",
        title: "全年日历",
        description: "选择年份，将全年 12 个月绘制在同一张画布上。周末高亮显示，可下载为 PNG 图片。",
        keywords: ["全年日历", "日历生成器", "打印日历", "年历", "日历图片", "电子日历"],
        faqs: [
          { q: "可以选任意年份吗？", a: "可以。输入任意年份即可自动生成正确的月份布局，包含闰年处理。" },
          { q: "可以打印吗？", a: "可以。下载 PNG 后即可打印，也可以用作壁纸或计划表。" },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
        ],
        labels: {},
        buttons: { render: "生成日历", download: "下载 PNG" },
      },
      ja: {
        metaTitle: "年間カレンダー - オンラインでカレンダー画像を生成",
        metaDesc: "12ヶ月分を1枚のPNG画像に描画する無料の年間カレンダー生成ツール。週末を強調表示。ブラウザ内で完結。",
        title: "年間カレンダー",
        description: "年を選ぶと12ヶ月すべてを1枚のキャンバスに描画します。週末を強調表示し、PNG画像としてダウンロードできます。",
        keywords: ["年間カレンダー", "カレンダー生成", "印刷用カレンダー", "年カレンダー", "カレンダー画像", "無料カレンダー"],
        faqs: [
          { q: "任意の年を選べますか？", a: "はい。任意の年を入力すれば、うるう年を含めて正しい月レイアウトを作成します。" },
          { q: "印刷できますか？", a: "はい。PNGをダウンロードして印刷したり、壁紙やプランナーとして使えます。" },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
        ],
        labels: {},
        buttons: { render: "カレンダーを生成", download: "PNGをダウンロード" },
      },
      ko: {
        metaTitle: "연간 달력 - 온라인 달력 이미지 생성",
        metaDesc: "12개월을 한 장의 PNG 이미지로 그리는 무료 연간 달력 생성기입니다. 주말을 강조하며 브라우저에서 완료됩니다.",
        title: "연간 달력",
        description: "연도를 선택하면 12개월 전체를 하나의 캔버스에 렌더링합니다. 주말이 강조되며 PNG 이미지로 다운로드할 수 있습니다.",
        keywords: ["연간 달력", "달력 생성기", "인쇄용 달력", "달력 이미지", "전체 달력", "무료 달력"],
        faqs: [
          { q: "원하는 연도를 선택할 수 있나요?", a: "네. 어떤 연도든 입력하면 윤년을 포함해 올바른 달력 레이아웃이 만들어집니다." },
          { q: "인쇄할 수 있나요?", a: "네. PNG를 다운로드해 인쇄하거나 배경화면, 플래너로 사용할 수 있습니다." },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
        ],
        labels: {},
        buttons: { render: "달력 생성", download: "PNG 다운로드" },
      },
      ru: {
        metaTitle: "Годовой календарь - сгенерировать изображение на весь год",
        metaDesc: "Бесплатный онлайн-генератор годового календаря. 12 месяцев на одном холсте в PNG с выделенными выходными. Всё в браузере.",
        title: "Годовой календарь",
        description: "Выберите год и отрисуйте все 12 месяцев на одном холсте. Выходные выделены, календарь скачивается в формате PNG.",
        keywords: ["годовой календарь", "генератор календаря", "печатный календарь", "календарь на год", "изображение календаря", "календарь онлайн"],
        faqs: [
          { q: "Можно выбрать любой год?", a: "Да — введите любой год, и инструмент построит правильную раскладку месяцев, включая високосные годы." },
          { q: "Можно распечатать?", a: "Да. Скачайте PNG и распечатайте или используйте как обои и планировщик." },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
        ],
        labels: {},
        buttons: { render: "Создать календарь", download: "Скачать PNG" },
      },
    },
  },
  {
    slug: "day-of-week",
    icon: "📆",
    home: {
      en: { name: "Day of Week", description: "Find which weekday any date falls on." },
      zh: { name: "星期查询", description: "查询任意日期是星期几。" },
      ja: { name: "曜日計算", description: "任意の日付が何曜日かを調べます。" },
      ko: { name: "요일 계산", description: "어떤 날짜가 무슨 요일인지 확인합니다." },
      ru: { name: "День недели", description: "Узнайте, на какой день недели выпадает дата." },
    },
    tools: {
      en: {
        metaTitle: "Day of Week - What Day Is That Date?",
        metaDesc: "Free online day of week calculator. Pick any date and instantly see the weekday, including historical or future dates. Runs in your browser.",
        title: "Day of Week",
        description: "Pick any date and find out which day of the week it falls on — today, a past birthday, or a future holiday.",
        keywords: ["day of week", "what day is it", "weekday calculator", "date weekday", "what day is that date", "calendar day"],
        faqs: [
          { q: "Can I check historical dates?", a: "Yes — any date works, from ancient history to far in the future." },
          { q: "Does it handle leap years?", a: "Yes, the calculation uses the Gregorian calendar rules including leap years." },
        ],
        related: [
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Year Calendar", zh: "全年日历", ja: "年間カレンダー", ko: "연간 달력", ru: "Годовой календарь" }, href: "/tools/calendar" },
        ],
        labels: { result: "This date is a" },
        buttons: { calculate: "Calculate" },
      },
      zh: {
        metaTitle: "星期查询 - 任意日期是星期几",
        metaDesc: "免费在线星期查询工具，选择任意日期即可立即查看它是星期几，支持历史与未来日期。全程在浏览器本地完成。",
        title: "星期查询",
        description: "选择任意日期，即可查看它是星期几——无论是今天、过去的生日，还是未来的节日。",
        keywords: ["星期查询", "星期几", "星期计算", "日期星期", "查询星期", "日历星期"],
        faqs: [
          { q: "可以查询历史日期吗？", a: "可以。任意日期都支持，从古代到遥远的未来都可以。" },
          { q: "闰年处理正确吗？", a: "正确。计算使用格里高利历规则，包含闰年处理。" },
        ],
        related: [
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Year Calendar", zh: "全年日历", ja: "年間カレンダー", ko: "연간 달력", ru: "Годовой календарь" }, href: "/tools/calendar" },
        ],
        labels: { result: "这一天是" },
        buttons: { calculate: "查询" },
      },
      ja: {
        metaTitle: "曜日計算 - その日付は何曜日？",
        metaDesc: "任意の日付の曜日を即座に調べられる無料ツール。過去・未来の日付に対応。ブラウザ内で完結。",
        title: "曜日計算",
        description: "任意の日付が何曜日かを確認できます。今日、過去の誕生日、未来の祝日にも対応。",
        keywords: ["曜日計算", "何曜日", "曜日調べ", "日付の曜日", "カレンダー", "曜日変換"],
        faqs: [
          { q: "過去の日付も調べられますか？", a: "はい。古代から遠い未来まで、どの日付でも対応します。" },
          { q: "うるう年は考慮されますか？", a: "はい。グレゴリオ暦の規則に従い、うるう年も正しく処理されます。" },
        ],
        related: [
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Year Calendar", zh: "全年日历", ja: "年間カレンダー", ko: "연간 달력", ru: "Годовой календарь" }, href: "/tools/calendar" },
        ],
        labels: { result: "この日は" },
        buttons: { calculate: "計算" },
      },
      ko: {
        metaTitle: "요일 계산 - 그 날짜는 무슨 요일?",
        metaDesc: "원하는 날짜의 요일을 즉시 확인하는 무료 도구입니다. 과거와 미래 날짜를 모두 지원하며 브라우저에서 완료됩니다.",
        title: "요일 계산",
        description: "원하는 날짜가 무슨 요일인지 확인하세요. 오늘, 지난 생일, 다가올 공휴일 등 모든 날짜를 지원합니다.",
        keywords: ["요일 계산", "무슨 요일", "요일 확인", "날짜 요일", "요일 찾기", "달력 요일"],
        faqs: [
          { q: "과거 날짜도 확인할 수 있나요?", a: "네. 고대부터 먼 미래까지 모든 날짜를 지원합니다." },
          { q: "윤년은 처리되나요?", a: "네. 그레고리력 규칙에 따라 윤년을 올바르게 처리합니다." },
        ],
        related: [
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Year Calendar", zh: "全年日历", ja: "年間カレンダー", ko: "연간 달력", ru: "Годовой календарь" }, href: "/tools/calendar" },
        ],
        labels: { result: "이 날짜는" },
        buttons: { calculate: "계산" },
      },
      ru: {
        metaTitle: "День недели - какой день недели у даты",
        metaDesc: "Бесплатный онлайн-калькулятор дня недели. Выберите дату и мгновенно узнайте день недели — для прошлых и будущих дат. Всё в браузере.",
        title: "День недели",
        description: "Выберите любую дату и узнайте, на какой день недели она выпадает — сегодня, прошедший день рождения или будущий праздник.",
        keywords: ["день недели", "какой день", "калькулятор дня недели", "день недели по дате", "календарь", "узнать день недели"],
        faqs: [
          { q: "Можно ли проверить исторические даты?", a: "Да — работает любая дата, от глубокой древности до далёкого будущего." },
          { q: "Учитываются ли високосные годы?", a: "Да, расчёт по правилам григорианского календаря, включая високосные годы." },
        ],
        related: [
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Year Calendar", zh: "全年日历", ja: "年間カレンダー", ko: "연간 달력", ru: "Годовой календарь" }, href: "/tools/calendar" },
        ],
        labels: { result: "Эта дата —" },
        buttons: { calculate: "Вычислить" },
      },
    },
  },
  {
    slug: "date-calculator",
    icon: "🧮",
    home: {
      en: { name: "Date Calculator", description: "Calculate the difference between dates or add days." },
      zh: { name: "日期计算器", description: "计算日期差或推算加天后的日期。" },
      ja: { name: "日付計算", description: "日付の差や加算日数を計算します。" },
      ko: { name: "날짜 계산", description: "날짜 차이 또는 날짜 더하기를 계산합니다." },
      ru: { name: "Калькулятор дат", description: "Считайте разницу между датами или прибавляйте дни." },
    },
    tools: {
      en: {
        metaTitle: "Date Calculator - Date Difference and Add Days",
        metaDesc: "Free online date calculator. Compute the number of days, weeks and months between two dates, or add/subtract days to a date. Runs in your browser.",
        title: "Date Calculator",
        description: "Two handy modes: calculate the difference between two dates in days, weeks and months, or add (or subtract) a number of days to a given date.",
        keywords: ["date calculator", "days between dates", "date difference", "add days to date", "date add subtract", "days calculator"],
        faqs: [
          { q: "How are months calculated?", a: "Months use the average month length (~30.44 days), which is accurate for planning purposes." },
          { q: "Can I subtract days?", a: "Yes — enter a negative number of days to go backwards from the start date." },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Expiration Date", zh: "保质期计算", ja: "賞味期限計算", ko: "유통기한 계산", ru: "Срок годности" }, href: "/tools/expiration" },
        ],
        labels: { days: "days", weeks: "weeks", months: "months" },
        buttons: { calculate: "Calculate" },
        modes: { diff: "Difference", add: "Add Days" },
      },
      zh: {
        metaTitle: "日期计算器 - 日期差与日期推算",
        metaDesc: "免费在线日期计算器：计算两个日期相差的天数、周数与月数，或给指定日期加/减天数。全程在浏览器本地完成。",
        title: "日期计算器",
        description: "两种实用模式：计算两个日期之间相差的天数、周数和月数；或为指定日期加上（减去）若干天。",
        keywords: ["日期计算器", "日期差", "天数计算", "日期推算", "加天数", "计算日期"],
        faqs: [
          { q: "月数是怎么计算的？", a: "月数按平均月长（约 30.44 天）计算，用于规划场景足够准确。" },
          { q: "可以减去天数吗？", a: "可以。输入负数天数即可从起始日期向前推算。" },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Expiration Date", zh: "保质期计算", ja: "賞味期限計算", ko: "유통기한 계산", ru: "Срок годности" }, href: "/tools/expiration" },
        ],
        labels: { days: "天", weeks: "周", months: "个月" },
        buttons: { calculate: "计算" },
        modes: { diff: "日期差", add: "加天数" },
      },
      ja: {
        metaTitle: "日付計算 - 日付の差と日数加算",
        metaDesc: "2つの日付の差（日・週・月）や、日付への加算・減算ができる無料ツール。ブラウザ内で完結。",
        title: "日付計算",
        description: "2つのモード：日付間の差を日・週・月で計算するか、指定日付に日数を加算（減算）します。",
        keywords: ["日付計算", "日数計算", "日付の差", "日数加算", "日付加算", "カレンダー計算"],
        faqs: [
          { q: "月数はどう計算されますか？", a: "平均の月長（約30.44日）で計算するため、計画用途には十分正確です。" },
          { q: "日数を減算できますか？", a: "はい。負の日数を入力すると開始日から遡って計算します。" },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Expiration Date", zh: "保质期计算", ja: "賞味期限計算", ko: "유통기한 계산", ru: "Срок годности" }, href: "/tools/expiration" },
        ],
        labels: { days: "日", weeks: "週", months: "ヶ月" },
        buttons: { calculate: "計算" },
        modes: { diff: "差を計算", add: "日数を加算" },
      },
      ko: {
        metaTitle: "날짜 계산 - 날짜 차이와 더하기",
        metaDesc: "두 날짜 사이의 차이(일·주·월) 또는 날짜 더하기/빼기를 계산하는 무료 도구입니다. 브라우저에서 완료됩니다.",
        title: "날짜 계산",
        description: "두 가지 모드: 두 날짜 사이의 차이를 일·주·월로 계산하거나, 지정된 날짜에 일 수를 더하거나 뺍니다.",
        keywords: ["날짜 계산", "날짜 차이", "일수 계산", "날짜 더하기", "날짜 계산기", "디데이 계산"],
        faqs: [
          { q: "월은 어떻게 계산되나요?", a: "평균 월 길이(약 30.44일)로 계산해 계획 용도로 충분히 정확합니다." },
          { q: "일 수를 뺄 수 있나요?", a: "네. 음수 일 수를 입력하면 시작 날짜에서 거슬러 계산합니다." },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Expiration Date", zh: "保质期计算", ja: "賞味期限計算", ko: "유통기한 계산", ru: "Срок годности" }, href: "/tools/expiration" },
        ],
        labels: { days: "일", weeks: "주", months: "개월" },
        buttons: { calculate: "계산" },
        modes: { diff: "차이", add: "날짜 더하기" },
      },
      ru: {
        metaTitle: "Калькулятор дат - разница и прибавление дней",
        metaDesc: "Бесплатный онлайн-калькулятор дат. Считайте разницу между датами в днях, неделях и месяцах или прибавляйте дни к дате. Всё в браузере.",
        title: "Калькулятор дат",
        description: "Два удобных режима: разница между двумя датами в днях, неделях и месяцах, либо прибавление (вычитание) дней к дате.",
        keywords: ["калькулятор дат", "дней между датами", "разница дат", "прибавить дни", "сложение дат", "счётчик дней"],
        faqs: [
          { q: "Как считаются месяцы?", a: "Месяцы считаются по средней длине месяца (~30,44 дня), чего достаточно для планирования." },
          { q: "Можно ли вычитать дни?", a: "Да — введите отрицательное число дней, чтобы идти назад от начальной даты." },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Expiration Date", zh: "保质期计算", ja: "賞味期限計算", ko: "유통기한 계산", ru: "Срок годности" }, href: "/tools/expiration" },
        ],
        labels: { days: "дней", weeks: "недель", months: "месяцев" },
        buttons: { calculate: "Вычислить" },
        modes: { diff: "Разница", add: "Прибавить дни" },
      },
    },
  },
];

const dir = join(process.cwd(), "scripts", "tool-data");
for (const entry of TOOLS) {
  writeFileSync(join(dir, `${entry.slug}.json`), JSON.stringify(build(entry), null, 2) + "\n", "utf8");
  console.log(`wrote ${entry.slug}.json`);
}
