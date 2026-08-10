import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.pdf-long-image.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "https://toolkitlife.com/tools/pdf-long-image",
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
