import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ogImageUrl } from "@/lib/og";
import ToolMessages from "@/components/ToolMessages";


export function generateStaticParams() {
  return [{ slug: "image-to-printmaking" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools.image-to-printmaking.metadata" });
  return {
    title: t("title"),
    openGraph: {
      type: "website",
      url: `https://toolkitlife.com/${locale}/tools/image-to-printmaking`,
      siteName: "ToolkitLife",
      images: [{ url: ogImageUrl({ title: t("title"), type: "tool" }), width: 1200, height: 630, alt: t("title") }],
    },
    twitter: { card: "summary_large_image", images: [ogImageUrl({ title: t("title"), type: "tool" })] },
    description: t("description"),
    alternates: {
      canonical: `https://toolkitlife.com/${locale}/tools/image-to-printmaking`,
      languages: {
        en: `https://toolkitlife.com/en/tools/image-to-printmaking`,
        es: `https://toolkitlife.com/es/tools/image-to-printmaking`,
        zh: `https://toolkitlife.com/zh/tools/image-to-printmaking`,
        ja: `https://toolkitlife.com/ja/tools/image-to-printmaking`,
        ko: `https://toolkitlife.com/ko/tools/image-to-printmaking`,
        ru: `https://toolkitlife.com/ru/tools/image-to-printmaking`,
        "x-default": `https://toolkitlife.com/en/tools/image-to-printmaking`,
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
    <ToolMessages slug="image-to-printmaking" locale={locale}>
      {children}
    </ToolMessages>
  );
}
