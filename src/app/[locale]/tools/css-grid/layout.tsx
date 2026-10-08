import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "css-grid" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.css-grid.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/css-grid`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/css-grid`,
      languages: {
        en: `https://toolkitlife.com/en/tools/css-grid`,
        es: `https://toolkitlife.com/es/tools/css-grid`,
        zh: `https://toolkitlife.com/zh/tools/css-grid`,
        ja: `https://toolkitlife.com/ja/tools/css-grid`,
        ko: `https://toolkitlife.com/ko/tools/css-grid`,
        ru: `https://toolkitlife.com/ru/tools/css-grid`,
        "x-default": `https://toolkitlife.com/en/tools/css-grid`,
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
    <ToolMessages slug="css-grid" locale={locale}>
      {children}
    </ToolMessages>
  );
}
