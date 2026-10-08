import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "px-to-rem" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.px-to-rem.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/px-to-rem`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/px-to-rem`,
      languages: {
        en: `https://toolkitlife.com/en/tools/px-to-rem`,
        es: `https://toolkitlife.com/es/tools/px-to-rem`,
        zh: `https://toolkitlife.com/zh/tools/px-to-rem`,
        ja: `https://toolkitlife.com/ja/tools/px-to-rem`,
        ko: `https://toolkitlife.com/ko/tools/px-to-rem`,
        ru: `https://toolkitlife.com/ru/tools/px-to-rem`,
        "x-default": `https://toolkitlife.com/en/tools/px-to-rem`,
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
    <ToolMessages slug="px-to-rem" locale={locale}>
      {children}
    </ToolMessages>
  );
}
