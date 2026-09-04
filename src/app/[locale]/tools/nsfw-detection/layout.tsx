import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "nsfw-detection" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.nsfw-detection.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/nsfw-detection`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/nsfw-detection`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/nsfw-detection`,
        zh: `https://www.toolkitlife.com/zh/tools/nsfw-detection`,
        ja: `https://www.toolkitlife.com/ja/tools/nsfw-detection`,
        ko: `https://www.toolkitlife.com/ko/tools/nsfw-detection`,
        ru: `https://www.toolkitlife.com/ru/tools/nsfw-detection`,
        "x-default": `https://www.toolkitlife.com/en/tools/nsfw-detection`,
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
    <ToolMessages slug="nsfw-detection" locale={locale}>
      {children}
    </ToolMessages>
  );
}
