import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "html-viewer" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.html-viewer.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/html-viewer`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/html-viewer`,
      languages: {
        en: `https://toolkitlife.com/en/tools/html-viewer`,
        es: `https://toolkitlife.com/es/tools/html-viewer`,
        zh: `https://toolkitlife.com/zh/tools/html-viewer`,
        ja: `https://toolkitlife.com/ja/tools/html-viewer`,
        ko: `https://toolkitlife.com/ko/tools/html-viewer`,
        ru: `https://toolkitlife.com/ru/tools/html-viewer`,
        "x-default": `https://toolkitlife.com/en/tools/html-viewer`,
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
    <ToolMessages slug="html-viewer" locale={locale}>
      {children}
    </ToolMessages>
  );
}
