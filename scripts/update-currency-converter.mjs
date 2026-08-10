// One-off: inject the currency-converter tool translations into all locale files.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, "..", "messages");

const LANGS = ["en", "zh", "ja", "ko"];
const SLUG = "currency-converter";
const RELATED = [
  "unit-converter",
  "percentage-calculator",
  "discount-calculator",
  "salary-calculator",
];

const home = {
  en: { name: "Currency Converter", description: "Convert between 40+ currencies with live exchange rates. Free & private.", category: "Utilities", icon: "💱" },
  zh: { name: "汇率换算工具", description: "40+ 种货币实时汇率换算，支持离线备用汇率，免费使用。", category: "实用工具", icon: "💱" },
  ja: { name: "通貨換算", description: "40以上の通貨をリアルタイム為替レートで換算。オフライン対応の無料ツール。", category: "ユーティリティ", icon: "💱" },
  ko: { name: "환율 계산기", description: "40개 이상 통화를 실시간 환율로 변환. 오프라인 대체 지원 무료 도구.", category: "유틸리티", icon: "💱" },
};

const guideTitles = {
  en: { whatIs: "What is a currency converter?", howTo: "How to use", howToIntro: "Three steps:", tips: "Tips" },
  zh: { whatIs: "什么是汇率换算工具？", howTo: "使用方法", howToIntro: "三步完成：", tips: "小提示" },
  ja: { whatIs: "通貨換算ツールとは？", howTo: "使い方", howToIntro: "3ステップ：", tips: "ヒント" },
  ko: { whatIs: "환율 계산기란?", howTo: "사용 방법", howToIntro: "3단계로 완료:", tips: "팁" },
};

const D = {
  en: {
    metaTitle: "Currency Converter - Free Online Tool",
    metaDesc: "Free online currency converter with live exchange rates for 40+ currencies. No signup required — works offline with built-in fallback rates.",
    title: "Currency Converter",
    desc: "Convert between 40+ world currencies with live exchange rates. Everything happens right in your browser — no signup, no data sent to us.",
    category: "Utilities",
    keywords: ["currency converter", "exchange rate", "currency exchange", "money converter", "forex", "FX converter"],
    whatIs: "This tool converts any amount between 40+ world currencies using live exchange rates. Rates are fetched from free public APIs when you open the page; if the network is unavailable, built-in rates are used instead so the tool keeps working offline.",
    howTo: ["Enter the amount you want to convert.", "Choose the source currency (From) and target currency (To).", "Read the converted amount and the unit rate instantly — no button needed."],
    tips: ["Use the Swap button to flip the currencies — the amount is carried over automatically.", "The offline fallback is a snapshot and may be stale; prefer live rates when accuracy matters.", "Rates refresh each time you open the page."],
    faqs: [
      ["How often are the exchange rates updated?", "Rates are fetched from free public APIs (European Central Bank data via frankfurter.app, or open.er-api.com) each time the page loads. ECB rates update once per working day; open.er-api updates daily."],
      ["Does it still work offline?", "Yes. If every live API is unreachable, the tool falls back to built-in snapshot rates so you can still convert — just note they may be out of date."],
      ["Which currencies are supported?", "Over 40 major currencies, including USD, EUR, GBP, JPY, CNY, HKD, KRW and many more."],
      ["Is my data sent to a server?", "No. The amount you enter is only processed in your browser. The only network request is to fetch public exchange rates."],
    ],
    labels: {
      amount: "Amount",
      from: "From",
      to: "To",
      swap: "Swap",
      result: "Converted amount",
      lastUpdate: "Last updated",
      live: "Live rates",
      offline: "Offline: using built-in rates, which may be out of date",
      loading: "Loading rates…",
      popularTitle: "{currency} cross-rates",
    },
  },
  zh: {
    metaTitle: "汇率换算工具 - 免费在线工具",
    metaDesc: "免费在线汇率换算：支持 40+ 种货币实时汇率，无需注册，断网时自动使用内置汇率备用。",
    title: "汇率换算工具",
    desc: "支持 40+ 种世界主要货币的实时汇率换算，全程在浏览器本地完成，无需注册，断网时自动回退到内置汇率。",
    category: "实用工具",
    keywords: ["汇率换算", "汇率转换", "货币换算", "货币转换", "外汇", "汇率计算", "汇率查询"],
    whatIs: "本工具使用实时汇率，在 40+ 种世界主要货币之间自由换算。打开页面时会自动从免费公开汇率 API 获取最新数据；若无法联网，则自动改用内置汇率表，保证离线也能用。",
    howTo: ["输入要换算的金额。", "选择原币种（从）和目标币种（到）。", "立即查看换算结果与单币汇率，无需点击任何按钮。"],
    tips: ["点击\u201c交换\u201d可快速互换币种，金额会自动带入。", "离线备用汇率是快照数据，可能过时；对精度要求高时请使用实时汇率。", "每次打开页面都会重新获取最新汇率。"],
    faqs: [
      ["汇率多久更新一次？", "每次打开页面都会从免费公开汇率 API（欧洲央行数据的 frankfurter.app 或 open.er-api.com）获取最新数据。欧洲央行数据每个工作日更新一次，open.er-api 每天更新。"],
      ["断网时还能用吗？", "可以。当所有实时 API 都无法访问时，工具会自动使用内置的快照汇率继续换算，但请注意该数据可能已过时。"],
      ["支持哪些货币？", "支持 40+ 种主要货币，包括美元、欧元、英镑、日元、人民币、港币、韩元等。"],
      ["我的数据会被上传吗？", "不会。你输入的金额只在浏览器本地计算，唯一的网络请求是获取公开汇率数据。"],
    ],
    labels: {
      amount: "金额",
      from: "从",
      to: "到",
      swap: "交换",
      result: "换算结果",
      lastUpdate: "更新时间",
      live: "实时汇率",
      offline: "离线模式：使用内置汇率，可能已过时",
      loading: "正在获取汇率…",
      popularTitle: "{currency} 常见货币汇率",
    },
  },
  ja: {
    metaTitle: "通貨換算ツール - 無料オンラインツール",
    metaDesc: "40以上の通貨をリアルタイム為替レートで換算できる無料ツール。登録不要、オフライン時は内蔵レートで自動代替。",
    title: "通貨換算ツール",
    desc: "世界の主要40以上の通貨をリアルタイム為替レートで換算。ブラウザ内で完結し、オフライン時は内蔵レートに自動フォールバック。",
    category: "ユーティリティ",
    keywords: ["為替レート", "通貨換算", "両替", "為替換算", "FX", "レート計算"],
    whatIs: "世界の主要40以上の通貨をリアルタイム為替レートで換算します。ページを開くと無料の為替APIから最新レートを取得。オフライン時は内蔵レートに自動で切り替わります。",
    howTo: ["換算したい金額を入力します。", "変換元（From）と変換先（To）の通貨を選択します。", "換算結果と単価レートが即座に表示されます。"],
    tips: ["「入れ替え」で通貨を即座に入れ替えられます（金額は自動で引き継ぎ）。", "オフラインの内蔵レートはスナップショットで古い可能性があります。精度が重要な場合はリアルタイムレートをご利用ください。", "ページを開くたびに最新レートを取得します。"],
    faqs: [
      ["為替レートはどれくらいの頻度で更新されますか？", "ページを開くたびに無料の公開API（欧州中央銀行データの frankfurter.app または open.er-api.com）から最新レートを取得します。ECBデータは営業日ごと、open.er-api は毎日更新されます。"],
      ["オフラインでも使えますか？", "はい。すべてのAPIに接続できない場合は内蔵のスナップショットレートに自動フォールバックします。ただし古い値の可能性がある点にご注意ください。"],
      ["対応している通貨は？", "USD、EUR、GBP、JPY、CNY、HKD、KRW など、世界の主要40以上の通貨に対応しています。"],
      ["データはサーバーに送信されますか？", "いいえ。入力した金額はブラウザ内でのみ処理されます。ネットワーク通信は公開為替レートの取得のみです。"],
    ],
    labels: {
      amount: "金額",
      from: "変換元",
      to: "変換先",
      swap: "入れ替え",
      result: "換算結果",
      lastUpdate: "更新日時",
      live: "リアルタイム",
      offline: "オフライン：内蔵レートを使用中（古い可能性あり）",
      loading: "レート取得中…",
      popularTitle: "{currency} の主要通貨レート",
    },
  },
  ko: {
    metaTitle: "환율 계산기 - 무료 온라인 도구",
    metaDesc: "40개 이상 통화를 실시간 환율로 변환하는 무료 도구. 회원가입 불필요, 오프라인 시 내장 환율로 자동 대체.",
    title: "환율 계산기",
    desc: "세계 주요 40개 이상 통화를 실시간 환율로 변환합니다. 브라우저에서 모든 처리가 완료되며 오프라인 시 내장 환율로 자동 대체됩니다.",
    category: "유틸리티",
    keywords: ["환율 계산", "환율 변환", "통화 변환", "환전", "환율 조회", "외환"],
    whatIs: "실시간 환율로 세계 주요 40개 이상 통화 간 환산을 지원합니다. 페이지를 열면 무료 공개 환율 API에서 최신 데이터를 가져오며, 오프라인일 땐 내장 환율로 자동 대체됩니다.",
    howTo: ["환산할 금액을 입력합니다.", "출발 통화와 도착 통화를 선택합니다.", "환산 결과와 단위 환율이 즉시 표시됩니다."],
    tips: ["'바꾸기' 버튼으로 통화를 즉시 맞바꿀 수 있으며 금액도 자동으로 전달됩니다.", "오프라인 내장 환율은 스냅샷이라 오래된 값일 수 있습니다. 정확도가 중요하면 실시간 환율을 사용하세요.", "페이지를 열 때마다 최신 환율을 불러옵니다."],
    faqs: [
      ["환율은 얼마나 자주 업데이트되나요?", "페이지를 열 때마다 무료 공개 API(유럽중앙은행 데이터 기반 frankfurter.app 또는 open.er-api.com)에서 최신 환율을 가져옵니다. ECB 데이터는 영업일마다, open.er-api는 매일 업데이트됩니다."],
      ["오프라인에서도 사용할 수 있나요?", "네. 모든 실시간 API에 접속할 수 없으면 내장 스냅샷 환율로 자동 대체되어 계속 변환할 수 있지만, 값이 오래되었을 수 있습니다."],
      ["어떤 통화를 지원하나요?", "USD, EUR, GBP, JPY, CNY, HKD, KRW 등 세계 주요 40개 이상의 통화를 지원합니다."],
      ["데이터가 서버로 전송되나요?", "아니요. 입력한 금액은 브라우저에서만 처리되며, 유일한 네트워크 요청은 공개 환율 데이터를 가져오는 것뿐입니다."],
    ],
    labels: {
      amount: "금액",
      from: "출발 통화",
      to: "도착 통화",
      swap: "바꾸기",
      result: "환산 결과",
      lastUpdate: "업데이트 시각",
      live: "실시간 환율",
      offline: "오프라인: 내장 환율 사용 중(오래된 값일 수 있음)",
      loading: "환율 불러오는 중…",
      popularTitle: "{currency} 주요 통화 환율",
    },
  },
};

const CURRENCY_NAMES = {
  en: {
    usd: "US Dollar", eur: "Euro", gbp: "British Pound", jpy: "Japanese Yen",
    cny: "Chinese Yuan", hkd: "Hong Kong Dollar", aud: "Australian Dollar",
    cad: "Canadian Dollar", chf: "Swiss Franc", krw: "South Korean Won",
    inr: "Indian Rupee", sgd: "Singapore Dollar", nzd: "New Zealand Dollar",
    sek: "Swedish Krona", nok: "Norwegian Krone", dkk: "Danish Krone",
    pln: "Polish Zloty", czk: "Czech Koruna", huf: "Hungarian Forint",
    try: "Turkish Lira", brl: "Brazilian Real", mxn: "Mexican Peso",
    zar: "South African Rand", aed: "UAE Dirham", sar: "Saudi Riyal",
    thb: "Thai Baht", myr: "Malaysian Ringgit", idr: "Indonesian Rupiah",
    php: "Philippine Peso", vnd: "Vietnamese Dong", rub: "Russian Ruble",
    twd: "New Taiwan Dollar", ils: "Israeli Shekel", clp: "Chilean Peso",
    cop: "Colombian Peso", ars: "Argentine Peso", egp: "Egyptian Pound",
    ngn: "Nigerian Naira", pkr: "Pakistani Rupee", bdt: "Bangladeshi Taka",
    uah: "Ukrainian Hryvnia", kzt: "Kazakhstani Tenge",
  },
  zh: {
    usd: "美元", eur: "欧元", gbp: "英镑", jpy: "日元",
    cny: "人民币", hkd: "港币", aud: "澳元",
    cad: "加元", chf: "瑞士法郎", krw: "韩元",
    inr: "印度卢比", sgd: "新加坡元", nzd: "新西兰元",
    sek: "瑞典克朗", nok: "挪威克朗", dkk: "丹麦克朗",
    pln: "波兰兹罗提", czk: "捷克克朗", huf: "匈牙利福林",
    try: "土耳其里拉", brl: "巴西雷亚尔", mxn: "墨西哥比索",
    zar: "南非兰特", aed: "阿联酋迪拉姆", sar: "沙特里亚尔",
    thb: "泰铢", myr: "马来西亚林吉特", idr: "印尼盾",
    php: "菲律宾比索", vnd: "越南盾", rub: "俄罗斯卢布",
    twd: "新台币", ils: "以色列谢克尔", clp: "智利比索",
    cop: "哥伦比亚比索", ars: "阿根廷比索", egp: "埃及镑",
    ngn: "尼日利亚奈拉", pkr: "巴基斯坦卢比", bdt: "孟加拉塔卡",
    uah: "乌克兰格里夫纳", kzt: "哈萨克斯坦坚戈",
  },
  ja: {
    usd: "米ドル", eur: "ユーロ", gbp: "英ポンド", jpy: "日本円",
    cny: "人民元", hkd: "香港ドル", aud: "豪ドル",
    cad: "カナダドル", chf: "スイスフラン", krw: "韓国ウォン",
    inr: "インドルピー", sgd: "シンガポールドル", nzd: "NZドル",
    sek: "スウェーデンクローナ", nok: "ノルウェークローネ", dkk: "デンマーククローネ",
    pln: "ポーランドズウォティ", czk: "チェココルナ", huf: "ハンガリーフォリント",
    try: "トルコリラ", brl: "ブラジルレアル", mxn: "メキシコペソ",
    zar: "南アフリカランド", aed: "UAEディルハム", sar: "サウジリヤル",
    thb: "タイバーツ", myr: "マレーシアリンギット", idr: "インドネシアルピア",
    php: "フィリピンペソ", vnd: "ベトナムドン", rub: "ロシアルーブル",
    twd: "台湾ドル", ils: "イスラエルシェケル", clp: "チリペソ",
    cop: "コロンビアペソ", ars: "アルゼンチンペソ", egp: "エジプトポンド",
    ngn: "ナイジェリアナイラ", pkr: "パキスタンルピー", bdt: "バングラデシュタカ",
    uah: "ウクライナフリヴニャ", kzt: "カザフスタンテンゲ",
  },
  ko: {
    usd: "미국 달러", eur: "유로", gbp: "영국 파운드", jpy: "일본 엔",
    cny: "중국 위안", hkd: "홍콩 달러", aud: "호주 달러",
    cad: "캐나다 달러", chf: "스위스 프랑", krw: "대한민국 원",
    inr: "인도 루피", sgd: "싱가포르 달러", nzd: "뉴질랜드 달러",
    sek: "스웨덴 크로나", nok: "노르웨이 크로네", dkk: "덴마크 크로네",
    pln: "폴란드 즈워티", czk: "체코 코루나", huf: "헝가리 포린트",
    try: "튀르키예 리라", brl: "브라질 헤알", mxn: "멕시코 페소",
    zar: "남아프리카 랜드", aed: "아랍에미리트 디르함", sar: "사우디 리얄",
    thb: "태국 밧", myr: "말레이시아 링깃", idr: "인도네시아 루피아",
    php: "필리핀 페소", vnd: "베트남 동", rub: "러시아 루블",
    twd: "대만 달러", ils: "이스라엘 셰켈", clp: "칠레 페소",
    cop: "콜롬비아 페소", ars: "아르헨티나 페소", egp: "이집트 파운드",
    ngn: "나이지리아 나이라", pkr: "파키스탄 루피", bdt: "방글라데시 타카",
    uah: "우크라이나 흐리브냐", kzt: "카자흐스탄 텡게",
  },
};

for (const lang of LANGS) {
  const file = join(messagesDir, `${lang}.json`);
  const data = JSON.parse(readFileSync(file, "utf8"));

  data.home.tools[SLUG] = home[lang];

  const d = D[lang];
  const g = guideTitles[lang];
  data.tools[SLUG] = {
    metadata: { title: d.metaTitle, description: d.metaDesc },
    title: d.title,
    description: d.desc,
    category: d.category,
    keywords: d.keywords,
    guide: {
      whatIs: { title: g.whatIs, body: [d.whatIs] },
      howTo: { title: g.howTo, intro: g.howToIntro, items: d.howTo },
      tips: { title: g.tips, items: d.tips },
    },
    faqs: d.faqs.map(([q, a]) => ({ question: q, answer: a })),
    relatedTools: RELATED.map((s) => ({
      name: data.home.tools[s]?.name ?? s,
      href: `/tools/${s}`,
    })),
    labels: d.labels,
    currencies: CURRENCY_NAMES[lang],
  };

  if (data.home.heroBadge && data.home.heroBadge.includes("213")) {
    data.home.heroBadge = data.home.heroBadge.replace("213", "214");
  }

  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`updated ${lang}`);
}
