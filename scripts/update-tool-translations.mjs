import fs from "fs";
import path from "path";

const root = process.cwd();
const slugs = [
  "mortgage-calculator",
  "auto-loan-calculator",
  "salary-calculator",
  "interest-calculator",
  "inflation-calculator",
  "profit-margin-calculator",
  "tax-calculator",
  "income-tax-calculator",
  "amortization-calculator",
  "obbba-tax-calculator",
  "electricity-cost-calculator",
  "medicaid-work-requirement-calculator",
  "claude-code-text-formatter",
  "fancy-text-generator",
  "bionic-reading",
  "image-crop",
  "image-filters",
  "image-compressor",
  "background-remover",
  "convert",
  "svg-wave-generator",
];

const extraTranslations = {
  "fancy-text-generator": {
    options: {
      serif: "Serif",
      sans: "Sans Serif",
      bold: "Bold",
      italic: "Italic",
      boldItalic: "Bold Italic",
      monospace: "Monospace",
      script: "Script",
      gothic: "Gothic",
      doubleStruck: "Double Struck",
      circled: "Circled",
      squared: "Squared",
    },
  },
};

const acronymMap = {
  pmi: "PMI",
  kwh: "kWh",
  csv: "CSV",
  svg: "SVG",
};

function humanize(key) {
  const lower = key.toLowerCase();
  if (acronymMap[lower]) return acronymMap[lower];
  const spaced = key
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([0-9]+)([a-zA-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function defaultValue(keyPath) {
  const category = keyPath[0];
  const leaf = keyPath[keyPath.length - 1];
  if (category === "placeholders") {
    if (leaf === "input") return "Enter or paste your text here";
    if (leaf === "output") return "Result will appear here";
    return `Enter ${humanize(leaf).toLowerCase()}`;
  }
  return humanize(leaf);
}

function setPath(obj, keyPath, value) {
  let cur = obj;
  for (let i = 0; i < keyPath.length - 1; i++) {
    const k = keyPath[i];
    if (!cur[k] || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  }
  cur[keyPath[keyPath.length - 1]] = value;
}

function extractStaticKeys(source) {
  const regex = /(?<!\w)t\((["'])([^"']+)\1\)/g;
  const keys = [];
  let m;
  while ((m = regex.exec(source)) !== null) {
    keys.push(m[2]);
  }
  return [...new Set(keys)];
}

function buildGeneratedTranslations() {
  const generated = {};
  for (const slug of slugs) {
    const file = path.join(root, "src/app/[locale]/tools", slug, "page.tsx");
    const src = fs.readFileSync(file, "utf8");
    const keys = extractStaticKeys(src);
    const slugExtra = extraTranslations[slug] || {};

    for (const key of keys) {
      if (key.startsWith("metadata.")) continue;
      const parts = key.split(".");
      setPath(generated, [slug, ...parts], defaultValue(parts));
    }

    // merge extras
    function mergeExtras(target, source) {
      for (const [k, v] of Object.entries(source)) {
        if (typeof v === "object" && v !== null) {
          if (!target[k] || typeof target[k] !== "object") target[k] = {};
          mergeExtras(target[k], v);
        } else {
          target[k] = v;
        }
      }
    }
    if (!generated[slug]) generated[slug] = {};
    mergeExtras(generated[slug], slugExtra);
  }
  return generated;
}

function mergeTranslations(existing, generated, isEnglish) {
  for (const [slug, slugObj] of Object.entries(generated)) {
    if (!existing[slug]) existing[slug] = {};
    mergeObject(existing[slug], slugObj, isEnglish);
  }
}

function mergeObject(target, source, isEnglish) {
  for (const [k, v] of Object.entries(source)) {
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      if (!target[k] || typeof target[k] !== "object" || Array.isArray(target[k])) {
        target[k] = {};
      }
      mergeObject(target[k], v, isEnglish);
    } else {
      if (isEnglish || target[k] === undefined || target[k] === "") {
        target[k] = v;
      }
    }
  }
}

function main() {
  const generated = buildGeneratedTranslations();

  for (const fileName of ["en.json", "zh.json", "ja.json", "ko.json"]) {
    const filePath = path.join(root, "messages", fileName);
    const messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!messages.tools) messages.tools = {};
    mergeTranslations(messages.tools, generated, fileName === "en.json");
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2) + "\n", "utf8");
    console.log(`Updated ${fileName}`);
  }
}

main();
