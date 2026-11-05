// SEO consistency validator — run with: node scripts/check-seo-consistency.mjs
// (or: npm run check:seo)
//
// Guards the invariants documented in docs/seo-audit-baseline.md:
//   1. home.tools slugs ↔ tool route folders are 1:1
//   2. Redirected slugs (next.config.ts) have no route folder, no messages
//      entry, and never appear in sitemap / llms.txt / llms-full.txt
//   3. Simulated sitemap URLs all resolve to real routes (published locales
//      only, blog pages exist)
//   4. relatedTools hrefs in every locale resolve to real routes
//   5. Blog relatedTools/relatedArticles resolve to real routes
//   6. No duplicate tool metadata titles/descriptions
//   7. llms.txt/llms-full.txt URLs are locale-prefixed and resolvable
//   8. Faker city anchors have valid coordinates
//
// Exits non-zero if any check fails, so it can run in CI.

import fs from "fs";
import path from "path";

const root = process.cwd();
let failures = 0;
const fail = (msg) => { failures++; console.error("  ✗ " + msg); };
const ok = (msg) => console.log("  ✓ " + msg);

const TOOLS_DIR = path.join(root, "src", "app", "[locale]", "tools");
const BLOG_DIR = path.join(root, "src", "app", "[locale]", "blog");
const LOCALES = ["en", "zh", "ja", "ko", "ru", "es", "de", "fr", "pt"];
const PUBLISHED = ["en", "zh", "ja", "ko", "ru", "es"];

const load = (loc) => JSON.parse(fs.readFileSync(path.join(root, "messages", `${loc}.json`), "utf8"));
const toolRouteExists = (slug) => fs.existsSync(path.join(TOOLS_DIR, slug, "page.tsx"));
const blogRouteExists = (slug) => fs.existsSync(path.join(BLOG_DIR, slug, "page.tsx"));

// Pull redirect sources out of next.config.ts (regex — config is simple).
const REDIRECTED_SLUGS = (() => {
  const cfg = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
  const slugs = [...cfg.matchAll(/\/:locale\/tools\/([a-z0-9-]+)", destination/g)].map((m) => m[1]);
  if (!slugs.length) fail("could not parse redirects from next.config.ts");
  return new Set(slugs);
})();

console.log("\n[1/8] tool routes ↔ messages");
const en = load("en");
const msgSlugs = Object.keys(en.home.tools);
const routeSlugs = fs.readdirSync(TOOLS_DIR).filter((d) => toolRouteExists(d));
for (const s of msgSlugs) if (!toolRouteExists(s)) fail(`messages slug has no route: ${s}`);
for (const s of routeSlugs) if (!en.home.tools[s]) fail(`route has no messages entry: ${s}`);
for (const s of REDIRECTED_SLUGS) {
  if (toolRouteExists(s)) fail(`redirected slug still has a route folder: ${s}`);
  if (en.home.tools[s]) fail(`redirected slug still in home.tools: ${s}`);
}
ok(`${msgSlugs.length} message slugs, ${routeSlugs.length} routes, ${REDIRECTED_SLUGS.size} redirects — consistent`);

console.log("\n[2/8] sitemap simulation");
let sitemapUrls = 0;
const staticPaths = ["", "/about", "/privacy", "/terms"];
for (const loc of PUBLISHED) {
  for (const p of staticPaths) {
    if (!fs.existsSync(path.join(root, "src", "app", "[locale]", p === "" ? "page.tsx" : `${p}/page.tsx`))) {
      fail(`sitemap static path has no page: /${loc}${p}`);
    }
    sitemapUrls++;
  }
  sitemapUrls++; // /blog index
  for (const slug of Object.keys(en.blogPosts ?? {})) {
    if (!blogRouteExists(slug)) fail(`sitemap blog slug has no page: /${loc}/blog/${slug}`);
    sitemapUrls++;
  }
  for (const slug of msgSlugs) {
    if (REDIRECTED_SLUGS.has(slug)) continue;
    if (!toolRouteExists(slug)) fail(`sitemap tool slug has no page: /${loc}/tools/${slug}`);
    sitemapUrls++;
  }
}
ok(`sitemap simulates ${sitemapUrls} URLs, all resolve`);

console.log("\n[3/8] relatedTools hrefs (all 9 locales)");
for (const loc of LOCALES) {
  const m = load(loc);
  for (const [slug, t] of Object.entries(m.tools ?? {})) {
    for (const r of t.relatedTools ?? []) {
      const target = r.href.replace(/^\/tools\//, "");
      if (!toolRouteExists(target)) fail(`${loc}: ${slug} -> broken related tool ${r.href}`);
    }
  }
}
ok("all relatedTools hrefs resolve");

console.log("\n[4/8] blog internal links");
const blogPosts = en.blogPosts ?? {};
for (const [slug, p] of Object.entries(blogPosts)) {
  for (const r of p.relatedTools ?? []) {
    if (!toolRouteExists(r.href.replace(/^\/tools\//, ""))) fail(`blog ${slug}: broken tool link ${r.href}`);
  }
  for (const a of p.relatedArticles ?? []) {
    if (!blogRouteExists(a.href.replace(/^\/blog\//, ""))) fail(`blog ${slug}: broken article link ${a.href}`);
  }
}
for (const d of fs.readdirSync(BLOG_DIR)) {
  const f = path.join(BLOG_DIR, d, "page.tsx");
  if (!fs.existsSync(f)) continue;
  const content = fs.readFileSync(f, "utf8");
  for (const m of content.matchAll(/\/tools\/([a-z0-9-]+)/g)) {
    if (!toolRouteExists(m[1])) fail(`blog page ${d}: broken /tools/${m[1]} link`);
  }
}
ok("blog links resolve");

console.log("\n[5/8] duplicate metadata titles/descriptions");
const titles = new Map();
const descs = new Map();
for (const [slug] of Object.entries(en.home.tools)) {
  // Tool page metadata lives under tools.{slug}.metadata (per-tool layouts
  // read it from there), not under home.tools.
  const meta = en.tools?.[slug]?.metadata;
  const title = meta?.title;
  const desc = meta?.description;
  if (title) {
    if (titles.has(title)) fail(`duplicate metadata.title: "${title}" (${titles.get(title)} + ${slug})`);
    titles.set(title, slug);
  } else fail(`tool ${slug}: missing metadata.title`);
  if (desc) {
    if (descs.has(desc)) fail(`duplicate metadata.description: "${desc.slice(0, 50)}…" (${descs.get(desc)} + ${slug})`);
    descs.set(desc, slug);
  } else fail(`tool ${slug}: missing metadata.description`);
}
ok(`${titles.size} unique titles, ${descs.size} unique descriptions`);

console.log("\n[6/8] llms.txt / llms-full.txt URLs");
for (const file of ["public/llms.txt", "public/llms-full.txt"]) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  const urls = [...content.matchAll(/https:\/\/toolkitlife\.com(?:\/[a-z-]+)*\/(?:tools|blog)\/[a-z0-9-]+/g)].map((u) => u[0]);
  for (const url of urls) {
    const m = url.match(/^https:\/\/toolkitlife\.com\/([a-z-]+)\/(tools|blog)\/([a-z0-9-]+)$/);
    if (!m || !PUBLISHED.includes(m[1])) { fail(`${file}: URL missing published locale prefix: ${url}`); continue; }
    const [, , kind, slug] = m;
    if (kind === "tools" && !toolRouteExists(slug)) fail(`${file}: URL has no route: ${url}`);
    if (kind === "blog" && !blogRouteExists(slug)) fail(`${file}: URL has no page: ${url}`);
    if (kind === "tools" && REDIRECTED_SLUGS.has(slug)) fail(`${file}: redirected slug advertised: ${url}`);
  }
  ok(`${file}: ${urls.length} URLs checked`);
}

console.log("\n[7/8] tool layout hreflang pattern");
const HREFLANG_SNIPPETS = ["en:", "es:", "zh:", "ja:", "ko:", "ru:", '"x-default"'];
const toolDirs = fs.readdirSync(TOOLS_DIR).filter((d) => fs.existsSync(path.join(TOOLS_DIR, d, "layout.tsx")));
for (const d of toolDirs) {
  const c = fs.readFileSync(path.join(TOOLS_DIR, d, "layout.tsx"), "utf8");
  for (const snippet of HREFLANG_SNIPPETS) {
    if (!c.includes(snippet)) fail(`tool ${d}: layout.tsx alternates missing ${snippet}`);
  }
}
ok(`${toolDirs.length} tool layouts carry the 6 published locales + x-default`);

console.log("\n[8/8] faker city anchor coordinates");
{
  // Anchors live in a .ts data module — parse the RAW table rows directly.
  const src = fs.readFileSync(path.join(root, "src", "data", "address-cities.ts"), "utf8");
  const rawBlock = src.slice(src.indexOf("const RAW"), src.indexOf("export const CITY_ANCHORS"));
  const rows = [...rawBlock.matchAll(/"([^"]+|)".*/g)].length; // rough count for the summary
  // Row format: "city|region|zip1,zip2,...|lat,lng" — coords are validated as
  // numbers AFTER extraction so malformed values like "M53.4808" are caught.
  for (const m of rawBlock.matchAll(/"([^"]*)"/g)) {
    const parts = m[1].split("|");
    if (parts.length !== 4) continue; // not an anchor row
    const [city, region, zips, coords] = parts;
    const [latRaw, lngRaw] = coords.split(",");
    const lat = Number(latRaw), lng = Number(lngRaw);
    const key = `${city}/${region}`;
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) fail(`anchor ${key}: invalid latitude "${latRaw}"`);
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) fail(`anchor ${key}: invalid longitude "${lngRaw}"`);
    if (zips.split(",").some((z) => /^0+$/.test(z.trim()))) fail(`anchor ${key}: placeholder postcode "${zips}"`);
  }
  ok(`checked ~${rows} raw string rows`);
}

console.log("\n─────────────────────────────");
if (failures) {
  console.error(`✗ ${failures} problem(s) found.`);
  process.exit(1);
}
console.log("✓ all SEO consistency checks passed");
