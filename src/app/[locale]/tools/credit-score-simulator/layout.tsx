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
  const t = await getTranslations({ locale, namespace: "tools.credit-score-simulator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      url: `https://www.toolkitlife.com/${locale}/tools/credit-score-simulator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/credit-score-simulator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/credit-score-simulator`,
        zh: `https://www.toolkitlife.com/zh/tools/credit-score-simulator`,
        ja: `https://www.toolkitlife.com/ja/tools/credit-score-simulator`,
        ko: `https://www.toolkitlife.com/ko/tools/credit-score-simulator`,
        ru: `https://www.toolkitlife.com/ru/tools/credit-score-simulator`,
        "x-default": `https://www.toolkitlife.com/en/tools/credit-score-simulator`,
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
    <ToolMessages slug="credit-score-simulator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
