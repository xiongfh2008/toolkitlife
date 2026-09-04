import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "unsharp-mask" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.unsharp-mask.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/unsharp-mask`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/unsharp-mask`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/unsharp-mask`,
        zh: `https://www.toolkitlife.com/zh/tools/unsharp-mask`,
        ja: `https://www.toolkitlife.com/ja/tools/unsharp-mask`,
        ko: `https://www.toolkitlife.com/ko/tools/unsharp-mask`,
        ru: `https://www.toolkitlife.com/ru/tools/unsharp-mask`,
        "x-default": `https://www.toolkitlife.com/en/tools/unsharp-mask`,
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
    <ToolMessages slug="unsharp-mask" locale={locale}>
      {children}
    </ToolMessages>
  );
}
