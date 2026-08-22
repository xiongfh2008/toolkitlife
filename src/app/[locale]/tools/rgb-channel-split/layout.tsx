import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.rgb-channel-split.metadata" });
  return {
    title: t("title"),
    openGraph: { images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }] },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/rgb-channel-split`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/rgb-channel-split`,
        zh: `https://www.toolkitlife.com/zh/tools/rgb-channel-split`,
        ja: `https://www.toolkitlife.com/ja/tools/rgb-channel-split`,
        ko: `https://www.toolkitlife.com/ko/tools/rgb-channel-split`,
        ru: `https://www.toolkitlife.com/ru/tools/rgb-channel-split`,
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
  return (
    <ToolMessages slug="rgb-channel-split" locale={locale}>
      {children}
    </ToolMessages>
  );
}
