import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "medicaid-work-requirement-calculator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.medicaid-work-requirement-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/medicaid-work-requirement-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/medicaid-work-requirement-calculator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/medicaid-work-requirement-calculator`,
        zh: `https://www.toolkitlife.com/zh/tools/medicaid-work-requirement-calculator`,
        ja: `https://www.toolkitlife.com/ja/tools/medicaid-work-requirement-calculator`,
        ko: `https://www.toolkitlife.com/ko/tools/medicaid-work-requirement-calculator`,
        ru: `https://www.toolkitlife.com/ru/tools/medicaid-work-requirement-calculator`,
        "x-default": `https://www.toolkitlife.com/en/tools/medicaid-work-requirement-calculator`,
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
    <ToolMessages slug="medicaid-work-requirement-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
