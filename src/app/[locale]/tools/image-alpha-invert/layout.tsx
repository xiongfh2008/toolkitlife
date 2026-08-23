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
  const t = await getTranslations({ locale, namespace: "tools.image-alpha-invert.metadata" });
  return {
    title: t("title"),
    openGraph: { images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }] },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/image-alpha-invert`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/image-alpha-invert`,
        zh: `https://www.toolkitlife.com/zh/tools/image-alpha-invert`,
        ja: `https://www.toolkitlife.com/ja/tools/image-alpha-invert`,
        ko: `https://www.toolkitlife.com/ko/tools/image-alpha-invert`,
        ru: `https://www.toolkitlife.com/ru/tools/image-alpha-invert`,
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
    <ToolMessages slug="image-alpha-invert" locale={locale}>
      {children}
    </ToolMessages>
  );
}
