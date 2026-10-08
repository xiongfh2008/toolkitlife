import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "text-to-image" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.text-to-image.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/text-to-image`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/text-to-image`,
      languages: {
        en: `https://toolkitlife.com/en/tools/text-to-image`,
        es: `https://toolkitlife.com/es/tools/text-to-image`,
        zh: `https://toolkitlife.com/zh/tools/text-to-image`,
        ja: `https://toolkitlife.com/ja/tools/text-to-image`,
        ko: `https://toolkitlife.com/ko/tools/text-to-image`,
        ru: `https://toolkitlife.com/ru/tools/text-to-image`,
        "x-default": `https://toolkitlife.com/en/tools/text-to-image`,
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
    <ToolMessages slug="text-to-image" locale={locale}>
      {children}
    </ToolMessages>
  );
}
