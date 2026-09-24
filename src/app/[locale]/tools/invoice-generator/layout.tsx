import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "invoice-generator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.invoice-generator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/invoice-generator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/invoice-generator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/invoice-generator`,
        es: `https://www.toolkitlife.com/es/tools/invoice-generator`,
        de: `https://www.toolkitlife.com/de/tools/invoice-generator`,
        fr: `https://www.toolkitlife.com/fr/tools/invoice-generator`,
        pt: `https://www.toolkitlife.com/pt/tools/invoice-generator`,
        zh: `https://www.toolkitlife.com/zh/tools/invoice-generator`,
        ja: `https://www.toolkitlife.com/ja/tools/invoice-generator`,
        ko: `https://www.toolkitlife.com/ko/tools/invoice-generator`,
        ru: `https://www.toolkitlife.com/ru/tools/invoice-generator`,
        "x-default": `https://www.toolkitlife.com/en/tools/invoice-generator`,
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
    <ToolMessages slug="invoice-generator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
