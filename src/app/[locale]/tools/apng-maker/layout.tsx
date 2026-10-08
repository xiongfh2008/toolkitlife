import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "apng-maker" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.apng-maker.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/apng-maker`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/apng-maker`,
      languages: {
        en: `https://toolkitlife.com/en/tools/apng-maker`,
        es: `https://toolkitlife.com/es/tools/apng-maker`,
        zh: `https://toolkitlife.com/zh/tools/apng-maker`,
        ja: `https://toolkitlife.com/ja/tools/apng-maker`,
        ko: `https://toolkitlife.com/ko/tools/apng-maker`,
        ru: `https://toolkitlife.com/ru/tools/apng-maker`,
        "x-default": `https://toolkitlife.com/en/tools/apng-maker`,
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
    <ToolMessages slug="apng-maker" locale={locale}>
      {children}
    </ToolMessages>
  );
}
