import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "heic" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.heic.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/heic`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/heic`,
      languages: {
        en: `https://toolkitlife.com/en/tools/heic`,
        es: `https://toolkitlife.com/es/tools/heic`,
        zh: `https://toolkitlife.com/zh/tools/heic`,
        ja: `https://toolkitlife.com/ja/tools/heic`,
        ko: `https://toolkitlife.com/ko/tools/heic`,
        ru: `https://toolkitlife.com/ru/tools/heic`,
        "x-default": `https://toolkitlife.com/en/tools/heic`,
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
    <ToolMessages slug="heic" locale={locale}>
      {children}
    </ToolMessages>
  );
}
