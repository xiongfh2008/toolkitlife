import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "domain-age" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.domain-age.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/domain-age`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/domain-age`,
      languages: {
        en: `https://toolkitlife.com/en/tools/domain-age`,
        es: `https://toolkitlife.com/es/tools/domain-age`,
        zh: `https://toolkitlife.com/zh/tools/domain-age`,
        ja: `https://toolkitlife.com/ja/tools/domain-age`,
        ko: `https://toolkitlife.com/ko/tools/domain-age`,
        ru: `https://toolkitlife.com/ru/tools/domain-age`,
        "x-default": `https://toolkitlife.com/en/tools/domain-age`,
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
    <ToolMessages slug="domain-age" locale={locale}>
      {children}
    </ToolMessages>
  );
}
