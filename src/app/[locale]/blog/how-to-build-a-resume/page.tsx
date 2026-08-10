import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogLayout, { ToolCTA } from "@/components/BlogLayout";
import Link from "next/link";
import { getPostMeta } from "@/data/blog-posts";

const slug = "how-to-build-a-resume";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  tags: meta.tags,
  faqs: [
    { question: "How long should a resume be?", answer: "One page for early to mid-career professionals (0-10 years of experience). Two pages are acceptable for senior roles with extensive experience. Recruiters spend an average of 6-7 seconds on initial resume screening, so keep it concise and put your strongest qualifications first." },
    { question: "What resume format is best for ATS?", answer: "Use a simple, single-column layout with standard section headers (Experience, Education, Skills). Avoid tables, text boxes, headers/footers, and graphics. Use standard fonts like Arial or Calibri. Save as PDF unless the application specifically requests .doc format. ATS systems parse clean, text-based resumes most accurately." },
    { question: "Should I include an objective statement?", answer: "Objective statements are outdated. Instead, use a professional summary — 2-3 sentences that highlight your experience level, key skills, and what you bring to the role. A summary tells the recruiter why you're a fit. An objective just tells them what you want." },
    { question: "How far back should my work experience go?", answer: "Generally 10-15 years. Older experience is rarely relevant unless it directly relates to the role. For recent graduates, include internships, part-time jobs, and relevant projects. Focus on roles that demonstrate skills applicable to the position you're applying for." },
    { question: "Do I need a different resume for every job?", answer: "You don't need to rewrite from scratch, but you should tailor each resume. Adjust your summary, reorder bullet points to match the job description, and include keywords from the posting. This takes 15-20 minutes per application and significantly improves your response rate." },
  ],
  relatedTools: [
    { name: "Resume Builder", href: "/tools/resume-builder" },
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
        <p><strong>TL;DR:</strong> A strong resume is one page, reverse-chronological, and tailored to each job. Lead with a professional summary, quantify your achievements, use keywords from the job posting for ATS compatibility, and keep formatting clean and simple. Skip objective statements, photos, and fancy graphics. Use a free resume builder to get the formatting right without fighting with Word templates.</p>
      </aside>

      <nav aria-label="Table of contents" className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Table of Contents</h2>
        <ol className="space-y-1.5 text-sm">
          <li><Link href="#format" className="text-blue-400 hover:text-blue-300">Choose the Right Format</Link></li>
          <li><Link href="#sections" className="text-blue-400 hover:text-blue-300">Essential Resume Sections</Link></li>
          <li><Link href="#bullets" className="text-blue-400 hover:text-blue-300">Writing Strong Bullet Points</Link></li>
          <li><Link href="#ats" className="text-blue-400 hover:text-blue-300">ATS Optimization</Link></li>
          <li><Link href="#mistakes" className="text-blue-400 hover:text-blue-300">Common Mistakes to Avoid</Link></li>
          <li><Link href="#tools" className="text-blue-400 hover:text-blue-300">Free Tools to Build Your Resume</Link></li>
          <li><Link href="#faq" className="text-blue-400 hover:text-blue-300">FAQ</Link></li>
        </ol>
      </nav>

      <section id="format">
        <h2>Choose the Right Format</h2>
        <p>There are three standard resume formats. <strong>Reverse-chronological</strong> is the most common and preferred by recruiters. It lists your most recent job first and works backward. This is the default choice for most job seekers.</p>
        <p><strong>Functional resumes</strong> focus on skills rather than timeline. These work for career changers or people with employment gaps, but many recruiters dislike them because they obscure your work history. <strong>Combination resumes</strong> blend both approaches but often run long. Stick with reverse-chronological unless you have a specific reason not to.</p>
      </section>

      <section id="sections">
        <h2>Essential Resume Sections</h2>
        <p>Every resume needs these sections, in this order:</p>
        <ul>
          <li><strong>Header:</strong> Name, phone, email, city/state (full address not needed), LinkedIn URL if relevant.</li>
          <li><strong>Professional Summary:</strong> 2-3 sentences summarizing your experience level, key skills, and value proposition. Replace the outdated &quot;Objective&quot; statement.</li>
          <li><strong>Work Experience:</strong> Job title, company, dates, and 3-5 bullet points per role. Most recent first.</li>
          <li><strong>Education:</strong> Degree, school, graduation year. GPA only if above 3.5 and you graduated within the last 3 years.</li>
          <li><strong>Skills:</strong> Technical skills, tools, certifications. Match these to the job posting.</li>
        </ul>
      </section>

      <section id="bullets">
        <h2>Writing Strong Bullet Points</h2>
        <p><strong>The single biggest improvement most people can make is quantifying their achievements.</strong> Compare these two bullet points:</p>
        <ul>
          <li>Weak: &quot;Responsible for managing social media accounts&quot;</li>
          <li>Strong: &quot;Grew Instagram following from 5K to 45K in 8 months, increasing engagement rate by 340%&quot;</li>
        </ul>
        <p>Start every bullet with a strong action verb: led, built, increased, reduced, launched, designed, implemented, optimized. Then add the result. Numbers, percentages, dollar amounts, and timeframes make your impact concrete and memorable.</p>
      </section>

      <section id="ats">
        <h2>ATS Optimization</h2>
        <p>Most companies use Applicant Tracking Systems to filter resumes before a human sees them. To pass ATS screening:</p>
        <ul>
          <li>Use standard section headers (Experience, Education, Skills) not creative alternatives.</li>
          <li>Include keywords from the job description naturally in your bullet points.</li>
          <li>Avoid tables, columns, text boxes, headers/footers, and images.</li>
          <li>Use a standard font (Arial, Calibri, Helvetica) at 10-12pt.</li>
          <li>Save as PDF unless told otherwise.</li>
        </ul>
      </section>

      <section id="mistakes">
        <h2>Common Mistakes to Avoid</h2>
        <ul>
          <li><strong>Including a photo</strong> unless applying in countries where it&apos;s expected (not the US, UK, or Canada).</li>
          <li><strong>Using &quot;References available upon request.&quot;</strong> This is assumed. It wastes space.</li>
          <li><strong>Listing every job you&apos;ve ever had.</strong> Focus on the last 10-15 years of relevant experience.</li>
          <li><strong>Using generic descriptions</strong> instead of specific achievements with numbers.</li>
          <li><strong>Typos and inconsistent formatting.</strong> Have someone else proofread it.</li>
        </ul>
      </section>

      <section id="tools">
        <h2>Free Tools to Build Your Resume</h2>
        <p>You don&apos;t need to fight with Word templates or pay for a subscription service. Our <Link href="/tools/resume-builder" className="text-blue-400 hover:text-blue-300">free Resume Builder</Link> lets you fill in your details, choose from multiple templates, preview your resume in real time, and download as PDF. Everything runs in your browser with no signup required.</p>
        <ToolCTA name="Resume Builder" href="/tools/resume-builder" description="Build a professional resume with live preview, multiple templates, and PDF download. No signup, no watermark — runs entirely in your browser." />
      </section>
    </BlogLayout>
  );
}
