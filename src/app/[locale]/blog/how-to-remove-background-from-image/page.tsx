import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "how-to-remove-background-from-image";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  faqs: [
    { question: "Can I remove a background without damaging the subject?", answer: "Yes. AI mode is designed to keep the main subject intact while erasing the background. Use high-contrast source images and check the edges after processing. For solid-color backgrounds, color mode with a low tolerance setting removes only the matched color, leaving the subject untouched." },
    { question: "What image format should I use for a transparent background?", answer: "PNG supports full transparency, so always download your result as a PNG when you need a transparent background. JPG flattens transparency to white and WebP supports transparency but is less widely supported by older editors and platforms." },
    { question: "Is AI background removal really free and private?", answer: "Yes. The Background Remover runs entirely in your browser — the AI model and color algorithm execute locally on your device. No image is uploaded to a server, no account is required, and nothing is stored." },
    { question: "How do I get clean edges on hair and fur?", answer: "Use AI mode, which is trained to handle fine, complex edges like hair strands and fur. Avoid color mode for these cases, since color matching cannot distinguish similar-colored hair from the background." },
  ],
  relatedTools: [
    { name: "Background Remover", href: "/tools/background-remover" },
    { name: "Background Replace", href: "/tools/background-replace" },
    { name: "ID Photo Generator", href: "/tools/id-photo-generator" },
  ],
  relatedArticles: meta.relatedArticles,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const post = await getTranslatedPost(locale, slug, basePost);
  const url = `https://www.toolkitlife.com/${locale}/blog/${post.slug}`;
  const ogImage = ogImageUrl({ title: post.title, type: "blog" });
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
      languages: {
        en: `https://www.toolkitlife.com/en/blog/${post.slug}`,
        zh: `https://www.toolkitlife.com/zh/blog/${post.slug}`,
        ja: `https://www.toolkitlife.com/ja/blog/${post.slug}`,
        ko: `https://www.toolkitlife.com/ko/blog/${post.slug}`,
        ru: `https://www.toolkitlife.com/ru/blog/${post.slug}`,
        "x-default": `https://www.toolkitlife.com/en/blog/${post.slug}`,
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
