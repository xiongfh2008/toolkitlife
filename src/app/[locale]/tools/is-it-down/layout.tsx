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
  const t = await getTranslations({ locale, namespace: "tools.is-it-down.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/is-it-down`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/is-it-down`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/is-it-down`,
        zh: `https://www.toolkitlife.com/zh/tools/is-it-down`,
        ja: `https://www.toolkitlife.com/ja/tools/is-it-down`,
        ko: `https://www.toolkitlife.com/ko/tools/is-it-down`,
        ru: `https://www.toolkitlife.com/ru/tools/is-it-down`,
        "x-default": `https://www.toolkitlife.com/en/tools/is-it-down`,
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
    <ToolMessages slug="is-it-down" locale={locale}>
      {children}
    </ToolMessages>
  );
}
