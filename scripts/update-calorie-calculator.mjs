// One-off: align calorie-calculator labels/options with reference page (units, activity descriptions, results table).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const extraLabels = {
  en: {
    unit: "Unit",
    metric: "Metric",
    imperial: "Imperial",
    weightLbs: "Weight (lbs)",
    feet: "Feet",
    inches: "Inches",
    maintain: "Daily Calories to Maintain",
    bmrResult: "BMR",
    weightLoss: "Weight Loss",
    weightGain: "Weight Gain",
    losePerWeek: "Lose {value} lb/week",
    gainPerWeek: "Gain {value} lb/week",
    calPerDay: "{value} cal/day",
  },
  zh: {
    unit: "单位",
    metric: "公制",
    imperial: "英制",
    weightLbs: "体重（磅）",
    feet: "英尺",
    inches: "英寸",
    maintain: "每日维持热量",
    bmrResult: "基础代谢率（BMR）",
    weightLoss: "减重",
    weightGain: "增重",
    losePerWeek: "每周减 {value} 磅",
    gainPerWeek: "每周增 {value} 磅",
    calPerDay: "{value} 卡/天",
  },
  ja: {
    unit: "単位",
    metric: "メートル法",
    imperial: "ヤード・ポンド法",
    weightLbs: "体重（lbs）",
    feet: "フィート",
    inches: "インチ",
    maintain: "維持に必要な1日のカロリー",
    bmrResult: "基礎代謝（BMR）",
    weightLoss: "減量",
    weightGain: "増量",
    losePerWeek: "毎週 {value} ポンド減量",
    gainPerWeek: "毎週 {value} ポンド増量",
    calPerDay: "{value} カロリー/日",
  },
  ko: {
    unit: "단위",
    metric: "미터법",
    imperial: "야드파운드법",
    weightLbs: "체중 (lbs)",
    feet: "피트",
    inches: "인치",
    maintain: "유지에 필요한 일일 칼로리",
    bmrResult: "기초대사량 (BMR)",
    weightLoss: "체중 감량",
    weightGain: "체중 증가",
    losePerWeek: "주당 {value}파운드 감량",
    gainPerWeek: "주당 {value}파운드 증가",
    calPerDay: "{value} 칼로리/일",
  },
};

const activityDesc = {
  en: {
    sedentaryDesc: "Little or no exercise, desk job",
    lightDesc: "Light exercise 1-3 days/week",
    moderateDesc: "Moderate exercise 3-5 days/week",
    activeDesc: "Hard exercise 6-7 days/week",
    veryActiveDesc: "Intense exercise + physical job",
  },
  zh: {
    sedentaryDesc: "很少或没有运动，久坐办公",
    lightDesc: "轻度运动，每周 1-3 天",
    moderateDesc: "中度运动，每周 3-5 天",
    activeDesc: "高强度运动，每周 6-7 天",
    veryActiveDesc: "高强度训练 + 体力劳动",
  },
  ja: {
    sedentaryDesc: "ほとんど運動なし、デスクワーク",
    lightDesc: "軽い運動 週1〜3日",
    moderateDesc: "中程度の運動 週3〜5日",
    activeDesc: "ハードな運動 週6〜7日",
    veryActiveDesc: "激しい運動＋肉体労働",
  },
  ko: {
    sedentaryDesc: "거의 운동 없음, 사무직",
    lightDesc: "가벼운 운동 주 1-3일",
    moderateDesc: "중간 강도 운동 주 3-5일",
    activeDesc: "격렬한 운동 주 6-7일",
    veryActiveDesc: "강도 높은 운동 + 육체노동",
  },
};

const guideItems = {
  en: "View your daily calorie needs, updated live as you type.",
  zh: "查看实时计算的每日卡路里需求。",
  ja: "入力とともにリアルタイムに更新される1日のカロリー必要量を確認します。",
  ko: "입력과 함께 실시간으로 업데이트되는 일일 칼로리 필요량을 확인하세요.",
};

for (const lang of ["en", "zh", "ja", "ko"]) {
  const file = join(root, "messages", `${lang}.json`);
  const data = JSON.parse(readFileSync(file, "utf8"));
  const tool = data.tools?.["calorie-calculator"];
  if (!tool) {
    console.error(`SKIP ${lang}: calorie-calculator not found`);
    continue;
  }
  Object.assign(tool.labels, extraLabels[lang]);
  Object.assign(tool.options, activityDesc[lang]);
  if (tool.guide?.howTo?.items?.length) {
    tool.guide.howTo.items[tool.guide.howTo.items.length - 1] = guideItems[lang];
  }
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`updated ${lang}.json`);
}
console.log("done");
