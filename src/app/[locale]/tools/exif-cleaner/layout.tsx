import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "exif-cleaner" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.exif-cleaner.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/exif-cleaner`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/exif-cleaner`,
      languages: {
        en: `https://toolkitlife.com/en/tools/exif-cleaner`,
        es: `https://toolkitlife.com/es/tools/exif-cleaner`,
        zh: `https://toolkitlife.com/zh/tools/exif-cleaner`,
        ja: `https://toolkitlife.com/ja/tools/exif-cleaner`,
        ko: `https://toolkitlife.com/ko/tools/exif-cleaner`,
        ru: `https://toolkitlife.com/ru/tools/exif-cleaner`,
        "x-default": `https://toolkitlife.com/en/tools/exif-cleaner`,
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
    <ToolMessages slug="exif-cleaner" locale={locale}>
      {children}
    </ToolMessages>
  );
}
