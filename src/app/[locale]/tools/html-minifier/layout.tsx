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
  const t = await getTranslations({ locale, namespace: "tools.html-minifier.metadata" });
  return {
    title: t("title"),
    openGraph: { images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }] },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/html-minifier`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/html-minifier`,
        zh: `https://www.toolkitlife.com/zh/tools/html-minifier`,
        ja: `https://www.toolkitlife.com/ja/tools/html-minifier`,
        ko: `https://www.toolkitlife.com/ko/tools/html-minifier`,
        ru: `https://www.toolkitlife.com/ru/tools/html-minifier`,
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
    <ToolMessages slug="html-minifier" locale={locale}>
      {children}
    </ToolMessages>
  );
}
