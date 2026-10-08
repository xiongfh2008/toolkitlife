import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "fire-calculator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.fire-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/fire-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/fire-calculator`,
      languages: {
        en: `https://toolkitlife.com/en/tools/fire-calculator`,
        es: `https://toolkitlife.com/es/tools/fire-calculator`,
        zh: `https://toolkitlife.com/zh/tools/fire-calculator`,
        ja: `https://toolkitlife.com/ja/tools/fire-calculator`,
        ko: `https://toolkitlife.com/ko/tools/fire-calculator`,
        ru: `https://toolkitlife.com/ru/tools/fire-calculator`,
        "x-default": `https://toolkitlife.com/en/tools/fire-calculator`,
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
    <ToolMessages slug="fire-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
