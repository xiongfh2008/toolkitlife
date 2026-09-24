import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "how-to-compress-images";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  image: "/blog/how-to-compress-images.jpg",
  faqs: [
    { question: "How do I compress an image to 100 KB?", answer: "Compress to JPEG or WebP at quality 80 and check the resulting size; lower quality slightly if you are still over. For an exact ceiling, use an exact-size compressor that recompresses to a target in KB without changing the image dimensions." },
    { question: "Which is smaller, PNG or JPEG?", answer: "For photos, JPEG is dramatically smaller — 70–90% less than the same image saved as PNG. PNG is lossless and best for screenshots, logos and sharp text, where it can actually be smaller than JPEG while keeping edges crisp." },
    { question: "Can I compress an image without any quality loss?", answer: "Yes, losslessly — PNG optimization or lossless WebP typically saves 5–30%. The big savings of 70–90% require lossy compression, but at quality 75–85 the difference is not visible at normal viewing sizes." },
    { question: "Does compressing an image change its resolution?", answer: "No. Compression reduces file size (bytes); resizing changes dimensions (pixels). They are independent operations — you can compress a 4000-pixel photo and keep every pixel, or do both if the image is also larger than it needs to be." },
  ],
  relatedTools: [
    { name: "Image Compressor", href: "/tools/image-compressor" },
    { name: "Image File Size", href: "/tools/image-file-size" },
    { name: "Batch Image Converter", href: "/tools/image-format-converter" },
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
        de: `https://www.toolkitlife.com/de/blog/${post.slug}`,
        fr: `https://www.toolkitlife.com/fr/blog/${post.slug}`,
        pt: `https://www.toolkitlife.com/pt/blog/${post.slug}`,
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
