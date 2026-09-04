import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "car-loan-interest-deduction-calculator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.car-loan-interest-deduction-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/car-loan-interest-deduction-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/car-loan-interest-deduction-calculator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/car-loan-interest-deduction-calculator`,
        zh: `https://www.toolkitlife.com/zh/tools/car-loan-interest-deduction-calculator`,
        ja: `https://www.toolkitlife.com/ja/tools/car-loan-interest-deduction-calculator`,
        ko: `https://www.toolkitlife.com/ko/tools/car-loan-interest-deduction-calculator`,
        ru: `https://www.toolkitlife.com/ru/tools/car-loan-interest-deduction-calculator`,
        "x-default": `https://www.toolkitlife.com/en/tools/car-loan-interest-deduction-calculator`,
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
    <ToolMessages slug="car-loan-interest-deduction-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
