import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "json-to-code";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  faqs: [
    { question: "Is it safe to paste API responses or customer data into a JSON converter?", answer: "Yes, when the tool runs entirely client-side. ToolkitLife's converters parse the JSON and generate code inside your browser tab with no network requests and no storage, so sensitive payloads never leave your machine." },
    { question: "How are arrays with inconsistent fields handled?", answer: "The converter merges the shapes of all objects in an array: it takes the union of keys and marks any field that is missing from some items as optional, so the generated type reflects what the API actually returns." },
    { question: "What is the difference between optional and nullable fields?", answer: "Optional means the key may be absent entirely; nullable means the key is present but can be null. They map to different constructs — e.g. ? versus T | null in TypeScript, pointers versus zero values in Go, Option<T> in Rust — and the converter preserves the distinction." },
    { question: "Is there a size or depth limit for the input JSON?", answer: "Large samples of several megabytes are fine because parsing happens locally. Extremely deep nesting is capped at a fixed depth: generation falls back to generic map types there to keep the output readable." },
  ],
  relatedTools: [
    { name: "JSON to TypeScript", href: "/tools/json-to-typescript" },
    { name: "JSON to Go struct", href: "/tools/json-to-go" },
    { name: "JSON to Python dataclass", href: "/tools/json-to-python" },
  ],
  relatedArticles: meta.relatedArticles,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const post = await getTranslatedPost(locale, slug, basePost);
  const url = `https://toolkitlife.com/${locale}/blog/${post.slug}`;
  const ogImage = ogImageUrl({ title: post.title, type: "blog" });
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
      languages: {
        en: `https://toolkitlife.com/en/blog/${post.slug}`,
        es: `https://toolkitlife.com/es/blog/${post.slug}`,
        zh: `https://toolkitlife.com/zh/blog/${post.slug}`,
        ja: `https://toolkitlife.com/ja/blog/${post.slug}`,
        ko: `https://toolkitlife.com/ko/blog/${post.slug}`,
        ru: `https://toolkitlife.com/ru/blog/${post.slug}`,
        "x-default": `https://toolkitlife.com/en/blog/${post.slug}`,
      },
    },
    openGraph: { title: post.title, description: post.description, url, siteName: "ToolkitLife", type: "article", publishedTime: post.datePublished, modifiedTime: post.dateModified, tags: post.tags, images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [ogImage] },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const post = await getTranslatedPost(locale, slug, basePost);
  const localized = blogContent[slug];
  const localeKey = (
    Object.prototype.hasOwnProperty.call(localized.faqs, locale) ? locale : "en"
  ) as keyof typeof localized.faqs;
  return (
    <BlogPost locale={locale} post={{ ...post, faqs: localized.faqs[localeKey] }}>
      {localized[localeKey]}
    </BlogPost>
  );
}
