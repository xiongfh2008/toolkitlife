import fs from "fs";
import path from "path";
import { blogPostsMeta } from "@/data/blog-posts";

// RSS 2.0 feed for the blog (English, the default locale). Static at build time.
export const dynamic = "force-static";

export function GET() {
  const en = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "messages", "en.json"), "utf-8")
  );
  const posts = en.blogPosts ?? {};

  const items = [...blogPostsMeta]
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
    .map((post) => {
      const localized = posts[post.slug] ?? {};
      const url = `https://www.toolkitlife.com/en/blog/${post.slug}`;
      return `    <item>
      <title><![CDATA[${localized.title ?? post.slug}]]></title>
      <link>${url}</link>
      <guid isPermaLink="false">${url}</guid>
      <pubDate>${new Date(post.datePublished).toUTCString()}</pubDate>
      <description><![CDATA[${localized.description ?? ""}]]></description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ToolkitLife Blog</title>
    <link>https://www.toolkitlife.com/en/blog</link>
    <description>Free online tools and how-to guides from ToolkitLife</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://www.toolkitlife.com/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
