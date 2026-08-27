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
  const t = await getTranslations({ locale, namespace: "tools.image-denoise.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/image-denoise`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/image-denoise`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/image-denoise`,
        zh: `https://www.toolkitlife.com/zh/tools/image-denoise`,
        ja: `https://www.toolkitlife.com/ja/tools/image-denoise`,
        ko: `https://www.toolkitlife.com/ko/tools/image-denoise`,
        ru: `https://www.toolkitlife.com/ru/tools/image-denoise`,
        "x-default": `https://www.toolkitlife.com/en/tools/image-denoise`,
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
    <ToolMessages slug="image-denoise" locale={locale}>
      {children}
    </ToolMessages>
  );
}
