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
  const t = await getTranslations({ locale, namespace: "tools.json-to-csv.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/json-to-csv`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/json-to-csv`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/json-to-csv`,
        zh: `https://www.toolkitlife.com/zh/tools/json-to-csv`,
        ja: `https://www.toolkitlife.com/ja/tools/json-to-csv`,
        ko: `https://www.toolkitlife.com/ko/tools/json-to-csv`,
        ru: `https://www.toolkitlife.com/ru/tools/json-to-csv`,
        "x-default": `https://www.toolkitlife.com/en/tools/json-to-csv`,
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
    <ToolMessages slug="json-to-csv" locale={locale}>
      {children}
    </ToolMessages>
  );
}
