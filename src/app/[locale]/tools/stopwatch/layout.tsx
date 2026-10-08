import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "stopwatch" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.stopwatch.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/stopwatch`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/stopwatch`,
      languages: {
        en: `https://toolkitlife.com/en/tools/stopwatch`,
        es: `https://toolkitlife.com/es/tools/stopwatch`,
        zh: `https://toolkitlife.com/zh/tools/stopwatch`,
        ja: `https://toolkitlife.com/ja/tools/stopwatch`,
        ko: `https://toolkitlife.com/ko/tools/stopwatch`,
        ru: `https://toolkitlife.com/ru/tools/stopwatch`,
        "x-default": `https://toolkitlife.com/en/tools/stopwatch`,
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
    <ToolMessages slug="stopwatch" locale={locale}>
      {children}
    </ToolMessages>
  );
}
