import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";

export function generateStaticParams() {
  return [{ slug: "aba-routing-number-validator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.aba-routing-number-validator" });
  return {
    title: t("metadata.title"),
    openGraph: {
      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/aba-routing-number-validator`,
      siteName: "ToolkitLife",
      images: [
        { url: ogImageUrl({ title: t("metadata.title"), type: "tool" }), width: 1200, height: 630, alt: t("metadata.title") },
      ],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("metadata.title"), type: "tool" })] },
    description: t("metadata.description"),
    keywords: t.raw("keywords") as string[],
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/aba-routing-number-validator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/aba-routing-number-validator`,
        es: `https://www.toolkitlife.com/es/tools/aba-routing-number-validator`,
        de: `https://www.toolkitlife.com/de/tools/aba-routing-number-validator`,
        fr: `https://www.toolkitlife.com/fr/tools/aba-routing-number-validator`,
        pt: `https://www.toolkitlife.com/pt/tools/aba-routing-number-validator`,
        zh: `https://www.toolkitlife.com/zh/tools/aba-routing-number-validator`,
        ja: `https://www.toolkitlife.com/ja/tools/aba-routing-number-validator`,
        ko: `https://www.toolkitlife.com/ko/tools/aba-routing-number-validator`,
        ru: `https://www.toolkitlife.com/ru/tools/aba-routing-number-validator`,
        "x-default": `https://www.toolkitlife.com/en/tools/aba-routing-number-validator`,
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
    <ToolMessages slug="aba-routing-number-validator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
