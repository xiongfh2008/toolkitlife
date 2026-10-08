import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "answer-book" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.answer-book.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/answer-book`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/answer-book`,
      languages: {
        en: `https://toolkitlife.com/en/tools/answer-book`,
        es: `https://toolkitlife.com/es/tools/answer-book`,
        zh: `https://toolkitlife.com/zh/tools/answer-book`,
        ja: `https://toolkitlife.com/ja/tools/answer-book`,
        ko: `https://toolkitlife.com/ko/tools/answer-book`,
        ru: `https://toolkitlife.com/ru/tools/answer-book`,
        "x-default": `https://toolkitlife.com/en/tools/answer-book`,
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
    <ToolMessages slug="answer-book" locale={locale}>
      {children}
    </ToolMessages>
  );
}
