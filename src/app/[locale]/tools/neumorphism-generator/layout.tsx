import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "neumorphism-generator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.neumorphism-generator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/neumorphism-generator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/neumorphism-generator`,
      languages: {
        en: `https://toolkitlife.com/en/tools/neumorphism-generator`,
        es: `https://toolkitlife.com/es/tools/neumorphism-generator`,
        zh: `https://toolkitlife.com/zh/tools/neumorphism-generator`,
        ja: `https://toolkitlife.com/ja/tools/neumorphism-generator`,
        ko: `https://toolkitlife.com/ko/tools/neumorphism-generator`,
        ru: `https://toolkitlife.com/ru/tools/neumorphism-generator`,
        "x-default": `https://toolkitlife.com/en/tools/neumorphism-generator`,
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
    <ToolMessages slug="neumorphism-generator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
