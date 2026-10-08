import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "css-flexbox" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.css-flexbox.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/css-flexbox`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/css-flexbox`,
      languages: {
        en: `https://toolkitlife.com/en/tools/css-flexbox`,
        es: `https://toolkitlife.com/es/tools/css-flexbox`,
        zh: `https://toolkitlife.com/zh/tools/css-flexbox`,
        ja: `https://toolkitlife.com/ja/tools/css-flexbox`,
        ko: `https://toolkitlife.com/ko/tools/css-flexbox`,
        ru: `https://toolkitlife.com/ru/tools/css-flexbox`,
        "x-default": `https://toolkitlife.com/en/tools/css-flexbox`,
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
    <ToolMessages slug="css-flexbox" locale={locale}>
      {children}
    </ToolMessages>
  );
}
