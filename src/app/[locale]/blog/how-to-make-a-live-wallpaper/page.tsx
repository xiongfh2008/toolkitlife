import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "how-to-make-a-live-wallpaper";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  faqs: [
    { question: "Do live wallpapers drain battery?", answer: "Yes, more than a static image, because the GPU renders every frame. Dark, slow scenes exported at 30fps and a shorter loop reduce the impact. On OLED screens, dark palettes save the most power." },
    { question: "Does Windows 11 support video wallpapers natively?", answer: "No. Windows needs a third-party wallpaper app to play video backgrounds. Export an MP4 in H.264 from a browser tool and load it into your wallpaper app of choice." },
    { question: "What format should a live wallpaper be?", answer: "MP4 with H.264 video is the most compatible across wallpaper apps and Android devices. Some Android launchers also accept WebM. Match the video resolution to your screen to avoid soft, upscaled-looking output." },
  ],
  relatedTools: [
    { name: "Live Wallpaper Generator", href: "/tools/live-wallpaper-generator" },
    { name: "Wallpaper Generator", href: "/tools/wallpaper-generator" },
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
        es: `https://www.toolkitlife.com/es/blog/${post.slug}`,
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
