import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow everything
      {
        userAgent: "*",
        allow: "/",
      },
      // AI search-augmented crawlers — explicit allow drives AI citations
      {
        userAgent: ["PerplexityBot", "GPTBot", "OAI-SearchBot", "ClaudeBot", "Google-Extended", "Applebot-Extended"],
        allow: "/",
      },
      // Aggressive scraper — block by default
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
    ],
    sitemap: "https://www.toolkitlife.com/sitemap.xml",
  };
}
