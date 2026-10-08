import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "web-shortcut" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.web-shortcut.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/web-shortcut`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/web-shortcut`,
      languages: {
        en: `https://toolkitlife.com/en/tools/web-shortcut`,
        es: `https://toolkitlife.com/es/tools/web-shortcut`,
        zh: `https://toolkitlife.com/zh/tools/web-shortcut`,
        ja: `https://toolkitlife.com/ja/tools/web-shortcut`,
        ko: `https://toolkitlife.com/ko/tools/web-shortcut`,
        ru: `https://toolkitlife.com/ru/tools/web-shortcut`,
        "x-default": `https://toolkitlife.com/en/tools/web-shortcut`,
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
    <ToolMessages slug="web-shortcut" locale={locale}>
      {children}
    </ToolMessages>
  );
}
