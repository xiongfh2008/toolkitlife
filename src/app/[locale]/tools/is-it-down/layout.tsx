import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "is-it-down" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.is-it-down.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/is-it-down`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/is-it-down`,
      languages: {
        en: `https://toolkitlife.com/en/tools/is-it-down`,
        es: `https://toolkitlife.com/es/tools/is-it-down`,
        zh: `https://toolkitlife.com/zh/tools/is-it-down`,
        ja: `https://toolkitlife.com/ja/tools/is-it-down`,
        ko: `https://toolkitlife.com/ko/tools/is-it-down`,
        ru: `https://toolkitlife.com/ru/tools/is-it-down`,
        "x-default": `https://toolkitlife.com/en/tools/is-it-down`,
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
    <ToolMessages slug="is-it-down" locale={locale}>
      {children}
    </ToolMessages>
  );
}
