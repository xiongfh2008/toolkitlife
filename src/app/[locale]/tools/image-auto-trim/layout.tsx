import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-auto-trim" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-auto-trim.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/image-auto-trim`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/image-auto-trim`,
      languages: {
        en: `https://toolkitlife.com/en/tools/image-auto-trim`,
        es: `https://toolkitlife.com/es/tools/image-auto-trim`,
        zh: `https://toolkitlife.com/zh/tools/image-auto-trim`,
        ja: `https://toolkitlife.com/ja/tools/image-auto-trim`,
        ko: `https://toolkitlife.com/ko/tools/image-auto-trim`,
        ru: `https://toolkitlife.com/ru/tools/image-auto-trim`,
        "x-default": `https://toolkitlife.com/en/tools/image-auto-trim`,
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
    <ToolMessages slug="image-auto-trim" locale={locale}>
      {children}
    </ToolMessages>
  );
}
