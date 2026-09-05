import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import HomeClient from "./home-client";

/**
 * Server wrapper for the homepage. Only the `home` namespace (tool directory,
 * scenes, labels) is shipped to the client — the [locale] layout already
 * provides nav/footer/common — instead of serializing the whole message file.
 *
 * The "Why" + FAQ sections below the tool grid are rendered on the server
 * (plain HTML + FAQPage JSON-LD) so AI crawlers and search engines see
 * substantive, citable content in the initial response.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale, namespace: "home" });
  const faqItems = t.raw("faq.items") as { question: string; answer: string }[];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <NextIntlClientProvider messages={{ home: messages.home }} locale={locale}>
        <HomeClient />
      </NextIntlClientProvider>

      {/* Server-rendered content sections (GEO: depth, citations, FAQ schema) */}
      <div className="prose-custom mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <section>
          <h2>{t("why.title")}</h2>
          <p>{t("why.intro")}</p>
          <p>
            {t.rich("why.privacy", {
              mdn: (chunks) => (
                <a
                  href="https://developer.mozilla.org/docs/WebAssembly"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
          <p>{t("why.i18n")}</p>
        </section>

        <section>
          <h2>{t("faq.title")}</h2>
          {faqItems.map((f) => (
            <div key={f.question}>
              <h3>{f.question}</h3>
              <p>{f.answer}</p>
            </div>
          ))}
        </section>

        {/* Plain <script> so the FAQPage JSON-LD ships in the SSR HTML */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </div>
    </>
  );
}
