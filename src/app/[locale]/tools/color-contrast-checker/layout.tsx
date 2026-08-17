import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.color-contrast-checker.metadata" });
  return {
    title: t("title"),
    openGraph: { images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }] },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/color-contrast-checker`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/color-contrast-checker`,
        zh: `https://www.toolkitlife.com/zh/tools/color-contrast-checker`,
        ja: `https://www.toolkitlife.com/ja/tools/color-contrast-checker`,
        ko: `https://www.toolkitlife.com/ko/tools/color-contrast-checker`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
