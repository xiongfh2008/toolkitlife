import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "geo-ip-locator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.geo-ip-locator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/geo-ip-locator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/geo-ip-locator`,
      languages: {
        en: `https://toolkitlife.com/en/tools/geo-ip-locator`,
        es: `https://toolkitlife.com/es/tools/geo-ip-locator`,
        zh: `https://toolkitlife.com/zh/tools/geo-ip-locator`,
        ja: `https://toolkitlife.com/ja/tools/geo-ip-locator`,
        ko: `https://toolkitlife.com/ko/tools/geo-ip-locator`,
        ru: `https://toolkitlife.com/ru/tools/geo-ip-locator`,
        "x-default": `https://toolkitlife.com/en/tools/geo-ip-locator`,
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
    <ToolMessages slug="geo-ip-locator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
