import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.video-frame-extractor.metadata" });
  return {
    title: t("title"),
    openGraph: { images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }] },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/video-frame-extractor`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/video-frame-extractor`,
        zh: `https://www.toolkitlife.com/zh/tools/video-frame-extractor`,
        ja: `https://www.toolkitlife.com/ja/tools/video-frame-extractor`,
        ko: `https://www.toolkitlife.com/ko/tools/video-frame-extractor`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
