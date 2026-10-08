import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "group-randomizer" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.group-randomizer.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/group-randomizer`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/group-randomizer`,
      languages: {
        en: `https://toolkitlife.com/en/tools/group-randomizer`,
        es: `https://toolkitlife.com/es/tools/group-randomizer`,
        zh: `https://toolkitlife.com/zh/tools/group-randomizer`,
        ja: `https://toolkitlife.com/ja/tools/group-randomizer`,
        ko: `https://toolkitlife.com/ko/tools/group-randomizer`,
        ru: `https://toolkitlife.com/ru/tools/group-randomizer`,
        "x-default": `https://toolkitlife.com/en/tools/group-randomizer`,
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
    <ToolMessages slug="group-randomizer" locale={locale}>
      {children}
    </ToolMessages>
  );
}
