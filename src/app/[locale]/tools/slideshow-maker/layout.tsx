import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "slideshow-maker" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.slideshow-maker.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/slideshow-maker`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/slideshow-maker`,
      languages: {
        en: `https://toolkitlife.com/en/tools/slideshow-maker`,
        es: `https://toolkitlife.com/es/tools/slideshow-maker`,
        zh: `https://toolkitlife.com/zh/tools/slideshow-maker`,
        ja: `https://toolkitlife.com/ja/tools/slideshow-maker`,
        ko: `https://toolkitlife.com/ko/tools/slideshow-maker`,
        ru: `https://toolkitlife.com/ru/tools/slideshow-maker`,
        "x-default": `https://toolkitlife.com/en/tools/slideshow-maker`,
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
    <ToolMessages slug="slideshow-maker" locale={locale}>
      {children}
    </ToolMessages>
  );
}
