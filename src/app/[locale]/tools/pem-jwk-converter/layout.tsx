import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";

export function generateStaticParams() {
  return [{ slug: "pem-jwk-converter" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.pem-jwk-converter.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/pem-jwk-converter`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/pem-jwk-converter`,
      languages: {
        en: `https://toolkitlife.com/en/tools/pem-jwk-converter`,
        es: `https://toolkitlife.com/es/tools/pem-jwk-converter`,
        zh: `https://toolkitlife.com/zh/tools/pem-jwk-converter`,
        ja: `https://toolkitlife.com/ja/tools/pem-jwk-converter`,
        ko: `https://toolkitlife.com/ko/tools/pem-jwk-converter`,
        ru: `https://toolkitlife.com/ru/tools/pem-jwk-converter`,
        "x-default": `https://toolkitlife.com/en/tools/pem-jwk-converter`,
      },
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <ToolMessages slug="pem-jwk-converter" locale={locale}>
      {children}
    </ToolMessages>
  );
}
