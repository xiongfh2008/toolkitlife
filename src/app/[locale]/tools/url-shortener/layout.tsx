import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "url-shortener" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.url-shortener.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/url-shortener`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/url-shortener`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/url-shortener`,
        zh: `https://www.toolkitlife.com/zh/tools/url-shortener`,
        ja: `https://www.toolkitlife.com/ja/tools/url-shortener`,
        ko: `https://www.toolkitlife.com/ko/tools/url-shortener`,
        ru: `https://www.toolkitlife.com/ru/tools/url-shortener`,
        "x-default": `https://www.toolkitlife.com/en/tools/url-shortener`,
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
    <ToolMessages slug="url-shortener" locale={locale}>
      {children}
    </ToolMessages>
  );
}
