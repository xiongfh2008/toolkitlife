import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "how-to-convert-text-to-speech";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  faqs: [
    { question: "Is text to speech free?", answer: "Yes. Modern browsers include the Web Speech API which provides text-to-speech for free with no limits. The voices are built into your operating system. No server processing, no signup required." },
    { question: "What languages are supported?", answer: "Most browsers support 20+ languages including English, Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Italian, and more. The exact voices depend on your OS." },
    { question: "Can I download the audio?", answer: "The Web Speech API is designed for real-time listening, not file export. For downloadable audio files, you need a server-side TTS service. Browser-based TTS is best for proofreading, accessibility, and learning." },
    { question: "Why do some voices sound robotic?", answer: "Browsers include both basic and premium voices. Premium voices (like Apple's Siri voices or Google's WaveNet voices) sound more natural but may need to be downloaded first in your OS settings." },
  ],
  relatedTools: [
    { name: "Text to Speech", href: "/tools/text-to-speech" },
  ],
  relatedArticles: meta.relatedArticles,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const post = await getTranslatedPost(locale, slug, basePost);
  const url = `https://www.toolkitlife.com/${locale}/blog/${post.slug}`;
  const ogImage = ogImageUrl({ title: post.title, type: "blog" });
  return {
    title: `${post.title} — ToolkitLife`,
    description: post.description,
    alternates: {
      canonical: url,
      languages: {
        en: `https://www.toolkitlife.com/en/blog/${post.slug}`,
        zh: `https://www.toolkitlife.com/zh/blog/${post.slug}`,
        ja: `https://www.toolkitlife.com/ja/blog/${post.slug}`,
        ko: `https://www.toolkitlife.com/ko/blog/${post.slug}`,
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
