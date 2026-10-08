import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "meta-tags-analyzer" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.meta-tags-analyzer.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/meta-tags-analyzer`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/meta-tags-analyzer`,
      languages: {
        en: `https://toolkitlife.com/en/tools/meta-tags-analyzer`,
        es: `https://toolkitlife.com/es/tools/meta-tags-analyzer`,
        zh: `https://toolkitlife.com/zh/tools/meta-tags-analyzer`,
        ja: `https://toolkitlife.com/ja/tools/meta-tags-analyzer`,
        ko: `https://toolkitlife.com/ko/tools/meta-tags-analyzer`,
        ru: `https://toolkitlife.com/ru/tools/meta-tags-analyzer`,
        "x-default": `https://toolkitlife.com/en/tools/meta-tags-analyzer`,
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
    <ToolMessages slug="meta-tags-analyzer" locale={locale}>
      {children}
    </ToolMessages>
  );
}
