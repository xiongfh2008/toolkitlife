import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "how-to-compress-video";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  faqs: [
    { question: "How much can I compress a video?", answer: "Typically 50-90% depending on the original quality and settings. A 100 MB video can often be compressed to 10-30 MB at medium quality with barely noticeable difference. The key factors are resolution, bitrate, and codec efficiency." },
    { question: "What is CRF and how does it affect quality?", answer: "CRF (Constant Rate Factor) controls quality in H.264 encoding. Lower CRF = higher quality and larger file. CRF 18 is visually lossless, 23 is the default, 28 is good for most web use, and 35+ is noticeable compression. Each 6-point increase roughly halves the file size." },
    { question: "Should I reduce resolution when compressing?", answer: "Only if the video will be viewed on smaller screens. A 4K video compressed to 1080p will be much smaller with minimal quality loss on phones and laptops. But if the video will be viewed on large screens or projected, keep the original resolution and use CRF compression instead." },
    { question: "What is the best video codec for compression?", answer: "H.264 (AVC) is the most compatible and widely supported. H.265 (HEVC) offers 30-50% better compression but slower encoding and less device support. VP9 (WebM) is good for web. For maximum compatibility, stick with H.264 in an MP4 container." },
    { question: "Is it safe to compress videos online?", answer: "It depends on the tool. Cloud-based compressors upload your video to a server, which raises privacy concerns for personal or confidential content. Browser-based tools like ToolkitLife process everything locally on your device — your video never leaves your computer." },
  ],
  relatedTools: [
    { name: "Video Compressor", href: "/tools/video-compressor" },
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
