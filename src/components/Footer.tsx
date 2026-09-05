"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-zinc-700 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
              <rect x="2" y="2" width="60" height="60" rx="14" fill="#6366F1" />
              <path d="M20 17 h24 a3 3 0 0 1 0 6 h-9 v22 a3 3 0 0 1-6 0 V23 h-9 a3 3 0 0 1 0-6 Z" fill="#ffffff" />
            </svg>
            <span className="font-display text-zinc-300">{t("brand")}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <Link href="/blog" className="hover:text-zinc-300 transition-colors">{t("blog")}</Link>
            <Link href="/about" className="hover:text-zinc-300 transition-colors">{t("about")}</Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">{t("terms")}</Link>
          </div>
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} {t("brand")} &middot; {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
