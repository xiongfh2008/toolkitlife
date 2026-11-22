import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "how-to-merge-pdf-files";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  faqs: [
    { question: "How do I merge PDF files for free without a watermark?", answer: "Use a browser-based merger that processes files locally. With ToolkitLife's Merge PDF tool you drag in your PDFs, reorder them with the arrow buttons, and download the combined document — no watermark, no signup, no page limits, and no email address required." },
    { question: "Are my documents uploaded to a server when I merge PDFs online?", answer: "Not with this tool. The merge runs entirely inside your browser using a PDF library compiled to WebAssembly — files are read from disk, combined in memory, and written straight back to your device. Nothing is transmitted, so contracts, payslips, and ID scans stay private, and the tool even works offline." },
    { question: "Is there a file size or page limit when combining PDFs?", answer: "No. Because merging happens on your device rather than on a paid server, there are no artificial per-file or per-day limits. The practical limit is your device's memory — even dozens of large PDFs merge fine on a normal laptop, and the total page count is displayed after merging so you can verify nothing was dropped." },
    { question: "Does merging PDFs reduce quality or lose form fields?", answer: "No. Merging copies every page 1:1 without re-rendering, so text, fonts, images, filled form fields, highlights, and annotations are preserved exactly as they were in the source files. Only the page order changes, and that is the order you set before merging." },
  ],
  relatedTools: [
    { name: "Merge PDF", href: "/tools/merge-pdf" },
    { name: "Split PDF", href: "/tools/split-pdf" },
    { name: "Compress PDF", href: "/tools/compress-pdf" },
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
