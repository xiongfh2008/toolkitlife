import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "multiavatar-avatar-generator" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: "tools.multiavatar-avatar-generator.metadata",
  });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/multiavatar-avatar-generator`,
      siteName: "ToolkitLife",
      images: [
        {
          url: ogImageUrl({ title: t("title"), type: "tool" }),
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl({ title: t("title"), type: "tool" })],
    },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/multiavatar-avatar-generator`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/multiavatar-avatar-generator`,
        zh: `https://www.toolkitlife.com/zh/tools/multiavatar-avatar-generator`,
        ja: `https://www.toolkitlife.com/ja/tools/multiavatar-avatar-generator`,
        ko: `https://www.toolkitlife.com/ko/tools/multiavatar-avatar-generator`,
        ru: `https://www.toolkitlife.com/ru/tools/multiavatar-avatar-generator`,
        "x-default": `https://www.toolkitlife.com/en/tools/multiavatar-avatar-generator`,
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
    <ToolMessages slug="multiavatar-avatar-generator" locale={locale}>
      {children}
    </ToolMessages>
  );
}
