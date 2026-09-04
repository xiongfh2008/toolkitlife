import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "css-sprite-generator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.css-sprite-generator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/css-sprite-generator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/css-sprite-generator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/css-sprite-generator`,
        zh: `https://www.toolkitlife.com/zh/tools/css-sprite-generator`,
        ja: `https://www.toolkitlife.com/ja/tools/css-sprite-generator`,
        ko: `https://www.toolkitlife.com/ko/tools/css-sprite-generator`,
        ru: `https://www.toolkitlife.com/ru/tools/css-sprite-generator`,
        "x-default": `https://www.toolkitlife.com/en/tools/css-sprite-generator`,
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
    <ToolMessages slug="css-sprite-generator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
