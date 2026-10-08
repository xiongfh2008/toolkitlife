import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "diff-checker" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.diff-checker.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/diff-checker`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/diff-checker`,
      languages: {
        en: `https://toolkitlife.com/en/tools/diff-checker`,
        es: `https://toolkitlife.com/es/tools/diff-checker`,
        zh: `https://toolkitlife.com/zh/tools/diff-checker`,
        ja: `https://toolkitlife.com/ja/tools/diff-checker`,
        ko: `https://toolkitlife.com/ko/tools/diff-checker`,
        ru: `https://toolkitlife.com/ru/tools/diff-checker`,
        "x-default": `https://toolkitlife.com/en/tools/diff-checker`,
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
    <ToolMessages slug="diff-checker" locale={locale}>
      {children}
    </ToolMessages>
  );
}
