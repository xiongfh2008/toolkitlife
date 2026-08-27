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
  const t = await getTranslations({ locale, namespace: "tools.url-encoder.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/url-encoder`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/url-encoder`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/url-encoder`,
        zh: `https://www.toolkitlife.com/zh/tools/url-encoder`,
        ja: `https://www.toolkitlife.com/ja/tools/url-encoder`,
        ko: `https://www.toolkitlife.com/ko/tools/url-encoder`,
        ru: `https://www.toolkitlife.com/ru/tools/url-encoder`,
        "x-default": `https://www.toolkitlife.com/en/tools/url-encoder`,
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
    <ToolMessages slug="url-encoder" locale={locale}>
      {children}
    </ToolMessages>
  );
}
