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
  const t = await getTranslations({ locale, namespace: "tools.video-speed-changer.metadata" });
  return {
    title: t("title"),
    openGraph: { images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }] },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/video-speed-changer`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/video-speed-changer`,
        zh: `https://www.toolkitlife.com/zh/tools/video-speed-changer`,
        ja: `https://www.toolkitlife.com/ja/tools/video-speed-changer`,
        ko: `https://www.toolkitlife.com/ko/tools/video-speed-changer`,
        ru: `https://www.toolkitlife.com/ru/tools/video-speed-changer`,
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
    <ToolMessages slug="video-speed-changer" locale={locale}>
      {children}
    </ToolMessages>
  );
}
