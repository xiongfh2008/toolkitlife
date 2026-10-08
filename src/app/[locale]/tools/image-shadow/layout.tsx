import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-shadow" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-shadow.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/image-shadow`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/image-shadow`,
      languages: {
        en: `https://toolkitlife.com/en/tools/image-shadow`,
        es: `https://toolkitlife.com/es/tools/image-shadow`,
        zh: `https://toolkitlife.com/zh/tools/image-shadow`,
        ja: `https://toolkitlife.com/ja/tools/image-shadow`,
        ko: `https://toolkitlife.com/ko/tools/image-shadow`,
        ru: `https://toolkitlife.com/ru/tools/image-shadow`,
        "x-default": `https://toolkitlife.com/en/tools/image-shadow`,
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
    <ToolMessages slug="image-shadow" locale={locale}>
      {children}
    </ToolMessages>
  );
}
