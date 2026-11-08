"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

// Artwork ships for these locales; every other locale falls back to English.
const ART_LOCALES = new Set(["en", "zh", "ja", "ko", "es", "de", "fr"]);

// Dismissal is remembered per page so closing the banner on one tool does not
// silence it on another.
const STORAGE_PREFIX = "tp:promo:wallhaze";
const SHOW_DELAY_MS = 1500;
const HIDE_MS = 220;

export default function PromoBanner() {
  const locale = useLocale();
  const t = useTranslations("promoBanner");
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean).pop() ?? "default";
  const storageKey = `${STORAGE_PREFIX}:${slug}`;
  const [enabled, setEnabled] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(storageKey) === "1";
    } catch {
      /* storage blocked — show the banner anyway */
    }
    if (dismissed) return;

    const timer = window.setTimeout(() => {
      setEnabled(true);
      requestAnimationFrame(() => setEntered(true));
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  // Reserve room at the end of the document so the fixed banner never covers
  // the footer when the page is scrolled all the way down.
  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("has-promo-banner");
    return () => document.body.classList.remove("has-promo-banner");
  }, [enabled]);

  const dismiss = () => {
    setEntered(false);
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setEnabled(false), HIDE_MS);
  };

  if (!enabled) return null;

  const lang = ART_LOCALES.has(locale) ? locale : "en";

  return (
    <aside
      aria-label={t("alt")}
      className={`fixed inset-x-0 bottom-0 z-40 hidden px-2 pb-2 sm:block sm:px-4 sm:pb-4 transition-all duration-200 ${
        entered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="relative mx-auto w-full max-w-[1120px]">
        <a
          href="https://wallhaze.com/"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/promo/wallhaze-bottom-${lang}.webp`}
            alt={t("alt")}
            width={1600}
            height={188}
            draggable={false}
            className="h-auto w-full select-none drop-shadow-[0_10px_30px_rgba(24,10,60,0.28)]"
          />
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("close")}
          title={t("close")}
          style={{ left: "97.4%", top: "20.6%" }}
          className="absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors hover:bg-white/25 focus-visible:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        />
      </div>
    </aside>
  );
}
