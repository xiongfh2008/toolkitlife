import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogLayout, { ToolCTA } from "@/components/BlogLayout";
import Link from "next/link";
import { getPostMeta } from "@/data/blog-posts";

const slug = "how-to-convert-pdf-to-word";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
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
        <p><strong>TL;DR:</strong> PDF to Word conversion extracts text from a PDF and puts it into an editable document format. Works best with text-based PDFs (not scanned images). Simple documents convert well; complex layouts may need manual cleanup. Use a browser-based converter to keep sensitive documents private.</p>
      </aside>

      <section>
        <h2>Why Convert PDF to Word</h2>
        <p>PDFs are designed to look the same everywhere, but they&apos;re not designed to be edited. When you need to modify text in a PDF, the fastest approach is converting it to a Word document, making your changes, and then exporting back to PDF if needed.</p>
        <p>Common scenarios: editing a contract, updating a resume originally saved as PDF, extracting content from a report, or repurposing text from a document you received.</p>
      </section>

      <section>
        <h2>Text-Based vs Scanned PDFs</h2>
        <p><strong>Text-based PDFs</strong> were created digitally from Word, Google Docs, LaTeX, or similar tools. The text is stored as actual text data inside the file. These convert cleanly and accurately.</p>
        <p><strong>Scanned PDFs</strong> are essentially images of paper documents. Each page is a photograph. A standard PDF-to-Word converter can&apos;t extract text from these because there is no text data, only pixels. You need OCR (Optical Character Recognition) to read the text from the image first.</p>
        <p>To check which type you have: open the PDF and try selecting text with your cursor. If you can highlight individual words, it&apos;s text-based. If the whole page selects as one block (or nothing selects), it&apos;s scanned.</p>
      </section>

      <section>
        <h2>What to Expect from Conversion</h2>
        <ul>
          <li><strong>Text content:</strong> Extracted accurately in almost all cases.</li>
          <li><strong>Paragraphs and line breaks:</strong> Preserved well for simple documents.</li>
          <li><strong>Tables:</strong> May be converted to plain text. Complex table layouts often need manual re-creation.</li>
          <li><strong>Images:</strong> Not extracted by basic converters. You may need to copy images separately.</li>
          <li><strong>Fonts and styling:</strong> Basic bold/italic may be preserved. Exact font matching depends on what fonts are installed on your system.</li>
        </ul>
      </section>

      <section>
        <h2>Convert PDF to Word for Free</h2>
        <p>Our <Link href="/tools/pdf-to-word" className="text-blue-400 hover:text-blue-300">free PDF to Word Converter</Link> extracts text from any text-based PDF and generates a .doc file that opens in Word, Google Docs, or LibreOffice. Processing happens entirely in your browser using PDF.js. No upload, no signup, no file size limits.</p>
        <ToolCTA name="PDF to Word Converter" href="/tools/pdf-to-word" description="Extract text from any PDF and download as a .doc file. Uses PDF.js — your document never leaves your device." />
      </section>
    </BlogLayout>
  );
}
