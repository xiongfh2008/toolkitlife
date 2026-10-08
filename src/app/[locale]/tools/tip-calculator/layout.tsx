import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "tip-calculator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.tip-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/tip-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/tip-calculator`,
      languages: {
        en: `https://toolkitlife.com/en/tools/tip-calculator`,
        es: `https://toolkitlife.com/es/tools/tip-calculator`,
        zh: `https://toolkitlife.com/zh/tools/tip-calculator`,
        ja: `https://toolkitlife.com/ja/tools/tip-calculator`,
        ko: `https://toolkitlife.com/ko/tools/tip-calculator`,
        ru: `https://toolkitlife.com/ru/tools/tip-calculator`,
        "x-default": `https://toolkitlife.com/en/tools/tip-calculator`,
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
    <ToolMessages slug="tip-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
