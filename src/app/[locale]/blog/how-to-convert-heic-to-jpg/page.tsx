import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "how-to-convert-heic-to-jpg";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  faqs: [
    { question: "How do I convert an iPhone HEIC photo to JPG?", answer: "Use a browser-based converter. With ToolkitLife's HEIC to JPG tool you drop in your .heic file, choose JPG or PNG, and download the result — the conversion runs locally in your browser through WebAssembly, so the photo never leaves your device and there's no signup, watermark, or upload." },
    { question: "Are my photos uploaded to a server when converting HEIC online?", answer: "Not with this tool. The HEIC decoder is a WebAssembly build of an open-source library running inside your browser tab: the photo is read locally, decoded on your CPU, and re-encoded to JPG or PNG on your device. Nothing is transmitted — it even works with Wi-Fi turned off." },
    { question: "Should I convert HEIC to JPG or PNG?", answer: "For real camera photos, JPG is almost always right: photographic content compresses well, so quality loss at 90% quality is invisible while the file stays small. PNG is only worth choosing for screenshots or graphics with flat colors, where lossless pixels matter more than file size." },
    { question: "Why does my .heif or renamed .heic file fail to convert?", answer: "The tool decodes genuine .heic images. Some .heif container variants fail, and files that were merely renamed from another format (like a .jpg renamed to .heic) can't be decoded at all. Open the photo in your album app, re-export it as a proper image file, and convert that fresh copy." },
  ],
  relatedTools: [
    { name: "HEIC to JPG", href: "/tools/heic" },
    { name: "Image Compressor", href: "/tools/image-compressor" },
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
