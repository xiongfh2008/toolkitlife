import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://www.toolkitlife.com/${locale}/privacy`,
      languages: {
        en: "https://www.toolkitlife.com/en/privacy",
        zh: "https://www.toolkitlife.com/zh/privacy",
        ja: "https://www.toolkitlife.com/ja/privacy",
        ko: "https://www.toolkitlife.com/ko/privacy",
        ru: "https://www.toolkitlife.com/ru/privacy",
      },
    },
  };
}

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

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
        <h2>{t("sections.shortVersion.title")}</h2>
        <p>{t("sections.shortVersion.body")}</p>

        <h2>{t("sections.whatDataWeCollect.title")}</h2>
        <h3>{t("sections.whatDataWeCollect.analytics.title")}</h3>
        <p>{t("sections.whatDataWeCollect.analytics.body")}</p>
        <ul>
          <li>{t("sections.whatDataWeCollect.analytics.items.pagesVisited")}</li>
          <li>{t("sections.whatDataWeCollect.analytics.items.referralSource")}</li>
          <li>{t("sections.whatDataWeCollect.analytics.items.generalLocation")}</li>
          <li>{t("sections.whatDataWeCollect.analytics.items.browserType")}</li>
        </ul>

        <h3>{t("sections.whatDataWeCollect.advertising.title")}</h3>
        <p>
          {t("sections.whatDataWeCollect.advertising.body")}{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">{t("sections.whatDataWeCollect.advertising.link")}</a>.
        </p>

        <h3>{t("sections.whatDataWeCollect.yourFiles.title")}</h3>
        <p>{t("sections.whatDataWeCollect.yourFiles.body")}</p>
        <ul>
          <li>{t("sections.whatDataWeCollect.yourFiles.items.staysOnDevice")}</li>
          <li>{t("sections.whatDataWeCollect.yourFiles.items.nothingUploaded")}</li>
          <li>{t("sections.whatDataWeCollect.yourFiles.items.nothingStored")}</li>
          <li>{t("sections.whatDataWeCollect.yourFiles.items.noAccess")}</li>
        </ul>

        <h2>{t("sections.cookies.title")}</h2>
        <p>{t("sections.cookies.body")}</p>

        <h2>{t("sections.thirdPartyServices.title")}</h2>
        <p>{t("sections.thirdPartyServices.intro")}</p>
        <ul>
          <li dangerouslySetInnerHTML={{ __html: t.raw("sections.thirdPartyServices.items.googleAdSense") }} />
          <li dangerouslySetInnerHTML={{ __html: t.raw("sections.thirdPartyServices.items.googleAnalytics") }} />
          <li dangerouslySetInnerHTML={{ __html: t.raw("sections.thirdPartyServices.items.cdnProviders") }} />
        </ul>
        <p>{t("sections.thirdPartyServices.outro")}</p>

        <h2>{t("sections.childrenPrivacy.title")}</h2>
        <p>{t("sections.childrenPrivacy.body")}</p>

        <h2>{t("sections.changes.title")}</h2>
        <p>{t("sections.changes.body")}</p>

        <h2>{t("sections.contact.title")}</h2>
        <p>{t("sections.contact.body")}</p>
      </div>
    </div>
  );
}
