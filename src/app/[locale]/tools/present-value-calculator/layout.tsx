import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "present-value-calculator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.present-value-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/present-value-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/present-value-calculator`,
      languages: {
        en: `https://toolkitlife.com/en/tools/present-value-calculator`,
        es: `https://toolkitlife.com/es/tools/present-value-calculator`,
        zh: `https://toolkitlife.com/zh/tools/present-value-calculator`,
        ja: `https://toolkitlife.com/ja/tools/present-value-calculator`,
        ko: `https://toolkitlife.com/ko/tools/present-value-calculator`,
        ru: `https://toolkitlife.com/ru/tools/present-value-calculator`,
        "x-default": `https://toolkitlife.com/en/tools/present-value-calculator`,
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
    <ToolMessages slug="present-value-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
