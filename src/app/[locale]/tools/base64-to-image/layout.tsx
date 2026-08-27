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
  const t = await getTranslations({ locale, namespace: "tools.base64-to-image.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/base64-to-image`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/base64-to-image`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/base64-to-image`,
        zh: `https://www.toolkitlife.com/zh/tools/base64-to-image`,
        ja: `https://www.toolkitlife.com/ja/tools/base64-to-image`,
        ko: `https://www.toolkitlife.com/ko/tools/base64-to-image`,
        ru: `https://www.toolkitlife.com/ru/tools/base64-to-image`,
        "x-default": `https://www.toolkitlife.com/en/tools/base64-to-image`,
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
    <ToolMessages slug="base64-to-image" locale={locale}>
      {children}
    </ToolMessages>
  );
}
