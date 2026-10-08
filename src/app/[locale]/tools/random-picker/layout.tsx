import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "random-picker" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.random-picker.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/random-picker`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/random-picker`,
      languages: {
        en: `https://toolkitlife.com/en/tools/random-picker`,
        es: `https://toolkitlife.com/es/tools/random-picker`,
        zh: `https://toolkitlife.com/zh/tools/random-picker`,
        ja: `https://toolkitlife.com/ja/tools/random-picker`,
        ko: `https://toolkitlife.com/ko/tools/random-picker`,
        ru: `https://toolkitlife.com/ru/tools/random-picker`,
        "x-default": `https://toolkitlife.com/en/tools/random-picker`,
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
    <ToolMessages slug="random-picker" locale={locale}>
      {children}
    </ToolMessages>
  );
}
