import type { Metadata } from "next";
import { getTranslatedPost } from "@/lib/blog";
import BlogPost from "@/components/BlogPost";
import { getPostMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";
import { blogContent } from "@/data/blog-content";

const slug = "how-to-build-a-resume";
const meta = getPostMeta(slug);

const basePost = {
  slug,
  datePublished: meta.datePublished,
  dateModified: meta.dateModified,
  author: meta.author,
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
  const url = `https://www.toolkitlife.com/${locale}/blog/${post.slug}`;
  const ogImage = ogImageUrl({ title: post.title, type: "blog" });
  return {
    title: `${post.title} — ToolkitLife`,
    description: post.description,
    alternates: {
      canonical: url,
      languages: {
        en: `https://www.toolkitlife.com/en/blog/${post.slug}`,
        zh: `https://www.toolkitlife.com/zh/blog/${post.slug}`,
        ja: `https://www.toolkitlife.com/ja/blog/${post.slug}`,
        ko: `https://www.toolkitlife.com/ko/blog/${post.slug}`,
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
