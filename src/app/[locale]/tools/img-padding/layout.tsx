import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "img-padding" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.img-padding.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/img-padding`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/img-padding`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/img-padding`,
        zh: `https://www.toolkitlife.com/zh/tools/img-padding`,
        ja: `https://www.toolkitlife.com/ja/tools/img-padding`,
        ko: `https://www.toolkitlife.com/ko/tools/img-padding`,
        ru: `https://www.toolkitlife.com/ru/tools/img-padding`,
        "x-default": `https://www.toolkitlife.com/en/tools/img-padding`,
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
    <ToolMessages slug="img-padding" locale={locale}>
      {children}
    </ToolMessages>
  );
}
