import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "ohms-law-calculator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.ohms-law-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/ohms-law-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/ohms-law-calculator`,
      languages: {
        en: `https://toolkitlife.com/en/tools/ohms-law-calculator`,
        es: `https://toolkitlife.com/es/tools/ohms-law-calculator`,
        zh: `https://toolkitlife.com/zh/tools/ohms-law-calculator`,
        ja: `https://toolkitlife.com/ja/tools/ohms-law-calculator`,
        ko: `https://toolkitlife.com/ko/tools/ohms-law-calculator`,
        ru: `https://toolkitlife.com/ru/tools/ohms-law-calculator`,
        "x-default": `https://toolkitlife.com/en/tools/ohms-law-calculator`,
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
    <ToolMessages slug="ohms-law-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
