// IndexNow bulk submission to Bing / Yandex / Seznam / Naver.
// Usage:
//   node scripts/indexnow.mjs            # dry-run: fetch sitemap, print what would be submitted
//   node scripts/indexnow.mjs --submit   # submit all URLs from the live sitemap
//   node scripts/indexnow.mjs --submit /en/blog/my-post /zh/blog/my-post
//                                        # submit specific paths (for newly added pages)
import { readFileSync, existsSync } from "node:fs";

const HOST = "www.toolkitlife.com";
const KEY = "a5bb015485fb9ee7609462d034ae6f5a";
const keyFile = new URL(`../public/${KEY}.txt`, import.meta.url);

if (!existsSync(keyFile) || readFileSync(keyFile, "utf8").trim() !== KEY) {
  console.error(`Key file mismatch: public/${KEY}.txt must exist and contain the key.`);
  process.exit(1);
}

const submit = process.argv.includes("--submit");
const paths = process.argv.slice(2).filter((a) => !a.startsWith("--"));

let urlList;
if (paths.length > 0) {
  urlList = paths.map((p) => `https://${HOST}${p.startsWith("/") ? p : "/" + p}`);
} else {
  const sitemapUrl = `https://${HOST}/sitemap.xml`;
  console.log(`Fetching ${sitemapUrl} ...`);
  const sitemap = await (await fetch(sitemapUrl)).text();
  urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

if (urlList.length === 0) {
  console.error("No URLs found.");
  process.exit(1);
}

console.log(`${submit ? "Submitting" : "[dry-run] Would submit"} ${urlList.length} URLs to IndexNow`);
console.log(`First 3: ${urlList.slice(0, 3).join(", ")}`);
if (!submit) process.exit(0);

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});
console.log(`Response: ${res.status} ${res.statusText}`);
const body = await res.text();
if (body) console.log(body);
process.exit(res.ok ? 0 : 1);
