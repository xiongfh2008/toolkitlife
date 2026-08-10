import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogLayout, { ToolCTA } from "@/components/BlogLayout";
import Link from "next/link";
import { getPostMeta } from "@/data/blog-posts";

const slug = "how-to-convert-text-to-speech";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  tags: meta.tags,
  faqs: [
    { question: "Is text to speech free?", answer: "Yes. Modern browsers include the Web Speech API which provides text-to-speech for free with no limits. The voices are built into your operating system. No server processing, no signup required." },
    { question: "What languages are supported?", answer: "Most browsers support 20+ languages including English, Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Italian, and more. The exact voices depend on your OS." },
    { question: "Can I download the audio?", answer: "The Web Speech API is designed for real-time listening, not file export. For downloadable audio files, you need a server-side TTS service. Browser-based TTS is best for proofreading, accessibility, and learning." },
    { question: "Why do some voices sound robotic?", answer: "Browsers include both basic and premium voices. Premium voices (like Apple's Siri voices or Google's WaveNet voices) sound more natural but may need to be downloaded first in your OS settings." },
  ],
  relatedTools: [
    { name: "Text to Speech", href: "/tools/text-to-speech" },
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
        <p><strong>TL;DR:</strong> Text to speech converts written text into spoken audio using your browser&apos;s built-in speech engine. It&apos;s free, works offline, supports multiple languages, and is useful for proofreading, accessibility, language learning, and multitasking. Adjust speed and pitch to match your preference.</p>
      </aside>

      <section>
        <h2>Who Uses Text to Speech</h2>
        <p><strong>People with visual impairments or reading disabilities</strong> rely on TTS to access written content. It&apos;s a core accessibility feature.</p>
        <p><strong>Writers and editors</strong> use TTS to proofread. Hearing your text read aloud catches errors your eyes skip over — awkward phrasing, missing words, and rhythm issues.</p>
        <p><strong>Language learners</strong> use it to hear correct pronunciation in their target language.</p>
        <p><strong>Multitaskers</strong> convert articles and emails to speech so they can listen while doing other things.</p>
      </section>

      <section>
        <h2>How Browser TTS Works</h2>
        <p>Modern browsers include the <strong>Web Speech API</strong>, which provides text-to-speech without any server. Your text stays on your device and is processed by your operating system&apos;s speech engine.</p>
        <p>The voices available depend on your OS. macOS includes high-quality voices like Samantha and Alex. Windows has Microsoft voices. ChromeOS and Android have Google voices. You can install additional voices in your system settings.</p>
      </section>

      <section>
        <h2>Getting Better Voice Quality</h2>
        <ul>
          <li><strong>Install premium voices:</strong> On macOS, go to System Settings &gt; Accessibility &gt; Spoken Content and download enhanced voices. On Windows, go to Settings &gt; Time &amp; Language &gt; Speech.</li>
          <li><strong>Use Chrome:</strong> Chrome includes Google&apos;s online voices which tend to sound more natural than default system voices.</li>
          <li><strong>Adjust speed:</strong> Slightly slower speeds (0.8-0.9x) often sound more natural. Faster speeds (1.2-1.5x) are good for skimming content.</li>
          <li><strong>Match the language:</strong> Select a voice that matches the language of your text for correct pronunciation.</li>
        </ul>
      </section>

      <section>
        <h2>Convert Text to Speech for Free</h2>
        <p>Our <Link href="/tools/text-to-speech" className="text-blue-400 hover:text-blue-300">free Text to Speech tool</Link> reads any text aloud using your browser&apos;s built-in voices. Multiple languages, adjustable speed and pitch, pause and resume. No signup, no server processing, 100% private.</p>
        <ToolCTA name="Text to Speech" href="/tools/text-to-speech" description="Convert text to natural speech in your browser. Multiple languages and voices, adjustable speed and pitch. Free and private." />
      </section>
    </BlogLayout>
  );
}
