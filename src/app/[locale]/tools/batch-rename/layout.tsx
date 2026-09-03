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
  const t = await getTranslations({ locale, namespace: "tools.batch-rename.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/batch-rename`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/batch-rename`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/batch-rename`,
        zh: `https://www.toolkitlife.com/zh/tools/batch-rename`,
        ja: `https://www.toolkitlife.com/ja/tools/batch-rename`,
        ko: `https://www.toolkitlife.com/ko/tools/batch-rename`,
        ru: `https://www.toolkitlife.com/ru/tools/batch-rename`,
        "x-default": `https://www.toolkitlife.com/en/tools/batch-rename`,
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
    <ToolMessages slug="batch-rename" locale={locale}>
      {children}
    </ToolMessages>
  );
}
