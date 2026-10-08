import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "markdown-preview" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.markdown-preview.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/markdown-preview`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/markdown-preview`,
      languages: {
        en: `https://toolkitlife.com/en/tools/markdown-preview`,
        es: `https://toolkitlife.com/es/tools/markdown-preview`,
        zh: `https://toolkitlife.com/zh/tools/markdown-preview`,
        ja: `https://toolkitlife.com/ja/tools/markdown-preview`,
        ko: `https://toolkitlife.com/ko/tools/markdown-preview`,
        ru: `https://toolkitlife.com/ru/tools/markdown-preview`,
        "x-default": `https://toolkitlife.com/en/tools/markdown-preview`,
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
    <ToolMessages slug="markdown-preview" locale={locale}>
      {children}
    </ToolMessages>
  );
}
