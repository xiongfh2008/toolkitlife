import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogLayout, { ToolCTA } from "@/components/BlogLayout";
import Link from "next/link";
import { getPostMeta } from "@/data/blog-posts";

const slug = "how-to-make-memes";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  tags: meta.tags,
  faqs: [
    { question: "What is the best meme font?", answer: "Impact is the classic meme font — bold, white text with a black outline. It's been the standard since early internet memes. Some modern memes use Arial or even Comic Sans for a different feel. The key is high contrast and readability." },
    { question: "Can I use any image for a meme?", answer: "You can use any image you have. Popular meme templates are widely available online. For original memes, use your own photos or screenshots. Most memes fall under fair use, but avoid using copyrighted images for commercial purposes." },
    { question: "What size should a meme be?", answer: "Most memes are 500-800px wide. Instagram prefers square (1080x1080). Twitter works best with 16:9 or 4:3. For general sharing, 600-800px wide works everywhere." },
    { question: "How do I make memes without a watermark?", answer: "Use a browser-based meme generator that runs locally. Cloud-based free tiers often add watermarks. Tools that process images in your browser have no reason to watermark since there's no server cost." },
  ],
  relatedTools: [
    { name: "Meme Generator", href: "/tools/meme-generator" },
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
        <p><strong>TL;DR:</strong> Making memes is simple: upload an image, add bold text at the top and bottom, and download. Use Impact font with white text and black outline for the classic look. Keep text short and punchy. Use a browser-based tool to avoid watermarks and signups.</p>
      </aside>

      <section>
        <h2>Anatomy of a Good Meme</h2>
        <p>The best memes follow a simple formula: <strong>setup at the top, punchline at the bottom.</strong> The image provides context, and the text delivers the joke or observation. Keep it short — if your meme text is more than two lines, it&apos;s too long.</p>
        <p>Relatability is everything. The most viral memes tap into shared experiences that make people think &quot;that&apos;s so true.&quot;</p>
      </section>

      <section>
        <h2>Classic Meme Format</h2>
        <ul>
          <li><strong>Font:</strong> Impact, bold, all caps</li>
          <li><strong>Color:</strong> White text with thick black outline (stroke)</li>
          <li><strong>Placement:</strong> Top text for setup, bottom text for punchline</li>
          <li><strong>Size:</strong> Large enough to read on a phone screen</li>
        </ul>
        <p>This format has been the standard since the early 2010s and is still instantly recognizable. Modern memes sometimes break this format with different fonts or text placement, but the classic format always works.</p>
      </section>

      <section>
        <h2>Tips for Better Memes</h2>
        <ul>
          <li><strong>Less is more:</strong> The fewer words, the funnier. Trim ruthlessly.</li>
          <li><strong>Timing matters:</strong> React to trending topics quickly. Meme relevance has a short shelf life.</li>
          <li><strong>Use popular templates:</strong> Familiar formats let people &quot;get it&quot; instantly. The template does half the work.</li>
          <li><strong>Make it shareable:</strong> If someone sees your meme and wants to send it to a friend, you&apos;ve succeeded.</li>
          <li><strong>Test with friends:</strong> If it doesn&apos;t get a reaction from one person, it won&apos;t go viral with thousands.</li>
        </ul>
      </section>

      <section>
        <h2>Make Memes for Free</h2>
        <p>Our <Link href="/tools/meme-generator" className="text-blue-400 hover:text-blue-300">free Meme Generator</Link> lets you upload any image, add top and bottom text, customize fonts and colors, and download your meme as PNG. No watermark, no signup, no upload to any server.</p>
        <ToolCTA name="Meme Generator" href="/tools/meme-generator" description="Create memes with custom text, fonts, and colors. No watermark, no signup — runs entirely in your browser." />
      </section>
    </BlogLayout>
  );
}
