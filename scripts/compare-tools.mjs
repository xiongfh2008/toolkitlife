import fs from "fs";
import path from "path";

const liveTools = new Set([
  "video-watermark-remover", "photo-watermark-remover", "claude-code-text-formatter",
  "qr-code-generator", "color-palette-generator", "css-gradient-generator",
  "box-shadow-generator", "password-generator", "json-formatter", "base64-encoder",
  "lorem-ipsum-generator", "uuid-generator", "word-counter", "image-color-picker",
  "aspect-ratio-calculator", "unit-converter", "regex-tester", "markdown-preview",
  "fancy-text-generator", "image-compressor", "image-resizer", "convert",
  "background-remover", "diff-checker", "glassmorphism-generator", "css-clip-path",
  "css-loader-generator", "html-minifier", "css-minifier", "js-minifier",
  "favicon-generator", "color-contrast-checker", "text-case-converter",
  "timestamp-converter", "hash-generator", "jwt-decoder", "url-encoder",
  "cron-generator", "svg-blob-generator", "svg-wave-generator", "image-to-base64",
  "barcode-generator", "html-entity-encoder", "chmod-calculator",
  "color-shades-generator", "image-crop", "meta-tag-generator",
  "robots-txt-generator", "neumorphism-generator", "json-to-csv",
  "placeholder-image", "css-text-shadow", "css-flexbox", "css-grid",
  "invoice-generator", "url-slug-generator", "exif-viewer", "noise-generator",
  "og-preview", "css-border-radius", "color-converter", "html-table-generator",
  "css-cubic-bezier", "bionic-reading", "css-background-pattern", "image-filters",
  "json-validator", "pixel-art", "mortgage-calculator", "compound-interest-calculator",
  "loan-calculator", "percentage-calculator", "tip-calculator", "salary-calculator",
  "auto-loan-calculator", "retirement-calculator", "savings-calculator",
  "investment-calculator", "bmi-calculator", "calorie-calculator", "tdee-calculator",
  "body-fat-calculator", "macro-calculator", "profit-margin-calculator",
  "discount-calculator", "sales-tax-calculator", "roi-calculator", "age-calculator",
  "payment-calculator", "paycheck-calculator", "interest-calculator",
  "inflation-calculator", "401k-calculator", "amortization-calculator",
  "income-tax-calculator", "tax-calculator", "obbba-tax-calculator",
  "electricity-cost-calculator", "medicaid-work-requirement-calculator",
  "debt-payoff-calculator", "hourly-to-salary-calculator", "budget-calculator",
  "simple-interest-calculator", "net-worth-calculator", "stock-profit-calculator",
  "credit-card-payoff-calculator", "down-payment-calculator", "dividend-calculator",
  "fire-calculator", "vat-calculator", "break-even-calculator",
  "mortgage-affordability-calculator", "apr-calculator", "student-loan-calculator",
  "capital-gains-tax-calculator", "gpa-calculator", "grade-calculator",
  "random-number-generator", "countdown-timer", "stopwatch", "scientific-calculator",
  "fraction-calculator", "character-counter", "text-repeater", "binary-converter",
  "color-mixer", "css-transform-generator", "pregnancy-calculator", "pace-calculator",
  "bmr-calculator", "waist-to-hip-ratio-calculator", "water-intake-calculator",
  "calorie-deficit-calculator", "protein-calculator", "ideal-weight-calculator",
  "sleep-calculator"
]);

const toolsDir = path.join(process.cwd(), "src/app/[locale]/tools");
const existingSlugs = new Set(
  fs.readdirSync(toolsDir)
    .filter((name) => fs.statSync(path.join(toolsDir, name)).isDirectory())
);

const missing = [...liveTools].filter((s) => !existingSlugs.has(s));
const extra = [...existingSlugs].filter((s) => !liveTools.has(s));

console.log("Missing tools count:", missing.length);
console.log("Missing slugs:");
for (const s of missing) console.log(`- ${s}`);

console.log("\nExisting but not on live site count:", extra.length);
for (const s of extra) console.log(`- ${s}`);
