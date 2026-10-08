import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-edge-detect" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-edge-detect.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/image-edge-detect`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/image-edge-detect`,
      languages: {
        en: `https://toolkitlife.com/en/tools/image-edge-detect`,
        es: `https://toolkitlife.com/es/tools/image-edge-detect`,
        zh: `https://toolkitlife.com/zh/tools/image-edge-detect`,
        ja: `https://toolkitlife.com/ja/tools/image-edge-detect`,
        ko: `https://toolkitlife.com/ko/tools/image-edge-detect`,
        ru: `https://toolkitlife.com/ru/tools/image-edge-detect`,
        "x-default": `https://toolkitlife.com/en/tools/image-edge-detect`,
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
    <ToolMessages slug="image-edge-detect" locale={locale}>
      {children}
    </ToolMessages>
  );
}
