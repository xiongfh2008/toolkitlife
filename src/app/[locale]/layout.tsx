import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import "../globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HtmlLang from "@/components/HtmlLang";
import GtagTracker from "@/components/GtagTracker";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL("https://toolkitlife.com"),
    title: {
      default: t("title"),
      template: "%s | ToolkitLife",
    },
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      url: "https://toolkitlife.com",
      siteName: "ToolkitLife",
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      other: {
        "msvalidate.01": "637B49DDC622A1D04AD4DDB6345E9C65",
      },
    },
    alternates: {
      canonical: "https://toolkitlife.com",
      languages: {
        en: "https://toolkitlife.com/en",
        zh: "https://toolkitlife.com/zh",
        ja: "https://toolkitlife.com/ja",
        ko: "https://toolkitlife.com/ko",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const siteT = await getTranslations({ locale, namespace: "metadata" });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {/* Apply saved/system theme before paint to avoid a flash of the wrong theme. */}
      <Script id="theme-init" strategy="beforeInteractive">
        {`(function(){try{var s=localStorage.getItem("toolkitlife-theme");var d=s?s==="dark":window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`}
      </Script>
      <HtmlLang locale={locale} />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <Analytics />
      <GtagTracker />

      {/* Google tag (gtag.js) */}
      <Script
        id="gtag"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-G9NQ7EZTB8"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-G9NQ7EZTB8');
        `}
      </Script>

      {/* Organization schema */}
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "ToolkitLife",
            url: "https://toolkitlife.com",
            description: siteT("description"),
            potentialAction: {
              "@type": "SearchAction",
              target: "https://toolkitlife.com/?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </NextIntlClientProvider>
  );
}
