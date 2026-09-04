import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "text-reader" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.text-reader.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/text-reader`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/text-reader`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/text-reader`,
        zh: `https://www.toolkitlife.com/zh/tools/text-reader`,
        ja: `https://www.toolkitlife.com/ja/tools/text-reader`,
        ko: `https://www.toolkitlife.com/ko/tools/text-reader`,
        ru: `https://www.toolkitlife.com/ru/tools/text-reader`,
        "x-default": `https://www.toolkitlife.com/en/tools/text-reader`,
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
    <ToolMessages slug="text-reader" locale={locale}>
      {children}
    </ToolMessages>
  );
}
