import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "qr-code-reader" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.qr-code-reader.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/qr-code-reader`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/qr-code-reader`,
      languages: {
        en: `https://toolkitlife.com/en/tools/qr-code-reader`,
        es: `https://toolkitlife.com/es/tools/qr-code-reader`,
        zh: `https://toolkitlife.com/zh/tools/qr-code-reader`,
        ja: `https://toolkitlife.com/ja/tools/qr-code-reader`,
        ko: `https://toolkitlife.com/ko/tools/qr-code-reader`,
        ru: `https://toolkitlife.com/ru/tools/qr-code-reader`,
        "x-default": `https://toolkitlife.com/en/tools/qr-code-reader`,
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
    <ToolMessages slug="qr-code-reader" locale={locale}>
      {children}
    </ToolMessages>
  );
}
