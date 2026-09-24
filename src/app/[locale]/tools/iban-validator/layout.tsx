import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";

export function generateStaticParams() {
  return [{ slug: "iban-validator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.iban-validator" });
  return {
    title: t("metadata.title"),
    openGraph: {
      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/iban-validator`,
      siteName: "ToolkitLife",
      images: [
        { url: ogImageUrl({ title: t("metadata.title"), type: "tool" }), width: 1200, height: 630, alt: t("metadata.title") },
      ],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("metadata.title"), type: "tool" })] },
    description: t("metadata.description"),
    keywords: t.raw("keywords") as string[],
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/iban-validator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/iban-validator`,
        zh: `https://www.toolkitlife.com/zh/tools/iban-validator`,
        ja: `https://www.toolkitlife.com/ja/tools/iban-validator`,
        ko: `https://www.toolkitlife.com/ko/tools/iban-validator`,
        ru: `https://www.toolkitlife.com/ru/tools/iban-validator`,
        "x-default": `https://www.toolkitlife.com/en/tools/iban-validator`,
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
    <ToolMessages slug="iban-validator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
