import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "convert" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.convert.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/convert`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/convert`,
      languages: {
        en: `https://toolkitlife.com/en/tools/convert`,
        es: `https://toolkitlife.com/es/tools/convert`,
        zh: `https://toolkitlife.com/zh/tools/convert`,
        ja: `https://toolkitlife.com/ja/tools/convert`,
        ko: `https://toolkitlife.com/ko/tools/convert`,
        ru: `https://toolkitlife.com/ru/tools/convert`,
        "x-default": `https://toolkitlife.com/en/tools/convert`,
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
    <ToolMessages slug="convert" locale={locale}>
      {children}
    </ToolMessages>
  );
}
