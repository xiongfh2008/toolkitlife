import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.claude-code-text-formatter.metadata" });
  return {
    title: t("title"),
    openGraph: { images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }] },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/claude-code-text-formatter`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/claude-code-text-formatter`,
        zh: `https://www.toolkitlife.com/zh/tools/claude-code-text-formatter`,
        ja: `https://www.toolkitlife.com/ja/tools/claude-code-text-formatter`,
        ko: `https://www.toolkitlife.com/ko/tools/claude-code-text-formatter`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
