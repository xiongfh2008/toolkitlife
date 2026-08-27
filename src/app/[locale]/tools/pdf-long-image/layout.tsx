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
  const t = await getTranslations({ locale, namespace: "tools.pdf-long-image.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/pdf-long-image`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/pdf-long-image`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/pdf-long-image`,
        zh: `https://www.toolkitlife.com/zh/tools/pdf-long-image`,
        ja: `https://www.toolkitlife.com/ja/tools/pdf-long-image`,
        ko: `https://www.toolkitlife.com/ko/tools/pdf-long-image`,
        ru: `https://www.toolkitlife.com/ru/tools/pdf-long-image`,
        "x-default": `https://www.toolkitlife.com/en/tools/pdf-long-image`,
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
    <ToolMessages slug="pdf-long-image" locale={locale}>
      {children}
    </ToolMessages>
  );
}
