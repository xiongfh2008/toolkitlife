import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "coin-flip" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.coin-flip.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/coin-flip`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/coin-flip`,
      languages: {
        en: `https://toolkitlife.com/en/tools/coin-flip`,
        es: `https://toolkitlife.com/es/tools/coin-flip`,
        zh: `https://toolkitlife.com/zh/tools/coin-flip`,
        ja: `https://toolkitlife.com/ja/tools/coin-flip`,
        ko: `https://toolkitlife.com/ko/tools/coin-flip`,
        ru: `https://toolkitlife.com/ru/tools/coin-flip`,
        "x-default": `https://toolkitlife.com/en/tools/coin-flip`,
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
    <ToolMessages slug="coin-flip" locale={locale}>
      {children}
    </ToolMessages>
  );
}
