import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-background" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-background.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/image-background`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/image-background`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/image-background`,
        zh: `https://www.toolkitlife.com/zh/tools/image-background`,
        ja: `https://www.toolkitlife.com/ja/tools/image-background`,
        ko: `https://www.toolkitlife.com/ko/tools/image-background`,
        ru: `https://www.toolkitlife.com/ru/tools/image-background`,
        "x-default": `https://www.toolkitlife.com/en/tools/image-background`,
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
    <ToolMessages slug="image-background" locale={locale}>
      {children}
    </ToolMessages>
  );
}
