import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "split-pdf" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.split-pdf.metadata" });

  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/split-pdf`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/split-pdf`,
      languages: {
        en: `https://toolkitlife.com/en/tools/split-pdf`,
        es: `https://toolkitlife.com/es/tools/split-pdf`,
        zh: `https://toolkitlife.com/zh/tools/split-pdf`,
        ja: `https://toolkitlife.com/ja/tools/split-pdf`,
        ko: `https://toolkitlife.com/ko/tools/split-pdf`,
        ru: `https://toolkitlife.com/ru/tools/split-pdf`,
        "x-default": `https://toolkitlife.com/en/tools/split-pdf`,
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
    <ToolMessages slug="split-pdf" locale={locale}>
      {children}
    </ToolMessages>
  );
}
