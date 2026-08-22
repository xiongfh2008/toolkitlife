"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass =
    "text-sm font-medium text-zinc-500 hover:text-zinc-200 transition-colors";

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-700 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg text-zinc-100 transition-colors hover:text-blue-500 md:text-xl"
        >
          <svg viewBox="0 0 64 64" className="h-7 w-7 shrink-0" aria-hidden="true">
            <rect x="2" y="2" width="60" height="60" rx="14" fill="#6366F1" />
            <path d="M20 17 h24 a3 3 0 0 1 0 6 h-9 v22 a3 3 0 0 1-6 0 V23 h-9 a3 3 0 0 1 0-6 Z" fill="#ffffff" />
          </svg>
          <span className="truncate tracking-tight">{t("home")}</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Desktop links */}
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/blog" className={linkClass}>
              {t("blog")}
            </Link>
            <Link href="/" className={linkClass}>
              {t("allTools")} &rarr;
            </Link>
          </div>
          <ThemeToggle />
          <LocaleSwitcher />
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t("menu")}
            aria-expanded={menuOpen}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-400 transition-colors hover:text-blue-600 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            <Link
              href="/blog"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
            >
              {t("blog")}
            </Link>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
            >
              {t("allTools")} &rarr;
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
