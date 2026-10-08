import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-color-picker" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-color-picker.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/image-color-picker`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/image-color-picker`,
      languages: {
        en: `https://toolkitlife.com/en/tools/image-color-picker`,
        es: `https://toolkitlife.com/es/tools/image-color-picker`,
        zh: `https://toolkitlife.com/zh/tools/image-color-picker`,
        ja: `https://toolkitlife.com/ja/tools/image-color-picker`,
        ko: `https://toolkitlife.com/ko/tools/image-color-picker`,
        ru: `https://toolkitlife.com/ru/tools/image-color-picker`,
        "x-default": `https://toolkitlife.com/en/tools/image-color-picker`,
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
    <ToolMessages slug="image-color-picker" locale={locale}>
      {children}
    </ToolMessages>
  );
}
