// One-off generator: life-scene tool-data JSON (part 4: 4 tools).
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
    slug: "hearing-test",
    icon: "👂",
    home: {
      en: { name: "Hearing Test", description: "Find the highest frequency your ears can hear." },
      zh: { name: "听力测试", description: "测试你的耳朵能听到的最高频率。" },
      ja: { name: "聴力テスト", description: "聞こえる最高周波数を調べます。" },
      ko: { name: "청력 테스트", description: "귀로 들을 수 있는 최고 주파수를 확인합니다." },
      ru: { name: "Тест слуха", description: "Узнайте самую высокую частоту, которую слышат ваши уши." },
    },
    tools: {
      en: {
        metaTitle: "Hearing Test - Find Your Highest Audible Frequency",
        metaDesc: "Free online hearing test. Play pure tones from 125 Hz to 16 kHz and find the highest frequency you can hear. Use headphones for best results. Runs in your browser.",
        title: "Hearing Test",
        description: "Play pure tones across 9 frequencies from 125 Hz to 16 kHz. Mark which ones you hear to find the highest audible frequency for your ears.",
        keywords: ["hearing test", "frequency test", "hearing range", "pure tone test", "audible frequency", "ear test"],
        faqs: [
          { q: "How should I take this test?", a: "Use headphones in a quiet room, and keep the volume comfortable — never too loud. Play each frequency and honestly mark what you hear." },
          { q: "Is this a medical hearing test?", a: "No. It is a quick self-check of your audible frequency range. Please see an audiologist for a professional evaluation." },
        ],
        related: [
          { name: { en: "Color Blindness Test", zh: "色盲测试", ja: "色覚テスト", ko: "색각 이상 테스트", ru: "Тест на дальтонизм" }, href: "/tools/color-blindness-test" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Frequency Tone Generator", zh: "频率发生器", ja: "周波数発生器", ko: "주파수 발생기", ru: "Генератор частот" }, href: "/tools/hz" },
        ],
        labels: { range: "Highest audible frequency", hint: "Use headphones in a quiet room" },
        buttons: { heard: "I heard it", notHeard: "Can't hear it" },
      },
      zh: {
        metaTitle: "听力测试 - 测出你的最高可听频率",
        metaDesc: "免费在线听力测试：播放 125Hz 到 16kHz 的纯音，找出你能听到的最高频率。建议佩戴耳机测试。全程在浏览器本地完成。",
        title: "听力测试",
        description: "播放 125Hz 到 16kHz 共 9 个频率的纯音，标记能听到的频率，找出你的耳朵可听到的最高频率。",
        keywords: ["听力测试", "频率测试", "听力范围", "纯音测试", "可听频率", "耳朵测试"],
        faqs: [
          { q: "应该如何测试？", a: "在安静环境佩戴耳机，音量保持舒适、切勿过大。逐个播放频率并如实标记是否听到。" },
          { q: "这是医学听力测试吗？", a: "不是。它只是可听频率范围的快速自测，专业评估请咨询听力专家。" },
        ],
        related: [
          { name: { en: "Color Blindness Test", zh: "色盲测试", ja: "色覚テスト", ko: "색각 이상 테스트", ru: "Тест на дальтонизм" }, href: "/tools/color-blindness-test" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Frequency Tone Generator", zh: "频率发生器", ja: "周波数発生器", ko: "주파수 발생기", ru: "Генератор частот" }, href: "/tools/hz" },
        ],
        labels: { range: "最高可听频率", hint: "建议在安静环境佩戴耳机测试" },
        buttons: { heard: "能听到", notHeard: "听不到" },
      },
      ja: {
        metaTitle: "聴力テスト - 聞こえる最高周波数をチェック",
        metaDesc: "125Hz〜16kHzの純音を再生し、聞こえる最高周波数を調べる無料テスト。ヘッドホン推奨。ブラウザ内で完結。",
        title: "聴力テスト",
        description: "125Hz〜16kHzの9つの周波数の純音を再生し、聞こえたものを記録して可聴上限を調べます。",
        keywords: ["聴力テスト", "周波数テスト", "聴力範囲", "純音テスト", "可聴周波数", "耳のテスト"],
        faqs: [
          { q: "どうやってテストしますか？", a: "静かな部屋でヘッドホンを使い、音量は心地よい範囲に。各周波数を再生し、聞こえたかどうかを正直に記録します。" },
          { q: "医学的な聴力検査ですか？", a: "いいえ。可聴周波数範囲の簡易チェックです。専門的な評価は聴覚専門医に。" },
        ],
        related: [
          { name: { en: "Color Blindness Test", zh: "色盲测试", ja: "色覚テスト", ko: "색각 이상 테스트", ru: "Тест на дальтонизм" }, href: "/tools/color-blindness-test" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Frequency Tone Generator", zh: "频率发生器", ja: "周波数発生器", ko: "주파수 발생기", ru: "Генератор частот" }, href: "/tools/hz" },
        ],
        labels: { range: "聞こえる最高周波数", hint: "静かな部屋でヘッドホンを使用してください" },
        buttons: { heard: "聞こえた", notHeard: "聞こえない" },
      },
      ko: {
        metaTitle: "청력 테스트 - 들리는 최고 주파수 확인",
        metaDesc: "125Hz~16kHz의 순음을 재생해 들을 수 있는 최고 주파수를 확인하는 무료 테스트입니다. 헤드폰 권장. 브라우저에서 완료됩니다.",
        title: "청력 테스트",
        description: "125Hz~16kHz의 9개 주파수 순음을 재생하고 들리는 것을 표시해 귀의 가청 최고 주파수를 확인합니다.",
        keywords: ["청력 테스트", "주파수 테스트", "청력 범위", "순음 테스트", "가청 주파수", "귀 테스트"],
        faqs: [
          { q: "어떻게 테스트하나요?", a: "조용한 방에서 헤드폰을 쓰고, 볼륨을 편안하게 유지하세요. 각 주파수를 재생하며 들리는지 솔직하게 표시합니다." },
          { q: "의학적 청력 검사인가요?", a: "아니요. 가청 주파수 범위를 확인하는 빠른 자가 체크입니다. 전문 평가는 청각 전문가에게." },
        ],
        related: [
          { name: { en: "Color Blindness Test", zh: "色盲测试", ja: "色覚テスト", ko: "색각 이상 테스트", ru: "Тест на дальтонизм" }, href: "/tools/color-blindness-test" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Frequency Tone Generator", zh: "频率发生器", ja: "周波数発生器", ko: "주파수 발생기", ru: "Генератор частот" }, href: "/tools/hz" },
        ],
        labels: { range: "최고 가청 주파수", hint: "조용한 방에서 헤드폰을 사용하세요" },
        buttons: { heard: "들림", notHeard: "안 들림" },
      },
      ru: {
        metaTitle: "Тест слуха - узнайте верхнюю границу слуха",
        metaDesc: "Бесплатный онлайн-тест слуха. Воспроизводите чистые тоны от 125 Гц до 16 кГц и найдите самую высокую слышимую частоту. Лучше в наушниках. Всё в браузере.",
        title: "Тест слуха",
        description: "Воспроизводите чистые тоны на 9 частотах от 125 Гц до 16 кГц. Отмечайте, что слышите, чтобы найти верхнюю границу вашего слуха.",
        keywords: ["тест слуха", "тест частот", "диапазон слуха", "чистый тон", "слышимая частота", "проверка ушей"],
        faqs: [
          { q: "Как проходить тест?", a: "Используйте наушники в тихой комнате, громкость — комфортная, не слишком громкая. Играйте каждую частоту и честно отмечайте, что слышите." },
          { q: "Это медицинский тест слуха?", a: "Нет. Это быстрая самопроверка диапазона слышимости. Для профессиональной оценки обратитесь к аудиологу." },
        ],
        related: [
          { name: { en: "Color Blindness Test", zh: "色盲测试", ja: "色覚テスト", ko: "색각 이상 테스트", ru: "Тест на дальтонизм" }, href: "/tools/color-blindness-test" },
          { name: { en: "Reaction Time Test", zh: "反应速度测试", ja: "反応速度テスト", ko: "반응 속도 테스트", ru: "Тест реакции" }, href: "/tools/reaction-time" },
          { name: { en: "Frequency Tone Generator", zh: "频率发生器", ja: "周波数発生器", ko: "주파수 발생기", ru: "Генератор частот" }, href: "/tools/hz" },
        ],
        labels: { range: "Верхняя слышимая частота", hint: "Используйте наушники в тихой комнате" },
        buttons: { heard: "Слышу", notHeard: "Не слышу" },
      },
    },
  },
  {
    slug: "world-clock",
    icon: "🌍",
    home: {
      en: { name: "World Clock", description: "Current time in 16 cities around the world." },
      zh: { name: "世界时钟", description: "查看全球 16 个城市的当前时间。" },
      ja: { name: "ワールドクロック", description: "世界16都市の現在時刻を表示します。" },
      ko: { name: "세계 시계", description: "세계 16개 도시의 현재 시간을 확인합니다." },
      ru: { name: "Мировые часы", description: "Текущее время в 16 городах мира." },
    },
    tools: {
      en: {
        metaTitle: "World Clock - Current Time in 16 Cities Online",
        metaDesc: "Free online world clock showing the current time in 16 major cities across all continents. Updates every second. Runs in your browser.",
        title: "World Clock",
        description: "See the current local time in 16 major cities across the globe at a glance, updated every second.",
        keywords: ["world clock", "time zones", "world time", "city time", "international time", "current time"],
        faqs: [
          { q: "Which cities are included?", a: "16 major cities across all continents: London, New York, Los Angeles, Toronto, Sao Paulo, Berlin, Paris, Moscow, Dubai, Mumbai, Singapore, Beijing, Tokyo, Seoul, Sydney and Auckland." },
          { q: "Is the time accurate?", a: "Yes — times are computed from your device's clock using official IANA time zone data, and refresh every second." },
        ],
        related: [
          { name: { en: "Online Clock", zh: "在线时钟", ja: "オンライン時計", ko: "온라인 시계", ru: "Онлайн-часы" }, href: "/tools/online-clock" },
          { name: { en: "Alarm Clock", zh: "闹钟", ja: "目覚まし", ko: "알람", ru: "Будильник" }, href: "/tools/alarm" },
          { name: { en: "Unix Timestamp Converter", zh: "时间戳转换", ja: "タイムスタンプ変換", ko: "타임스탬프 변환", ru: "Конвертер меток времени" }, href: "/tools/timestamp-converter" },
        ],
        labels: {},
        buttons: {},
      },
      zh: {
        metaTitle: "世界时钟 - 全球 16 城当前时间",
        metaDesc: "免费在线世界时钟，显示全球 16 个主要城市的当前时间，每秒自动刷新。全程在浏览器本地完成。",
        title: "世界时钟",
        description: "一眼查看全球 16 个主要城市的当前当地时间，每秒自动刷新。",
        keywords: ["世界时钟", "时区", "世界时间", "城市时间", "国际时间", "当前时间"],
        faqs: [
          { q: "包含哪些城市？", a: "覆盖各大洲的 16 个主要城市：伦敦、纽约、洛杉矶、多伦多、圣保罗、柏林、巴黎、莫斯科、迪拜、孟买、新加坡、北京、东京、首尔、悉尼和奥克兰。" },
          { q: "时间准确吗？", a: "准确。时间基于你设备的时钟，使用官方 IANA 时区数据计算，并每秒刷新。" },
        ],
        related: [
          { name: { en: "Online Clock", zh: "在线时钟", ja: "オンライン時計", ko: "온라인 시계", ru: "Онлайн-часы" }, href: "/tools/online-clock" },
          { name: { en: "Alarm Clock", zh: "闹钟", ja: "目覚まし", ko: "알람", ru: "Будильник" }, href: "/tools/alarm" },
          { name: { en: "Unix Timestamp Converter", zh: "时间戳转换", ja: "タイムスタンプ変換", ko: "타임스탬프 변환", ru: "Конвертер меток времени" }, href: "/tools/timestamp-converter" },
        ],
        labels: {},
        buttons: {},
      },
      ja: {
        metaTitle: "ワールドクロック - 世界16都市の現在時刻",
        metaDesc: "世界16の主要都市の現在時刻を毎秒更新で表示する無料ツール。ブラウザ内で完結します。",
        title: "ワールドクロック",
        description: "世界16の主要都市の現在時刻をひと目で確認できます。毎秒自動更新。",
        keywords: ["ワールドクロック", "時差", "世界時計", "都市の時刻", "現在時刻", "国際時刻"],
        faqs: [
          { q: "どの都市が含まれますか？", a: "ロンドン、ニューヨーク、ロサンゼルス、トロント、サンパウロ、ベルリン、パリ、モスクワ、ドバイ、ムンバイ、シンガポール、北京、東京、ソウル、シドニー、オークランドの16都市です。" },
          { q: "時刻は正確ですか？", a: "はい。端末の時計と公式IANAタイムゾーンデータから計算し、毎秒更新します。" },
        ],
        related: [
          { name: { en: "Online Clock", zh: "在线时钟", ja: "オンライン時計", ko: "온라인 시계", ru: "Онлайн-часы" }, href: "/tools/online-clock" },
          { name: { en: "Alarm Clock", zh: "闹钟", ja: "目覚まし", ko: "알람", ru: "Будильник" }, href: "/tools/alarm" },
          { name: { en: "Unix Timestamp Converter", zh: "时间戳转换", ja: "タイムスタンプ変換", ko: "타임스탬프 변환", ru: "Конвертер меток времени" }, href: "/tools/timestamp-converter" },
        ],
        labels: {},
        buttons: {},
      },
      ko: {
        metaTitle: "세계 시계 - 전 세계 16개 도시 현재 시간",
        metaDesc: "세계 16개 주요 도시의 현재 시간을 매초 갱신해 표시하는 무료 도구입니다. 브라우저에서 완료됩니다.",
        title: "세계 시계",
        description: "전 세계 16개 주요 도시의 현재 현지 시간을 한눈에 확인할 수 있으며 매초 자동 갱신됩니다.",
        keywords: ["세계 시계", "시간대", "세계 시간", "도시 시간", "국제 시간", "현재 시간"],
        faqs: [
          { q: "어떤 도시가 포함되나요?", a: "런던, 뉴욕, 로스앤젤레스, 토론토, 상파울루, 베를린, 파리, 모스크바, 두바이, 뭄바이, 싱가포르, 베이징, 도쿄, 서울, 시드니, 오클랜드 등 16개 도시입니다." },
          { q: "시간이 정확한가요?", a: "네. 기기 시계와 공식 IANA 시간대 데이터로 계산되며 매초 갱신됩니다." },
        ],
        related: [
          { name: { en: "Online Clock", zh: "在线时钟", ja: "オンライン時計", ko: "온라인 시계", ru: "Онлайн-часы" }, href: "/tools/online-clock" },
          { name: { en: "Alarm Clock", zh: "闹钟", ja: "目覚まし", ko: "알람", ru: "Будильник" }, href: "/tools/alarm" },
          { name: { en: "Unix Timestamp Converter", zh: "时间戳转换", ja: "タイムスタンプ変換", ko: "타임스탬프 변환", ru: "Конвертер меток времени" }, href: "/tools/timestamp-converter" },
        ],
        labels: {},
        buttons: {},
      },
      ru: {
        metaTitle: "Мировые часы - время в 16 городах онлайн",
        metaDesc: "Бесплатные онлайн-мировые часы: текущее время в 16 крупных городах всех континентов. Обновление каждую секунду. Всё в браузере.",
        title: "Мировые часы",
        description: "Смотрите текущее местное время в 16 крупных городах мира одним взглядом, обновляется каждую секунду.",
        keywords: ["мировые часы", "часовые пояса", "время в мире", "время в городах", "международное время", "текущее время"],
        faqs: [
          { q: "Какие города включены?", a: "16 крупных городов со всех континентов: Лондон, Нью-Йорк, Лос-Анджелес, Торонто, Сан-Паулу, Берлин, Париж, Москва, Дубай, Мумбаи, Сингапур, Пекин, Токио, Сеул, Сидней и Окленд." },
          { q: "Время точное?", a: "Да — время вычисляется по часам вашего устройства с официальными данными IANA и обновляется каждую секунду." },
        ],
        related: [
          { name: { en: "Online Clock", zh: "在线时钟", ja: "オンライン時計", ko: "온라인 시계", ru: "Онлайн-часы" }, href: "/tools/online-clock" },
          { name: { en: "Alarm Clock", zh: "闹钟", ja: "目覚まし", ko: "알람", ru: "Будильник" }, href: "/tools/alarm" },
          { name: { en: "Unix Timestamp Converter", zh: "时间戳转换", ja: "タイムスタンプ変換", ko: "타임스탬프 변환", ru: "Конвертер меток времени" }, href: "/tools/timestamp-converter" },
        ],
        labels: {},
        buttons: {},
      },
    },
  },
  {
    slug: "alarm",
    icon: "⏰",
    home: {
      en: { name: "Alarm Clock", description: "Set an alarm at a specific time or in N minutes." },
      zh: { name: "闹钟", description: "在指定时间或 N 分钟后设置闹钟提醒。" },
      ja: { name: "目覚まし", description: "指定時刻またはN分後にアラームを設定。" },
      ko: { name: "알람", description: "특정 시간 또는 N분 후에 알람을 설정합니다." },
      ru: { name: "Будильник", description: "Установите будильник на точное время или через N минут." },
    },
    tools: {
      en: {
        metaTitle: "Alarm Clock - Set an Online Alarm",
        metaDesc: "Free online alarm clock. Set an alarm for a specific time of day or a few minutes from now, with a ringing sound. Runs entirely in your browser.",
        title: "Alarm Clock",
        description: "Set an alarm to ring at a chosen time, or a number of minutes from now. When the time comes, a tone sounds to wake you up.",
        keywords: ["alarm clock", "online alarm", "set alarm", "wake up", "alarm timer", "reminder"],
        faqs: [
          { q: "Does the alarm work when the page is open?", a: "Yes, while the page stays open. The alarm only rings when this tab is running, so keep it open or use your device's native alarm for best reliability." },
          { q: "Can I test the sound first?", a: "Yes — use the test sound button to check the volume before setting the alarm." },
        ],
        related: [
          { name: { en: "Online Clock", zh: "在线时钟", ja: "オンライン時計", ko: "온라인 시계", ru: "Онлайн-часы" }, href: "/tools/online-clock" },
          { name: { en: "Countdown Timer", zh: "倒计时", ja: "カウントダウン", ko: "카운트다운", ru: "Таймер" }, href: "/tools/countdown-timer" },
          { name: { en: "World Clock", zh: "世界时钟", ja: "ワールドクロック", ko: "세계 시계", ru: "Мировые часы" }, href: "/tools/world-clock" },
        ],
        labels: { ringing: "Alarm ringing!", countdown: "Rings in", placeholder: "Set a time or minutes below" },
        buttons: { setTime: "Set Time Alarm", setMinutes: "Set Minutes Alarm", stop: "Stop", testSound: "Test Sound" },
      },
      zh: {
        metaTitle: "闹钟 - 在线设置闹钟",
        metaDesc: "免费在线闹钟，可设置指定时刻闹钟或 N 分钟后提醒，到点响铃。全程在浏览器本地完成。",
        title: "闹钟",
        description: "设置一个在指定时间或 N 分钟后响铃的闹钟，时间到时会播放提示音提醒你。",
        keywords: ["闹钟", "在线闹钟", "设置闹钟", "起床闹钟", "定时提醒", "闹钟提醒"],
        faqs: [
          { q: "页面打开时闹钟才会响吗？", a: "是的，闹钟只在当前标签页运行时才会响。请保持页面打开，或使用设备自带闹钟获得更可靠的提醒。" },
          { q: "可以先试听铃声吗？", a: "可以。设置前先用「试听声音」按钮确认音量。" },
        ],
        related: [
          { name: { en: "Online Clock", zh: "在线时钟", ja: "オンライン時計", ko: "온라인 시계", ru: "Онлайн-часы" }, href: "/tools/online-clock" },
          { name: { en: "Countdown Timer", zh: "倒计时", ja: "カウントダウン", ko: "카운트다운", ru: "Таймер" }, href: "/tools/countdown-timer" },
          { name: { en: "World Clock", zh: "世界时钟", ja: "ワールドクロック", ko: "세계 시계", ru: "Мировые часы" }, href: "/tools/world-clock" },
        ],
        labels: { ringing: "闹钟响了！", countdown: "响铃倒计时", placeholder: "请在下方设置时间或分钟" },
        buttons: { setTime: "设置定时闹钟", setMinutes: "设置分钟闹钟", stop: "停止", testSound: "试听声音" },
      },
      ja: {
        metaTitle: "目覚まし - オンラインでアラームを設定",
        metaDesc: "指定時刻またはN分後に鳴る無料のオンラインアラーム。ブラウザ内で完結します。",
        title: "目覚まし",
        description: "指定時刻または今からN分後に鳴るアラームを設定。時間になると音でお知らせします。",
        keywords: ["目覚まし", "オンラインアラーム", "アラーム設定", "起床", "タイマー", "リマインダー"],
        faqs: [
          { q: "ページを開いているときだけ鳴りますか？", a: "はい。このタブが動いている間だけ鳴ります。ページを開いたままにするか、確実性を重視するなら端末のアラームをどうぞ。" },
          { q: "音を先に確認できますか？", a: "はい。「サウンドテスト」ボタンで音量を確認してから設定できます。" },
        ],
        related: [
          { name: { en: "Online Clock", zh: "在线时钟", ja: "オンライン時計", ko: "온라인 시계", ru: "Онлайн-часы" }, href: "/tools/online-clock" },
          { name: { en: "Countdown Timer", zh: "倒计时", ja: "カウントダウン", ko: "카운트다운", ru: "Таймер" }, href: "/tools/countdown-timer" },
          { name: { en: "World Clock", zh: "世界时钟", ja: "ワールドクロック", ko: "세계 시계", ru: "Мировые часы" }, href: "/tools/world-clock" },
        ],
        labels: { ringing: "アラームが鳴っています！", countdown: "鳴るまで", placeholder: "以下で時刻または分数を設定" },
        buttons: { setTime: "時刻アラーム", setMinutes: "分数アラーム", stop: "停止", testSound: "サウンドテスト" },
      },
      ko: {
        metaTitle: "알람 - 온라인 알람 설정",
        metaDesc: "특정 시간 또는 N분 후에 울리는 무료 온라인 알람입니다. 브라우저에서 완료됩니다.",
        title: "알람",
        description: "지정된 시간 또는 지금부터 N분 후에 울리는 알람을 설정하고, 시간이 되면 소리로 알려줍니다.",
        keywords: ["알람", "온라인 알람", "알람 설정", "기상 알람", "타이머", "리마인더"],
        faqs: [
          { q: "페이지를 열어둘 때만 울리나요?", a: "네. 이 탭이 실행되는 동안만 울립니다. 페이지를 열어두거나 신뢰성을 위해 기기 알람을 사용하세요." },
          { q: "소리를 먼저 확인할 수 있나요?", a: "네. 설정 전에 '소리 테스트' 버튼으로 볼륨을 확인할 수 있습니다." },
        ],
        related: [
          { name: { en: "Online Clock", zh: "在线时钟", ja: "オンライン時計", ko: "온라인 시계", ru: "Онлайн-часы" }, href: "/tools/online-clock" },
          { name: { en: "Countdown Timer", zh: "倒计时", ja: "カウントダウン", ko: "카운트다운", ru: "Таймер" }, href: "/tools/countdown-timer" },
          { name: { en: "World Clock", zh: "世界时钟", ja: "ワールドクロック", ko: "세계 시계", ru: "Мировые часы" }, href: "/tools/world-clock" },
        ],
        labels: { ringing: "알람이 울리고 있어요!", countdown: "울릴 때까지", placeholder: "아래에서 시간 또는 분을 설정하세요" },
        buttons: { setTime: "시간 알람 설정", setMinutes: "분 알람 설정", stop: "중지", testSound: "소리 테스트" },
      },
      ru: {
        metaTitle: "Будильник - установить онлайн",
        metaDesc: "Бесплатный онлайн-будильник. Установите сигнал на конкретное время или через несколько минут, со звонком. Всё в браузере.",
        title: "Будильник",
        description: "Установите будильник на выбранное время или через N минут. Когда время наступит, прозвучит сигнал.",
        keywords: ["будильник", "онлайн будильник", "установить будильник", "проснуться", "таймер", "напоминание"],
        faqs: [
          { q: "Будильник сработает при открытой странице?", a: "Да, пока страница открыта. Сигнал звучит только когда вкладка работает — держите её открытой или используйте системный будильник для надёжности." },
          { q: "Можно ли сначала проверить звук?", a: "Да — кнопка «Проверить звук» позволяет проверить громкость до установки будильника." },
        ],
        related: [
          { name: { en: "Online Clock", zh: "在线时钟", ja: "オンライン時計", ko: "온라인 시계", ru: "Онлайн-часы" }, href: "/tools/online-clock" },
          { name: { en: "Countdown Timer", zh: "倒计时", ja: "カウントダウン", ko: "카운트다운", ru: "Таймер" }, href: "/tools/countdown-timer" },
          { name: { en: "World Clock", zh: "世界时钟", ja: "ワールドクロック", ko: "세계 시계", ru: "Мировые часы" }, href: "/tools/world-clock" },
        ],
        labels: { ringing: "Будильник звонит!", countdown: "Прозвонит через", placeholder: "Укажите время или минуты ниже" },
        buttons: { setTime: "По времени", setMinutes: "Через N минут", stop: "Стоп", testSound: "Проверить звук" },
      },
    },
  },
  {
    slug: "online-clock",
    icon: "🕐",
    home: {
      en: { name: "Online Clock", description: "Full-screen clock with Unix timestamp and ISO time." },
      zh: { name: "在线时钟", description: "大屏时钟，显示 Unix 时间戳与 ISO 时间。" },
      ja: { name: "オンライン時計", description: "UnixタイムスタンプとISO時刻を表示する時計。" },
      ko: { name: "온라인 시계", description: "Unix 타임스탬프와 ISO 시간을 표시하는 시계입니다." },
      ru: { name: "Онлайн-часы", description: "Часы с Unix-временем и временем в формате ISO." },
    },
    tools: {
      en: {
        metaTitle: "Online Clock - Current Time with Unix Timestamp",
        metaDesc: "Free online clock showing the current time, live Unix timestamp and ISO time, updated every second. Perfect as a time reference. Runs in your browser.",
        title: "Online Clock",
        description: "A live clock with the current time in seconds, plus the Unix timestamp and ISO 8601 time for developers and time references.",
        keywords: ["online clock", "current time", "unix timestamp", "iso time", "live clock", "clock online"],
        faqs: [
          { q: "Why are Unix timestamps useful?", a: "Unix timestamps are the number of seconds since 1970-01-01 UTC, used in APIs, databases and scripts for unambiguous time values." },
          { q: "Is the displayed time my local time?", a: "Yes — the clock shows your device's local time and updates every second." },
        ],
        related: [
          { name: { en: "World Clock", zh: "世界时钟", ja: "ワールドクロック", ko: "세계 시계", ru: "Мировые часы" }, href: "/tools/world-clock" },
          { name: { en: "Unix Timestamp Converter", zh: "时间戳转换", ja: "タイムスタンプ変換", ko: "타임스탬프 변환", ru: "Конвертер меток времени" }, href: "/tools/timestamp-converter" },
          { name: { en: "Alarm Clock", zh: "闹钟", ja: "目覚まし", ko: "알람", ru: "Будильник" }, href: "/tools/alarm" },
        ],
        labels: { unix: "Unix timestamp", iso: "ISO time" },
        buttons: {},
      },
      zh: {
        metaTitle: "在线时钟 - 当前时间与 Unix 时间戳",
        metaDesc: "免费在线时钟，显示当前时间、实时 Unix 时间戳和 ISO 时间，每秒自动刷新，适合作为时间参考。全程在浏览器本地完成。",
        title: "在线时钟",
        description: "实时时钟显示精确到秒的当前时间，以及 Unix 时间戳和 ISO 8601 时间，方便开发者与时间参照。",
        keywords: ["在线时钟", "当前时间", "unix时间戳", "iso时间", "实时时钟", "网络时钟"],
        faqs: [
          { q: "Unix 时间戳有什么用？", a: "Unix 时间戳是从 1970-01-01 UTC 起经过的秒数，常用于 API、数据库和脚本中表示无歧义的时间值。" },
          { q: "显示的是本地时间吗？", a: "是的，时钟显示你设备的本地时间，并每秒更新。" },
        ],
        related: [
          { name: { en: "World Clock", zh: "世界时钟", ja: "ワールドクロック", ko: "세계 시계", ru: "Мировые часы" }, href: "/tools/world-clock" },
          { name: { en: "Unix Timestamp Converter", zh: "时间戳转换", ja: "タイムスタンプ変換", ko: "타임스탬프 변환", ru: "Конвертер меток времени" }, href: "/tools/timestamp-converter" },
          { name: { en: "Alarm Clock", zh: "闹钟", ja: "目覚まし", ko: "알람", ru: "Будильник" }, href: "/tools/alarm" },
        ],
        labels: { unix: "Unix 时间戳", iso: "ISO 时间" },
        buttons: {},
      },
      ja: {
        metaTitle: "オンライン時計 - 現在時刻とUnixタイムスタンプ",
        metaDesc: "現在時刻、リアルタイムのUnixタイムスタンプ、ISO時刻を毎秒更新で表示する無料時計。ブラウザ内で完結。",
        title: "オンライン時計",
        description: "秒まで正確な現在時刻と、Unixタイムスタンプ、ISO 8601時刻を表示するリアルタイム時計です。",
        keywords: ["オンライン時計", "現在時刻", "unixタイムスタンプ", "iso時刻", "リアルタイム時計", "ネット時計"],
        faqs: [
          { q: "Unixタイムスタンプは何に使いますか？", a: "1970-01-01 UTCからの秒数で、APIやデータベース、スクリプトで曖昧さのない時刻値として使われます。" },
          { q: "表示はローカル時刻ですか？", a: "はい。端末のローカル時刻を毎秒更新で表示します。" },
        ],
        related: [
          { name: { en: "World Clock", zh: "世界时钟", ja: "ワールドクロック", ko: "세계 시계", ru: "Мировые часы" }, href: "/tools/world-clock" },
          { name: { en: "Unix Timestamp Converter", zh: "时间戳转换", ja: "タイムスタンプ変換", ko: "타임스탬프 변환", ru: "Конвертер меток времени" }, href: "/tools/timestamp-converter" },
          { name: { en: "Alarm Clock", zh: "闹钟", ja: "目覚まし", ko: "알람", ru: "Будильник" }, href: "/tools/alarm" },
        ],
        labels: { unix: "Unixタイムスタンプ", iso: "ISO時刻" },
        buttons: {},
      },
      ko: {
        metaTitle: "온라인 시계 - 현재 시간과 Unix 타임스탬프",
        metaDesc: "현재 시간, 실시간 Unix 타임스탬프, ISO 시간을 매초 갱신해 표시하는 무료 시계입니다. 브라우저에서 완료됩니다.",
        title: "온라인 시계",
        description: "초 단위의 현재 시간과 Unix 타임스탬프, ISO 8601 시간을 표시하는 실시간 시계입니다.",
        keywords: ["온라인 시계", "현재 시간", "unix 타임스탬프", "iso 시간", "실시간 시계", "인터넷 시계"],
        faqs: [
          { q: "Unix 타임스탬프는 어디에 쓰이나요?", a: "1970-01-01 UTC부터의 초 수로, API·데이터베이스·스크립트에서 모호함 없는 시간 값을 나타낼 때 사용됩니다." },
          { q: "표시되는 시간은 로컬 시간인가요?", a: "네. 기기의 로컬 시간을 매초 갱신해 표시합니다." },
        ],
        related: [
          { name: { en: "World Clock", zh: "世界时钟", ja: "ワールドクロック", ko: "세계 시계", ru: "Мировые часы" }, href: "/tools/world-clock" },
          { name: { en: "Unix Timestamp Converter", zh: "时间戳转换", ja: "タイムスタンプ変換", ko: "타임스탬프 변환", ru: "Конвертер меток времени" }, href: "/tools/timestamp-converter" },
          { name: { en: "Alarm Clock", zh: "闹钟", ja: "目覚まし", ko: "알람", ru: "Будильник" }, href: "/tools/alarm" },
        ],
        labels: { unix: "Unix 타임스탬프", iso: "ISO 시간" },
        buttons: {},
      },
      ru: {
        metaTitle: "Онлайн-часы - текущее время и Unix-время",
        metaDesc: "Бесплатные онлайн-часы с текущим временем, живой Unix-меткой и временем ISO, обновление каждую секунду. Всё в браузере.",
        title: "Онлайн-часы",
        description: "Живые часы с точным до секунды временем, а также Unix-меткой и временем ISO 8601 для разработчиков и сверки времени.",
        keywords: ["онлайн часы", "текущее время", "unix время", "iso время", "живые часы", "часы онлайн"],
        faqs: [
          { q: "Зачем нужны Unix-метки?", a: "Unix-метка — число секунд с 1970-01-01 UTC, используется в API, базах данных и скриптах для однозначного времени." },
          { q: "Показывается местное время?", a: "Да — часы показывают местное время вашего устройства и обновляются каждую секунду." },
        ],
        related: [
          { name: { en: "World Clock", zh: "世界时钟", ja: "ワールドクロック", ko: "세계 시계", ru: "Мировые часы" }, href: "/tools/world-clock" },
          { name: { en: "Unix Timestamp Converter", zh: "时间戳转换", ja: "タイムスタンプ変換", ko: "타임스탬프 변환", ru: "Конвертер меток времени" }, href: "/tools/timestamp-converter" },
          { name: { en: "Alarm Clock", zh: "闹钟", ja: "目覚まし", ko: "알람", ru: "Будильник" }, href: "/tools/alarm" },
        ],
        labels: { unix: "Unix-метка", iso: "Время ISO" },
        buttons: {},
      },
    },
  },
];

const dir = join(process.cwd(), "scripts", "tool-data");
for (const entry of TOOLS) {
  writeFileSync(join(dir, `${entry.slug}.json`), JSON.stringify(build(entry), null, 2) + "\n", "utf8");
  console.log(`wrote ${entry.slug}.json`);
}
