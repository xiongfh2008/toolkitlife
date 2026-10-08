import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "long-tail-keywords" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.long-tail-keywords.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/long-tail-keywords`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/long-tail-keywords`,
      languages: {
        en: `https://toolkitlife.com/en/tools/long-tail-keywords`,
        es: `https://toolkitlife.com/es/tools/long-tail-keywords`,
        zh: `https://toolkitlife.com/zh/tools/long-tail-keywords`,
        ja: `https://toolkitlife.com/ja/tools/long-tail-keywords`,
        ko: `https://toolkitlife.com/ko/tools/long-tail-keywords`,
        ru: `https://toolkitlife.com/ru/tools/long-tail-keywords`,
        "x-default": `https://toolkitlife.com/en/tools/long-tail-keywords`,
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
    <ToolMessages slug="long-tail-keywords" locale={locale}>
      {children}
    </ToolMessages>
  );
}
