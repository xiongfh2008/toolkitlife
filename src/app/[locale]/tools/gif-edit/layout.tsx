import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "gif-edit" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.gif-edit.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/gif-edit`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/gif-edit`,
      languages: {
        en: `https://toolkitlife.com/en/tools/gif-edit`,
        es: `https://toolkitlife.com/es/tools/gif-edit`,
        zh: `https://toolkitlife.com/zh/tools/gif-edit`,
        ja: `https://toolkitlife.com/ja/tools/gif-edit`,
        ko: `https://toolkitlife.com/ko/tools/gif-edit`,
        ru: `https://toolkitlife.com/ru/tools/gif-edit`,
        "x-default": `https://toolkitlife.com/en/tools/gif-edit`,
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
    <ToolMessages slug="gif-edit" locale={locale}>
      {children}
    </ToolMessages>
  );
}
