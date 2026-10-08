import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "day-of-year" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.day-of-year.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/day-of-year`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/day-of-year`,
      languages: {
        en: `https://toolkitlife.com/en/tools/day-of-year`,
        es: `https://toolkitlife.com/es/tools/day-of-year`,
        zh: `https://toolkitlife.com/zh/tools/day-of-year`,
        ja: `https://toolkitlife.com/ja/tools/day-of-year`,
        ko: `https://toolkitlife.com/ko/tools/day-of-year`,
        ru: `https://toolkitlife.com/ru/tools/day-of-year`,
        "x-default": `https://toolkitlife.com/en/tools/day-of-year`,
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
    <ToolMessages slug="day-of-year" locale={locale}>
      {children}
    </ToolMessages>
  );
}
