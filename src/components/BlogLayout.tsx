"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ogImageUrl } from "@/lib/og";

interface BlogPost {
  title: string;
  slug: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified: string;
  tags: string[];
  faqs?: { question: string; answer: string }[];
  relatedTools?: { name: string; href: string }[];
  relatedArticles?: { title: string; href: string }[];
}

export interface ToolCTAProps {
  name: string;
  href: string;
  description: string;
}

export function ToolCTA({ name, href, description }: ToolCTAProps) {
  const t = useTranslations("blogLayout");
  return (
    <div className="mt-6 rounded-xl border border-blue-500/30 bg-blue-500/10 p-5">
      <h3 className="mb-1 text-lg font-semibold text-blue-400">{name}</h3>
      <p className="mb-4 text-sm text-zinc-300">{description}</p>
      <Link
        href={href}
        className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
      >
        {t("tryCta", { name })} →
      </Link>
    </div>
  );
}

interface BlogLayoutProps {
  post: BlogPost;
  children: React.ReactNode;
}

export default function BlogLayout({ post, children }: BlogLayoutProps) {
  const t = useTranslations("blogLayout");
  const locale = useLocale();
  const url = `https://www.toolkitlife.com/${locale}/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    image: ogImageUrl({ title: post.title, type: "blog" }),
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { "@type": "Person", name: post.author, url: `https://www.toolkitlife.com/${locale}/blog` },
    publisher: { "@type": "Organization", name: "ToolkitLife", logo: { "@type": "ImageObject", url: "https://www.toolkitlife.com/icon.svg" } },
    mainEntityOfPage: url,
    keywords: post.tags.join(", "),
  };

  const faqSchema = post.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: `https://www.toolkitlife.com/${locale}` },
      { "@type": "ListItem", position: 2, name: t("breadcrumbBlog"), item: `https://www.toolkitlife.com/${locale}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      {/* Structured data — plain <script> so JSON-LD is server-rendered in the
          initial HTML instead of only being injected after hydration. */}
      <script
        id={`schema-article-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          id={`schema-faq-${post.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        id={`schema-breadcrumb-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <nav className="mb-8 text-sm text-zinc-500">
          <Link href="/" className="hover:text-blue-500 transition-colors">{t("breadcrumbHome")}</Link>
          <span className="mx-2 text-zinc-600">/</span>
          <Link href="/blog" className="hover:text-blue-500 transition-colors">{t("breadcrumbBlog")}</Link>
          <span className="mx-2 text-zinc-600">/</span>
          <span className="text-zinc-300">{post.title}</span>
        </nav>

        <article className="prose-custom">
          <header className="mb-8 not-prose">
            <h1 className="mb-4 font-display text-4xl text-zinc-100">{post.title}</h1>
            <p className="mb-4 text-zinc-400">{post.description}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
              <span className="font-medium text-zinc-300">
                {t("byAuthor", { author: post.author })}
              </span>
              <span>·</span>
              <time dateTime={post.datePublished}>
                {new Date(post.datePublished).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.dateModified !== post.datePublished && (
                <>
                  <span>·</span>
                  <span>
                    {t("updated")}{" "}
                    <time dateTime={post.dateModified}>
                      {new Date(post.dateModified).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </span>
                </>
              )}
              {post.tags.length > 0 && (
                <>
                  <span>·</span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </header>

          {children}

          {post.faqs && post.faqs.length > 0 && (
            <section id="faq" className="mt-12">
              <h2>{t("faqTitle")}</h2>
              <div className="space-y-4">
                {post.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-zinc-900 border border-zinc-800 rounded-xl"
                  >
                    <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-zinc-200 font-medium text-sm select-none">
                      {faq.question}
                      <span className="ml-4 text-zinc-500 group-open:rotate-45 transition-transform text-lg">+</span>
                    </summary>
                    <div className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}
        </article>

        {post.relatedTools && post.relatedTools.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl text-zinc-100 mb-4">{t("relatedToolsTitle")}</h2>
            <div className="flex flex-wrap gap-2">
              {post.relatedTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:border-blue-500/40 hover:text-blue-500 transition-colors"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {post.relatedArticles && post.relatedArticles.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl text-zinc-100 mb-4">{t("relatedArticlesTitle")}</h2>
            <ul className="space-y-2">
              {post.relatedArticles.map((article) => (
                <li key={article.href}>
                  <Link
                    href={article.href}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
