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
  const t = await getTranslations({ locale, namespace: "tools.image-to-base64.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/image-to-base64`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/image-to-base64`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/image-to-base64`,
        zh: `https://www.toolkitlife.com/zh/tools/image-to-base64`,
        ja: `https://www.toolkitlife.com/ja/tools/image-to-base64`,
        ko: `https://www.toolkitlife.com/ko/tools/image-to-base64`,
        ru: `https://www.toolkitlife.com/ru/tools/image-to-base64`,
        "x-default": `https://www.toolkitlife.com/en/tools/image-to-base64`,
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
    <ToolMessages slug="image-to-base64" locale={locale}>
      {children}
    </ToolMessages>
  );
}
