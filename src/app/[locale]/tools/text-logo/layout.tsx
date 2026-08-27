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
  const t = await getTranslations({ locale, namespace: "tools.text-logo.metadata" });
  return {
    title: t("title"),
    openGraph: {
      url: `https://www.toolkitlife.com/${locale}/tools/text-logo`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/text-logo`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/text-logo`,
        zh: `https://www.toolkitlife.com/zh/tools/text-logo`,
        ja: `https://www.toolkitlife.com/ja/tools/text-logo`,
        ko: `https://www.toolkitlife.com/ko/tools/text-logo`,
        ru: `https://www.toolkitlife.com/ru/tools/text-logo`,
        "x-default": `https://www.toolkitlife.com/en/tools/text-logo`,
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
    <ToolMessages slug="text-logo" locale={locale}>
      {children}
    </ToolMessages>
  );
}
