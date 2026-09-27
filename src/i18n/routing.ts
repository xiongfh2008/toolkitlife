import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "zh", "ja", "ko", "ru", "es", "de", "fr", "pt"],
  defaultLocale: "en",
  localePrefix: "always",
});

// Locales shown in the language switcher. de/fr/pt routes still work (English
// fallback) but are hidden until their message files are translated.
export const publishedLocales = ["en", "zh", "ja", "ko", "ru", "es"] as const;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
