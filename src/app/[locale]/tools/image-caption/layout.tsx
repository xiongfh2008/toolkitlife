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
  const t = await getTranslations({ locale, namespace: "tools.image-caption.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/image-caption`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/image-caption`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/image-caption`,
        zh: `https://www.toolkitlife.com/zh/tools/image-caption`,
        ja: `https://www.toolkitlife.com/ja/tools/image-caption`,
        ko: `https://www.toolkitlife.com/ko/tools/image-caption`,
        ru: `https://www.toolkitlife.com/ru/tools/image-caption`,
        "x-default": `https://www.toolkitlife.com/en/tools/image-caption`,
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
    <ToolMessages slug="image-caption" locale={locale}>
      {children}
    </ToolMessages>
  );
}
