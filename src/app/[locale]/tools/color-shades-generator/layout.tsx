import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "color-shades-generator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.color-shades-generator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/color-shades-generator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/color-shades-generator`,
      languages: {
        en: `https://toolkitlife.com/en/tools/color-shades-generator`,
        es: `https://toolkitlife.com/es/tools/color-shades-generator`,
        zh: `https://toolkitlife.com/zh/tools/color-shades-generator`,
        ja: `https://toolkitlife.com/ja/tools/color-shades-generator`,
        ko: `https://toolkitlife.com/ko/tools/color-shades-generator`,
        ru: `https://toolkitlife.com/ru/tools/color-shades-generator`,
        "x-default": `https://toolkitlife.com/en/tools/color-shades-generator`,
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
    <ToolMessages slug="color-shades-generator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
