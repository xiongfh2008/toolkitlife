import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "save-vs-rap-calculator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.save-vs-rap-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/save-vs-rap-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/save-vs-rap-calculator`,
      languages: {
        en: `https://toolkitlife.com/en/tools/save-vs-rap-calculator`,
        es: `https://toolkitlife.com/es/tools/save-vs-rap-calculator`,
        zh: `https://toolkitlife.com/zh/tools/save-vs-rap-calculator`,
        ja: `https://toolkitlife.com/ja/tools/save-vs-rap-calculator`,
        ko: `https://toolkitlife.com/ko/tools/save-vs-rap-calculator`,
        ru: `https://toolkitlife.com/ru/tools/save-vs-rap-calculator`,
        "x-default": `https://toolkitlife.com/en/tools/save-vs-rap-calculator`,
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
    <ToolMessages slug="save-vs-rap-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
