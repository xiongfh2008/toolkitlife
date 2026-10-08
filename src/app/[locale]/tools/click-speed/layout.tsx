import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "click-speed" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.click-speed.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/click-speed`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/click-speed`,
      languages: {
        en: `https://toolkitlife.com/en/tools/click-speed`,
        es: `https://toolkitlife.com/es/tools/click-speed`,
        zh: `https://toolkitlife.com/zh/tools/click-speed`,
        ja: `https://toolkitlife.com/ja/tools/click-speed`,
        ko: `https://toolkitlife.com/ko/tools/click-speed`,
        ru: `https://toolkitlife.com/ru/tools/click-speed`,
        "x-default": `https://toolkitlife.com/en/tools/click-speed`,
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
    <ToolMessages slug="click-speed" locale={locale}>
      {children}
    </ToolMessages>
  );
}
