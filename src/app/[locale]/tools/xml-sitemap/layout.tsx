import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "xml-sitemap" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.xml-sitemap.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/xml-sitemap`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/xml-sitemap`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/xml-sitemap`,
        es: `https://www.toolkitlife.com/es/tools/xml-sitemap`,
        de: `https://www.toolkitlife.com/de/tools/xml-sitemap`,
        fr: `https://www.toolkitlife.com/fr/tools/xml-sitemap`,
        pt: `https://www.toolkitlife.com/pt/tools/xml-sitemap`,
        zh: `https://www.toolkitlife.com/zh/tools/xml-sitemap`,
        ja: `https://www.toolkitlife.com/ja/tools/xml-sitemap`,
        ko: `https://www.toolkitlife.com/ko/tools/xml-sitemap`,
        ru: `https://www.toolkitlife.com/ru/tools/xml-sitemap`,
        "x-default": `https://www.toolkitlife.com/en/tools/xml-sitemap`,
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
    <ToolMessages slug="xml-sitemap" locale={locale}>
      {children}
    </ToolMessages>
  );
}
