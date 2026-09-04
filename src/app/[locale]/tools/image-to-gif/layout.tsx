import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-to-gif" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-to-gif.metadata" });
  return {
    title: t("title"),
    openGraph: {

      type: "website",
      url: `https://www.toolkitlife.com/${locale}/tools/image-to-gif`,

      siteName: "ToolkitLife",

      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],

    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/tools/image-to-gif`,
      languages: {
        en: `https://www.toolkitlife.com/en/tools/image-to-gif`,
        zh: `https://www.toolkitlife.com/zh/tools/image-to-gif`,
        ja: `https://www.toolkitlife.com/ja/tools/image-to-gif`,
        ko: `https://www.toolkitlife.com/ko/tools/image-to-gif`,
        ru: `https://www.toolkitlife.com/ru/tools/image-to-gif`,
        "x-default": `https://www.toolkitlife.com/en/tools/image-to-gif`,
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
    <ToolMessages slug="image-to-gif" locale={locale}>
      {children}
    </ToolMessages>
  );
}
