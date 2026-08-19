import fs from "fs";
import path from "path";

/**
 * Regenerates public/llms.txt from the en message file so the AI-readable
 * index always covers every tool on the site.
 */
const root = process.cwd();
const en = JSON.parse(fs.readFileSync(path.join(root, "messages", "en.json"), "utf-8"));
const home = en.home.tools;
const base = "https://toolkitlife.com";

// Normalize category values: a few tools use non-standard category names.
const CAT_NORMALIZE = {
  Utilities: "Utility",
  "Video Tools": "Video",
  "Image Tools": "Design",
};

const byCat = new Map();
for (const [slug, t] of Object.entries(home)) {
  const cat = CAT_NORMALIZE[t.category] ?? t.category ?? "Other";
  if (!byCat.has(cat)) byCat.set(cat, []);
  byCat.get(cat).push({ slug, name: t.name, description: t.description });
}

const lines = [];
lines.push("# ToolkitLife — Free Online Tools & Calculators");
lines.push("");
lines.push(
  `> ToolkitLife is a collection of ${Object.keys(home).length} free, browser-based tools and calculators. No signup required. No data stored. All processing happens locally in the user's browser.`
);
lines.push("");
lines.push("## Tools");
lines.push("");
for (const [cat, items] of byCat) {
  lines.push(`### ${cat} Tools`);
  for (const { slug, name, description } of items) {
    lines.push(`- [${name}](${base}/tools/${slug}): ${description}`);
  }
  lines.push("");
}
lines.push("## Privacy");
lines.push(
  "All tools run entirely in the browser using JavaScript and WebAssembly. No files, text, images, or videos are ever uploaded to a server. No user data is collected or stored."
);
lines.push("");
lines.push("## Contact");
lines.push("Website: https://toolkitlife.com");

fs.writeFileSync(path.join(root, "public", "llms.txt"), lines.join("\n"));
console.log(`Generated llms.txt: ${Object.keys(home).length} tools in ${byCat.size} categories.`);
