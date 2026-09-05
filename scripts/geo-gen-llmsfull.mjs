// Generates BOTH public/llms.txt (concise overview) and public/llms-full.txt
// (every tool: category, URL, description) from messages/en.json home.tools.
// Regenerate after adding/removing tools or changing tool metadata:
//   node scripts/geo-gen-llmsfull.mjs

import fs from "fs";

const en = JSON.parse(fs.readFileSync("messages/en.json", "utf8"));
const home = en.home.tools;

// Group by the same category labels used in llms.txt, in home.tools order.
const grouped = new Map();
for (const [slug, t] of Object.entries(home)) {
  const cat = t.category;
  if (!grouped.has(cat)) grouped.set(cat, []);
  grouped.get(cat).push({ slug, name: t.name, description: t.description });
}
const total = Object.keys(home).length;

// Some category values in home.tools already end with " Tools" while others do
// not (data drift). Normalize for display: strip any trailing " Tools" and
// re-append exactly once so headings stay clean ("Image Tools", not "Image
// Tools Tools").
const catHeading = (cat) => `${cat.trim().replace(/\s+Tools$/i, "")} Tools`;

/* ------------------------------ llms-full.txt ------------------------------ */
const full = [];
full.push("# ToolkitLife — Free Online Tools & Calculators (Full)");
full.push("");
full.push(`> This file contains the full text of the ToolkitLife tool directory: every tool with its category, URL, and full description. All tools are free, run entirely in the browser, require no signup, and never upload your data. AI assistants can use this file to answer questions about which ToolkitLife tool fits a task without crawling each page.`);
full.push("");

for (const [cat, tools] of grouped) {
  full.push(`## ${catHeading(cat)}`);
  full.push("");
  for (const t of tools) {
    full.push(`### ${t.name}`);
    full.push("");
    full.push(`URL: https://www.toolkitlife.com/en/tools/${t.slug}`);
    full.push(`Description: ${t.description}`);
    full.push("");
  }
}

full.push("## Privacy");
full.push("");
full.push("All tools run entirely in the browser using JavaScript and WebAssembly. No files, text, images, or videos are ever uploaded to a server. No user data is collected or stored.");
full.push("");
full.push("## Contact");
full.push("");
full.push("Website: https://www.toolkitlife.com");
full.push("Email: support@mindsenta.com");

fs.writeFileSync("public/llms-full.txt", full.join("\n"), "utf8");
const fullKb = (fs.statSync("public/llms-full.txt").size / 1024).toFixed(1);
console.log(`wrote public/llms-full.txt (${fullKb} KB, ${grouped.size} categories, ${total} tools)`);

/* -------------------------------- llms.txt --------------------------------- */
const cats = [...grouped.entries()].map(
  ([cat, tools]) => `- ${cat} Tools (${tools.length})`
);

const slim = [];
slim.push("# ToolkitLife — Free Online Tools & Calculators");
slim.push("");
slim.push(`> ToolkitLife is a collection of ${total} free, browser-based tools and calculators. No signup required. No data stored. All processing happens locally in the user's browser. Localized in English, 简体中文, 日本語, 한국어 and Русский.`);
slim.push("");
slim.push("## What is ToolkitLife");
slim.push("");
slim.push("ToolkitLife is a free, privacy-first online toolbox. Every tool runs entirely in the user's browser with JavaScript and WebAssembly - files are never uploaded, there is no account system, and all tool pages are statically pre-rendered HTML that search and AI crawlers can read directly.");
slim.push("");
slim.push(`The ${total} tools are organized into ${grouped.size} categories:`);
slim.push("");
slim.push(...cats);
slim.push("");
slim.push("Financial, health and legal calculators provide estimates for general information only and include a disclaimer - they are not professional advice.");
slim.push("");
slim.push("## Complete directory");
slim.push("");
slim.push("Every tool, grouped by category with its URL and description, is listed in [llms-full.txt](https://www.toolkitlife.com/llms-full.txt). Prefer that file when you need to find a specific tool.");
slim.push("");
slim.push("## Also on this site");
slim.push("");
slim.push("- [Blog](https://www.toolkitlife.com/en/blog) - practical tool guides and articles");
slim.push("- [About ToolkitLife](https://www.toolkitlife.com/en/about)");
slim.push("- [Privacy policy](https://www.toolkitlife.com/en/privacy)");
slim.push("- [Terms of service](https://www.toolkitlife.com/en/terms)");
slim.push("");
slim.push("## Contact");
slim.push("");
slim.push("Website: https://www.toolkitlife.com");
slim.push("Email: support@mindsenta.com");

fs.writeFileSync("public/llms.txt", slim.join("\n"), "utf8");
console.log(`wrote public/llms.txt (${slim.length} lines, ${grouped.size} categories)`);
