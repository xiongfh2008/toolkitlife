import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "dice-roller" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.dice-roller.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/dice-roller`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/dice-roller`,
      languages: {
        en: `https://toolkitlife.com/en/tools/dice-roller`,
        es: `https://toolkitlife.com/es/tools/dice-roller`,
        zh: `https://toolkitlife.com/zh/tools/dice-roller`,
        ja: `https://toolkitlife.com/ja/tools/dice-roller`,
        ko: `https://toolkitlife.com/ko/tools/dice-roller`,
        ru: `https://toolkitlife.com/ru/tools/dice-roller`,
        "x-default": `https://toolkitlife.com/en/tools/dice-roller`,
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
    <ToolMessages slug="dice-roller" locale={locale}>
      {children}
    </ToolMessages>
  );
}
