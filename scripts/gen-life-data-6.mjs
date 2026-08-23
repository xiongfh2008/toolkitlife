// One-off generator: life-scene tool-data JSON (part 6: 4 tools).
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
      ...(t.genders ? { genders: t.genders } : {}),
    };
  }
  return out;
}

const TOOLS = [
  {
    slug: "day-of-year",
    icon: "📅",
    home: {
      en: { name: "Day of Year", description: "Find which day of the year a date is." },
      zh: { name: "第几天", description: "查询某个日期是当年的第几天。" },
      ja: { name: "年間通算日", description: "その日付が1年のうち何日目かを調べます。" },
      ko: { name: "올해 며칠째", description: "어떤 날짜가 올해의 며칠째인지 확인합니다." },
      ru: { name: "День года", description: "Узнайте, какой это день года." },
    },
    tools: {
      en: {
        metaTitle: "Day of Year - Which Day of the Year Is Today?",
        metaDesc: "Free online day of year calculator. Find which day of the year any date is, plus how many days are left in the year. Runs in your browser.",
        title: "Day of Year",
        description: "Pick a date and see its day number of the year, the total days in that year, and how many days remain.",
        keywords: ["day of year", "day number", "day of the year calculator", "days in year", "days remaining", "ordinal date"],
        faqs: [
          { q: "What is the day of year?", a: "It is the ordinal number of the day within the year — January 1 is day 1, February 1 is day 32 in a non-leap year." },
          { q: "Are leap years handled?", a: "Yes, leap years correctly show 366 days with February 29 counted." },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Year Calendar", zh: "全年日历", ja: "年間カレンダー", ko: "연간 달력", ru: "Годовой календарь" }, href: "/tools/calendar" },
        ],
        labels: { dayOfYear: "Day of year", totalDays: "Days in year", daysLeft: "Days left" },
        buttons: { calculate: "Calculate" },
      },
      zh: {
        metaTitle: "第几天 - 查询今天是当年的第几天",
        metaDesc: "免费在线第几天查询工具，可查看任意日期是当年的第几天、全年天数与剩余天数。全程在浏览器本地完成。",
        title: "第几天",
        description: "选择日期，查看它是当年的第几天、该年总天数以及还剩多少天。",
        keywords: ["第几天", "年度日序", "一年中的第几天", "全年天数", "剩余天数", "日序号"],
        faqs: [
          { q: "什么是当年第几天？", a: "即该日在一年中的序号——1 月 1 日是第 1 天，平年 2 月 1 日是第 32 天。" },
          { q: "闰年处理正确吗？", a: "正确。闰年显示 366 天，并计入 2 月 29 日。" },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Year Calendar", zh: "全年日历", ja: "年間カレンダー", ko: "연간 달력", ru: "Годовой календарь" }, href: "/tools/calendar" },
        ],
        labels: { dayOfYear: "当年第几天", totalDays: "全年天数", daysLeft: "剩余天数" },
        buttons: { calculate: "查询" },
      },
      ja: {
        metaTitle: "年間通算日 - 今日は1年の何日目？",
        metaDesc: "任意の日付が1年の何日目か、その年の総日数と残り日数を調べられる無料ツール。ブラウザ内で完結。",
        title: "年間通算日",
        description: "日付を選ぶと、その年の通算日数、その年の総日数、残り日数がわかります。",
        keywords: ["年間通算日", "日数", "1年の何日目", "年の日数", "残り日数", "通算日"],
        faqs: [
          { q: "年間通算日とは？", a: "1年の中でのその日の番号です。1月1日が1日目、平年の2月1日は32日目になります。" },
          { q: "うるう年は考慮されますか？", a: "はい。うるう年は366日として2月29日も数えます。" },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Year Calendar", zh: "全年日历", ja: "年間カレンダー", ko: "연간 달력", ru: "Годовой календарь" }, href: "/tools/calendar" },
        ],
        labels: { dayOfYear: "年間通算日", totalDays: "年の総日数", daysLeft: "残り日数" },
        buttons: { calculate: "計算" },
      },
      ko: {
        metaTitle: "올해 며칠째 - 날짜의 연중 일수 확인",
        metaDesc: "원하는 날짜가 올해의 며칠째인지, 해당 연도의 총 일수와 남은 일수를 확인하는 무료 도구입니다. 브라우저에서 완료됩니다.",
        title: "올해 며칠째",
        description: "날짜를 선택하면 그날이 연중 몇 번째 날인지, 그해 총 일수와 남은 일수를 보여줍니다.",
        keywords: ["올해 며칠째", "연중 일수", "날짜 일수", "연간 일수", "남은 일수", "일수 계산"],
        faqs: [
          { q: "연중 일수가 무엇인가요?", a: "그날이 1년 중 몇 번째인지를 나타냅니다. 1월 1일이 1일째, 평년 2월 1일은 32일째입니다." },
          { q: "윤년은 처리되나요?", a: "네. 윤년은 366일로 표시하고 2월 29일도 셉니다." },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Year Calendar", zh: "全年日历", ja: "年間カレンダー", ko: "연간 달력", ru: "Годовой календарь" }, href: "/tools/calendar" },
        ],
        labels: { dayOfYear: "연중 일수", totalDays: "연간 총 일수", daysLeft: "남은 일수" },
        buttons: { calculate: "계산" },
      },
      ru: {
        metaTitle: "День года - какой сегодня день года",
        metaDesc: "Бесплатный онлайн-калькулятор дня года. Узнайте номер дня любого числа, общее число дней в году и сколько осталось. Всё в браузере.",
        title: "День года",
        description: "Выберите дату и увидите её номер в году, общее число дней в этом году и сколько дней осталось.",
        keywords: ["день года", "номер дня", "какой день года", "дней в году", "осталось дней", "порядковый день"],
        faqs: [
          { q: "Что такое день года?", a: "Это порядковый номер дня в году — 1 января это день 1, 1 февраля в невисокосный год это день 32." },
          { q: "Високосные годы учитываются?", a: "Да, високосный год показывает 366 дней с учётом 29 февраля." },
        ],
        related: [
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Year Calendar", zh: "全年日历", ja: "年間カレンダー", ko: "연간 달력", ru: "Годовой календарь" }, href: "/tools/calendar" },
        ],
        labels: { dayOfYear: "День года", totalDays: "Дней в году", daysLeft: "Осталось дней" },
        buttons: { calculate: "Вычислить" },
      },
    },
  },
  {
    slug: "expiration",
    icon: "🏷️",
    home: {
      en: { name: "Expiration Date", description: "Calculate expiry date from production date and shelf life." },
      zh: { name: "保质期计算", description: "根据生产日期与保质期计算过期日期。" },
      ja: { name: "賞味期限計算", description: "製造日と賞味期間から期限を計算します。" },
      ko: { name: "유통기한 계산", description: "제조일과 유통기한으로 만료일을 계산합니다." },
      ru: { name: "Срок годности", description: "Рассчитайте срок годности по дате производства." },
    },
    tools: {
      en: {
        metaTitle: "Expiration Date - Calculate Expiry From Production Date",
        metaDesc: "Free online expiration date calculator. Enter the production date and shelf life in days to get the expiry date and how many days are left. Runs in your browser.",
        title: "Expiration Date",
        description: "Enter the production date and shelf life in days to instantly get the expiry date and how much time is left until it expires.",
        keywords: ["expiration date", "expiry calculator", "shelf life calculator", "best before", "expiration date calculator", "expiry date"],
        faqs: [
          { q: "Is this calculation reliable?", a: "It is a simple date math based on the shelf life you enter. Always check the label on the product for the official date." },
          { q: "Can I use months instead of days?", a: "Enter the shelf life in days — for example 90 days for roughly 3 months." },
        ],
        related: [
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
        ],
        labels: {
          producedAt: "Production date",
          shelfLife: "Shelf life",
          days: "days",
          expiresAt: "Expiry date",
          daysLeft: "Days remaining",
          expiredDays: "Expired {count, plural, one {# day} other {# days}} ago",
        },
        buttons: { calculate: "Calculate" },
      },
      zh: {
        metaTitle: "保质期计算 - 根据生产日期计算过期日",
        metaDesc: "免费在线保质期计算工具，输入生产日期与保质期天数即可得到过期日期与剩余天数。全程在浏览器本地完成。",
        title: "保质期计算",
        description: "输入生产日期与保质期天数，立即得到过期日期以及距离过期还剩多少天。",
        keywords: ["保质期计算", "过期日期", "保质期", "有效期计算", "过期时间", "生产日期"],
        faqs: [
          { q: "计算结果可靠吗？", a: "它只是基于你输入的保质期做日期计算。实际请以产品包装上的官方日期为准。" },
          { q: "可以用月数吗？", a: "请按天数输入，例如 90 天约等于 3 个月。" },
        ],
        related: [
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
        ],
        labels: {
          producedAt: "生产日期",
          shelfLife: "保质期",
          days: "天",
          expiresAt: "过期日期",
          daysLeft: "剩余天数",
          expiredDays: "已过期 {count, plural, =1 {1 天} other {# 天}}",
        },
        buttons: { calculate: "计算" },
      },
      ja: {
        metaTitle: "賞味期限計算 - 製造日から期限を計算",
        metaDesc: "製造日と賞味期間（日数）から期限日と残り日数を計算する無料ツール。ブラウザ内で完結。",
        title: "賞味期限計算",
        description: "製造日と賞味期間を日数で入力すると、期限日と期限までの残り日数を即座に計算します。",
        keywords: ["賞味期限", "消費期限計算", "賞味期限計算", "期限日", "残り日数", "有効期限"],
        faqs: [
          { q: "計算は信頼できますか？", a: "入力した賞味期間に基づく単純な日付計算です。公式の期限は商品ラベルで確認してください。" },
          { q: "月数で入力できますか？", a: "日数で入力してください。例：約3ヶ月なら90日。" },
        ],
        related: [
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
        ],
        labels: {
          producedAt: "製造日",
          shelfLife: "賞味期間",
          days: "日",
          expiresAt: "期限日",
          daysLeft: "残り日数",
          expiredDays: "期限切れから {count, plural, =1 {1 日} other {# 日}}",
        },
        buttons: { calculate: "計算" },
      },
      ko: {
        metaTitle: "유통기한 계산 - 제조일로 만료일 계산",
        metaDesc: "제조일과 유통기한(일수)으로 만료일과 남은 일수를 계산하는 무료 도구입니다. 브라우저에서 완료됩니다.",
        title: "유통기한 계산",
        description: "제조일과 유통기한을 일수로 입력하면 만료일과 만료까지 남은 일수를 즉시 계산합니다.",
        keywords: ["유통기한 계산", "만료일", "소비기한", "유효기간 계산", "제조일", "유통기한"],
        faqs: [
          { q: "계산이 정확한가요?", a: "입력한 유통기한에 기반한 단순 날짜 계산입니다. 공식 날짜는 제품 라벨을 확인하세요." },
          { q: "개월로 입력할 수 있나요?", a: "일수로 입력하세요. 예: 약 3개월은 90일입니다." },
        ],
        related: [
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
        ],
        labels: {
          producedAt: "제조일",
          shelfLife: "유통기한",
          days: "일",
          expiresAt: "만료일",
          daysLeft: "남은 일수",
          expiredDays: "만료 후 {count, plural, =1 {1일} other {#일}} 지남",
        },
        buttons: { calculate: "계산" },
      },
      ru: {
        metaTitle: "Срок годности - рассчитать по дате производства",
        metaDesc: "Бесплатный онлайн-калькулятор срока годности. Введите дату производства и срок в днях — получите дату истечения и оставшиеся дни. Всё в браузере.",
        title: "Срок годности",
        description: "Введите дату производства и срок годности в днях, чтобы мгновенно получить дату истечения и оставшееся время.",
        keywords: ["срок годности", "калькулятор срока", "годен до", "срок хранения", "дата истечения", "просрочка"],
        faqs: [
          { q: "Расчёт надёжен?", a: "Это простое вычисление даты на основе введённого срока. Официальную дату всегда проверяйте на этикетке." },
          { q: "Можно указать месяцы?", a: "Вводите срок в днях — например, 90 дней примерно равно 3 месяцам." },
        ],
        related: [
          { name: { en: "Date Calculator", zh: "日期计算", ja: "日付計算", ko: "날짜 계산", ru: "Калькулятор дат" }, href: "/tools/date-calculator" },
          { name: { en: "Day of Year", zh: "第几天", ja: "年間通算日", ko: "올해 며칠째", ru: "День года" }, href: "/tools/day-of-year" },
          { name: { en: "Day of Week", zh: "星期查询", ja: "曜日計算", ko: "요일 계산", ru: "День недели" }, href: "/tools/day-of-week" },
        ],
        labels: {
          producedAt: "Дата производства",
          shelfLife: "Срок годности",
          days: "дней",
          expiresAt: "Годен до",
          daysLeft: "Осталось дней",
          expiredDays: "Просрочено на {count, plural, one {# день} few {# дня} other {# дней}}",
        },
        buttons: { calculate: "Рассчитать" },
      },
    },
  },
  {
    slug: "blood-type",
    icon: "🩸",
    home: {
      en: { name: "Blood Type Inheritance", description: "Predict possible blood types of children from parents." },
      zh: { name: "血型遗传", description: "根据父母血型预测子女可能的血型。" },
      ja: { name: "血液型遺伝", description: "両親の血液型から子の血液型を予測します。" },
      ko: { name: "혈액형 유전", description: "부모 혈액형으로 자녀의 혈액형을 예측합니다." },
      ru: { name: "Наследование группы крови", description: "Спрогнозируйте возможные группы крови детей по родителям." },
    },
    tools: {
      en: {
        metaTitle: "Blood Type Inheritance - Possible Child Blood Types",
        metaDesc: "Free online blood type inheritance calculator. Select the parents' ABO blood types to see which blood types their child can or cannot have. Runs in your browser.",
        title: "Blood Type Inheritance",
        description: "Select the father's and mother's ABO blood types to instantly see which blood types their child can have — and which are impossible.",
        keywords: ["blood type inheritance", "child blood type", "blood type calculator", "abo inheritance", "possible blood types", "parents blood type"],
        faqs: [
          { q: "Why are some blood types impossible?", a: "Blood type follows Mendelian inheritance of the A, B and O alleles. Combining the parents' possible genotypes rules out some types." },
          { q: "Is this medical advice?", a: "No. It is a general genetics table. For anything important, consult a doctor or geneticist." },
        ],
        related: [
          { name: { en: "Height Predictor", zh: "身高预测", ja: "身長予測", ko: "키 예측", ru: "Прогноз роста" }, href: "/tools/height-predict" },
          { name: { en: "BMI Calculator", zh: "BMI计算", ja: "BMI計算", ko: "BMI 계산", ru: "Калькулятор ИМТ" }, href: "/tools/bmi-calculator" },
          { name: { en: "Pregnancy Calculator", zh: "怀孕计算", ja: "妊娠計算", ko: "임신 계산", ru: "Калькулятор беременности" }, href: "/tools/pregnancy-calculator" },
        ],
        labels: { father: "Father", mother: "Mother", possible: "Possible for the child", impossible: "Not possible for the child" },
        buttons: {},
      },
      zh: {
        metaTitle: "血型遗传 - 子女可能的血型",
        metaDesc: "免费在线血型遗传计算器，选择父母 ABO 血型即可查看子女可能和不可能的血型。全程在浏览器本地完成。",
        title: "血型遗传",
        description: "选择父亲与母亲的 ABO 血型，立即查看子女可能的血型以及不可能出现的血型。",
        keywords: ["血型遗传", "子女血型", "血型计算", "ABO遗传", "父母血型", "血型预测"],
        faqs: [
          { q: "为什么有些血型不可能？", a: "血型遵循 A、B、O 等位基因的孟德尔遗传规律，综合父母可能的基因型后可排除部分血型。" },
          { q: "这是医学建议吗？", a: "不是。它只是通用的遗传学表格，重要情况请咨询医生或遗传学专家。" },
        ],
        related: [
          { name: { en: "Height Predictor", zh: "身高预测", ja: "身長予測", ko: "키 예측", ru: "Прогноз роста" }, href: "/tools/height-predict" },
          { name: { en: "BMI Calculator", zh: "BMI计算", ja: "BMI計算", ko: "BMI 계산", ru: "Калькулятор ИМТ" }, href: "/tools/bmi-calculator" },
          { name: { en: "Pregnancy Calculator", zh: "怀孕计算", ja: "妊娠計算", ko: "임신 계산", ru: "Калькулятор беременности" }, href: "/tools/pregnancy-calculator" },
        ],
        labels: { father: "父亲", mother: "母亲", possible: "子女可能血型", impossible: "子女不可能血型" },
        buttons: {},
      },
      ja: {
        metaTitle: "血液型遺伝 - 子にあり得る血液型",
        metaDesc: "両親のABO血液型を選ぶと、子にあり得る・あり得ない血液型がわかる無料ツール。ブラウザ内で完結。",
        title: "血液型遺伝",
        description: "父親と母親のABO血液型を選ぶと、子にあり得る血液型とあり得ない血液型がすぐにわかります。",
        keywords: ["血液型遺伝", "子の血液型", "血液型計算", "ABO遺伝", "両親の血液型", "血液型予測"],
        faqs: [
          { q: "なぜあり得ない型があるのですか？", a: "血液型はA・B・O対立遺伝子のメンデル遺伝に従います。両親の可能な遺伝子型から一部の型は除外されます。" },
          { q: "医学的な助言ですか？", a: "いいえ。一般的な遺伝学の表です。重要なことは医師や遺伝学者に相談してください。" },
        ],
        related: [
          { name: { en: "Height Predictor", zh: "身高预测", ja: "身長予測", ko: "키 예측", ru: "Прогноз роста" }, href: "/tools/height-predict" },
          { name: { en: "BMI Calculator", zh: "BMI计算", ja: "BMI計算", ko: "BMI 계산", ru: "Калькулятор ИМТ" }, href: "/tools/bmi-calculator" },
          { name: { en: "Pregnancy Calculator", zh: "怀孕计算", ja: "妊娠計算", ko: "임신 계산", ru: "Калькулятор беременности" }, href: "/tools/pregnancy-calculator" },
        ],
        labels: { father: "父親", mother: "母親", possible: "子にあり得る血液型", impossible: "子にあり得ない血液型" },
        buttons: {},
      },
      ko: {
        metaTitle: "혈액형 유전 - 자녀의 가능 혈액형",
        metaDesc: "부모의 ABO 혈액형을 선택하면 자녀가 가질 수 있는 혈액형과 불가능한 혈액형을 확인하는 무료 도구입니다. 브라우저에서 완료됩니다.",
        title: "혈액형 유전",
        description: "아버지와 어머니의 ABO 혈액형을 선택하면 자녀가 가질 수 있는 혈액형과 가질 수 없는 혈액형을 바로 확인할 수 있습니다.",
        keywords: ["혈액형 유전", "자녀 혈액형", "혈액형 계산", "ABO 유전", "부모 혈액형", "혈액형 예측"],
        faqs: [
          { q: "왜 어떤 혈액형은 불가능한가요?", a: "혈액형은 A, B, O 대립유전자의 멘델 유전을 따릅니다. 부모의 가능한 유전자형을 조합하면 일부 혈액형이 제외됩니다." },
          { q: "의학적 조언인가요?", a: "아니요. 일반적인 유전학 표일 뿐입니다. 중요한 사항은 의사나 유전학 전문가와 상담하세요." },
        ],
        related: [
          { name: { en: "Height Predictor", zh: "身高预测", ja: "身長予測", ko: "키 예측", ru: "Прогноз роста" }, href: "/tools/height-predict" },
          { name: { en: "BMI Calculator", zh: "BMI计算", ja: "BMI計算", ko: "BMI 계산", ru: "Калькулятор ИМТ" }, href: "/tools/bmi-calculator" },
          { name: { en: "Pregnancy Calculator", zh: "怀孕计算", ja: "妊娠計算", ko: "임신 계산", ru: "Калькулятор беременности" }, href: "/tools/pregnancy-calculator" },
        ],
        labels: { father: "아버지", mother: "어머니", possible: "자녀가 가질 수 있는 혈액형", impossible: "자녀가 가질 수 없는 혈액형" },
        buttons: {},
      },
      ru: {
        metaTitle: "Наследование группы крови - возможные группы ребёнка",
        metaDesc: "Бесплатный онлайн-калькулятор наследования группы крови. Выберите группы крови родителей и узнайте, какие группы могут быть у ребёнка. Всё в браузере.",
        title: "Наследование группы крови",
        description: "Выберите группы крови отца и матери по системе ABO — и сразу увидите, какие группы крови возможны у ребёнка, а какие нет.",
        keywords: ["наследование группы крови", "группа крови ребёнка", "калькулятор группы крови", "наследование ABO", "возможные группы", "группа крови родителей"],
        faqs: [
          { q: "Почему некоторые группы невозможны?", a: "Группа крови наследуется по Менделю через аллели A, B и O. Комбинация возможных генотипов родителей исключает часть групп." },
          { q: "Это медицинская рекомендация?", a: "Нет. Это общая таблица генетики. Для важных вопросов обратитесь к врачу или генетику." },
        ],
        related: [
          { name: { en: "Height Predictor", zh: "身高预测", ja: "身長予測", ko: "키 예측", ru: "Прогноз роста" }, href: "/tools/height-predict" },
          { name: { en: "BMI Calculator", zh: "BMI计算", ja: "BMI計算", ko: "BMI 계산", ru: "Калькулятор ИМТ" }, href: "/tools/bmi-calculator" },
          { name: { en: "Pregnancy Calculator", zh: "怀孕计算", ja: "妊娠計算", ko: "임신 계산", ru: "Калькулятор беременности" }, href: "/tools/pregnancy-calculator" },
        ],
        labels: { father: "Отец", mother: "Мать", possible: "Возможные группы ребёнка", impossible: "Невозможные группы ребёнка" },
        buttons: {},
      },
    },
  },
  {
    slug: "height-predict",
    icon: "📏",
    home: {
      en: { name: "Height Predictor", description: "Predict a child's height from the parents' heights." },
      zh: { name: "身高预测", description: "根据父母身高预测孩子身高。" },
      ja: { name: "身長予測", description: "両親の身長から子の身長を予測します。" },
      ko: { name: "키 예측", description: "부모의 키로 자녀의 키를 예측합니다." },
      ru: { name: "Прогноз роста", description: "Спрогнозируйте рост ребёнка по росту родителей." },
    },
    tools: {
      en: {
        metaTitle: "Height Predictor - Estimate Child Height from Parents",
        metaDesc: "Free online height predictor. Enter the parents' heights and gender of the child to get a rough adult height estimate. Runs in your browser.",
        title: "Height Predictor",
        description: "Enter the father's and mother's heights and the child's gender to estimate the child's adult height using a common prediction formula.",
        keywords: ["height predictor", "child height", "height calculator", "predict height", "mid-parental height", "growth estimate"],
        faqs: [
          { q: "How accurate is this?", a: "It uses the mid-parental height formula, which is an estimate. Actual height depends on genetics, nutrition and health." },
          { q: "Is this medical advice?", a: "No, it is an educational estimate. Consult a pediatrician for growth concerns." },
        ],
        related: [
          { name: { en: "Blood Type Inheritance", zh: "血型遗传", ja: "血液型遺伝", ko: "혈액형 유전", ru: "Группа крови" }, href: "/tools/blood-type" },
          { name: { en: "BMI Calculator", zh: "BMI计算", ja: "BMI計算", ko: "BMI 계산", ru: "Калькулятор ИМТ" }, href: "/tools/bmi-calculator" },
          { name: { en: "Ideal Weight", zh: "理想体重", ja: "理想体重", ko: "이상 체중", ru: "Идеальный вес" }, href: "/tools/ideal-weight-calculator" },
        ],
        labels: { father: "Father height", mother: "Mother height", estimate: "Estimated adult height" },
        buttons: { calculate: "Calculate" },
        genders: { boy: "Boy", girl: "Girl" },
      },
      zh: {
        metaTitle: "身高预测 - 根据父母身高估算孩子身高",
        metaDesc: "免费在线身高预测工具，输入父母身高与孩子性别即可用常见公式估算成年身高。全程在浏览器本地完成。",
        title: "身高预测",
        description: "输入父亲与母亲的身高以及孩子性别，使用常见预测公式估算孩子的成年身高。",
        keywords: ["身高预测", "孩子身高", "身高计算", "预测身高", "父母身高", "身高估算"],
        faqs: [
          { q: "准确吗？", a: "使用父母中位身高公式进行估算，实际身高还受遗传、营养与健康等因素影响。" },
          { q: "这是医学建议吗？", a: "不是，只是科普性估算。有生长发育疑问请咨询儿科医生。" },
        ],
        related: [
          { name: { en: "Blood Type Inheritance", zh: "血型遗传", ja: "血液型遺伝", ko: "혈액형 유전", ru: "Группа крови" }, href: "/tools/blood-type" },
          { name: { en: "BMI Calculator", zh: "BMI计算", ja: "BMI計算", ko: "BMI 계산", ru: "Калькулятор ИМТ" }, href: "/tools/bmi-calculator" },
          { name: { en: "Ideal Weight", zh: "理想体重", ja: "理想体重", ko: "이상 체중", ru: "Идеальный вес" }, href: "/tools/ideal-weight-calculator" },
        ],
        labels: { father: "父亲身高", mother: "母亲身高", estimate: "预估成年身高" },
        buttons: { calculate: "计算" },
        genders: { boy: "男孩", girl: "女孩" },
      },
      ja: {
        metaTitle: "身長予測 - 両親の身長から子の身長を推定",
        metaDesc: "両親の身長と子の性別を入力して成人時の身長を推定する無料ツール。ブラウザ内で完結。",
        title: "身長予測",
        description: "父親と母親の身長、子の性別を入力すると、一般的な予測式で成人時の身長を推定します。",
        keywords: ["身長予測", "子供の身長", "身長計算", "予測身長", "両親の身長", "身長推定"],
        faqs: [
          { q: "どのくらい正確ですか？", a: "両親の平均身長を使う方式で、あくまで推定です。実際の身長は遺伝・栄養・健康に左右されます。" },
          { q: "医学的な助言ですか？", a: "いいえ。教育的な推定です。成長の不安は小児科医に相談してください。" },
        ],
        related: [
          { name: { en: "Blood Type Inheritance", zh: "血型遗传", ja: "血液型遺伝", ko: "혈액형 유전", ru: "Группа крови" }, href: "/tools/blood-type" },
          { name: { en: "BMI Calculator", zh: "BMI计算", ja: "BMI計算", ko: "BMI 계산", ru: "Калькулятор ИМТ" }, href: "/tools/bmi-calculator" },
          { name: { en: "Ideal Weight", zh: "理想体重", ja: "理想体重", ko: "이상 체중", ru: "Идеальный вес" }, href: "/tools/ideal-weight-calculator" },
        ],
        labels: { father: "父親の身長", mother: "母親の身長", estimate: "予測される成人身長" },
        buttons: { calculate: "計算" },
        genders: { boy: "男の子", girl: "女の子" },
      },
      ko: {
        metaTitle: "키 예측 - 부모 키로 자녀 키 추정",
        metaDesc: "부모의 키와 자녀의 성별을 입력해 성인 키를 추정하는 무료 도구입니다. 브라우저에서 완료됩니다.",
        title: "키 예측",
        description: "아버지와 어머니의 키, 자녀의 성별을 입력하면 일반적인 예측 공식으로 성인 키를 추정합니다.",
        keywords: ["키 예측", "자녀 키", "키 계산", "예상 키", "부모 키", "키 추정"],
        faqs: [
          { q: "정확한가요?", a: "부모 중간 키 공식을 사용한 추정치입니다. 실제 키는 유전, 영양, 건강에 따라 달라집니다." },
          { q: "의학적 조언인가요?", a: "아니요, 교육적 추정입니다. 성장 관련 우려는 소아과 의사와 상담하세요." },
        ],
        related: [
          { name: { en: "Blood Type Inheritance", zh: "血型遗传", ja: "血液型遺伝", ko: "혈액형 유전", ru: "Группа крови" }, href: "/tools/blood-type" },
          { name: { en: "BMI Calculator", zh: "BMI计算", ja: "BMI計算", ko: "BMI 계산", ru: "Калькулятор ИМТ" }, href: "/tools/bmi-calculator" },
          { name: { en: "Ideal Weight", zh: "理想体重", ja: "理想体重", ko: "이상 체중", ru: "Идеальный вес" }, href: "/tools/ideal-weight-calculator" },
        ],
        labels: { father: "아버지 키", mother: "어머니 키", estimate: "예상 성인 키" },
        buttons: { calculate: "계산" },
        genders: { boy: "남아", girl: "여아" },
      },
      ru: {
        metaTitle: "Прогноз роста - оценить рост ребёнка по родителям",
        metaDesc: "Бесплатный онлайн-прогноз роста. Введите рост родителей и пол ребёнка, чтобы получить примерный взрослый рост. Всё в браузере.",
        title: "Прогноз роста",
        description: "Введите рост отца и матери и пол ребёнка, чтобы оценить его взрослый рост по распространённой формуле.",
        keywords: ["прогноз роста", "рост ребёнка", "калькулятор роста", "предсказать рост", "средний родительский рост", "оценка роста"],
        faqs: [
          { q: "Насколько это точно?", a: "Используется формула среднего родительского роста — это оценка. Реальный рост зависит от генетики, питания и здоровья." },
          { q: "Это медицинская рекомендация?", a: "Нет, это образовательная оценка. При вопросах о росте обратитесь к педиатру." },
        ],
        related: [
          { name: { en: "Blood Type Inheritance", zh: "血型遗传", ja: "血液型遺伝", ko: "혈액형 유전", ru: "Группа крови" }, href: "/tools/blood-type" },
          { name: { en: "BMI Calculator", zh: "BMI计算", ja: "BMI計算", ko: "BMI 계산", ru: "Калькулятор ИМТ" }, href: "/tools/bmi-calculator" },
          { name: { en: "Ideal Weight", zh: "理想体重", ja: "理想体重", ko: "이상 체중", ru: "Идеальный вес" }, href: "/tools/ideal-weight-calculator" },
        ],
        labels: { father: "Рост отца", mother: "Рост матери", estimate: "Оценка взрослого роста" },
        buttons: { calculate: "Рассчитать" },
        genders: { boy: "Мальчик", girl: "Девочка" },
      },
    },
  },
];

const dir = join(process.cwd(), "scripts", "tool-data");
for (const entry of TOOLS) {
  writeFileSync(join(dir, `${entry.slug}.json`), JSON.stringify(build(entry), null, 2) + "\n", "utf8");
  console.log(`wrote ${entry.slug}.json`);
}
