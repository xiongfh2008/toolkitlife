import type { Metadata } from "next";
import { blogContent, type LocaleKey } from "@/data/blog-content";
import { publishedLocales } from "@/i18n/routing";

const SITE = "https://toolkitlife.com";

/**
 * Locales for which a blog post has real localized body AND FAQ content.
 * en/zh/ja/ko are required by the BlogContent type; ru/es are optional.
 * Locales missing from this list fall back to the English body on the page,
 * so they must never be declared as indexable alternates for that post.
 */
export function blogBodyLocales(slug: string): string[] {
  const content = blogContent[slug];
  if (!content) return ["en"];
  return publishedLocales.filter(
    (locale) =>
      Boolean(content[locale as LocaleKey]) &&
      Object.prototype.hasOwnProperty.call(content.faqs, locale)
  );
}

export function isBlogBodyLocalized(slug: string, locale: string): boolean {
  return blogBodyLocales(slug).includes(locale);
}

/**
 * Shared indexability + hreflang signals for every blog post page. This is the
 * single source of truth for the blog fallback policy:
 * - locales with real localized content are indexable and form the post's
 *   hreflang cluster (x-default → English);
 * - locales without localized content (e.g. ru/es on older posts that only
 *   have an English body) get noindex,follow with a self-referencing
 *   canonical, so English-fallback content is never indexed as if it were a
 *   localized article.
 */
export function blogIndexSignals(
  slug: string,
  locale: string
): Pick<Metadata, "robots" | "alternates"> {
  const available = blogBodyLocales(slug);
  const languages: Record<string, string> = {};
  for (const l of available) {
    languages[l] = `${SITE}/${l}/blog/${slug}`;
  }
  languages["x-default"] = `${SITE}/en/blog/${slug}`;
  return {
    robots: {
      index: available.includes(locale),
      follow: true,
    },
    alternates: {
      canonical: `${SITE}/${locale}/blog/${slug}`,
      languages,
    },
  };
}
