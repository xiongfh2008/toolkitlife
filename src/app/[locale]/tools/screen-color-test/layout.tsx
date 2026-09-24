import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";

export function generateStaticParams() {
  return [{ slug: "screen-color-test" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.screen-color-test.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/screen-color-test`,
      siteName: "ToolkitLife",
      images: [
        { url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") },
      ],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/screen-color-test`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/screen-color-test`,
        es: `https://www.toolkitlife.com/es/tools/screen-color-test`,
        de: `https://www.toolkitlife.com/de/tools/screen-color-test`,
        fr: `https://www.toolkitlife.com/fr/tools/screen-color-test`,
        pt: `https://www.toolkitlife.com/pt/tools/screen-color-test`,
        zh: `https://www.toolkitlife.com/zh/tools/screen-color-test`,
        ja: `https://www.toolkitlife.com/ja/tools/screen-color-test`,
        ko: `https://www.toolkitlife.com/ko/tools/screen-color-test`,
        ru: `https://www.toolkitlife.com/ru/tools/screen-color-test`,
        "x-default": `https://www.toolkitlife.com/en/tools/screen-color-test`,
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
    <ToolMessages slug="screen-color-test" locale={locale}>
      {children}
    </ToolMessages>
  );
}
