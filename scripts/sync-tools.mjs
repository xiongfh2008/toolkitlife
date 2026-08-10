import fs from "fs";
import path from "path";

const htmlPath =
  process.argv[2] ||
  "C:/Users/xiong/AppData/Local/Temp/trae/toolcall-output/780aec95-23d4-497c-abac-54e45fa218b7.txt";
const html = fs.readFileSync(htmlPath, "utf-8");
const lines = html.split(/\r?\n/);

const CATEGORIES = new Set([
  "Developer",
  "Design",
  "Text",
  "Utility",
  "Finance",
  "Legal",
  "Health",
  "Home & Energy",
  "Marketing",
]);

const links = [];
const titles = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const linkMatch = line.match(
    /^\[([^\]]+)\]\(https:\/\/toolkitlife\.com\/tools\/([a-z0-9-]+)\)/
  );
  if (linkMatch) {
    const text = linkMatch[1].trim();
    const slug = linkMatch[2];
    links.push({ index: i, text, slug, isCategory: CATEGORIES.has(text) });
    continue;
  }

  const titleMatch = line.match(
    /^## \[([^\]]+)\]\(https:\/\/toolkitlife\.com\/tools\/([a-z0-9-]+)\)/
  );
  if (titleMatch) {
    titles.push({
      index: i,
      title: titleMatch[1].trim(),
      slug: titleMatch[2],
    });
  }
}

const liveTools = titles.map((t) => {
  const toolLinks = links.filter((l) => l.slug === t.slug);
  const iconLink = toolLinks
    .filter((l) => l.index < t.index && !l.isCategory)
    .pop();
  const descLink = toolLinks.find(
    (l) => l.index > t.index && !l.isCategory
  );
  const catLink = toolLinks.find(
    (l) => l.index > t.index && l.isCategory
  );

  return {
    slug: t.slug,
    title: t.title,
    icon: iconLink?.text || "",
    description: descLink?.text || "",
    category: catLink?.text || "Utility",
  };
});

console.log(`Parsed ${liveTools.length} tools from live site.`);

const messagesDir = path.join(process.cwd(), "messages");
const toolsDir = path.join(process.cwd(), "src/app/[locale]/tools");
const locales = ["en", "zh", "ja", "ko"];

const existingSlugs = new Set(
  fs
    .readdirSync(toolsDir)
    .filter((name) => fs.statSync(path.join(toolsDir, name)).isDirectory())
);

const categoryTranslations = {
  en: {
    All: "All",
    Developer: "Developer",
    Design: "Design",
    Text: "Text",
    Utility: "Utility",
    Finance: "Finance",
    Legal: "Legal",
    Health: "Health",
    "Home & Energy": "Home & Energy",
    Marketing: "Marketing",
    Math: "Math",
  },
  zh: {
    All: "全部",
    Developer: "开发者",
    Design: "设计",
    Text: "文本",
    Utility: "实用工具",
    Finance: "金融",
    Legal: "法律",
    Health: "健康",
    "Home & Energy": "家居与能源",
    Marketing: "营销",
    Math: "数学",
  },
  ja: {
    All: "すべて",
    Developer: "開発者",
    Design: "デザイン",
    Text: "テキスト",
    Utility: "ユーティリティ",
    Finance: "ファイナンス",
    Legal: "法務",
    Health: "健康",
    "Home & Energy": "住宅・エネルギー",
    Marketing: "マーケティング",
    Math: "数学",
  },
  ko: {
    All: "전체",
    Developer: "개발자",
    Design: "디자인",
    Text: "텍스트",
    Utility: "유틸리티",
    Finance: "금융",
    Legal: "법률",
    Health: "건강",
    "Home & Energy": "주택 및 에너지",
    Marketing: "마케팅",
    Math: "수학",
  },
};

for (const locale of locales) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  messages.home.categories = categoryTranslations[locale];

  const homeTools = {};
  for (const tool of liveTools) {
    homeTools[tool.slug] = {
      name: tool.title,
      description: tool.description,
      category: tool.category,
      icon: tool.icon,
    };
  }
  messages.home.tools = homeTools;

  messages.tools = messages.tools || {};
  for (const tool of liveTools) {
    const existing = messages.tools[tool.slug];
    const metadata = {
      title: tool.title,
      description: tool.description,
      category: tool.category,
    };
    if (!existing) {
      messages.tools[tool.slug] = {
        metadata,
        keywords: [],
        faqs: [],
        relatedTools: [],
      };
    } else {
      existing.metadata = metadata;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
  console.log(`Updated messages/${locale}.json`);
}

let created = 0;
for (const tool of liveTools) {
  if (existingSlugs.has(tool.slug)) continue;

  const dir = path.join(toolsDir, tool.slug);
  fs.mkdirSync(dir, { recursive: true });

  const componentName = tool.slug
    .replace(/(^|-)([a-z])/g, (_, __, letter) => letter.toUpperCase())
    .replace(/-/g, "")
    + "Page";

  const content = `"use client";

import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function ${componentName}() {
  const t = useTranslations("tools.${tool.slug}");

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="${tool.slug}"
    >
      <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-8 text-center">
        <div className="mb-4 text-4xl">🚧</div>
        <h2 className="mb-2 text-xl font-semibold text-zinc-100">
          Coming Soon
        </h2>
        <p className="text-zinc-400">
          This tool is not yet implemented.
        </p>
      </div>
    </ToolLayout>
  );
}
`;

  fs.writeFileSync(path.join(dir, "page.tsx"), content);
  created++;
}

console.log(`Created ${created} stub tool page(s).`);
