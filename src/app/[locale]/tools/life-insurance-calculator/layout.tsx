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
  const t = await getTranslations({ locale, namespace: "tools.life-insurance-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/life-insurance-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/life-insurance-calculator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/life-insurance-calculator`,
        zh: `https://www.toolkitlife.com/zh/tools/life-insurance-calculator`,
        ja: `https://www.toolkitlife.com/ja/tools/life-insurance-calculator`,
        ko: `https://www.toolkitlife.com/ko/tools/life-insurance-calculator`,
        ru: `https://www.toolkitlife.com/ru/tools/life-insurance-calculator`,
        "x-default": `https://www.toolkitlife.com/en/tools/life-insurance-calculator`,
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
    <ToolMessages slug="life-insurance-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
