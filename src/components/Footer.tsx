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
            <svg viewBox="0 0 64 64" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M34 28 C31 19 25 13 16 10 C19 19 26 25 34 28 Z" fill="#22c55e" />
              <path d="M34 28 C28 25 23 21 19 15" stroke="#065f46" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M12 28 a5 5 0 0 1 5-5 h30 a5 5 0 0 1 5 5 v18 a5 5 0 0 1-5 5 H17 a5 5 0 0 1-5-5 Z" fill="#3b82f6" />
              <path d="M22 28 V23 a5 5 0 0 1 5-5 h10 a5 5 0 0 1 5 5 v5" stroke="#3b82f6" strokeWidth="4.5" strokeLinecap="round" />
              <rect x="27" y="34" width="10" height="6" rx="2" fill="#1d4ed8" />
            </svg>
            <span className="font-display text-zinc-300">{t("brand")}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
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
