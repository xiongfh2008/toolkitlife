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
  const t = await getTranslations({ locale, namespace: "tools.video-to-images.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/video-to-images`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/video-to-images`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/video-to-images`,
        zh: `https://www.toolkitlife.com/zh/tools/video-to-images`,
        ja: `https://www.toolkitlife.com/ja/tools/video-to-images`,
        ko: `https://www.toolkitlife.com/ko/tools/video-to-images`,
        ru: `https://www.toolkitlife.com/ru/tools/video-to-images`,
        "x-default": `https://www.toolkitlife.com/en/tools/video-to-images`,
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
    <ToolMessages slug="video-to-images" locale={locale}>
      {children}
    </ToolMessages>
  );
}
