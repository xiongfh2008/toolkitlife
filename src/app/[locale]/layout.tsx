import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import { ogImageUrl } from "@/lib/og";
import "../globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HtmlLang from "@/components/HtmlLang";
import GtagTracker from "@/components/GtagTracker";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });
  const baseUrl = `https://www.toolkitlife.com/${locale}`;
  const ogImage = ogImageUrl({ type: "home" });

  return {
    metadataBase: new URL("https://www.toolkitlife.com"),
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
      url: baseUrl,
      siteName: "ToolkitLife",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "ToolkitLife" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: [ogImage],
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
      canonical: baseUrl,
      languages: {
        en: "https://www.toolkitlife.com/en",
        zh: "https://www.toolkitlife.com/zh",
        ja: "https://www.toolkitlife.com/ja",
        ko: "https://www.toolkitlife.com/ko",
        ru: "https://www.toolkitlife.com/ru",
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
  setRequestLocale(locale);

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  // Only ship the namespaces consumed by the always-present client components
  // (Nav/Footer/CopyButton/LocaleSwitcher). Everything else — tools (~1MB),
  // home (~57KB), privacy, terms, blog, metadata — is provided per-page by
  // the respective layout/page, keeping the base RSC payload tiny.
  const publicMessages = {
    common: messages.common,
    nav: messages.nav,
    footer: messages.footer,
    localeSwitcher: messages.localeSwitcher,
  };
  const siteT = await getTranslations({ locale, namespace: "metadata" });

  return (
    <NextIntlClientProvider messages={publicMessages} locale={locale}>
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
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-JL8M403PXS"
      />
      <Script id="gtag-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JL8M403PXS');
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
            url: "https://www.toolkitlife.com",
            description: siteT("description"),
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.toolkitlife.com/?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </NextIntlClientProvider>
  );
}
