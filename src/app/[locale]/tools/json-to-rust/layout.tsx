import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";

export function generateStaticParams() {
  return [{ slug: "json-to-rust" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.json-to-rust.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/json-to-rust`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/json-to-rust`,
      languages: {
        en: `https://toolkitlife.com/en/tools/json-to-rust`,
        es: `https://toolkitlife.com/es/tools/json-to-rust`,
        zh: `https://toolkitlife.com/zh/tools/json-to-rust`,
        ja: `https://toolkitlife.com/ja/tools/json-to-rust`,
        ko: `https://toolkitlife.com/ko/tools/json-to-rust`,
        ru: `https://toolkitlife.com/ru/tools/json-to-rust`,
        "x-default": `https://toolkitlife.com/en/tools/json-to-rust`,
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
    <ToolMessages slug="json-to-rust" locale={locale}>
      {children}
    </ToolMessages>
  );
}
