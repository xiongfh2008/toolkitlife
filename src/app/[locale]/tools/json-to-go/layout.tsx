import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";

export function generateStaticParams() {
  return [{ slug: "json-to-go" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.json-to-go.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/json-to-go`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/json-to-go`,
      languages: {
        en: `https://toolkitlife.com/en/tools/json-to-go`,
        es: `https://toolkitlife.com/es/tools/json-to-go`,
        zh: `https://toolkitlife.com/zh/tools/json-to-go`,
        ja: `https://toolkitlife.com/ja/tools/json-to-go`,
        ko: `https://toolkitlife.com/ko/tools/json-to-go`,
        ru: `https://toolkitlife.com/ru/tools/json-to-go`,
        "x-default": `https://toolkitlife.com/en/tools/json-to-go`,
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
    <ToolMessages slug="json-to-go" locale={locale}>
      {children}
    </ToolMessages>
  );
}
