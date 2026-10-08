import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "face-detector" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.face-detector.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/face-detector`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/face-detector`,
      languages: {
        en: `https://toolkitlife.com/en/tools/face-detector`,
        es: `https://toolkitlife.com/es/tools/face-detector`,
        zh: `https://toolkitlife.com/zh/tools/face-detector`,
        ja: `https://toolkitlife.com/ja/tools/face-detector`,
        ko: `https://toolkitlife.com/ko/tools/face-detector`,
        ru: `https://toolkitlife.com/ru/tools/face-detector`,
        "x-default": `https://toolkitlife.com/en/tools/face-detector`,
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
    <ToolMessages slug="face-detector" locale={locale}>
      {children}
    </ToolMessages>
  );
}
