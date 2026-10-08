import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "hz" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.hz.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/hz`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/hz`,
      languages: {
        en: `https://toolkitlife.com/en/tools/hz`,
        es: `https://toolkitlife.com/es/tools/hz`,
        zh: `https://toolkitlife.com/zh/tools/hz`,
        ja: `https://toolkitlife.com/ja/tools/hz`,
        ko: `https://toolkitlife.com/ko/tools/hz`,
        ru: `https://toolkitlife.com/ru/tools/hz`,
        "x-default": `https://toolkitlife.com/en/tools/hz`,
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
    <ToolMessages slug="hz" locale={locale}>
      {children}
    </ToolMessages>
  );
}
