import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "digital-signature" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.digital-signature.metadata" });

  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/digital-signature`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/digital-signature`,
      languages: {
        en: `https://toolkitlife.com/en/tools/digital-signature`,
        es: `https://toolkitlife.com/es/tools/digital-signature`,
        zh: `https://toolkitlife.com/zh/tools/digital-signature`,
        ja: `https://toolkitlife.com/ja/tools/digital-signature`,
        ko: `https://toolkitlife.com/ko/tools/digital-signature`,
        ru: `https://toolkitlife.com/ru/tools/digital-signature`,
        "x-default": `https://toolkitlife.com/en/tools/digital-signature`,
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
    <ToolMessages slug="digital-signature" locale={locale}>
      {children}
    </ToolMessages>
  );
}
