import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "video-frame-extractor" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.video-frame-extractor.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/video-frame-extractor`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/video-frame-extractor`,
      languages: {
        en: `https://toolkitlife.com/en/tools/video-frame-extractor`,
        es: `https://toolkitlife.com/es/tools/video-frame-extractor`,
        zh: `https://toolkitlife.com/zh/tools/video-frame-extractor`,
        ja: `https://toolkitlife.com/ja/tools/video-frame-extractor`,
        ko: `https://toolkitlife.com/ko/tools/video-frame-extractor`,
        ru: `https://toolkitlife.com/ru/tools/video-frame-extractor`,
        "x-default": `https://toolkitlife.com/en/tools/video-frame-extractor`,
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
    <ToolMessages slug="video-frame-extractor" locale={locale}>
      {children}
    </ToolMessages>
  );
}
