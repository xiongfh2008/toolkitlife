import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "ip-lookup" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.ip-lookup.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/ip-lookup`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/ip-lookup`,
      languages: {
        en: `https://toolkitlife.com/en/tools/ip-lookup`,
        es: `https://toolkitlife.com/es/tools/ip-lookup`,
        zh: `https://toolkitlife.com/zh/tools/ip-lookup`,
        ja: `https://toolkitlife.com/ja/tools/ip-lookup`,
        ko: `https://toolkitlife.com/ko/tools/ip-lookup`,
        ru: `https://toolkitlife.com/ru/tools/ip-lookup`,
        "x-default": `https://toolkitlife.com/en/tools/ip-lookup`,
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
    <ToolMessages slug="ip-lookup" locale={locale}>
      {children}
    </ToolMessages>
  );
}
