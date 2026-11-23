import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";
import { blogIndexSignals } from "@/lib/blog-locales";

const slug = "how-to-transfer-files-with-qr-codes";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
  tags: meta.tags,
  faqs: [
    { question: "Can I really transfer files between devices with no internet?", answer: "Yes. Both devices open the QR File Transfer page once; after that the entire transfer runs offline. The sender displays an animated stream of QR codes and the receiver's camera reads them — the data crosses the air gap as light, not as network packets, so no Wi-Fi, Bluetooth, cable, or cloud service is involved." },
    { question: "How does the tool guarantee the received file is intact?", answer: "The file is split into fountain-coded packets: the receiver can reassemble the complete original from any sufficiently large set of captured frames, regardless of order or dropped frames. Once reassembled, the result is hashed with SHA-256 and compared against the sender's declared hash — the transfer only reports success when the checksum matches." },
    { question: "What is the file size limit and how fast is the transfer?", answer: "Files up to 64 MB are supported. Speed depends on lighting, screen brightness, and camera stability, but expect roughly tens of KB per second — a small document or a few photos takes a minute or two, while large media files are better suited to a cable or local network." },
    { question: "Is QR file transfer secure?", answer: "There is no server involved and nothing to intercept on a network, but the data is visible as QR codes to anyone with a clear view of the sending screen — an onlooker or camera can film the frames and reconstruct the file. Use the tool in trusted, private environments, especially for passwords or recovery keys." },
  ],
  relatedTools: [
    { name: "QR File Transfer", href: "/tools/qr-file-transfer" },
    { name: "QR Code Generator", href: "/tools/qr-code-generator" },
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
