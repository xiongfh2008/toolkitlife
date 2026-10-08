import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "svg-preview" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.svg-preview.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/svg-preview`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/svg-preview`,
      languages: {
        en: `https://toolkitlife.com/en/tools/svg-preview`,
        es: `https://toolkitlife.com/es/tools/svg-preview`,
        zh: `https://toolkitlife.com/zh/tools/svg-preview`,
        ja: `https://toolkitlife.com/ja/tools/svg-preview`,
        ko: `https://toolkitlife.com/ko/tools/svg-preview`,
        ru: `https://toolkitlife.com/ru/tools/svg-preview`,
        "x-default": `https://toolkitlife.com/en/tools/svg-preview`,
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
    <ToolMessages slug="svg-preview" locale={locale}>
      {children}
    </ToolMessages>
  );
}
