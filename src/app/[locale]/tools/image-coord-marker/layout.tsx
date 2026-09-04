import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-coord-marker" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-coord-marker.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/image-coord-marker`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/image-coord-marker`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/image-coord-marker`,
        zh: `https://www.toolkitlife.com/zh/tools/image-coord-marker`,
        ja: `https://www.toolkitlife.com/ja/tools/image-coord-marker`,
        ko: `https://www.toolkitlife.com/ko/tools/image-coord-marker`,
        ru: `https://www.toolkitlife.com/ru/tools/image-coord-marker`,
        "x-default": `https://www.toolkitlife.com/en/tools/image-coord-marker`,
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
    <ToolMessages slug="image-coord-marker" locale={locale}>
      {children}
    </ToolMessages>
  );
}
