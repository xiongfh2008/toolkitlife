import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "pregnancy-calculator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.pregnancy-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/pregnancy-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/pregnancy-calculator`,
      languages: {
        en: `https://toolkitlife.com/en/tools/pregnancy-calculator`,
        es: `https://toolkitlife.com/es/tools/pregnancy-calculator`,
        zh: `https://toolkitlife.com/zh/tools/pregnancy-calculator`,
        ja: `https://toolkitlife.com/ja/tools/pregnancy-calculator`,
        ko: `https://toolkitlife.com/ko/tools/pregnancy-calculator`,
        ru: `https://toolkitlife.com/ru/tools/pregnancy-calculator`,
        "x-default": `https://toolkitlife.com/en/tools/pregnancy-calculator`,
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
    <ToolMessages slug="pregnancy-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
