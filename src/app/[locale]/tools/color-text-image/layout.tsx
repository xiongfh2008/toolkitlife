import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "color-text-image" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.color-text-image.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/color-text-image`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/color-text-image`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/color-text-image`,
        zh: `https://www.toolkitlife.com/zh/tools/color-text-image`,
        ja: `https://www.toolkitlife.com/ja/tools/color-text-image`,
        ko: `https://www.toolkitlife.com/ko/tools/color-text-image`,
        ru: `https://www.toolkitlife.com/ru/tools/color-text-image`,
        "x-default": `https://www.toolkitlife.com/en/tools/color-text-image`,
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
    <ToolMessages slug="color-text-image" locale={locale}>
      {children}
    </ToolMessages>
  );
}
