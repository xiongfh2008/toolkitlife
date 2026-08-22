import fs from "fs";
import path from "path";

/**
 * Add the `ru` entry to every alternates.languages block that hardcodes the
 * four original locales. Handles two shapes:
 *   tools dir layout.tsx      →  ko: `.../ko/tools/<slug>`,
 *   blog dir page.tsx         →  ko: `.../ko/blog/${post.slug}`,
 * Idempotent: skips files that already contain a /ru/ alternates line.
 */
const appDir = path.join(process.cwd(), "src", "app", "[locale]");
const targets = [];

for (const entry of fs.readdirSync(path.join(appDir, "tools"), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const p = path.join(appDir, "tools", entry.name, "layout.tsx");
  if (fs.existsSync(p)) targets.push(p);
}
for (const entry of fs.readdirSync(path.join(appDir, "blog"), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const p = path.join(appDir, "blog", entry.name, "page.tsx");
  if (fs.existsSync(p)) targets.push(p);
}

let updated = 0;
let skipped = 0;
const problems = [];

for (const file of targets) {
  let src = fs.readFileSync(file, "utf-8");
  // Repair any `undefined` prefix leaked by a previous buggy run.
  const repaired = src.replace(/^undefined([ \t]*ru:)/gm, "$1");
  if (repaired !== src) fs.writeFileSync(file, repaired);
  src = repaired;
  if (src.includes("/ru/")) {
    skipped++;
    continue;
  }
  // NOTE: no `g` flag — match() must return capture groups.
  const koLineRe = /^([ \t]*)ko: `https:\/\/www\.toolkitlife\.com\/ko\/(tools\/[a-z0-9-]+|blog\/\$\{post\.slug\})`,$/m;
  const lines = src.split("\n");
  let changed = false;
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(koLineRe);
    if (m) {
      const indent = m[1];
      const ruUrl = m[0].replace("/ko/", "/ru/").replace("ko:", "ru:");
      lines.splice(i + 1, 0, `${indent}${ruUrl}`);
      changed = true;
    }
  }
  if (!changed) {
    problems.push(path.relative(process.cwd(), file));
    continue;
  }
  fs.writeFileSync(file, lines.join("\n"));
  updated++;
}

console.log(`updated: ${updated}`);
console.log(`skipped (already has ru): ${skipped}`);
if (problems.length) {
  console.log(`problems (${problems.length}):`);
  for (const p of problems) console.log("  " + p);
} else {
  console.log("problems: none");
}
