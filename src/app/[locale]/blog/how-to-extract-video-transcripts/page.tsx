import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "how-to-extract-video-transcripts";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  faqs: [
    { question: "Is it safe to paste my Bilibili SESSDATA cookie into the extractor?", answer: "The extractor sends SESSDATA only to bilibili.com as part of your own subtitle request; it is never logged or stored. That said, SESSDATA is a session credential, so treat it like a password — only use it in tools you trust, and log out and back in if you ever want to invalidate it." },
    { question: "Why does Bilibili always return zero subtitles without SESSDATA?", answer: "Since 2025, Bilibili's player API returns an empty subtitle list to every anonymous request, even for videos that visibly show AI subtitles in the web player. The subtitle data simply isn't in the response without login, so any tool needs your own SESSDATA cookie to read it." },
    { question: "Why can't I extract transcripts from TikTok, Douyin, or Twitter videos?", answer: "Those platforms don't expose subtitle data publicly and gate their detail APIs behind signed requests, so there is no caption track for any tool to read. Many of them don't produce subtitles at all. ToolkitLife supports the five platforms that do expose captions: YouTube, Bilibili, Vimeo, Dailymotion, and TED." },
    { question: "What's the difference between copying the text and downloading SRT/VTT?", answer: "Copying gives you the transcript as readable text with timestamps — ideal for notes, quotes, and LLM workflows. SRT/VTT downloads preserve exact per-segment timing in standard subtitle formats, which is what you want for video players, editors, or as a starting point for translating subtitles into another language." },
  ],
  relatedTools: [
    { name: "Video Transcript Extractor", href: "/tools/video-transcript" },
    { name: "Screen Recorder", href: "/tools/screen-recorder" },
    { name: "Video to GIF", href: "/tools/video-to-gif" },
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
