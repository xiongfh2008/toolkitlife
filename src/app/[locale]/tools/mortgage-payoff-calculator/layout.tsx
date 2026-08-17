import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.mortgage-payoff-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: { images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }] },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/mortgage-payoff-calculator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/mortgage-payoff-calculator`,
        zh: `https://www.toolkitlife.com/zh/tools/mortgage-payoff-calculator`,
        ja: `https://www.toolkitlife.com/ja/tools/mortgage-payoff-calculator`,
        ko: `https://www.toolkitlife.com/ko/tools/mortgage-payoff-calculator`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
