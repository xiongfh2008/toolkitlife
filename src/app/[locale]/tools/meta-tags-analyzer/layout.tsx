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
  const t = await getTranslations({ locale, namespace: "tools.meta-tags-analyzer.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/meta-tags-analyzer`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/meta-tags-analyzer`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/meta-tags-analyzer`,
        zh: `https://www.toolkitlife.com/zh/tools/meta-tags-analyzer`,
        ja: `https://www.toolkitlife.com/ja/tools/meta-tags-analyzer`,
        ko: `https://www.toolkitlife.com/ko/tools/meta-tags-analyzer`,
        ru: `https://www.toolkitlife.com/ru/tools/meta-tags-analyzer`,
        "x-default": `https://www.toolkitlife.com/en/tools/meta-tags-analyzer`,
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
    <ToolMessages slug="meta-tags-analyzer" locale={locale}>
      {children}
    </ToolMessages>
  );
}
