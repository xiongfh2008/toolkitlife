import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";

const SLUG = "ai-object-eraser";

export function generateStaticParams() {
  return [{ slug: "ai-object-eraser" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: `tools.${SLUG}` });
  const url = `https://toolkitlife.com/${locale}/tools/${SLUG}`;
  return {
    title: t("metadata.title"),
    keywords: t.raw("keywords") as string[],
    openGraph: {
      type: "website",
      url,
      siteName: "ToolkitLife",
      images: [
        {
          url: ogImageUrl({ title: t("metadata.title"), type: "tool" }),
          width: 1200,
          height: 630,
          alt: t("metadata.title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl({ title: t("metadata.title"), type: "tool" })],
    },
    description: t("metadata.description"),
    alternates: {
      canonical: url,
      languages: {
        en: `https://toolkitlife.com/en/tools/${SLUG}`,
        es: `https://toolkitlife.com/es/tools/${SLUG}`,
        zh: `https://toolkitlife.com/zh/tools/${SLUG}`,
        ja: `https://toolkitlife.com/ja/tools/${SLUG}`,
        ko: `https://toolkitlife.com/ko/tools/${SLUG}`,
        ru: `https://toolkitlife.com/ru/tools/${SLUG}`,
        "x-default": `https://toolkitlife.com/en/tools/${SLUG}`,
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
    <ToolMessages slug={SLUG} locale={locale}>
      {children}
    </ToolMessages>
  );
}
