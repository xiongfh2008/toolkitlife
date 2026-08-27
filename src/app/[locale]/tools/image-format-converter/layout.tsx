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
  const t = await getTranslations({ locale, namespace: "tools.image-format-converter.metadata" });
  return {
    title: t("title"),
    openGraph: {
      url: `https://www.toolkitlife.com/${locale}/tools/image-format-converter`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/image-format-converter`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/image-format-converter`,
        zh: `https://www.toolkitlife.com/zh/tools/image-format-converter`,
        ja: `https://www.toolkitlife.com/ja/tools/image-format-converter`,
        ko: `https://www.toolkitlife.com/ko/tools/image-format-converter`,
        ru: `https://www.toolkitlife.com/ru/tools/image-format-converter`,
        "x-default": `https://www.toolkitlife.com/en/tools/image-format-converter`,
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
    <ToolMessages slug="image-format-converter" locale={locale}>
      {children}
    </ToolMessages>
  );
}
