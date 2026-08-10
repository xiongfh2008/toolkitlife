"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const t = useTranslations("nav");

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-700 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl text-zinc-100 hover:text-blue-500 transition-colors"
        >
          <svg viewBox="0 0 64 64" className="h-7 w-7 shrink-0" fill="none" aria-hidden="true">
            <path d="M34 28 C31 19 25 13 16 10 C19 19 26 25 34 28 Z" fill="#22c55e" />
            <path d="M34 28 C28 25 23 21 19 15" stroke="#065f46" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M12 28 a5 5 0 0 1 5-5 h30 a5 5 0 0 1 5 5 v18 a5 5 0 0 1-5 5 H17 a5 5 0 0 1-5-5 Z" fill="#3b82f6" />
            <path d="M22 28 V23 a5 5 0 0 1 5-5 h10 a5 5 0 0 1 5 5 v5" stroke="#3b82f6" strokeWidth="4.5" strokeLinecap="round" />
            <rect x="27" y="34" width="10" height="6" rx="2" fill="#1d4ed8" />
          </svg>
          <span className="tracking-tight">{t("home")}</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            {t("blog")}
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            {t("allTools")} &rarr;
          </Link>
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </nav>
  );
}
