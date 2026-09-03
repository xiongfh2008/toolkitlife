import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.pi-digits.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/pi-digits`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/pi-digits`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/pi-digits`,
        zh: `https://www.toolkitlife.com/zh/tools/pi-digits`,
        ja: `https://www.toolkitlife.com/ja/tools/pi-digits`,
        ko: `https://www.toolkitlife.com/ko/tools/pi-digits`,
        ru: `https://www.toolkitlife.com/ru/tools/pi-digits`,
        "x-default": `https://www.toolkitlife.com/en/tools/pi-digits`,
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
  return (
    <ToolMessages slug="pi-digits" locale={locale}>
      {children}
    </ToolMessages>
  );
}
