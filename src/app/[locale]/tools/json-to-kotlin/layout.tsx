import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";

export function generateStaticParams() {
  return [{ slug: "json-to-kotlin" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.json-to-kotlin.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/json-to-kotlin`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/json-to-kotlin`,
      languages: {
        en: `https://toolkitlife.com/en/tools/json-to-kotlin`,
        es: `https://toolkitlife.com/es/tools/json-to-kotlin`,
        zh: `https://toolkitlife.com/zh/tools/json-to-kotlin`,
        ja: `https://toolkitlife.com/ja/tools/json-to-kotlin`,
        ko: `https://toolkitlife.com/ko/tools/json-to-kotlin`,
        ru: `https://toolkitlife.com/ru/tools/json-to-kotlin`,
        "x-default": `https://toolkitlife.com/en/tools/json-to-kotlin`,
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
    <ToolMessages slug="json-to-kotlin" locale={locale}>
      {children}
    </ToolMessages>
  );
}
