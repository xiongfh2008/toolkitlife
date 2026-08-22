import fs from "fs";
import path from "path";

/**
 * Add the `ru` alternate link to every hardcoded `alternates.languages` block
 * in tool layouts / blog pages / legal pages. Idempotent: skips files that
 * already contain an `ru:` entry pointing at toolkitlife.com.
 */
const appDir = path.join(process.cwd(), "src", "app");

const files = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".tsx")) files.push(p);
  }
};
walk(appDir);

let updated = 0;
let skipped = 0;
for (const file of files) {
  let src = fs.readFileSync(file, "utf-8");
  if (!/ko: (["`])https:\/\/www\.toolkitlife\.com\/ko/.test(src)) continue;
  if (/ru: (["`])https:\/\/www\.toolkitlife\.com\/ru/.test(src)) {
    skipped++;
    continue;
  }
  const next = src.replace(
    /(^[ \t]*ko: (["`])https:\/\/www\.toolkitlife\.com\/ko[^"`]*\2,\r?\n)/m,
    (m, koLine) => {
      const indent = m.match(/^[ \t]*/)[0];
      const quote = koLine.includes("`") ? "`" : '"';
      const pathPart = koLine.match(/\/ko([^`"]*)/)[1];
      return (
        koLine +
        `${indent}ru: ${quote}https://www.toolkitlife.com/ru${pathPart}${quote},\n`
      );
    }
  );
  if (next === src) {
    console.log(`NO MATCH: ${file}`);
    continue;
  }
  fs.writeFileSync(file, next, "utf-8");
  updated++;
}
console.log(`updated: ${updated}, already had ru: ${skipped}`);
