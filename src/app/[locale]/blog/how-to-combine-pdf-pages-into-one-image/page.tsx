import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";
import { blogIndexSignals } from "@/lib/blog-locales";

const slug = "how-to-combine-pdf-pages-into-one-image";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  faqs: [
    { question: "How do I combine all pages of a PDF into one single image?", answer: "Use a browser-based long-image converter. With ToolkitLife's PDF to Long Image tool you drop in your PDF, choose PNG or JPEG, set a clarity level (1x–3x), and click convert — every page is rendered with pdf.js and stitched top-to-bottom into one tall image that downloads instantly." },
    { question: "Is my PDF uploaded to a server during the conversion?", answer: "No. The rendering runs entirely inside your browser via pdf.js: the file is read from disk, drawn in memory, and the finished image is written back to your device. Nothing is transmitted, so the tool works even offline and is safe for contracts, statements, and ID scans." },
    { question: "Should I choose PNG or JPEG for a long image?", answer: "Choose PNG for text documents, forms, and screenshots — it is lossless and keeps small letters razor-sharp. Choose JPEG when you need a much smaller file, such as for scanned documents or for apps that reject large uploads; JPEG's lossy compression slightly blurs fine text." },
    { question: "Why did my conversion fail or produce a blank image?", answer: "Almost certainly the browser canvas height limit. Long documents at high clarity levels produce images taller than some browsers can draw — Safari is the strictest. Lower the clarity level (3x → 2x → 1x), or split the PDF into parts and convert each half separately." },
  ],
  relatedTools: [
    { name: "PDF to Long Image", href: "/tools/pdf-long-image" },
    { name: "PDF to JPG", href: "/tools/pdf-to-jpg" },
    { name: "Merge PDF", href: "/tools/merge-pdf" },
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
    ...blogIndexSignals(slug, locale),
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
