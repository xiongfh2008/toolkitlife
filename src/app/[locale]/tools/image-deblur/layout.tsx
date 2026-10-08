import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-deblur" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-deblur.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/image-deblur`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/image-deblur`,
      languages: {
        en: `https://toolkitlife.com/en/tools/image-deblur`,
        es: `https://toolkitlife.com/es/tools/image-deblur`,
        zh: `https://toolkitlife.com/zh/tools/image-deblur`,
        ja: `https://toolkitlife.com/ja/tools/image-deblur`,
        ko: `https://toolkitlife.com/ko/tools/image-deblur`,
        ru: `https://toolkitlife.com/ru/tools/image-deblur`,
        "x-default": `https://toolkitlife.com/en/tools/image-deblur`,
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
    <ToolMessages slug="image-deblur" locale={locale}>
      {children}
    </ToolMessages>
  );
}
