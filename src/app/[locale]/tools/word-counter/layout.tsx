import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "word-counter" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.word-counter.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/word-counter`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/word-counter`,
      languages: {
        en: `https://toolkitlife.com/en/tools/word-counter`,
        es: `https://toolkitlife.com/es/tools/word-counter`,
        zh: `https://toolkitlife.com/zh/tools/word-counter`,
        ja: `https://toolkitlife.com/ja/tools/word-counter`,
        ko: `https://toolkitlife.com/ko/tools/word-counter`,
        ru: `https://toolkitlife.com/ru/tools/word-counter`,
        "x-default": `https://toolkitlife.com/en/tools/word-counter`,
      },
    },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <ToolMessages slug="word-counter" locale={locale}>
      {children}
    </ToolMessages>
  );
}
