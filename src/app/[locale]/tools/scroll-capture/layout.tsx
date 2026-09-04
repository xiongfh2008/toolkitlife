import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "scroll-capture" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.scroll-capture.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/scroll-capture`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/scroll-capture`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/scroll-capture`,
        zh: `https://www.toolkitlife.com/zh/tools/scroll-capture`,
        ja: `https://www.toolkitlife.com/ja/tools/scroll-capture`,
        ko: `https://www.toolkitlife.com/ko/tools/scroll-capture`,
        ru: `https://www.toolkitlife.com/ru/tools/scroll-capture`,
        "x-default": `https://www.toolkitlife.com/en/tools/scroll-capture`,
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
    <ToolMessages slug="scroll-capture" locale={locale}>
      {children}
    </ToolMessages>
  );
}
