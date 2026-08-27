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
  const t = await getTranslations({ locale, namespace: "tools.docx-to-jpg.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/docx-to-jpg`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/docx-to-jpg`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/docx-to-jpg`,
        zh: `https://www.toolkitlife.com/zh/tools/docx-to-jpg`,
        ja: `https://www.toolkitlife.com/ja/tools/docx-to-jpg`,
        ko: `https://www.toolkitlife.com/ko/tools/docx-to-jpg`,
        ru: `https://www.toolkitlife.com/ru/tools/docx-to-jpg`,
        "x-default": `https://www.toolkitlife.com/en/tools/docx-to-jpg`,
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
    <ToolMessages slug="docx-to-jpg" locale={locale}>
      {children}
    </ToolMessages>
  );
}
