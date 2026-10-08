import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "css-text-shadow" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.css-text-shadow.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/css-text-shadow`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/css-text-shadow`,
      languages: {
        en: `https://toolkitlife.com/en/tools/css-text-shadow`,
        es: `https://toolkitlife.com/es/tools/css-text-shadow`,
        zh: `https://toolkitlife.com/zh/tools/css-text-shadow`,
        ja: `https://toolkitlife.com/ja/tools/css-text-shadow`,
        ko: `https://toolkitlife.com/ko/tools/css-text-shadow`,
        ru: `https://toolkitlife.com/ru/tools/css-text-shadow`,
        "x-default": `https://toolkitlife.com/en/tools/css-text-shadow`,
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
    <ToolMessages slug="css-text-shadow" locale={locale}>
      {children}
    </ToolMessages>
  );
}
