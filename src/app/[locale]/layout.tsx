import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { ogImageUrl } from "@/lib/og";
import "../globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GtagTracker from "@/components/GtagTracker";

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const heading = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const code = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
});

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
      yandex: "55f0fc137d5117ba",
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
        "x-default": `https://www.toolkitlife.com/en`,
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
    notFound: messages.notFound,
  };
  const siteT = await getTranslations({ locale, namespace: "metadata" });

  return (
    <html
      lang={locale}
      className={`${body.variable} ${heading.variable} ${code.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 antialiased">
        <NextIntlClientProvider messages={publicMessages} locale={locale}>
      {/* Apply saved/system theme before paint to avoid a flash of the wrong theme. */}
      <Script id="theme-init" strategy="beforeInteractive">
        {`(function(){try{var s=localStorage.getItem("toolkitlife-theme");var d=s?s==="dark":window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`}
      </Script>

      {/* Yandex.Metrika counter */}
      <Script id="ym-counter" strategy="beforeInteractive">
        {`
          (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=111875924', 'ym');

          ym(111875924, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
        `}
      </Script>
      <noscript>
        {/* Yandex pixel — noscript fallback can't use next/image (needs JS), so
            keep a plain img with explicit size + lazy/low-priority so it never
            competes for the LCP image slot. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://mc.yandex.ru/watch/111875924"
          alt=""
          width={1}
          height={1}
          style={{ position: "absolute", left: -9999 }}
          loading="lazy"
          fetchPriority="low"
          decoding="async"
        />
      </noscript>
      {/* /Yandex.Metrika counter */}
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

      {/* Microsoft Clarity — session replays & heatmaps */}
      <Script id="clarity-init" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "y8zr3ckhi9");
        `}
      </Script>

      {/* WebSite + Organization schema — plain <script> so crawlers see it in SSR HTML */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                name: "ToolkitLife",
                url: "https://www.toolkitlife.com",
                description: siteT("description"),
                inLanguage: locale,
                potentialAction: {
                  "@type": "SearchAction",
                  target: `https://www.toolkitlife.com/${locale}/?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@type": "Organization",
                name: "ToolkitLife",
                url: "https://www.toolkitlife.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.toolkitlife.com/icon.svg",
                  width: 64,
                  height: 64,
                },
              },
            ],
          }),
        }}
      />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
