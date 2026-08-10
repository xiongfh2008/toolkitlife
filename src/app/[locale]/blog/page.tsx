import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

const posts = [
  { slug: "how-to-build-a-resume" },
  { slug: "how-to-compress-video" },
  { slug: "how-to-convert-pdf-to-word" },
  { slug: "how-to-convert-text-to-speech" },
  { slug: "how-to-convert-video-to-gif" },
  { slug: "how-to-create-digital-signature" },
  { slug: "how-to-extract-text-from-images" },
  { slug: "how-to-make-memes" },
  { slug: "how-to-record-your-screen" },
  { slug: "how-to-upscale-images" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogIndex.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogIndex" });
  const pt = await getTranslations({ locale, namespace: "blogPosts" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="mb-8 text-sm text-zinc-500">
        <Link href="/" className="hover:text-blue-500 transition-colors">{t("breadcrumbHome")}</Link>
        <span className="mx-2 text-zinc-600">/</span>
        <span className="text-zinc-300">{t("title")}</span>
      </nav>

      <h1 className="mb-4 font-display text-4xl text-zinc-100">{t("title")}</h1>
      <p className="mb-10 text-zinc-400">{t("description")}</p>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <h2 className="mb-2 text-xl font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                {pt(`${post.slug}.title`)}
              </h2>
              <p className="text-sm text-zinc-400">{pt(`${post.slug}.description`)}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
