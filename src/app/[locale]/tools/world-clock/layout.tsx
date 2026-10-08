import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "world-clock" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.world-clock.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/world-clock`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/world-clock`,
      languages: {
        en: `https://toolkitlife.com/en/tools/world-clock`,
        es: `https://toolkitlife.com/es/tools/world-clock`,
        zh: `https://toolkitlife.com/zh/tools/world-clock`,
        ja: `https://toolkitlife.com/ja/tools/world-clock`,
        ko: `https://toolkitlife.com/ko/tools/world-clock`,
        ru: `https://toolkitlife.com/ru/tools/world-clock`,
        "x-default": `https://toolkitlife.com/en/tools/world-clock`,
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
    <ToolMessages slug="world-clock" locale={locale}>
      {children}
    </ToolMessages>
  );
}
