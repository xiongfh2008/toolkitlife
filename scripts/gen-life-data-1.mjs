// One-off generator: life-scene tool-data JSON (part 1: 4 tools).
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
    slug: "group-randomizer",
    icon: "👥",
    home: {
      en: { name: "Random Group Generator", description: "Split a list of names into random groups by count or size." },
      zh: { name: "名单随机分组", description: "将名单随机分成若干小组，支持按组数或每组人数分组。" },
      ja: { name: "ランダムグループ分け", description: "名前リストをグループ数または人数でランダムに分けます。" },
      ko: { name: "랜덤 그룹 나누기", description: "이름 목록을 그룹 수 또는 인원수 기준으로 무작위로 나눕니다." },
      ru: { name: "Случайное разбиение на группы", description: "Разделите список имён на случайные группы по количеству или размеру." },
    },
    tools: {
      en: {
        metaTitle: "Random Group Generator - Split Names into Teams Online",
        metaDesc: "Free online random group generator. Shuffle names and split them into balanced groups by number of groups or people per group. Everything runs in your browser.",
        title: "Random Group Generator",
        description: "Paste a list of names, choose whether to group by the number of groups or by people per group, and split everyone into random teams instantly.",
        keywords: ["random group generator", "random team splitter", "group names randomly", "team randomizer", "split list into groups", "random grouping"],
        faqs: [
          { q: "Can I paste names copied from Excel?", a: "Yes. Paste names separated by newlines, commas, or tabs — all of these are recognized as separators." },
          { q: "Is the grouping fair?", a: "Names are shuffled before assignment, so every run produces a fresh random grouping." },
        ],
        related: [
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { list: "Name list", placeholder: "Enter names, one per line (commas, semicolons and tabs also work)", groupName: "Group" },
        buttons: { group: "Random Group" },
      },
      zh: {
        metaTitle: "名单随机分组 - 在线随机分组工具",
        metaDesc: "免费在线名单随机分组工具，支持按组数或每组人数随机分组，一键打乱名单。所有处理都在浏览器本地完成。",
        title: "名单随机分组",
        description: "粘贴一份名单，选择按组数还是按每组人数分组，即可一键随机分组成小组。",
        keywords: ["随机分组", "名单分组", "分组工具", "随机分组器", "打乱名单分组", "随机分组生成器"],
        faqs: [
          { q: "可以粘贴 Excel 里的名单吗？", a: "可以。将名单按换行、逗号、分号或 Tab 分隔粘贴即可。" },
          { q: "分组公平吗？", a: "分配前会先打乱名单，每次运行都会得到不同的随机结果。" },
        ],
        related: [
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { list: "名单", placeholder: "输入名单，每行一个（也支持逗号、分号、Tab）", groupName: "第" },
        buttons: { group: "随机分组" },
      },
      ja: {
        metaTitle: "ランダムグループ分け - オンラインで名前をグループ分け",
        metaDesc: "名前リストをシャッフルし、グループ数または人数で均等に分ける無料ツール。すべてブラウザ内で完結します。",
        title: "ランダムグループ分け",
        description: "名前リストを貼り付け、グループ数か人数のどちらで分けるかを選ぶだけで、ランダムにチーム分けできます。",
        keywords: ["グループ分け", "ランダムグループ", "チーム分け", "名前をグループ分け", "シャッフル", "グループ生成"],
        faqs: [
          { q: "Excel からコピーした名前を貼り付けられますか？", a: "はい。改行、カンマ、セミコロン、タブ区切りで貼り付けられます。" },
          { q: "公平に分けられますか？", a: "割り当て前に名前をシャッフルするため、毎回新しいランダムな結果になります。" },
        ],
        related: [
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { list: "名前リスト", placeholder: "名前を1行に1つ入力（カンマ、セミコロン、タブも可）", groupName: "グループ" },
        buttons: { group: "ランダム分け" },
      },
      ko: {
        metaTitle: "랜덤 그룹 나누기 - 온라인 이름 그룹 분배",
        metaDesc: "이름 목록을 섞어 그룹 수 또는 인원수 기준으로 나누는 무료 도구입니다. 모든 처리는 브라우저에서 완료됩니다.",
        title: "랜덤 그룹 나누기",
        description: "이름 목록을 붙여넣고 그룹 수 또는 그룹당 인원 기준으로 선택하면 즉시 무작위 팀 분배가 완료됩니다.",
        keywords: ["랜덤 그룹", "그룹 나누기", "팀 분배", "이름 그룹화", "조 편성", "그룹 생성기"],
        faqs: [
          { q: "Excel에서 복사한 이름을 붙여넣을 수 있나요?", a: "네. 줄바꿈, 쉼표, 세미콜론, 탭으로 구분해 붙여넣을 수 있습니다." },
          { q: "공정하게 나뉘나요?", a: "배정 전에 이름을 섞기 때문에 매번 새로운 무작위 결과가 나옵니다." },
        ],
        related: [
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { list: "이름 목록", placeholder: "이름을 한 줄에 하나씩 입력 (쉼표, 세미콜론, 탭도 가능)", groupName: "그룹" },
        buttons: { group: "랜덤 분배" },
      },
      ru: {
        metaTitle: "Случайное разбиение на группы - онлайн",
        metaDesc: "Бесплатный онлайн-генератор групп. Перемешайте имена и разделите их на группы по количеству групп или человек в группе. Всё в браузере.",
        title: "Случайное разбиение на группы",
        description: "Вставьте список имён, выберите режим — по числу групп или человек в группе — и мгновенно получите случайные команды.",
        keywords: ["разбить на группы", "случайные группы", "разделить список", "генератор групп", "случайная команда", "перемешать имена"],
        faqs: [
          { q: "Можно ли вставить имена из Excel?", a: "Да. Вставьте имена, разделённые переносами строк, запятыми, точками с запятой или табуляцией." },
          { q: "Разбиение честное?", a: "Имена перемешиваются перед распределением, поэтому каждый запуск даёт новый случайный результат." },
        ],
        related: [
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { list: "Список имён", placeholder: "Введите имена, по одному на строку (также работают запятая, точка с запятой, табуляция)", groupName: "Группа" },
        buttons: { group: "Разбить" },
      },
    },
  },
  {
    slug: "coin-flip",
    icon: "🪙",
    home: {
      en: { name: "Coin Flip", description: "Flip a virtual coin with heads/tails statistics." },
      zh: { name: "抛硬币", description: "虚拟抛硬币，记录正反面统计结果。" },
      ja: { name: "コイントス", description: "仮想コインを投げて表裏の統計を記録します。" },
      ko: { name: "동전 던지기", description: "가상 동전을 던져 앞뒷면 통계를 기록합니다." },
      ru: { name: "Монетка", description: "Подбросьте виртуальную монету со статистикой орла и решки." },
    },
    tools: {
      en: {
        metaTitle: "Coin Flip - Flip a Virtual Coin Online",
        metaDesc: "Flip a virtual coin online. Track heads and tails with a running tally. Great for decisions and practice. Runs in your browser.",
        title: "Coin Flip",
        description: "Flip a virtual coin with a single click. The counter keeps track of heads and tails so you can see the distribution over time.",
        keywords: ["coin flip", "flip a coin", "coin toss", "heads or tails", "virtual coin", "coin flipper"],
        faqs: [
          { q: "Is this a fair coin?", a: "Yes — the result is generated with a secure random number generator, so heads and tails are equally likely." },
          { q: "Is there a limit on flips?", a: "No. You can flip as many times as you like, and the running totals always stay visible." },
        ],
        related: [
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Random Group Generator", zh: "名单随机分组", ja: "ランダムグループ分け", ko: "랜덤 그룹 나누기", ru: "Случайные группы" }, href: "/tools/group-randomizer" },
        ],
        labels: { result: "Result", heads: "Heads", tails: "Tails", headsCount: "Heads", tailsCount: "Tails", total: "Total" },
        buttons: { flip: "Flip Coin", reset: "Reset" },
      },
      zh: {
        metaTitle: "抛硬币 - 在线虚拟抛硬币",
        metaDesc: "在线虚拟抛硬币，记录正反面统计次数，可用于决策或练习。所有操作都在浏览器本地完成。",
        title: "抛硬币",
        description: "一键抛掷虚拟硬币，计数器会记录正反面次数，方便观察分布情况。",
        keywords: ["抛硬币", "掷硬币", "硬币正反面", "随机硬币", "抛硬币决定", "在线硬币"],
        faqs: [
          { q: "硬币公平吗？", a: "公平。结果由安全的随机数生成器产生，正反面概率各占一半。" },
          { q: "抛掷次数有限制吗？", a: "没有限制，可以一直抛，累计次数始终可见。" },
        ],
        related: [
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Random Group Generator", zh: "名单随机分组", ja: "ランダムグループ分け", ko: "랜덤 그룹 나누기", ru: "Случайные группы" }, href: "/tools/group-randomizer" },
        ],
        labels: { result: "结果", heads: "正面", tails: "反面", headsCount: "正面", tailsCount: "反面", total: "总次数" },
        buttons: { flip: "抛硬币", reset: "重置" },
      },
      ja: {
        metaTitle: "コイントス - オンラインでコインを投げる",
        metaDesc: "仮想コインをオンラインで投げ、表裏の統計を記録。決断や練習に便利。ブラウザ内で完結します。",
        title: "コイントス",
        description: "クリックひとつで仮想コインを投げ、表と裏の回数を記録して分布を確認できます。",
        keywords: ["コイントス", "コインを投げる", "表裏", "オンラインコイン", "くじ引き", "コインフリップ"],
        faqs: [
          { q: "公平なコインですか？", a: "はい。安全な乱数生成で表裏が等確率になるようになっています。" },
          { q: "回数に制限はありますか？", a: "いいえ。何度でも投げられ、累計は常に表示されます。" },
        ],
        related: [
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Random Group Generator", zh: "名单随机分组", ja: "ランダムグループ分け", ko: "랜덤 그룹 나누기", ru: "Случайные группы" }, href: "/tools/group-randomizer" },
        ],
        labels: { result: "結果", heads: "表", tails: "裏", headsCount: "表", tailsCount: "裏", total: "合計" },
        buttons: { flip: "コインを投げる", reset: "リセット" },
      },
      ko: {
        metaTitle: "동전 던지기 - 온라인 가상 동전",
        metaDesc: "가상 동전을 온라인으로 던지고 앞뒷면 통계를 기록합니다. 결정이나 연습에 유용하며 브라우저에서 완료됩니다.",
        title: "동전 던지기",
        description: "클릭 한 번으로 가상 동전을 던지고, 앞면과 뒷면 횟수를 기록해 분포를 확인할 수 있습니다.",
        keywords: ["동전 던지기", "동전 토스", "앞뒷면", "가상 동전", "온라인 동전", "동전 선택"],
        faqs: [
          { q: "공정한 동전인가요?", a: "네. 안전한 난수 생성기로 앞뒷면 확률이 동일합니다." },
          { q: "던지는 횟수 제한이 있나요?", a: "없습니다. 몇 번이든 던질 수 있으며 누적 횟수가 항상 표시됩니다." },
        ],
        related: [
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Random Group Generator", zh: "名单随机分组", ja: "ランダムグループ分け", ko: "랜덤 그룹 나누기", ru: "Случайные группы" }, href: "/tools/group-randomizer" },
        ],
        labels: { result: "결과", heads: "앞면", tails: "뒷면", headsCount: "앞면", tailsCount: "뒷면", total: "합계" },
        buttons: { flip: "던지기", reset: "초기화" },
      },
      ru: {
        metaTitle: "Монетка - подбросить монету онлайн",
        metaDesc: "Подбросьте виртуальную монету онлайн со счётчиком орлов и решек. Удобно для решений и тренировки. Всё в браузере.",
        title: "Монетка",
        description: "Подбросьте виртуальную монету одним кликом. Счётчик ведёт учёт орлов и решек, чтобы вы видели распределение.",
        keywords: ["подбросить монету", "орёл или решка", "монетка онлайн", "виртуальная монета", "жребий", "бросок монеты"],
        faqs: [
          { q: "Монета честная?", a: "Да — результат генерируется защищённым генератором случайных чисел, орёл и решка равновероятны." },
          { q: "Есть ли лимит бросков?", a: "Нет. Бросайте сколько угодно — счётчик всегда перед глазами." },
        ],
        related: [
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
          { name: { en: "Random Group Generator", zh: "名单随机分组", ja: "ランダムグループ分け", ko: "랜덤 그룹 나누기", ru: "Случайные группы" }, href: "/tools/group-randomizer" },
        ],
        labels: { result: "Результат", heads: "Орёл", tails: "Решка", headsCount: "Орёл", tailsCount: "Решка", total: "Всего" },
        buttons: { flip: "Подбросить", reset: "Сбросить" },
      },
    },
  },
  {
    slug: "dice-roller",
    icon: "🎲",
    home: {
      en: { name: "Dice Roller", description: "Roll 1-10 dice and see the total instantly." },
      zh: { name: "掷骰子", description: "一次性掷 1-10 个骰子，立即显示总和。" },
      ja: { name: "サイコロ", description: "1〜10個のサイコロを振り、合計を即座に表示。" },
      ko: { name: "주사위", description: "주사위 1-10개를 굴려 합계를 즉시 확인합니다." },
      ru: { name: "Кубики", description: "Бросьте 1-10 кубиков и мгновенно узнайте сумму." },
    },
    tools: {
      en: {
        metaTitle: "Dice Roller - Roll 1-10 Dice Online",
        metaDesc: "Free online dice roller. Roll between 1 and 10 dice with realistic faces and an instant total. Runs entirely in your browser.",
        title: "Dice Roller",
        description: "Choose how many dice to roll (1 to 10), then roll them to see each face and the total. Handy for board games and tabletop RPGs.",
        keywords: ["dice roller", "roll dice", "d20", "dice online", "board game dice", "dice simulator"],
        faqs: [
          { q: "How many dice can I roll at once?", a: "Between 1 and 10 dice per roll, and you can roll as many times as you want." },
          { q: "Are the rolls random?", a: "Yes — each die uses a secure random number generator, so every face is equally likely." },
        ],
        related: [
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
        ],
        labels: { total: "Total", diceCount: "Number of dice" },
        buttons: { roll: "Roll Dice", reset: "Reset" },
      },
      zh: {
        metaTitle: "掷骰子 - 在线掷 1-10 个骰子",
        metaDesc: "免费在线掷骰子工具，支持 1-10 个骰子，真实骰面并即时计算总和。全程在浏览器本地完成。",
        title: "掷骰子",
        description: "选择要掷的骰子数量（1-10 个），即可查看每个骰面与总和，适合桌游和跑团使用。",
        keywords: ["掷骰子", "骰子", "在线骰子", "骰子模拟", "桌面游戏骰子", "投骰子"],
        faqs: [
          { q: "一次能掷多少个骰子？", a: "每次可掷 1 到 10 个，且不限次数。" },
          { q: "结果是随机的吗？", a: "是。每个骰子使用安全随机数生成器，每个骰面概率均等。" },
        ],
        related: [
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
        ],
        labels: { total: "总和", diceCount: "骰子数量" },
        buttons: { roll: "掷骰子", reset: "重置" },
      },
      ja: {
        metaTitle: "サイコロ - オンラインで1〜10個を振る",
        metaDesc: "1〜10個のサイコロを振れる無料ツール。リアルな出目と合計を即表示。ブラウザ内で完結します。",
        title: "サイコロ",
        description: "振るサイコロの数（1〜10個）を選ぶだけで、各出目と合計を確認できます。ボードゲームやTRPGに便利。",
        keywords: ["サイコロ", "サイコロを振る", "オンラインサイコロ", "ダイス", "ボードゲーム", "ダイスロール"],
        faqs: [
          { q: "一度に何個振れますか？", a: "1〜10個まで振れ、何度でも繰り返せます。" },
          { q: "結果はランダムですか？", a: "はい。安全な乱数生成で各出目が等確率です。" },
        ],
        related: [
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
        ],
        labels: { total: "合計", diceCount: "サイコロの数" },
        buttons: { roll: "振る", reset: "リセット" },
      },
      ko: {
        metaTitle: "주사위 - 온라인 1-10개 굴리기",
        metaDesc: "주사위 1-10개를 굴릴 수 있는 무료 도구입니다. 실제 주사위 면과 합계를 즉시 확인하며 브라우저에서 완료됩니다.",
        title: "주사위",
        description: "굴릴 주사위 수(1-10개)를 선택하면 각 면과 합계를 확인할 수 있습니다. 보드게임과 TRPG에 유용합니다.",
        keywords: ["주사위", "주사위 굴리기", "온라인 주사위", "다이스", "보드게임 주사위", "주사위 시뮬레이터"],
        faqs: [
          { q: "한 번에 몇 개까지 굴릴 수 있나요?", a: "1개부터 10개까지이며 횟수 제한은 없습니다." },
          { q: "결과는 무작위인가요?", a: "네. 각 주사위는 안전한 난수 생성기를 사용해 모든 면이 동일한 확률입니다." },
        ],
        related: [
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
        ],
        labels: { total: "합계", diceCount: "주사위 개수" },
        buttons: { roll: "굴리기", reset: "초기화" },
      },
      ru: {
        metaTitle: "Кубики - бросить 1-10 кубиков онлайн",
        metaDesc: "Бесплатный онлайн-бросок кубиков. Бросайте от 1 до 10 кубиков с реалистичными гранями и мгновенной суммой. Всё в браузере.",
        title: "Кубики",
        description: "Выберите количество кубиков (от 1 до 10) и бросьте их, чтобы увидеть каждую грань и сумму. Удобно для настольных игр.",
        keywords: ["бросить кубик", "кубики онлайн", "кости", "d20", "настольные игры", "симулятор кубиков"],
        faqs: [
          { q: "Сколько кубиков можно бросить за раз?", a: "От 1 до 10 за бросок, а самих бросков может быть сколько угодно." },
          { q: "Бросок случайный?", a: "Да — каждая кость использует защищённый генератор случайных чисел, все грани равновероятны." },
        ],
        related: [
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Random Number Generator", zh: "随机数生成", ja: "乱数生成", ko: "난수 생성", ru: "Генератор чисел" }, href: "/tools/random-number-generator" },
          { name: { en: "Random Picker", zh: "随机抽签", ja: "ランダム抽選", ko: "랜덤 뽑기", ru: "Случайный выбор" }, href: "/tools/random-picker" },
        ],
        labels: { total: "Сумма", diceCount: "Количество кубиков" },
        buttons: { roll: "Бросить", reset: "Сбросить" },
      },
    },
  },
  {
    slug: "random-picker",
    icon: "🎯",
    home: {
      en: { name: "Random Picker", description: "Draw one or more names at random from a list." },
      zh: { name: "随机抽签", description: "从名单中随机抽取一个或多个名字。" },
      ja: { name: "ランダム抽選", description: "リストから名前をランダムに1つ以上抽選します。" },
      ko: { name: "랜덤 뽑기", description: "목록에서 이름을 무작위로 하나 이상 뽑습니다." },
      ru: { name: "Случайный выбор", description: "Случайно вытяните одно или несколько имён из списка." },
    },
    tools: {
      en: {
        metaTitle: "Random Picker - Pick a Name at Random Online",
        metaDesc: "Free online random picker. Enter a list of names and draw one or several winners at random. Perfect for raffles and giveaways. Runs in your browser.",
        title: "Random Picker",
        description: "Paste a list of names, choose how many to draw, and pick the winners at random. Great for class calls, raffles and lucky draws.",
        keywords: ["random picker", "pick a name", "random name selector", "name wheel", "raffle picker", "lucky draw"],
        faqs: [
          { q: "Can I draw more than one name?", a: "Yes — set the number of names to draw, and duplicates are avoided automatically." },
          { q: "Is the drawing fair?", a: "Yes. Names are selected with a secure random number generator." },
        ],
        related: [
          { name: { en: "Random Group Generator", zh: "名单随机分组", ja: "ランダムグループ分け", ko: "랜덤 그룹 나누기", ru: "Случайные группы" }, href: "/tools/group-randomizer" },
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { list: "Name list", placeholder: "Enter names, one per line (commas, semicolons and tabs also work)", count: "Number to draw", result: "Result" },
        buttons: { pick: "Pick Random" },
      },
      zh: {
        metaTitle: "随机抽签 - 在线随机抽取名字",
        metaDesc: "免费在线随机抽签工具，输入名单后可随机抽取一个或多个名字，适合课堂点名、抽奖等场景。全程在浏览器本地完成。",
        title: "随机抽签",
        description: "粘贴名单并选择抽取数量，即可随机抽取中奖者。适合课堂点名、抽奖和幸运抽选。",
        keywords: ["随机抽签", "随机点名", "抽签工具", "名字抽取", "抽奖", "点名器"],
        faqs: [
          { q: "可以一次抽取多个名字吗？", a: "可以。设置抽取数量即可，且会自动避免重复。" },
          { q: "抽取公平吗？", a: "公平。名字由安全随机数生成器选取。" },
        ],
        related: [
          { name: { en: "Random Group Generator", zh: "名单随机分组", ja: "ランダムグループ分け", ko: "랜덤 그룹 나누기", ru: "Случайные группы" }, href: "/tools/group-randomizer" },
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { list: "名单", placeholder: "输入名单，每行一个（也支持逗号、分号、Tab）", count: "抽取数量", result: "抽取结果" },
        buttons: { pick: "随机抽取" },
      },
      ja: {
        metaTitle: "ランダム抽選 - オンラインで名前を抽選",
        metaDesc: "名前リストからランダムに1つ以上を抽選する無料ツール。授業の指名や抽選会に最適。ブラウザ内で完結します。",
        title: "ランダム抽選",
        description: "名前リストを貼り付け、抽選数を選ぶだけで当選者をランダムに決定できます。",
        keywords: ["ランダム抽選", "抽選ツール", "名前を抽選", "くじ引き", "当選者", "指名"],
        faqs: [
          { q: "複数名を一度に抽選できますか？", a: "はい。抽選数を指定すれば、重複なしで抽選できます。" },
          { q: "抽選は公平ですか？", a: "はい。安全な乱数生成器で名前を選びます。" },
        ],
        related: [
          { name: { en: "Random Group Generator", zh: "名单随机分组", ja: "ランダムグループ分け", ko: "랜덤 그룹 나누기", ru: "Случайные группы" }, href: "/tools/group-randomizer" },
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { list: "名前リスト", placeholder: "名前を1行に1つ入力（カンマ、セミコロン、タブも可）", count: "抽選数", result: "抽選結果" },
        buttons: { pick: "ランダム抽選" },
      },
      ko: {
        metaTitle: "랜덤 뽑기 - 온라인 이름 추첨",
        metaDesc: "이름 목록에서 무작위로 하나 이상 뽑는 무료 도구입니다. 수업 지명, 추첨, 경품 이벤트에 적합하며 브라우저에서 완료됩니다.",
        title: "랜덤 뽑기",
        description: "이름 목록을 붙여넣고 뽑을 개수를 선택하면 무작위로 당첨자를 결정합니다.",
        keywords: ["랜덤 뽑기", "이름 추첨", "제비뽑기", "당첨자 뽑기", "추첨기", "이름 선택기"],
        faqs: [
          { q: "한 번에 여러 명을 뽑을 수 있나요?", a: "네. 뽑을 개수를 지정하면 중복 없이 추첨됩니다." },
          { q: "추첨은 공정한가요?", a: "네. 안전한 난수 생성기로 이름을 선택합니다." },
        ],
        related: [
          { name: { en: "Random Group Generator", zh: "名单随机分组", ja: "ランダムグループ分け", ko: "랜덤 그룹 나누기", ru: "Случайные группы" }, href: "/tools/group-randomizer" },
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { list: "이름 목록", placeholder: "이름을 한 줄에 하나씩 입력 (쉼표, 세미콜론, 탭도 가능)", count: "뽑을 개수", result: "추첨 결과" },
        buttons: { pick: "랜덤 추첨" },
      },
      ru: {
        metaTitle: "Случайный выбор - выбрать имя онлайн",
        metaDesc: "Бесплатный онлайн-выбор имени. Введите список и случайно вытяните одного или несколько победителей. Идеально для лотерей и розыгрышей. Всё в браузере.",
        title: "Случайный выбор",
        description: "Вставьте список имён, укажите количество победителей и вытяните их случайным образом. Подходит для лотерей и розыгрышей.",
        keywords: ["случайный выбор", "выбрать имя", "генератор имён", "лотерея онлайн", "розыгрыш", "случайное имя"],
        faqs: [
          { q: "Можно ли вытянуть несколько имён?", a: "Да — укажите количество, и дубликаты исключаются автоматически." },
          { q: "Выбор честный?", a: "Да. Имена выбираются защищённым генератором случайных чисел." },
        ],
        related: [
          { name: { en: "Random Group Generator", zh: "名单随机分组", ja: "ランダムグループ分け", ko: "랜덤 그룹 나누기", ru: "Случайные группы" }, href: "/tools/group-randomizer" },
          { name: { en: "Coin Flip", zh: "抛硬币", ja: "コイントス", ko: "동전 던지기", ru: "Монетка" }, href: "/tools/coin-flip" },
          { name: { en: "Dice Roller", zh: "掷骰子", ja: "サイコロ", ko: "주사위", ru: "Кубики" }, href: "/tools/dice-roller" },
        ],
        labels: { list: "Список имён", placeholder: "Введите имена, по одному на строку (также работают запятая, точка с запятой, табуляция)", count: "Сколько вытянуть", result: "Результат" },
        buttons: { pick: "Выбрать" },
      },
    },
  },
];

const dir = join(process.cwd(), "scripts", "tool-data");
for (const entry of TOOLS) {
  writeFileSync(join(dir, `${entry.slug}.json`), JSON.stringify(build(entry), null, 2) + "\n", "utf8");
  console.log(`wrote ${entry.slug}.json`);
}
