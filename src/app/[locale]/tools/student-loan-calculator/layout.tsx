import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "student-loan-calculator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.student-loan-calculator.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/student-loan-calculator`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/student-loan-calculator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/student-loan-calculator`,
        zh: `https://www.toolkitlife.com/zh/tools/student-loan-calculator`,
        ja: `https://www.toolkitlife.com/ja/tools/student-loan-calculator`,
        ko: `https://www.toolkitlife.com/ko/tools/student-loan-calculator`,
        ru: `https://www.toolkitlife.com/ru/tools/student-loan-calculator`,
        "x-default": `https://www.toolkitlife.com/en/tools/student-loan-calculator`,
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
    <ToolMessages slug="student-loan-calculator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
