import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/terms`,
      languages: {
        en: "https://www.toolkitlife.com/en/terms",
        zh: "https://www.toolkitlife.com/zh/terms",
        ja: "https://www.toolkitlife.com/ja/terms",
        ko: "https://www.toolkitlife.com/ko/terms",
      },
    },
  };
}

export default async function TermsOfService({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="mb-8 text-sm text-zinc-500">
        <Link href="/" className="hover:text-blue-500 transition-colors">{t("breadcrumb.home")}</Link>
        <span className="mx-2 text-zinc-600">/</span>
        <span className="text-zinc-300">{t("breadcrumb.current")}</span>
      </nav>

      <h1 className="mb-6 font-display text-4xl text-zinc-100">{t("title")}</h1>
      <p className="mb-8 text-sm text-zinc-500">{t("lastUpdated")} {new Date().toLocaleDateString(locale, { month: "long", day: "numeric", year: "numeric" })}</p>

      <div className="prose-custom space-y-6">
        <h2>{t("sections.acceptance.title")}</h2>
        <p>{t("sections.acceptance.body")}</p>

        <h2>{t("sections.description.title")}</h2>
        <p>{t("sections.description.body")}</p>

        <h2>{t("sections.use.title")}</h2>
        <p>{t("sections.use.intro")}</p>
        <ul>
          <li>{t("sections.use.items.noRightToModify")}</li>
          <li>{t("sections.use.items.disruptService")}</li>
          <li>{t("sections.use.items.scrapeCommercial")}</li>
          <li>{t("sections.use.items.violateLaws")}</li>
        </ul>

        <h2>{t("sections.intellectualProperty.title")}</h2>
        <p>{t("sections.intellectualProperty.body")}</p>

        <h2>{t("sections.disclaimer.title")}</h2>
        <p>{t("sections.disclaimer.body")}</p>

        <h2>{t("sections.limitation.title")}</h2>
        <p>{t("sections.limitation.body")}</p>

        <h2>{t("sections.watermark.title")}</h2>
        <p dangerouslySetInnerHTML={{ __html: t.raw("sections.watermark.body") }} />

        <h2>{t("sections.changes.title")}</h2>
        <p>{t("sections.changes.body")}</p>

        <h2>{t("sections.contact.title")}</h2>
        <p>{t("sections.contact.body")}</p>
      </div>
    </div>
  );
}
