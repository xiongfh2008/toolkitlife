import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "aes-encryption" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.aes-encryption.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/aes-encryption`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/aes-encryption`,
      languages: {
        en: `https://toolkitlife.com/en/tools/aes-encryption`,
        es: `https://toolkitlife.com/es/tools/aes-encryption`,
        zh: `https://toolkitlife.com/zh/tools/aes-encryption`,
        ja: `https://toolkitlife.com/ja/tools/aes-encryption`,
        ko: `https://toolkitlife.com/ko/tools/aes-encryption`,
        ru: `https://toolkitlife.com/ru/tools/aes-encryption`,
        "x-default": `https://toolkitlife.com/en/tools/aes-encryption`,
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
    <ToolMessages slug="aes-encryption" locale={locale}>
      {children}
    </ToolMessages>
  );
}
