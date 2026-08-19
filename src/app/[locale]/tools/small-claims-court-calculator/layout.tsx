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
  const t = await getTranslations({ locale, namespace: "tools.small-claims-court-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: { images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }] },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/small-claims-court-calculator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/small-claims-court-calculator`,
        zh: `https://www.toolkitlife.com/zh/tools/small-claims-court-calculator`,
        ja: `https://www.toolkitlife.com/ja/tools/small-claims-court-calculator`,
        ko: `https://www.toolkitlife.com/ko/tools/small-claims-court-calculator`,
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
    <ToolMessages slug="small-claims-court-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
