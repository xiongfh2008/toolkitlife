import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "binary-converter" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.binary-converter.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/binary-converter`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/binary-converter`,
      languages: {
        en: `https://toolkitlife.com/en/tools/binary-converter`,
        es: `https://toolkitlife.com/es/tools/binary-converter`,
        zh: `https://toolkitlife.com/zh/tools/binary-converter`,
        ja: `https://toolkitlife.com/ja/tools/binary-converter`,
        ko: `https://toolkitlife.com/ko/tools/binary-converter`,
        ru: `https://toolkitlife.com/ru/tools/binary-converter`,
        "x-default": `https://toolkitlife.com/en/tools/binary-converter`,
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
    <ToolMessages slug="binary-converter" locale={locale}>
      {children}
    </ToolMessages>
  );
}
