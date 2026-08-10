import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogLayout, { ToolCTA } from "@/components/BlogLayout";
import Link from "next/link";

const slug = "how-to-extract-text-from-images";

const basePost = {
  slug,
  datePublished: "2026-03-06",
  dateModified: "2026-03-06",
  tags: ["OCR", "Productivity", "Text Extraction", "Images"],
  faqs: [
    { question: "What is OCR and how does it work?", answer: "OCR (Optical Character Recognition) is technology that identifies text characters in images and converts them to editable text. Modern OCR uses neural networks trained on millions of text samples to recognize characters, words, and layout structure in any image." },
    { question: "How accurate is OCR?", answer: "Modern OCR achieves 95-99% accuracy on clean, printed text with good resolution. Accuracy drops with handwriting, low resolution, unusual fonts, skewed images, or poor lighting. For best results, use clear images with high contrast between text and background." },
    { question: "Can OCR read handwritten text?", answer: "Basic OCR tools struggle with handwriting. Specialized handwriting recognition models exist but require more processing power. For printed text, standard OCR works excellently. For handwriting, you may need specialized tools or manual transcription." },
  ],
  relatedTools: [
    { name: "Image to Text (OCR)", href: "/tools/image-to-text" },
  ],
  relatedArticles: [
    { title: "How to Convert PDF to Word", href: "/blog/how-to-convert-pdf-to-word" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const post = await getTranslatedPost(locale, slug, basePost);
  return {
    title: `${post.title} — ToolkitLife`,
    description: post.description,
    alternates: { canonical: `https://toolkitlife.com/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, url: `https://toolkitlife.com/blog/${post.slug}`, siteName: "ToolkitLife", type: "article", publishedTime: post.datePublished, modifiedTime: post.dateModified, tags: post.tags },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const post = await getTranslatedPost(locale, slug, basePost);
  return (
    <BlogLayout post={post}>
      <aside aria-label="Summary" className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 mb-8">
        <p><strong>TL;DR:</strong> OCR technology converts images of text into editable, copyable text. It works best on clear, high-resolution images with printed text. For best accuracy, crop to the text area, ensure good contrast, and select the correct language. Browser-based OCR tools process everything locally so your documents stay private.</p>
      </aside>

      <section>
        <h2>When You Need OCR</h2>
        <p>You have a screenshot of an error message you need to search. A photo of a whiteboard from a meeting. A scanned receipt for expense reporting. A page from a textbook you need to quote. In all these cases, the text is trapped inside an image and you need it as actual text you can copy, edit, and search.</p>
        <p>This is exactly what OCR does. It analyzes the pixels in your image, identifies characters and words, and outputs them as editable text.</p>
      </section>

      <section>
        <h2>Tips for Better OCR Accuracy</h2>
        <ul>
          <li><strong>Resolution matters:</strong> Higher resolution images produce better results. If possible, use at least 300 DPI for scanned documents.</li>
          <li><strong>Contrast is key:</strong> Dark text on a light background works best. Avoid images with text overlaid on busy backgrounds or photos.</li>
          <li><strong>Crop to the text area:</strong> Remove unnecessary borders, images, and whitespace. The less noise in the image, the better the OCR accuracy.</li>
          <li><strong>Straighten skewed images:</strong> Text that&apos;s rotated or at an angle is harder to recognize. Straighten the image before running OCR.</li>
          <li><strong>Select the right language:</strong> OCR models are language-specific. Selecting the correct language improves character recognition, especially for non-Latin scripts.</li>
        </ul>
      </section>

      <section>
        <h2>Common OCR Use Cases</h2>
        <p><strong>Screenshots:</strong> Extract error messages, code snippets, chat messages, or any text from screenshots. This is the most common use case and typically gives the best accuracy since screenshots are already high-resolution with clean text.</p>
        <p><strong>Scanned documents:</strong> Convert scanned contracts, receipts, letters, and forms into searchable, editable text. Scan at 300+ DPI in grayscale for best results.</p>
        <p><strong>Photos of text:</strong> Whiteboards, signs, book pages, business cards. Accuracy depends on image quality and lighting.</p>
      </section>

      <section>
        <h2>Extract Text for Free</h2>
        <p>Our <Link href="/tools/image-to-text" className="text-blue-400 hover:text-blue-300">free Image to Text tool</Link> uses Tesseract.js OCR engine running entirely in your browser. Upload any image, select the language, and get editable text in seconds. Supports 7 languages, no upload to any server, no signup required.</p>
        <ToolCTA name="Image to Text (OCR)" href="/tools/image-to-text" description="Extract text from any image using Tesseract.js OCR. Supports 7 languages — runs entirely in your browser, no upload required." />
      </section>
    </BlogLayout>
  );
}
