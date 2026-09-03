import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { blogPostsMeta } from "@/data/blog-posts";
import { ogImageUrl } from "@/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogIndex.metadata" });
  const url = `https://www.toolkitlife.com/${locale}/blog`;
  const ogImage = ogImageUrl({ title: t("title"), type: "blog" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: url,
      languages: {
        en: "https://www.toolkitlife.com/en/blog",
        zh: "https://www.toolkitlife.com/zh/blog",
        ja: "https://www.toolkitlife.com/ja/blog",
        ko: "https://www.toolkitlife.com/ko/blog",
        ru: "https://www.toolkitlife.com/ru/blog",
        "x-default": `https://www.toolkitlife.com/en/blog`,
      },
      types: {
        "application/rss+xml": "https://www.toolkitlife.com/feed.xml",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url,
      siteName: "ToolkitLife",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: t("title") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [ogImage],
    },
  };
}

function formatDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogIndex" });
  const pt = await getTranslations({ locale, namespace: "blogPosts" });

  const sortedPosts = [...blogPostsMeta].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished)
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Blog + CollectionPage schema — plain <script> so it's in the SSR HTML */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: t("title"),
            description: t("description"),
            url: `https://www.toolkitlife.com/${locale}/blog`,
            inLanguage: locale,
            isPartOf: {
              "@type": "WebSite",
              name: "ToolkitLife",
              url: "https://www.toolkitlife.com",
            },
            blogPost: sortedPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: pt(`${post.slug}.title`),
              description: pt(`${post.slug}.description`),
              url: `https://www.toolkitlife.com/${locale}/blog/${post.slug}`,
              datePublished: post.datePublished,
              dateModified: post.dateModified,
              author: { "@type": "Person", name: post.author },
            })),
          }),
        }}
      />
      <nav className="mb-8 text-sm text-zinc-500">
        <Link href="/" className="hover:text-blue-500 transition-colors">{t("breadcrumbHome")}</Link>
        <span className="mx-2 text-zinc-600">/</span>
        <span className="text-zinc-300">{t("title")}</span>
      </nav>

      <h1 className="mb-4 font-display text-4xl text-zinc-100">{t("title")}</h1>
      <p className="mb-10 text-zinc-400">{t("description")}</p>

      <div className="space-y-6">
        {sortedPosts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700"
            >
              <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium text-blue-400">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/blog/${post.slug}`} className="block">
                <h2 className="mb-2 text-xl font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                  {pt(`${post.slug}.title`)}
                </h2>
                <p className="text-sm text-zinc-400">{pt(`${post.slug}.description`)}</p>
              </Link>
              <time
                dateTime={post.datePublished}
                className="mt-3 block text-sm text-zinc-500"
              >
                {formatDate(post.datePublished, locale)}
              </time>
            </article>
          ))}
      </div>
    </div>
  );
}
