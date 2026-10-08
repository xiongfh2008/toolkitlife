import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "photo-colorize" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.photo-colorize.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/photo-colorize`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/photo-colorize`,
      languages: {
        en: `https://toolkitlife.com/en/tools/photo-colorize`,
        es: `https://toolkitlife.com/es/tools/photo-colorize`,
        zh: `https://toolkitlife.com/zh/tools/photo-colorize`,
        ja: `https://toolkitlife.com/ja/tools/photo-colorize`,
        ko: `https://toolkitlife.com/ko/tools/photo-colorize`,
        ru: `https://toolkitlife.com/ru/tools/photo-colorize`,
        "x-default": `https://toolkitlife.com/en/tools/photo-colorize`,
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
    <ToolMessages slug="photo-colorize" locale={locale}>
      {children}
    </ToolMessages>
  );
}
