import fs from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const CITY_KEYS = [
  "london", "new_york", "los_angeles", "toronto", "sao_paulo", "berlin",
  "paris", "moscow", "dubai", "mumbai", "singapore", "beijing",
  "tokyo", "seoul", "sydney", "auckland",
];

const CITIES = {
  en: ["London", "New York", "Los Angeles", "Toronto", "São Paulo", "Berlin", "Paris", "Moscow", "Dubai", "Mumbai", "Singapore", "Beijing", "Tokyo", "Seoul", "Sydney", "Auckland"],
  zh: ["伦敦", "纽约", "洛杉矶", "多伦多", "圣保罗", "柏林", "巴黎", "莫斯科", "迪拜", "孟买", "新加坡", "北京", "东京", "首尔", "悉尼", "奥克兰"],
  ja: ["ロンドン", "ニューヨーク", "ロサンゼルス", "トロント", "サンパウロ", "ベルリン", "パリ", "モスクワ", "ドバイ", "ムンバイ", "シンガポール", "北京", "東京", "ソウル", "シドニー", "オークランド"],
  ko: ["런던", "뉴욕", "로스앤젤레스", "토론토", "상파울루", "베를린", "파리", "모스크바", "두바이", "뭄바이", "싱가포르", "베이징", "도쿄", "서울", "시드니", "오클랜드"],
  ru: ["Лондон", "Нью-Йорк", "Лос-Анджелес", "Торонто", "Сан-Паулу", "Берлин", "Париж", "Москва", "Дубай", "Мумбаи", "Сингапур", "Пекин", "Токио", "Сеул", "Сидней", "Окленд"],
  es: ["Londres", "Nueva York", "Los Ángeles", "Toronto", "São Paulo", "Berlín", "París", "Moscú", "Dubái", "Mumbai", "Singapur", "Pekín", "Tokio", "Seúl", "Sídney", "Auckland"],
  de: ["London", "New York", "Los Angeles", "Toronto", "São Paulo", "Berlin", "Paris", "Moskau", "Dubai", "Mumbai", "Singapur", "Peking", "Tokio", "Seoul", "Sydney", "Auckland"],
  fr: ["Londres", "New York", "Los Angeles", "Toronto", "São Paulo", "Berlin", "Paris", "Moscou", "Dubaï", "Mumbai", "Singapour", "Pékin", "Tokyo", "Séoul", "Sydney", "Auckland"],
  pt: ["Londres", "Nova York", "Los Angeles", "Toronto", "São Paulo", "Berlim", "Paris", "Moscou", "Dubai", "Mumbai", "Cingapura", "Pequim", "Tóquio", "Seul", "Sydney", "Auckland"],
};

const locales = Object.keys(CITIES);
if (Object.values(CITIES).some((arr) => arr.length !== CITY_KEYS.length)) {
  console.error("FAIL: city name count mismatch");
  process.exit(1);
}

for (const locale of locales) {
  const file = `${ROOT}messages/${locale}.json`;
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!data.tools || !data.tools["world-clock"]) {
    console.error(`FAIL: tools.world-clock missing in ${locale}`);
    process.exit(1);
  }
  const cities = {};
  CITY_KEYS.forEach((key, i) => {
    cities[key] = CITIES[locale][i];
  });
  data.tools["world-clock"].cities = cities;
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`${locale}: cities injected (${CITY_KEYS.length})`);
}
console.log("OK");
