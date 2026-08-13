import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogLayout from "@/components/BlogLayout";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "how-to-extract-text-from-images";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  faqs: [
    { question: "What is OCR and how does it work?", answer: "OCR (Optical Character Recognition) is technology that identifies text characters in images and converts them to editable text. Modern OCR uses neural networks trained on millions of text samples to recognize characters, words, and layout structure in any image." },
    { question: "How accurate is OCR?", answer: "Modern OCR achieves 95-99% accuracy on clean, printed text with good resolution. Accuracy drops with handwriting, low resolution, unusual fonts, skewed images, or poor lighting. For best results, use clear images with high contrast between text and background." },
    { question: "Can OCR read handwritten text?", answer: "Basic OCR tools struggle with handwriting. Specialized handwriting recognition models exist but require more processing power. For printed text, standard OCR works excellently. For handwriting, you may need specialized tools or manual transcription." },
  ],
  relatedTools: [
    { name: "Image to Text (OCR)", href: "/tools/image-to-text" },
  ],
  relatedArticles: meta.relatedArticles,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const post = await getTranslatedPost(locale, slug, basePost);
  const url = `https://toolkitlife.com/${locale}/blog/${post.slug}`;
  const ogImage = ogImageUrl({ title: post.title, type: "blog" });
  return {
    title: `${post.title} — ToolkitLife`,
    description: post.description,
    alternates: { canonical: url },
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
