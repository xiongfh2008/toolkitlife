import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "depreciation-calculator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.depreciation-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/depreciation-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/depreciation-calculator`,
      languages: {
        en: `https://toolkitlife.com/en/tools/depreciation-calculator`,
        es: `https://toolkitlife.com/es/tools/depreciation-calculator`,
        zh: `https://toolkitlife.com/zh/tools/depreciation-calculator`,
        ja: `https://toolkitlife.com/ja/tools/depreciation-calculator`,
        ko: `https://toolkitlife.com/ko/tools/depreciation-calculator`,
        ru: `https://toolkitlife.com/ru/tools/depreciation-calculator`,
        "x-default": `https://toolkitlife.com/en/tools/depreciation-calculator`,
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
    <ToolMessages slug="depreciation-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
