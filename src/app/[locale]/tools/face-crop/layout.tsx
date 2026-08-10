import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.face-crop.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "https://toolkitlife.com/tools/face-crop",
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
