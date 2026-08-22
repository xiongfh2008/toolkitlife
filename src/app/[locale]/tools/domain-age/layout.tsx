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
  const t = await getTranslations({ locale, namespace: "tools.domain-age.metadata" });
  return {
    title: t("title"),
    openGraph: { images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }] },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/domain-age`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/domain-age`,
        zh: `https://www.toolkitlife.com/zh/tools/domain-age`,
        ja: `https://www.toolkitlife.com/ja/tools/domain-age`,
        ko: `https://www.toolkitlife.com/ko/tools/domain-age`,
        ru: `https://www.toolkitlife.com/ru/tools/domain-age`,
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
    <ToolMessages slug="domain-age" locale={locale}>
      {children}
    </ToolMessages>
  );
}
