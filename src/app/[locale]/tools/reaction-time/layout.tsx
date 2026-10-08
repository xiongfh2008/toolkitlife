import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "reaction-time" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.reaction-time.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/reaction-time`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/reaction-time`,
      languages: {
        en: `https://toolkitlife.com/en/tools/reaction-time`,
        es: `https://toolkitlife.com/es/tools/reaction-time`,
        zh: `https://toolkitlife.com/zh/tools/reaction-time`,
        ja: `https://toolkitlife.com/ja/tools/reaction-time`,
        ko: `https://toolkitlife.com/ko/tools/reaction-time`,
        ru: `https://toolkitlife.com/ru/tools/reaction-time`,
        "x-default": `https://toolkitlife.com/en/tools/reaction-time`,
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
    <ToolMessages slug="reaction-time" locale={locale}>
      {children}
    </ToolMessages>
  );
}
