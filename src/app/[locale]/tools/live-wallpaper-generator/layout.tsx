import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "live-wallpaper-generator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.live-wallpaper-generator.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/live-wallpaper-generator`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/live-wallpaper-generator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/live-wallpaper-generator`,
        es: `https://www.toolkitlife.com/es/tools/live-wallpaper-generator`,
        zh: `https://www.toolkitlife.com/zh/tools/live-wallpaper-generator`,
        ja: `https://www.toolkitlife.com/ja/tools/live-wallpaper-generator`,
        ko: `https://www.toolkitlife.com/ko/tools/live-wallpaper-generator`,
        ru: `https://www.toolkitlife.com/ru/tools/live-wallpaper-generator`,
        "x-default": `https://www.toolkitlife.com/en/tools/live-wallpaper-generator`,
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
    <ToolMessages slug="live-wallpaper-generator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
