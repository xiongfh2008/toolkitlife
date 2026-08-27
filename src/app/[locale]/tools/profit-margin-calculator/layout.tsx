import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.profit-margin-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/profit-margin-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/profit-margin-calculator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/profit-margin-calculator`,
        zh: `https://www.toolkitlife.com/zh/tools/profit-margin-calculator`,
        ja: `https://www.toolkitlife.com/ja/tools/profit-margin-calculator`,
        ko: `https://www.toolkitlife.com/ko/tools/profit-margin-calculator`,
        ru: `https://www.toolkitlife.com/ru/tools/profit-margin-calculator`,
        "x-default": `https://www.toolkitlife.com/en/tools/profit-margin-calculator`,
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
  return (
    <ToolMessages slug="profit-margin-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
