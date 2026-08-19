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
  const t = await getTranslations({ locale, namespace: "tools.photo-watermark-remover.metadata" });
  return {
    title: t("title"),
    openGraph: { images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }] },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/photo-watermark-remover`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/photo-watermark-remover`,
        zh: `https://www.toolkitlife.com/zh/tools/photo-watermark-remover`,
        ja: `https://www.toolkitlife.com/ja/tools/photo-watermark-remover`,
        ko: `https://www.toolkitlife.com/ko/tools/photo-watermark-remover`,
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
    <ToolMessages slug="photo-watermark-remover" locale={locale}>
      {children}
    </ToolMessages>
  );
}
