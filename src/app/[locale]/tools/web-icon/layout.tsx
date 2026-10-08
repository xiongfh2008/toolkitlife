import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "web-icon" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.web-icon.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/web-icon`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/web-icon`,
      languages: {
        en: `https://toolkitlife.com/en/tools/web-icon`,
        es: `https://toolkitlife.com/es/tools/web-icon`,
        zh: `https://toolkitlife.com/zh/tools/web-icon`,
        ja: `https://toolkitlife.com/ja/tools/web-icon`,
        ko: `https://toolkitlife.com/ko/tools/web-icon`,
        ru: `https://toolkitlife.com/ru/tools/web-icon`,
        "x-default": `https://toolkitlife.com/en/tools/web-icon`,
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
    <ToolMessages slug="web-icon" locale={locale}>
      {children}
    </ToolMessages>
  );
}
