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
  const t = await getTranslations({ locale, namespace: "tools.keyword-position.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/keyword-position`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/keyword-position`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/keyword-position`,
        zh: `https://www.toolkitlife.com/zh/tools/keyword-position`,
        ja: `https://www.toolkitlife.com/ja/tools/keyword-position`,
        ko: `https://www.toolkitlife.com/ko/tools/keyword-position`,
        ru: `https://www.toolkitlife.com/ru/tools/keyword-position`,
        "x-default": `https://www.toolkitlife.com/en/tools/keyword-position`,
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
    <ToolMessages slug="keyword-position" locale={locale}>
      {children}
    </ToolMessages>
  );
}
