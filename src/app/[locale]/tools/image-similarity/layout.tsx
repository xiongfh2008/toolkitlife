import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-similarity" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-similarity.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/image-similarity`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/image-similarity`,
      languages: {
        en: `https://toolkitlife.com/en/tools/image-similarity`,
        es: `https://toolkitlife.com/es/tools/image-similarity`,
        zh: `https://toolkitlife.com/zh/tools/image-similarity`,
        ja: `https://toolkitlife.com/ja/tools/image-similarity`,
        ko: `https://toolkitlife.com/ko/tools/image-similarity`,
        ru: `https://toolkitlife.com/ru/tools/image-similarity`,
        "x-default": `https://toolkitlife.com/en/tools/image-similarity`,
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
    <ToolMessages slug="image-similarity" locale={locale}>
      {children}
    </ToolMessages>
  );
}
