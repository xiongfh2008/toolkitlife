import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "keyword-position" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.keyword-position.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/keyword-position`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/keyword-position`,
      languages: {
        en: `https://toolkitlife.com/en/tools/keyword-position`,
        es: `https://toolkitlife.com/es/tools/keyword-position`,
        zh: `https://toolkitlife.com/zh/tools/keyword-position`,
        ja: `https://toolkitlife.com/ja/tools/keyword-position`,
        ko: `https://toolkitlife.com/ko/tools/keyword-position`,
        ru: `https://toolkitlife.com/ru/tools/keyword-position`,
        "x-default": `https://toolkitlife.com/en/tools/keyword-position`,
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
    <ToolMessages slug="keyword-position" locale={locale}>
      {children}
    </ToolMessages>
  );
}
