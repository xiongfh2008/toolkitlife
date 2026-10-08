import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-date-watermark" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-date-watermark.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/image-date-watermark`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/image-date-watermark`,
      languages: {
        en: `https://toolkitlife.com/en/tools/image-date-watermark`,
        es: `https://toolkitlife.com/es/tools/image-date-watermark`,
        zh: `https://toolkitlife.com/zh/tools/image-date-watermark`,
        ja: `https://toolkitlife.com/ja/tools/image-date-watermark`,
        ko: `https://toolkitlife.com/ko/tools/image-date-watermark`,
        ru: `https://toolkitlife.com/ru/tools/image-date-watermark`,
        "x-default": `https://toolkitlife.com/en/tools/image-date-watermark`,
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
    <ToolMessages slug="image-date-watermark" locale={locale}>
      {children}
    </ToolMessages>
  );
}
