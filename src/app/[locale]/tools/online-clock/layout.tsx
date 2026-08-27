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
  const t = await getTranslations({ locale, namespace: "tools.online-clock.metadata" });
  return {
    title: t("title"),
    openGraph: {
      url: `https://www.toolkitlife.com/${locale}/tools/online-clock`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/online-clock`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/online-clock`,
        zh: `https://www.toolkitlife.com/zh/tools/online-clock`,
        ja: `https://www.toolkitlife.com/ja/tools/online-clock`,
        ko: `https://www.toolkitlife.com/ko/tools/online-clock`,
        ru: `https://www.toolkitlife.com/ru/tools/online-clock`,
        "x-default": `https://www.toolkitlife.com/en/tools/online-clock`,
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
    <ToolMessages slug="online-clock" locale={locale}>
      {children}
    </ToolMessages>
  );
}
