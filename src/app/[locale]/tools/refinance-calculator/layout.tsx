import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "refinance-calculator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.refinance-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/refinance-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/refinance-calculator`,
      languages: {
        en: `https://toolkitlife.com/en/tools/refinance-calculator`,
        es: `https://toolkitlife.com/es/tools/refinance-calculator`,
        zh: `https://toolkitlife.com/zh/tools/refinance-calculator`,
        ja: `https://toolkitlife.com/ja/tools/refinance-calculator`,
        ko: `https://toolkitlife.com/ko/tools/refinance-calculator`,
        ru: `https://toolkitlife.com/ru/tools/refinance-calculator`,
        "x-default": `https://toolkitlife.com/en/tools/refinance-calculator`,
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
    <ToolMessages slug="refinance-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
