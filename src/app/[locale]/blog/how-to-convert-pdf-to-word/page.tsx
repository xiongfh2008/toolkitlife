import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogLayout from "@/components/BlogLayout";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "how-to-convert-pdf-to-word";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  faqs: [
    { question: "Can I convert a PDF to Word for free?", answer: "Yes. Several tools offer free PDF to Word conversion. Browser-based tools process the file locally on your device, so there's no upload and no file size limit. The output is a .doc file that opens in Microsoft Word, Google Docs, and LibreOffice." },
    { question: "Will the formatting be preserved?", answer: "Text content and basic paragraph structure are preserved well. Complex layouts with multiple columns, tables, and embedded images may not convert perfectly. For simple text documents, the conversion is nearly identical. For complex layouts, some manual formatting adjustment may be needed." },
    { question: "Can I convert a scanned PDF?", answer: "Scanned PDFs are images, not text. You need OCR (Optical Character Recognition) to extract text from scanned pages. Use an OCR tool first to extract the text, then paste it into a Word document. Our Image to Text tool can help with this." },
    { question: "Is it safe to convert PDFs online?", answer: "Cloud-based converters upload your file to a server, which is a privacy risk for sensitive documents. Browser-based tools like ToolkitLife process everything locally — your PDF never leaves your device. For confidential documents, always use a local tool." },
  ],
  relatedTools: [
    { name: "PDF to Word Converter", href: "/tools/pdf-to-word" },
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
    <BlogLayout post={{ ...post, faqs: localized.faqs[localeKey] }}>
      {localized[localeKey]}
    </BlogLayout>
  );
}
