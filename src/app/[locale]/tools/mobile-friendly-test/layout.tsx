import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "mobile-friendly-test" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.mobile-friendly-test.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/mobile-friendly-test`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/mobile-friendly-test`,
      languages: {
        en: `https://toolkitlife.com/en/tools/mobile-friendly-test`,
        es: `https://toolkitlife.com/es/tools/mobile-friendly-test`,
        zh: `https://toolkitlife.com/zh/tools/mobile-friendly-test`,
        ja: `https://toolkitlife.com/ja/tools/mobile-friendly-test`,
        ko: `https://toolkitlife.com/ko/tools/mobile-friendly-test`,
        ru: `https://toolkitlife.com/ru/tools/mobile-friendly-test`,
        "x-default": `https://toolkitlife.com/en/tools/mobile-friendly-test`,
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
    <ToolMessages slug="mobile-friendly-test" locale={locale}>
      {children}
    </ToolMessages>
  );
}
