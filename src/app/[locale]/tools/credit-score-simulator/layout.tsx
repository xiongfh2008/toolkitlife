import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "credit-score-simulator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.credit-score-simulator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/credit-score-simulator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/credit-score-simulator`,
      languages: {
        en: `https://toolkitlife.com/en/tools/credit-score-simulator`,
        es: `https://toolkitlife.com/es/tools/credit-score-simulator`,
        zh: `https://toolkitlife.com/zh/tools/credit-score-simulator`,
        ja: `https://toolkitlife.com/ja/tools/credit-score-simulator`,
        ko: `https://toolkitlife.com/ko/tools/credit-score-simulator`,
        ru: `https://toolkitlife.com/ru/tools/credit-score-simulator`,
        "x-default": `https://toolkitlife.com/en/tools/credit-score-simulator`,
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
    <ToolMessages slug="credit-score-simulator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
