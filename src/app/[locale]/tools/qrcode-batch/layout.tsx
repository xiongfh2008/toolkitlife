import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "qrcode-batch" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.qrcode-batch.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/qrcode-batch`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/qrcode-batch`,
      languages: {
        en: `https://toolkitlife.com/en/tools/qrcode-batch`,
        es: `https://toolkitlife.com/es/tools/qrcode-batch`,
        zh: `https://toolkitlife.com/zh/tools/qrcode-batch`,
        ja: `https://toolkitlife.com/ja/tools/qrcode-batch`,
        ko: `https://toolkitlife.com/ko/tools/qrcode-batch`,
        ru: `https://toolkitlife.com/ru/tools/qrcode-batch`,
        "x-default": `https://toolkitlife.com/en/tools/qrcode-batch`,
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
    <ToolMessages slug="qrcode-batch" locale={locale}>
      {children}
    </ToolMessages>
  );
}
