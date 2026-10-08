import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "docx-to-png" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.docx-to-png.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/docx-to-png`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/docx-to-png`,
      languages: {
        en: `https://toolkitlife.com/en/tools/docx-to-png`,
        es: `https://toolkitlife.com/es/tools/docx-to-png`,
        zh: `https://toolkitlife.com/zh/tools/docx-to-png`,
        ja: `https://toolkitlife.com/ja/tools/docx-to-png`,
        ko: `https://toolkitlife.com/ko/tools/docx-to-png`,
        ru: `https://toolkitlife.com/ru/tools/docx-to-png`,
        "x-default": `https://toolkitlife.com/en/tools/docx-to-png`,
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
    <ToolMessages slug="docx-to-png" locale={locale}>
      {children}
    </ToolMessages>
  );
}
