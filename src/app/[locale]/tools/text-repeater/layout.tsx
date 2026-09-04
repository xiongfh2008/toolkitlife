import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "text-repeater" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.text-repeater.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/text-repeater`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/text-repeater`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/text-repeater`,
        zh: `https://www.toolkitlife.com/zh/tools/text-repeater`,
        ja: `https://www.toolkitlife.com/ja/tools/text-repeater`,
        ko: `https://www.toolkitlife.com/ko/tools/text-repeater`,
        ru: `https://www.toolkitlife.com/ru/tools/text-repeater`,
        "x-default": `https://www.toolkitlife.com/en/tools/text-repeater`,
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
    <ToolMessages slug="text-repeater" locale={locale}>
      {children}
    </ToolMessages>
  );
}
