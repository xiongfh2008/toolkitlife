import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "self-employment-tax-calculator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.self-employment-tax-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/self-employment-tax-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/self-employment-tax-calculator`,
      languages: {
        en: `https://toolkitlife.com/en/tools/self-employment-tax-calculator`,
        es: `https://toolkitlife.com/es/tools/self-employment-tax-calculator`,
        zh: `https://toolkitlife.com/zh/tools/self-employment-tax-calculator`,
        ja: `https://toolkitlife.com/ja/tools/self-employment-tax-calculator`,
        ko: `https://toolkitlife.com/ko/tools/self-employment-tax-calculator`,
        ru: `https://toolkitlife.com/ru/tools/self-employment-tax-calculator`,
        "x-default": `https://toolkitlife.com/en/tools/self-employment-tax-calculator`,
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
    <ToolMessages slug="self-employment-tax-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
