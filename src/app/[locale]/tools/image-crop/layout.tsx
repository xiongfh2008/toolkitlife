import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-crop" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-crop.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/image-crop`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/image-crop`,
      languages: {
        en: `https://toolkitlife.com/en/tools/image-crop`,
        es: `https://toolkitlife.com/es/tools/image-crop`,
        zh: `https://toolkitlife.com/zh/tools/image-crop`,
        ja: `https://toolkitlife.com/ja/tools/image-crop`,
        ko: `https://toolkitlife.com/ko/tools/image-crop`,
        ru: `https://toolkitlife.com/ru/tools/image-crop`,
        "x-default": `https://toolkitlife.com/en/tools/image-crop`,
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
    <ToolMessages slug="image-crop" locale={locale}>
      {children}
    </ToolMessages>
  );
}
