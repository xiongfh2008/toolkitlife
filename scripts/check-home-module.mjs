/**
 * Verify which shared chunks each page actually loads, and estimate the
 * source-level size of the home.ts data blocks (scenes vs search aliases).
 * Usage: node scripts/check-home-module.mjs [baseUrl]
 */
import fs from "fs";

const base = process.argv[2] ?? "http://localhost:3001";

// 1. Source-level size split of src/data/home.ts
const src = fs.readFileSync("src/data/home.ts", "utf8");
const lines = src.split("\n");
const aliasStart = src.indexOf("export const SEARCH_ALIASES");
const aliasLen = aliasStart >= 0 ? src.length - aliasStart : 0;
const scenesLen = src.length - aliasLen;
console.log("home.ts source bytes:", src.length);
console.log(`  scenes+derived block: ~${scenesLen} B`);
console.log(`  SEARCH_ALIASES block: ~${aliasLen} B`);

// 2. Which chunks does each page load?
const pages = [
  ["/en", "home"],
  ["/en/tools/1rm-calculator", "tool"],
  ["/en/blog/how-to-build-a-resume", "blog"],
];
(async () => {
  for (const [u, n] of pages) {
    const r = await fetch(base + u);
    const h = await r.text();
    const srcs = [...h.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
    const local = srcs.filter((s) => s.startsWith("/_next/static/chunks"));
    console.log(`\n${n} (${local.length} local scripts):`);
    console.log(local.join("\n"));
  }
})();
