import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "merge-pdf" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.merge-pdf.metadata" });

  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/merge-pdf`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/merge-pdf`,
      languages: {
        en: `https://toolkitlife.com/en/tools/merge-pdf`,
        es: `https://toolkitlife.com/es/tools/merge-pdf`,
        zh: `https://toolkitlife.com/zh/tools/merge-pdf`,
        ja: `https://toolkitlife.com/ja/tools/merge-pdf`,
        ko: `https://toolkitlife.com/ko/tools/merge-pdf`,
        ru: `https://toolkitlife.com/ru/tools/merge-pdf`,
        "x-default": `https://toolkitlife.com/en/tools/merge-pdf`,
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
    <ToolMessages slug="merge-pdf" locale={locale}>
      {children}
    </ToolMessages>
  );
}
