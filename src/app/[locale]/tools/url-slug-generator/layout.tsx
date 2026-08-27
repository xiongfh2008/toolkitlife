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
  const t = await getTranslations({ locale, namespace: "tools.url-slug-generator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/url-slug-generator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/url-slug-generator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/url-slug-generator`,
        zh: `https://www.toolkitlife.com/zh/tools/url-slug-generator`,
        ja: `https://www.toolkitlife.com/ja/tools/url-slug-generator`,
        ko: `https://www.toolkitlife.com/ko/tools/url-slug-generator`,
        ru: `https://www.toolkitlife.com/ru/tools/url-slug-generator`,
        "x-default": `https://www.toolkitlife.com/en/tools/url-slug-generator`,
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
    <ToolMessages slug="url-slug-generator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
