import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "monte-carlo-pi" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.monte-carlo-pi.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/monte-carlo-pi`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/monte-carlo-pi`,
      languages: {
        en: `https://toolkitlife.com/en/tools/monte-carlo-pi`,
        es: `https://toolkitlife.com/es/tools/monte-carlo-pi`,
        zh: `https://toolkitlife.com/zh/tools/monte-carlo-pi`,
        ja: `https://toolkitlife.com/ja/tools/monte-carlo-pi`,
        ko: `https://toolkitlife.com/ko/tools/monte-carlo-pi`,
        ru: `https://toolkitlife.com/ru/tools/monte-carlo-pi`,
        "x-default": `https://toolkitlife.com/en/tools/monte-carlo-pi`,
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
    <ToolMessages slug="monte-carlo-pi" locale={locale}>
      {children}
    </ToolMessages>
  );
}
