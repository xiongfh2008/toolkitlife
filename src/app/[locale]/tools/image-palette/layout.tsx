import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-palette" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-palette.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/image-palette`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/image-palette`,
      languages: {
        en: `https://toolkitlife.com/en/tools/image-palette`,
        es: `https://toolkitlife.com/es/tools/image-palette`,
        zh: `https://toolkitlife.com/zh/tools/image-palette`,
        ja: `https://toolkitlife.com/ja/tools/image-palette`,
        ko: `https://toolkitlife.com/ko/tools/image-palette`,
        ru: `https://toolkitlife.com/ru/tools/image-palette`,
        "x-default": `https://toolkitlife.com/en/tools/image-palette`,
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
    <ToolMessages slug="image-palette" locale={locale}>
      {children}
    </ToolMessages>
  );
}
