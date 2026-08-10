import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogLayout, { ToolCTA } from "@/components/BlogLayout";
import Link from "next/link";

const slug = "how-to-compress-video";

const basePost = {
  slug,
  datePublished: "2026-03-06",
  dateModified: "2026-03-06",
  tags: ["Video", "Compression", "Media", "Productivity"],
  faqs: [
    { question: "How much can I compress a video?", answer: "Typically 50-90% depending on the original quality and settings. A 100 MB video can often be compressed to 10-30 MB at medium quality with barely noticeable difference. The key factors are resolution, bitrate, and codec efficiency." },
    { question: "What is CRF and how does it affect quality?", answer: "CRF (Constant Rate Factor) controls quality in H.264 encoding. Lower CRF = higher quality and larger file. CRF 18 is visually lossless, 23 is the default, 28 is good for most web use, and 35+ is noticeable compression. Each 6-point increase roughly halves the file size." },
    { question: "Should I reduce resolution when compressing?", answer: "Only if the video will be viewed on smaller screens. A 4K video compressed to 1080p will be much smaller with minimal quality loss on phones and laptops. But if the video will be viewed on large screens or projected, keep the original resolution and use CRF compression instead." },
    { question: "What is the best video codec for compression?", answer: "H.264 (AVC) is the most compatible and widely supported. H.265 (HEVC) offers 30-50% better compression but slower encoding and less device support. VP9 (WebM) is good for web. For maximum compatibility, stick with H.264 in an MP4 container." },
    { question: "Is it safe to compress videos online?", answer: "It depends on the tool. Cloud-based compressors upload your video to a server, which raises privacy concerns for personal or confidential content. Browser-based tools like ToolkitLife process everything locally on your device — your video never leaves your computer." },
  ],
  relatedTools: [
    { name: "Video Compressor", href: "/tools/video-compressor" },
  ],
  relatedArticles: [
    { title: "How to Compress PDF Files", href: "/blog/how-to-compress-pdf" },
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
        <p><strong>TL;DR:</strong> Video files are large because they store thousands of frames at high resolution. Compress by reducing CRF (quality level), lowering resolution if appropriate, and using H.264 codec. Medium compression (CRF 28) typically cuts file size by 60-80% with minimal visible quality loss. Use a browser-based compressor to keep your videos private.</p>
      </aside>

      <section>
        <h2>Why Videos Are So Large</h2>
        <p>A one-minute 1080p video at 30fps contains 1,800 individual frames. Each uncompressed frame is roughly 6 MB, making one minute of raw video over 10 GB. Video codecs like H.264 compress this dramatically by storing only the differences between frames, but even compressed video files can be hundreds of megabytes for longer content.</p>
        <p>The main factors that determine video file size are <strong>resolution</strong> (1080p vs 4K), <strong>bitrate</strong> (how much data per second), <strong>duration</strong>, and <strong>codec efficiency</strong>.</p>
      </section>

      <section>
        <h2>Understanding Compression Settings</h2>
        <p><strong>CRF (Constant Rate Factor)</strong> is the most important setting. It tells the encoder how much quality to preserve. Think of it as a quality dial from 0 (perfect) to 51 (terrible). For most purposes, CRF 23-28 gives excellent results with major file size reduction.</p>
        <p><strong>Resolution</strong> has a huge impact on file size. Dropping from 4K to 1080p can reduce file size by 75%. If your video will only be viewed on phones or shared on social media, 720p is often sufficient.</p>
        <p><strong>Preset speed</strong> controls how much time the encoder spends optimizing. Slower presets produce smaller files at the same quality but take longer. For quick compression, &quot;ultrafast&quot; or &quot;fast&quot; presets are fine.</p>
      </section>

      <section>
        <h2>Best Settings for Common Uses</h2>
        <ul>
          <li><strong>Email attachments (under 25 MB):</strong> CRF 28-32, 720p resolution. Most email providers cap at 25 MB.</li>
          <li><strong>Discord (under 25 MB free, 50 MB Nitro):</strong> CRF 28, 720p for free users. Keep videos under 60 seconds.</li>
          <li><strong>Social media upload:</strong> CRF 22-24, keep original resolution. Platforms re-encode anyway, so start with good quality.</li>
          <li><strong>Archival/backup:</strong> CRF 18-20 for near-lossless. Larger files but preserves maximum quality.</li>
        </ul>
      </section>

      <section>
        <h2>Compress Videos for Free</h2>
        <p>Our <Link href="/tools/video-compressor" className="text-blue-400 hover:text-blue-300">free Video Compressor</Link> runs entirely in your browser using FFmpeg WebAssembly. Upload your video, choose quality and resolution settings, and download the compressed result. No upload to any server, no signup, no file size limits.</p>
        <ToolCTA name="Video Compressor" href="/tools/video-compressor" description="Compress videos by up to 90% with adjustable quality and resolution. Uses FFmpeg WebAssembly — your video never leaves your device." />
      </section>
    </BlogLayout>
  );
}
