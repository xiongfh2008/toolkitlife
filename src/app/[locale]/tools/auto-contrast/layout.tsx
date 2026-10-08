import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "auto-contrast" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.auto-contrast.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/auto-contrast`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/auto-contrast`,
      languages: {
        en: `https://toolkitlife.com/en/tools/auto-contrast`,
        es: `https://toolkitlife.com/es/tools/auto-contrast`,
        zh: `https://toolkitlife.com/zh/tools/auto-contrast`,
        ja: `https://toolkitlife.com/ja/tools/auto-contrast`,
        ko: `https://toolkitlife.com/ko/tools/auto-contrast`,
        ru: `https://toolkitlife.com/ru/tools/auto-contrast`,
        "x-default": `https://toolkitlife.com/en/tools/auto-contrast`,
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
    <ToolMessages slug="auto-contrast" locale={locale}>
      {children}
    </ToolMessages>
  );
}
