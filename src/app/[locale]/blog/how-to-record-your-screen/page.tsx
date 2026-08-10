import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogLayout, { ToolCTA } from "@/components/BlogLayout";
import Link from "next/link";
import { getPostMeta } from "@/data/blog-posts";

const slug = "how-to-record-your-screen";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  tags: meta.tags,
  faqs: [
    { question: "Can I record my screen for free without a watermark?", answer: "Yes. Browser-based screen recorders use the MediaRecorder API built into your browser. They produce watermark-free recordings with no time limit, no signup, and no software to install." },
    { question: "Can I record system audio?", answer: "Yes, when sharing a browser tab. System audio capture when sharing an entire screen depends on your OS. macOS requires additional permissions. Windows supports it natively in most browsers." },
    { question: "What format are recordings saved in?", answer: "Browser-based recorders save in WebM format. This plays in all modern browsers and VLC. You can convert to MP4 using a video converter if needed for compatibility with older software." },
    { question: "Is there a time limit?", answer: "No. Browser-based recorders have no time limit. The recording is stored in your browser's memory, so very long recordings (multiple hours) may use significant RAM." },
  ],
  relatedTools: [
    { name: "Screen Recorder", href: "/tools/screen-recorder" },
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
        <p><strong>TL;DR:</strong> You can record your screen directly in your browser with no software to install. Choose to capture your full screen, a window, or a browser tab. Add system audio and microphone if needed. The recording saves as a WebM file with no watermark and no time limit.</p>
      </aside>

      <section>
        <h2>Why Record Your Screen</h2>
        <p>Screen recording is essential for tutorials, bug reports, presentations, remote work demos, and content creation. Instead of writing long explanations, show exactly what you mean. A 30-second screen recording often replaces a page of documentation.</p>
      </section>

      <section>
        <h2>Browser-Based vs Desktop Apps</h2>
        <p><strong>Browser-based recorders</strong> use the built-in MediaRecorder API. No download, no install, works on any OS. The tradeoff is WebM output (not MP4) and limited editing options.</p>
        <p><strong>Desktop apps</strong> like OBS, Loom, or Camtasia offer more features — scene switching, editing, MP4 output — but require installation and often have watermarks or time limits on free tiers.</p>
        <p>For quick recordings without fuss, browser-based is the way to go. For professional production, desktop apps are better.</p>
      </section>

      <section>
        <h2>How to Capture Audio</h2>
        <p><strong>Tab audio:</strong> When you share a browser tab, you get the option to include tab audio. This captures any sound playing in that tab — videos, music, web apps.</p>
        <p><strong>System audio:</strong> When sharing your entire screen, audio capture depends on your OS. Windows supports it in Chrome. macOS requires you to grant screen recording permissions in System Settings.</p>
        <p><strong>Microphone:</strong> Enable microphone capture separately to add voiceover narration to your recording. This is great for tutorials and walkthroughs.</p>
      </section>

      <section>
        <h2>Tips for Better Recordings</h2>
        <ul>
          <li><strong>Clean your desktop:</strong> Close unnecessary windows and notifications before recording.</li>
          <li><strong>Use a consistent resolution:</strong> Record at 1080p for a good balance of quality and file size.</li>
          <li><strong>Zoom in on important areas:</strong> Use your OS zoom (Ctrl/Cmd + scroll) to make small UI elements visible.</li>
          <li><strong>Keep it short:</strong> Break long recordings into shorter clips. Viewers drop off after 2-3 minutes.</li>
        </ul>
      </section>

      <section>
        <h2>Record Your Screen for Free</h2>
        <p>Our <Link href="/tools/screen-recorder" className="text-blue-400 hover:text-blue-300">free Screen Recorder</Link> captures your screen, webcam, or browser tab with audio. No watermark, no time limit, no signup. Works in Chrome, Edge, and Firefox.</p>
        <ToolCTA name="Screen Recorder" href="/tools/screen-recorder" description="Record your screen, webcam, or browser tab with audio. No watermark, no time limit — runs entirely in your browser." />
      </section>
    </BlogLayout>
  );
}
