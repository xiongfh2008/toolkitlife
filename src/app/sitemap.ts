import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import { blogPostsMeta } from "@/data/blog-posts";
import { routing, publishedLocales } from "@/i18n/routing";

// Only published locales belong in the sitemap; de/fr/pt routes serve English
// fallback until their message files are translated.
const locales = [...publishedLocales];

// Every tool slug, derived from the en message file so newly added tools are
// included automatically instead of being maintained by hand here.
const tools = Object.keys(
  JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "messages", "en.json"), "utf-8")
  ).home.tools
);

// Keep in sync with the actual blog page directories: every listed slug must
// resolve to an existing page, otherwise search engines index 404s.
const blogSlugs = blogPostsMeta.map((p) => p.slug);

// Old tool slugs that 308-redirect to their canonical replacements (see the
// slug-alignment redirects in next.config.ts). Redirecting URLs must not be
// listed in the sitemap. Keep in sync with next.config.ts.
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

const staticPaths = ["", "/about", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://toolkitlife.com";

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const prefix = `${base}/${locale}`;

    for (const path of staticPaths) {
      entries.push({
        url: `${prefix}${path}`,
        changeFrequency: path === "" ? "weekly" : "yearly",
        priority: path === "" ? 1 : 0.5,
      });
    }

    entries.push({
      url: `${prefix}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
    });

    for (const slug of blogSlugs) {
      const meta = blogPostsMeta.find((p) => p.slug === slug);
      entries.push({
        url: `${prefix}/blog/${slug}`,
        lastModified: meta?.dateModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    for (const slug of tools) {
      if (REDIRECTED_TOOL_SLUGS.has(slug)) continue;
      entries.push({
        url: `${prefix}/tools/${slug}`,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
