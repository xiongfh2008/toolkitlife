import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "how-to-check-dead-pixels";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  image: "/blog/how-to-check-dead-pixels.jpg",
  faqs: [
    { question: "How many dead pixels are acceptable?", answer: "It depends on the manufacturer's policy. Most brands allow a small number before a screen qualifies for replacement, and a brand-new device within its return window can be exchanged regardless." },
    { question: "Can I test a screen before buying?", answer: "Yes — open a browser-based screen test on a display model and cycle through black, white and the RGB primaries. Nothing needs to be installed." },
    { question: "Is backlight bleed a defect?", answer: "A trace of bleed is inherent to LCD technology and usually not covered by warranty. It counts as a defect when clearly visible in normal use. OLED screens have no backlight and are immune." },
  ],
  relatedTools: [
    { name: "Screen Color Test", href: "/tools/screen-color-test" },
    { name: "Screen Recorder", href: "/tools/screen-recorder" },
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
