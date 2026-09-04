import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "compress-pdf" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.compress-pdf.metadata" });

  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/compress-pdf`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/compress-pdf`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/compress-pdf`,
        zh: `https://www.toolkitlife.com/zh/tools/compress-pdf`,
        ja: `https://www.toolkitlife.com/ja/tools/compress-pdf`,
        ko: `https://www.toolkitlife.com/ko/tools/compress-pdf`,
        ru: `https://www.toolkitlife.com/ru/tools/compress-pdf`,
        "x-default": `https://www.toolkitlife.com/en/tools/compress-pdf`,
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
    <ToolMessages slug="compress-pdf" locale={locale}>
      {children}
    </ToolMessages>
  );
}
