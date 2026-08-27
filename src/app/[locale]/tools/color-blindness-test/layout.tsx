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
  const t = await getTranslations({ locale, namespace: "tools.color-blindness-test.metadata" });
  return {
    title: t("title"),
    openGraph: {
      url: `https://www.toolkitlife.com/${locale}/tools/color-blindness-test`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/color-blindness-test`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/color-blindness-test`,
        zh: `https://www.toolkitlife.com/zh/tools/color-blindness-test`,
        ja: `https://www.toolkitlife.com/ja/tools/color-blindness-test`,
        ko: `https://www.toolkitlife.com/ko/tools/color-blindness-test`,
        ru: `https://www.toolkitlife.com/ru/tools/color-blindness-test`,
        "x-default": `https://www.toolkitlife.com/en/tools/color-blindness-test`,
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
    <ToolMessages slug="color-blindness-test" locale={locale}>
      {children}
    </ToolMessages>
  );
}
