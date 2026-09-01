import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "how-to-create-cartoon-avatar";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  faqs: [
    { question: "What is a Multiavatar?", answer: "A Multiavatar is a procedurally generated multicultural cartoon avatar. Any text input — a name, username, or phrase — produces a unique, symmetrical character. The same input always gives the same avatar, making it ideal for consistent online identities." },
    { question: "Is the Multiavatar generator free?", answer: "Yes. The generator runs entirely in your browser, so there is no server cost and no reason to charge. You can generate unlimited avatars and download them as SVG or PNG for free." },
    { question: "Can I use the generated avatar commercially?", answer: "Generated avatars are safe to use for profile pictures, apps, logos, and other projects. Since each avatar is generated from your text input, your unique avatar is effectively your own asset." },
    { question: "How is this different from other avatar generators?", answer: "Most generators are deterministic too, but Multiavatar's multicultural style combines elements inspired by cultures around the world into one character. It also offers SVG export, so the avatar scales cleanly from favicon to billboard." },
  ],
  relatedTools: [
    { name: "Multiavatar Avatar Generator", href: "/tools/multiavatar-avatar-generator" },
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
