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
  const t = await getTranslations({ locale, namespace: "tools.pdf-to-png.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/pdf-to-png`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/pdf-to-png`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/pdf-to-png`,
        zh: `https://www.toolkitlife.com/zh/tools/pdf-to-png`,
        ja: `https://www.toolkitlife.com/ja/tools/pdf-to-png`,
        ko: `https://www.toolkitlife.com/ko/tools/pdf-to-png`,
        ru: `https://www.toolkitlife.com/ru/tools/pdf-to-png`,
        "x-default": `https://www.toolkitlife.com/en/tools/pdf-to-png`,
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
    <ToolMessages slug="pdf-to-png" locale={locale}>
      {children}
    </ToolMessages>
  );
}
