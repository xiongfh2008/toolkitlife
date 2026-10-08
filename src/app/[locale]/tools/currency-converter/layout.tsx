import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "currency-converter" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.currency-converter.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/currency-converter`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/currency-converter`,
      languages: {
        en: `https://toolkitlife.com/en/tools/currency-converter`,
        es: `https://toolkitlife.com/es/tools/currency-converter`,
        zh: `https://toolkitlife.com/zh/tools/currency-converter`,
        ja: `https://toolkitlife.com/ja/tools/currency-converter`,
        ko: `https://toolkitlife.com/ko/tools/currency-converter`,
        ru: `https://toolkitlife.com/ru/tools/currency-converter`,
        "x-default": `https://toolkitlife.com/en/tools/currency-converter`,
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
    <ToolMessages slug="currency-converter" locale={locale}>
      {children}
    </ToolMessages>
  );
}
