import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";

export function generateStaticParams() {
  return [{ slug: "swift-bic-checker" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.swift-bic-checker" });
  return {
    title: t("metadata.title"),
    openGraph: {
      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/swift-bic-checker`,
      siteName: "ToolkitLife",
      images: [
        { url: ogImageUrl({ title: t("metadata.title"), type: "tool" }), width: 1200, height: 630, alt: t("metadata.title") },
      ],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("metadata.title"), type: "tool" })] },
    description: t("metadata.description"),
    keywords: t.raw("keywords") as string[],
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/swift-bic-checker`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/swift-bic-checker`,
        zh: `https://www.toolkitlife.com/zh/tools/swift-bic-checker`,
        ja: `https://www.toolkitlife.com/ja/tools/swift-bic-checker`,
        ko: `https://www.toolkitlife.com/ko/tools/swift-bic-checker`,
        ru: `https://www.toolkitlife.com/ru/tools/swift-bic-checker`,
        "x-default": `https://www.toolkitlife.com/en/tools/swift-bic-checker`,
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
    <ToolMessages slug="swift-bic-checker" locale={locale}>
      {children}
    </ToolMessages>
  );
}
