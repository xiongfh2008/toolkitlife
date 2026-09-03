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
  const t = await getTranslations({ locale, namespace: "tools.square-footage-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/square-footage-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/square-footage-calculator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/square-footage-calculator`,
        zh: `https://www.toolkitlife.com/zh/tools/square-footage-calculator`,
        ja: `https://www.toolkitlife.com/ja/tools/square-footage-calculator`,
        ko: `https://www.toolkitlife.com/ko/tools/square-footage-calculator`,
        ru: `https://www.toolkitlife.com/ru/tools/square-footage-calculator`,
        "x-default": `https://www.toolkitlife.com/en/tools/square-footage-calculator`,
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
    <ToolMessages slug="square-footage-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
