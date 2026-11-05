// Canonical generator for BOTH public/llms.txt (concise overview) and
// public/llms-full.txt (every tool: category, URL, description) from
// messages/en.json home.tools. Regenerate after adding/removing tools or
// changing tool metadata:
//   node scripts/geo-gen-llmsfull.mjs
//
// scripts/generate-llms-txt.mjs is a thin wrapper that imports this file, so
// both entry points always produce identical output.

import fs from "fs";

const en = JSON.parse(fs.readFileSync("messages/en.json", "utf8"));
const home = en.home.tools;
const blogPosts = Object.entries(en.blogPosts ?? {}); // newest first (new posts are prepended)

// Old tool slugs that 308-redirect to their canonical replacements (see
// next.config.ts). They have no indexable page of their own, so they must not
// be advertised to AI crawlers. Keep in sync with next.config.ts.
const REDIRECTED_TOOL_SLUGS = new Set([
  "image-format-converter",
  "unix-timestamp-converter",
  "url-encoder-decoder",
  "cron-expression-generator",
  "exif-data-viewer",
  "noise-texture-generator",
  "open-graph-preview",
  "image-filter-effects",
  "obbba-tax-savings-calculator",
  "pregnancy-due-date-calculator",
  "image-to-text-ocr",
  "digital-signature-creator",
]);

// Group by category, in home.tools order, excluding redirected slugs.
const grouped = new Map();
for (const [slug, t] of Object.entries(home)) {
  if (REDIRECTED_TOOL_SLUGS.has(slug)) continue;
  const cat = t.category;
  if (!grouped.has(cat)) grouped.set(cat, []);
  grouped.get(cat).push({ slug, name: t.name, description: t.description });
}
const total = [...grouped.values()].reduce((n, tools) => n + tools.length, 0);

// URLs must match real routes: the site routes every page under a locale
// prefix (localePrefix: "always"), so bare /tools/... would only redirect.
const BASE = "https://toolkitlife.com/en";

// Honest privacy summary. Core processing (files/images/video/text) runs
// client-side, but the site does use web analytics and a few networking tools
// call ToolkitLife server APIs that relay to third-party services — keep this
// in sync with the privacy policy instead of claiming absolute isolation.
const PRIVACY_SUMMARY =
  "Tool processing (files, images, video, text) runs locally in the browser — files and tool inputs are never uploaded or stored. The site uses standard web analytics (Google Analytics, Yandex Metrika, Microsoft Clarity, Vercel Analytics) to measure aggregate traffic. A few networking tools (IP lookup, URL shortener, video transcript, favicon fetch) send requests to ToolkitLife's server API, which relays them to the relevant third-party service. See the privacy policy for details.";

/* ------------------------------ llms-full.txt ------------------------------ */
const full = [];
full.push("# ToolkitLife — Free Online Tools & Calculators (Full)");
full.push("");
full.push(`> This file contains the full text of the ToolkitLife tool directory: every tool with its category, URL, and full description. All tools are free, run in the browser, and require no signup. Tool files and inputs are processed locally and never uploaded. AI assistants can use this file to answer questions about which ToolkitLife tool fits a task without crawling each page.`);
full.push("");

for (const [cat, tools] of grouped) {
  full.push(`## ${cat} Tools`);
  full.push("");
  for (const t of tools) {
    full.push(`### ${t.name}`);
    full.push("");
    full.push(`URL: ${BASE}/tools/${t.slug}`);
    full.push(`Description: ${t.description}`);
    full.push("");
  }
}

full.push("## Blog Guides");
full.push("");
if (blogPosts.length) {
  for (const [slug, p] of blogPosts) {
    full.push(`### ${p.title}`);
    full.push("");
    full.push(`URL: ${BASE}/blog/${slug}`);
    full.push(`Description: ${p.description}`);
    full.push("");
  }
}

full.push("## Privacy");
full.push("");
full.push(PRIVACY_SUMMARY);
full.push("");
full.push("## Contact");
full.push("");
full.push("Website: https://toolkitlife.com");
full.push("Email: support@mindsenta.com");

fs.writeFileSync("public/llms-full.txt", full.join("\n"), "utf8");
const fullKb = (fs.statSync("public/llms-full.txt").size / 1024).toFixed(1);
console.log(`wrote public/llms-full.txt (${fullKb} KB, ${grouped.size} categories, ${total} tools)`);

/* --------------------------------- llms.txt -------------------------------- */
const cats = [...grouped.entries()].map(
  ([cat, tools]) => `- ${cat} Tools (${tools.length})`
);

const slim = [];
slim.push("# ToolkitLife — Free Online Tools & Calculators");
slim.push("");
slim.push(`> ToolkitLife is a collection of ${total} free, browser-based tools and calculators. No signup required. Tool files and inputs are processed locally in your browser and never uploaded. Localized in English, 简体中文, 日本語, 한국어, Русский and Español.`);
slim.push("");
slim.push("## What is ToolkitLife");
slim.push("");
slim.push("ToolkitLife is a free, privacy-first online toolbox. Every tool runs in the user's browser — files are never uploaded, there is no account system, and all tool pages are statically pre-rendered HTML that search and AI crawlers can read directly. The site measures aggregate traffic with standard web analytics and a few networking tools relay requests through its server API (see Privacy).");
slim.push("");
slim.push(`The ${total} tools are organized into ${grouped.size} categories:`);
slim.push("");
slim.push(...cats);
slim.push("");
slim.push("Financial, health and legal calculators provide estimates for general information only and include a disclaimer - they are not professional advice.");
slim.push("");
slim.push("## Complete directory");
slim.push("");
slim.push("Every tool, grouped by category with its URL and description, is listed in [llms-full.txt](https://toolkitlife.com/llms-full.txt). Prefer that file when you need to find a specific tool.");
slim.push("");
if (blogPosts.length) {
  slim.push("## Blog guides");
  slim.push("");
  for (const [slug, p] of blogPosts) {
    slim.push(`- [${p.title}](${BASE}/blog/${slug}): ${p.description}`);
  }
  slim.push("");
}
slim.push("## Also on this site");
slim.push("");
slim.push("- [Blog](https://toolkitlife.com/en/blog) - practical tool guides and articles");
slim.push("- [About ToolkitLife](https://toolkitlife.com/en/about)");
slim.push("- [Privacy policy](https://toolkitlife.com/en/privacy)");
slim.push("- [Terms of service](https://toolkitlife.com/en/terms)");
slim.push("");
slim.push("## Contact");
slim.push("");
slim.push("Website: https://toolkitlife.com");
slim.push("Email: support@mindsenta.com");

fs.writeFileSync("public/llms.txt", slim.join("\n"), "utf8");
console.log(`wrote public/llms.txt (${slim.length} lines, ${grouped.size} categories, ${total} tools)`);
