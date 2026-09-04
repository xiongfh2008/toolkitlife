import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "hdr-tone-mapping" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.hdr-tone-mapping.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/hdr-tone-mapping`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/hdr-tone-mapping`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/hdr-tone-mapping`,
        zh: `https://www.toolkitlife.com/zh/tools/hdr-tone-mapping`,
        ja: `https://www.toolkitlife.com/ja/tools/hdr-tone-mapping`,
        ko: `https://www.toolkitlife.com/ko/tools/hdr-tone-mapping`,
        ru: `https://www.toolkitlife.com/ru/tools/hdr-tone-mapping`,
        "x-default": `https://www.toolkitlife.com/en/tools/hdr-tone-mapping`,
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
    <ToolMessages slug="hdr-tone-mapping" locale={locale}>
      {children}
    </ToolMessages>
  );
}
