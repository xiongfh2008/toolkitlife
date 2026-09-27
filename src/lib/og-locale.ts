// 语言代码 → OpenGraph 标准 locale（BCP-47 → POSIX 风格）
export const ogLocaleMap: Record<string, string> = {
  en: "en_US",
  zh: "zh_CN",
  ja: "ja_JP",
  ko: "ko_KR",
  ru: "ru_RU",
  es: "es_ES",
  de: "de_DE",
  fr: "fr_FR",
  pt: "pt_BR",
};

// og:locale:alternate values for published locales only — de/fr/pt serve
// English fallback until translated, so they are not advertised yet.
export const publishedOgLocales: string[] = [
  "en_US",
  "zh_CN",
  "ja_JP",
  "ko_KR",
  "ru_RU",
  "es_ES",
];
