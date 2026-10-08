import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "character-counter" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.character-counter.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/character-counter`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/character-counter`,
      languages: {
        en: `https://toolkitlife.com/en/tools/character-counter`,
        es: `https://toolkitlife.com/es/tools/character-counter`,
        zh: `https://toolkitlife.com/zh/tools/character-counter`,
        ja: `https://toolkitlife.com/ja/tools/character-counter`,
        ko: `https://toolkitlife.com/ko/tools/character-counter`,
        ru: `https://toolkitlife.com/ru/tools/character-counter`,
        "x-default": `https://toolkitlife.com/en/tools/character-counter`,
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
    <ToolMessages slug="character-counter" locale={locale}>
      {children}
    </ToolMessages>
  );
}
