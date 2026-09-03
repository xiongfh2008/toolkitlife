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
  const t = await getTranslations({ locale, namespace: "tools.timestamp-converter.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/timestamp-converter`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/timestamp-converter`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/timestamp-converter`,
        zh: `https://www.toolkitlife.com/zh/tools/timestamp-converter`,
        ja: `https://www.toolkitlife.com/ja/tools/timestamp-converter`,
        ko: `https://www.toolkitlife.com/ko/tools/timestamp-converter`,
        ru: `https://www.toolkitlife.com/ru/tools/timestamp-converter`,
        "x-default": `https://www.toolkitlife.com/en/tools/timestamp-converter`,
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
    <ToolMessages slug="timestamp-converter" locale={locale}>
      {children}
    </ToolMessages>
  );
}
