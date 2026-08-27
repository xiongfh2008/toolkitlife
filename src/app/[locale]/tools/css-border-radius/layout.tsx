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
  const t = await getTranslations({ locale, namespace: "tools.css-border-radius.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/css-border-radius`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/css-border-radius`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/css-border-radius`,
        zh: `https://www.toolkitlife.com/zh/tools/css-border-radius`,
        ja: `https://www.toolkitlife.com/ja/tools/css-border-radius`,
        ko: `https://www.toolkitlife.com/ko/tools/css-border-radius`,
        ru: `https://www.toolkitlife.com/ru/tools/css-border-radius`,
        "x-default": `https://www.toolkitlife.com/en/tools/css-border-radius`,
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
    <ToolMessages slug="css-border-radius" locale={locale}>
      {children}
    </ToolMessages>
  );
}
