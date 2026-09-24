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
      url: `https://www.toolkitlife.com/${locale}/tools/image-deblur`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/image-deblur`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/image-deblur`,
        es: `https://www.toolkitlife.com/es/tools/image-deblur`,
        de: `https://www.toolkitlife.com/de/tools/image-deblur`,
        fr: `https://www.toolkitlife.com/fr/tools/image-deblur`,
        pt: `https://www.toolkitlife.com/pt/tools/image-deblur`,
        zh: `https://www.toolkitlife.com/zh/tools/image-deblur`,
        ja: `https://www.toolkitlife.com/ja/tools/image-deblur`,
        ko: `https://www.toolkitlife.com/ko/tools/image-deblur`,
        ru: `https://www.toolkitlife.com/ru/tools/image-deblur`,
        "x-default": `https://www.toolkitlife.com/en/tools/image-deblur`,
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
