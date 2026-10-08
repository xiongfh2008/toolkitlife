import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "pixel-art" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.pixel-art.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/pixel-art`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/pixel-art`,
      languages: {
        en: `https://toolkitlife.com/en/tools/pixel-art`,
        es: `https://toolkitlife.com/es/tools/pixel-art`,
        zh: `https://toolkitlife.com/zh/tools/pixel-art`,
        ja: `https://toolkitlife.com/ja/tools/pixel-art`,
        ko: `https://toolkitlife.com/ko/tools/pixel-art`,
        ru: `https://toolkitlife.com/ru/tools/pixel-art`,
        "x-default": `https://toolkitlife.com/en/tools/pixel-art`,
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
    <ToolMessages slug="pixel-art" locale={locale}>
      {children}
    </ToolMessages>
  );
}
