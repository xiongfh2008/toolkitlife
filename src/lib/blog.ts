import { getTranslations } from "next-intl/server";

export interface BaseBlogPost {
  slug: string;
  datePublished: string;
  dateModified: string;
  tags: string[];
  faqs?: { question: string; answer: string }[];
  relatedTools?: { name: string; href: string }[];
  relatedArticles?: { title: string; href: string }[];
}

export async function getTranslatedPost(
  locale: string,
  slug: string,
  base: Omit<BaseBlogPost, "title" | "description">
) {
  const t = await getTranslations({ locale, namespace: "blogPosts" });
  return {
    ...base,
    slug,
    title: t(`${slug}.title`),
    description: t(`${slug}.description`),
  };
}
