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
  const t = await getTranslations({ locale, namespace: "tools.blob-dataurl.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/blob-dataurl`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/blob-dataurl`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/blob-dataurl`,
        zh: `https://www.toolkitlife.com/zh/tools/blob-dataurl`,
        ja: `https://www.toolkitlife.com/ja/tools/blob-dataurl`,
        ko: `https://www.toolkitlife.com/ko/tools/blob-dataurl`,
        ru: `https://www.toolkitlife.com/ru/tools/blob-dataurl`,
        "x-default": `https://www.toolkitlife.com/en/tools/blob-dataurl`,
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
    <ToolMessages slug="blob-dataurl" locale={locale}>
      {children}
    </ToolMessages>
  );
}
