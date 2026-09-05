"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SCENE_OF_SLUG } from "@/data/scene-of-slug";
import { YMYL_TOOLS, type YmylKind } from "@/data/ymyl-tools";

const YMYL_DISCLAIMER_KEY: Record<YmylKind, string> = {
  financial: "disclaimerFinancial",
  health: "disclaimerHealth",
  legal: "disclaimerLegal",
};

const FAVORITES_KEY = "tp:favorites";
const RECENT_KEY = "tp:recent";

export interface FAQ {
  question: string;
  answer: string;
}

export interface RelatedTool {
  name: string;
  href: string;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  category: string;
  slug: string;
  children: React.ReactNode;
  guide?: React.ReactNode;
  faqs?: FAQ[];
  relatedTools?: RelatedTool[];
  keywords?: string[];
}

interface GuideBlock {
  title?: string;
  body?: string[];
  paragraphs?: string[];
  intro?: string;
  items?: string[];
}

/**
 * Generic guide renderer that supports the two data shapes used across
 * tool translations:
 *  - shape A: { intro: {title, paragraphs[]}, sections: [{title, paragraphs[], items[]}] }
 *  - shape B: { whatIs: {title, body[]}, modes/howTo/tips: {title, intro?, items[]} }
 */
function GuideContent({ guide }: { guide: Record<string, unknown> }) {
  if (!guide) return null;

  if (guide.intro) {
    const intro = guide.intro as GuideBlock;
    const sections = (guide.sections as GuideBlock[] | undefined) ?? [];
    return (
      <>
        {intro.title && <h2>{intro.title}</h2>}
        {(intro.paragraphs ?? []).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {sections.map((s, i) => (
          <section key={i}>
            {s.title && <h3>{s.title}</h3>}
            {(s.paragraphs ?? []).map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            {s.items && (
              <ul>
                {s.items.map((it, k) => (
                  <li key={k}>{it}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </>
    );
  }

  const order = ["whatIs", "modes", "howTo", "tips"];
  const keys = order.filter((k) => guide[k]);
  return (
    <>
      {keys.map((k) => {
        const sec = guide[k] as GuideBlock;
        return (
          <section key={k}>
            {sec.title && <h3>{sec.title}</h3>}
            {(sec.body ?? []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {sec.intro && <p>{sec.intro}</p>}
            {sec.items && (
              <ul>
                {sec.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </>
  );
}

export default function ToolLayout({
  title,
  description,
  category,
  slug,
  children,
  guide,
  faqs,
  relatedTools,
  keywords,
}: ToolLayoutProps) {
  const t = useTranslations("toolLayout");
  const toolT = useTranslations(`tools.${slug}`);
  const locale = useLocale();

  // Fall back to translation data when a page doesn't pass these explicitly.
  const effectiveGuide =
    guide ??
    (toolT.has("guide") ? (
      <GuideContent guide={toolT.raw("guide") as Record<string, unknown>} />
    ) : undefined);
  const effectiveFaqs =
    faqs ?? (toolT.has("faqs") ? (toolT.raw("faqs") as FAQ[]) : undefined);
  const effectiveRelatedTools =
    relatedTools ??
    (toolT.has("relatedTools")
      ? (toolT.raw("relatedTools") as RelatedTool[])
      : undefined);
  const effectiveKeywords =
    keywords ??
    (toolT.has("keywords") ? (toolT.raw("keywords") as string[]) : undefined);

  // Favorites + recently-used (localStorage, shared with the homepage)
  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const favs = JSON.parse(
        window.localStorage.getItem(FAVORITES_KEY) ?? "[]"
      ) as string[];
      return favs.includes(slug);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const recent = JSON.parse(
        window.localStorage.getItem(RECENT_KEY) ?? "[]"
      ) as string[];
      const next = [slug, ...recent.filter((s) => s !== slug)].slice(0, 12);
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("tp:recent-changed"));
    } catch {
      /* ignore */
    }
  }, [slug]);

  const toggleFavorite = () => {
    setIsFavorite((prev) => {
      const next = !prev;
      try {
        const favs = JSON.parse(
          window.localStorage.getItem(FAVORITES_KEY) ?? "[]"
        ) as string[];
        const updated = next
          ? [...favs, slug]
          : favs.filter((s) => s !== slug);
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("tp:favorites-changed"));
      } catch {
        /* ignore */
      }
      return next;
    });
  };
  const url = `https://www.toolkitlife.com/${locale}/tools/${slug}`;

  // Financial / health / legal tools show a general informational disclaimer so
  // readers (and AI assistants citing the page) see the content is not advice.
  const ymylKind = YMYL_TOOLS[slug];
  const disclaimerKey = ymylKind ? YMYL_DISCLAIMER_KEY[ymylKind] : null;
  const disclaimerLabel = disclaimerKey && t.has(disclaimerKey) ? t(disclaimerKey) : null;

  // SoftwareApplication schema
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description,
    url,
    applicationCategory: "BrowserApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    aggregateRating: undefined as undefined | object,
  };

  // FAQ schema
  const faqSchema = effectiveFaqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: effectiveFaqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  // HowTo schema — derived from the guide's step list ("howTo" block) so AI
  // assistants can cite step-by-step instructions directly from the tool page
  const rawGuide = toolT.has("guide")
    ? (toolT.raw("guide") as { howTo?: { items?: string[] } })
    : undefined;
  const howToSteps = rawGuide?.howTo?.items ?? [];
  const howToSchema = howToSteps.length
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: title,
        description,
        inLanguage: locale,
        step: howToSteps.map((s) => ({ "@type": "HowToStep", text: s })),
      }
    : null;

  // BreadcrumbList schema — URLs must match the actual (locale-prefixed) pages
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: `https://www.toolkitlife.com/${locale}` },
      { "@type": "ListItem", position: 2, name: category, item: `https://www.toolkitlife.com/${locale}/#scene=${SCENE_OF_SLUG[slug] ?? "all"}` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };

  return (
    <>
      {/* Structured data — plain <script> so JSON-LD is server-rendered in the
          initial HTML instead of only being injected after hydration. */}
      <script
        id={`schema-app-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      {faqSchema && (
        <script
          id={`schema-faq-${slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          id={`schema-howto-${slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      <script
        id={`schema-breadcrumb-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-zinc-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-500 transition-colors">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-2 text-zinc-600">/</span>
          <Link
            href={`/#scene=${SCENE_OF_SLUG[slug] ?? "all"}`}
            className="hover:text-blue-500 transition-colors"
          >
            {category}
          </Link>
          <span className="mx-2 text-zinc-600">/</span>
          <span className="text-zinc-300">{title}</span>
        </nav>

        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-4">
          <h1 className="font-display text-4xl text-zinc-100">{title}</h1>
          <button
            onClick={toggleFavorite}
            className={`shrink-0 text-2xl transition-colors ${
              isFavorite
                ? "text-amber-400"
                : "text-zinc-600 hover:text-amber-400"
            }`}
            aria-label={isFavorite ? "remove favorite" : "add favorite"}
            title={isFavorite ? "★" : "☆"}
          >
            {isFavorite ? "★" : "☆"}
          </button>
        </div>
        <p className="mb-8 text-zinc-400 text-lg leading-relaxed max-w-2xl">{description}</p>

        {/* Tool */}
        <div className="mb-12">{children}</div>

        {/* YMYL informational disclaimer (financial / health / legal tools) */}
        {disclaimerLabel && (
          <aside
            role="note"
            aria-label="Disclaimer"
            className="mb-12 rounded-xl border border-amber-800/40 bg-amber-950/20 px-5 py-4 text-xs leading-relaxed text-amber-200/80"
          >
            {disclaimerLabel}
          </aside>
        )}

        {/* Guide content */}
        {effectiveGuide && (
          <article className="mb-12 prose-custom">
            {effectiveGuide}
          </article>
        )}

        {/* FAQ section */}
        {effectiveFaqs && effectiveFaqs.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl text-zinc-100 mb-6">
              {t("faqTitle")}
            </h2>
            <div className="space-y-4">
              {effectiveFaqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-zinc-900 border border-zinc-800 rounded-xl"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-zinc-200 font-medium text-sm select-none">
                    {faq.question}
                    <span className="ml-4 text-zinc-500 group-open:rotate-45 transition-transform text-lg">+</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related tools */}
        {effectiveRelatedTools && effectiveRelatedTools.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-xl text-zinc-100 mb-4">{t("relatedToolsTitle")}</h2>
            <div className="flex flex-wrap gap-2">
              {effectiveRelatedTools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:border-blue-500/40 hover:text-blue-500 transition-colors"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SEO keyword footer — hidden visually but indexable */}
        {effectiveKeywords && (
          <footer className="mt-8 text-xs text-zinc-600 leading-relaxed">
            <p>
              {title} — {t("keywordsSuffix", { keywords: effectiveKeywords.join(", ") })}
            </p>
          </footer>
        )}
      </div>
    </>
  );
}
