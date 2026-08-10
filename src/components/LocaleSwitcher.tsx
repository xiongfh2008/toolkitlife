"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, getPathname } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
};

export default function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher");
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params.locale as string) || routing.defaultLocale;

  const handleChange = (locale: string) => {
    const href = getPathname({ locale, href: pathname });
    window.location.href = href;
  };

  return (
    <div className="relative">
      <select
        value={currentLocale}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 pr-8 text-sm text-zinc-300 outline-none focus:border-blue-500 cursor-pointer"
        aria-label={t("selectLanguage")}
      >
        {routing.locales.map((locale) => (
          <option key={locale} value={locale}>
            {labels[locale]}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
        ▼
      </span>
    </div>
  );
}
