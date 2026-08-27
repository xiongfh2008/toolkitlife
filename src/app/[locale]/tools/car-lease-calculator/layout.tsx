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
  const t = await getTranslations({ locale, namespace: "tools.car-lease-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/car-lease-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/car-lease-calculator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/car-lease-calculator`,
        zh: `https://www.toolkitlife.com/zh/tools/car-lease-calculator`,
        ja: `https://www.toolkitlife.com/ja/tools/car-lease-calculator`,
        ko: `https://www.toolkitlife.com/ko/tools/car-lease-calculator`,
        ru: `https://www.toolkitlife.com/ru/tools/car-lease-calculator`,
        "x-default": `https://www.toolkitlife.com/en/tools/car-lease-calculator`,
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
    <ToolMessages slug="car-lease-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
