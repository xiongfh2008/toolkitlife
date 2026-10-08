import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "what-is-my-browser" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.what-is-my-browser.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/what-is-my-browser`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/what-is-my-browser`,
      languages: {
        en: `https://toolkitlife.com/en/tools/what-is-my-browser`,
        es: `https://toolkitlife.com/es/tools/what-is-my-browser`,
        zh: `https://toolkitlife.com/zh/tools/what-is-my-browser`,
        ja: `https://toolkitlife.com/ja/tools/what-is-my-browser`,
        ko: `https://toolkitlife.com/ko/tools/what-is-my-browser`,
        ru: `https://toolkitlife.com/ru/tools/what-is-my-browser`,
        "x-default": `https://toolkitlife.com/en/tools/what-is-my-browser`,
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
    <ToolMessages slug="what-is-my-browser" locale={locale}>
      {children}
    </ToolMessages>
  );
}
