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
  const t = await getTranslations({ locale, namespace: "tools.video-watermark-remover.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/video-watermark-remover`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/video-watermark-remover`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/video-watermark-remover`,
        zh: `https://www.toolkitlife.com/zh/tools/video-watermark-remover`,
        ja: `https://www.toolkitlife.com/ja/tools/video-watermark-remover`,
        ko: `https://www.toolkitlife.com/ko/tools/video-watermark-remover`,
        ru: `https://www.toolkitlife.com/ru/tools/video-watermark-remover`,
        "x-default": `https://www.toolkitlife.com/en/tools/video-watermark-remover`,
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
    <ToolMessages slug="video-watermark-remover" locale={locale}>
      {children}
    </ToolMessages>
  );
}
