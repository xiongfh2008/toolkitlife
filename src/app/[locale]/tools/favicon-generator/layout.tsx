import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "favicon-generator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.favicon-generator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/favicon-generator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/favicon-generator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/favicon-generator`,
        zh: `https://www.toolkitlife.com/zh/tools/favicon-generator`,
        ja: `https://www.toolkitlife.com/ja/tools/favicon-generator`,
        ko: `https://www.toolkitlife.com/ko/tools/favicon-generator`,
        ru: `https://www.toolkitlife.com/ru/tools/favicon-generator`,
        "x-default": `https://www.toolkitlife.com/en/tools/favicon-generator`,
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
    <ToolMessages slug="favicon-generator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
