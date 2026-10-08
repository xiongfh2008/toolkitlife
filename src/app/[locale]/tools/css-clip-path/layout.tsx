import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "css-clip-path" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.css-clip-path.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/css-clip-path`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/css-clip-path`,
      languages: {
        en: `https://toolkitlife.com/en/tools/css-clip-path`,
        es: `https://toolkitlife.com/es/tools/css-clip-path`,
        zh: `https://toolkitlife.com/zh/tools/css-clip-path`,
        ja: `https://toolkitlife.com/ja/tools/css-clip-path`,
        ko: `https://toolkitlife.com/ko/tools/css-clip-path`,
        ru: `https://toolkitlife.com/ru/tools/css-clip-path`,
        "x-default": `https://toolkitlife.com/en/tools/css-clip-path`,
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
    <ToolMessages slug="css-clip-path" locale={locale}>
      {children}
    </ToolMessages>
  );
}
