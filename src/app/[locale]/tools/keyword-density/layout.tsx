import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "keyword-density" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.keyword-density.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/keyword-density`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/keyword-density`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/keyword-density`,
        zh: `https://www.toolkitlife.com/zh/tools/keyword-density`,
        ja: `https://www.toolkitlife.com/ja/tools/keyword-density`,
        ko: `https://www.toolkitlife.com/ko/tools/keyword-density`,
        ru: `https://www.toolkitlife.com/ru/tools/keyword-density`,
        "x-default": `https://www.toolkitlife.com/en/tools/keyword-density`,
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
  setRequestLocale(locale);
  return (
    <ToolMessages slug="keyword-density" locale={locale}>
      {children}
    </ToolMessages>
  );
}
