import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ogImageUrl } from "@/lib/og";
import { CONTACT_EMAIL } from "@/lib/contact";

interface AboutSection {
  title: string;
  paragraphs: string[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.metadata" });
  const url = `https://www.toolkitlife.com/${locale}/about`;
  const ogImage = ogImageUrl({ title: t("title"), type: "home" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: url,
      languages: {
        en: "https://www.toolkitlife.com/en/about",
        zh: "https://www.toolkitlife.com/zh/about",
        ja: "https://www.toolkitlife.com/ja/about",
        ko: "https://www.toolkitlife.com/ko/about",
        ru: "https://www.toolkitlife.com/ru/about",
        "x-default": `https://www.toolkitlife.com/en/about`,
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const sections = t.raw("sections") as AboutSection[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="mb-8 text-sm text-zinc-500">
        <Link href="/" className="hover:text-blue-500 transition-colors">{t("breadcrumb.home")}</Link>
        <span className="mx-2 text-zinc-600">/</span>
        <span className="text-zinc-300">{t("breadcrumb.current")}</span>
      </nav>

      <h1 className="mb-6 font-display text-4xl text-zinc-100">{t("title")}</h1>
      <p className="mb-10 text-lg leading-relaxed text-zinc-300">{t("lead")}</p>

      <div className="prose-custom space-y-6">
        {sections.map((s, i) => (
          <section key={i}>
            <h2>{s.title}</h2>
            {s.paragraphs.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </section>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="mb-3 font-display text-2xl text-zinc-100">{t("contact.title")}</h2>
        <p className="text-zinc-300">
          {t("contact.body")}{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blue-500 transition-colors hover:text-blue-400"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </div>
  );
}
