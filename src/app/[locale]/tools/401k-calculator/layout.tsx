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
  const t = await getTranslations({ locale, namespace: "tools.401k-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: { images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }] },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/401k-calculator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/401k-calculator`,
        zh: `https://www.toolkitlife.com/zh/tools/401k-calculator`,
        ja: `https://www.toolkitlife.com/ja/tools/401k-calculator`,
        ko: `https://www.toolkitlife.com/ko/tools/401k-calculator`,
        ru: `https://www.toolkitlife.com/ru/tools/401k-calculator`,
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
    <ToolMessages slug="401k-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
