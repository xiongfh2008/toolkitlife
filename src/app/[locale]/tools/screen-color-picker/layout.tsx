import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "tools.screen-color-picker.metadata",
  });
  return {
    title: t("title"),
    openGraph: {
      images: [
        {
          url: ogImageUrl({ title: t("title"), type: "tool" }),
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl({ title: t("title"), type: "tool" })],
    },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/screen-color-picker`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/screen-color-picker`,
        zh: `https://www.toolkitlife.com/zh/tools/screen-color-picker`,
        ja: `https://www.toolkitlife.com/ja/tools/screen-color-picker`,
        ko: `https://www.toolkitlife.com/ko/tools/screen-color-picker`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
