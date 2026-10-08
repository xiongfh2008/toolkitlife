import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "background-replace" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.background-replace.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/background-replace`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/background-replace`,
      languages: {
        en: `https://toolkitlife.com/en/tools/background-replace`,
        es: `https://toolkitlife.com/es/tools/background-replace`,
        zh: `https://toolkitlife.com/zh/tools/background-replace`,
        ja: `https://toolkitlife.com/ja/tools/background-replace`,
        ko: `https://toolkitlife.com/ko/tools/background-replace`,
        ru: `https://toolkitlife.com/ru/tools/background-replace`,
        "x-default": `https://toolkitlife.com/en/tools/background-replace`,
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
    <ToolMessages slug="background-replace" locale={locale}>
      {children}
    </ToolMessages>
  );
}
