import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "screen-recorder" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.screen-recorder.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/screen-recorder`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/screen-recorder`,
      languages: {
        en: `https://toolkitlife.com/en/tools/screen-recorder`,
        es: `https://toolkitlife.com/es/tools/screen-recorder`,
        zh: `https://toolkitlife.com/zh/tools/screen-recorder`,
        ja: `https://toolkitlife.com/ja/tools/screen-recorder`,
        ko: `https://toolkitlife.com/ko/tools/screen-recorder`,
        ru: `https://toolkitlife.com/ru/tools/screen-recorder`,
        "x-default": `https://toolkitlife.com/en/tools/screen-recorder`,
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
    <ToolMessages slug="screen-recorder" locale={locale}>
      {children}
    </ToolMessages>
  );
}
