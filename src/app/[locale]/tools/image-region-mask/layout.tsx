import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-region-mask" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-region-mask.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/image-region-mask`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/image-region-mask`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/image-region-mask`,
        zh: `https://www.toolkitlife.com/zh/tools/image-region-mask`,
        ja: `https://www.toolkitlife.com/ja/tools/image-region-mask`,
        ko: `https://www.toolkitlife.com/ko/tools/image-region-mask`,
        ru: `https://www.toolkitlife.com/ru/tools/image-region-mask`,
        "x-default": `https://www.toolkitlife.com/en/tools/image-region-mask`,
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
    <ToolMessages slug="image-region-mask" locale={locale}>
      {children}
    </ToolMessages>
  );
}
