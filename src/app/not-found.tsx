"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Root 404 — statically rendered. The locale is derived client-side from the
// URL path (locale-prefixed misses like /zh/unknown) with a navigator-language
// fallback, so no dynamic APIs (headers()) are needed — using those here would
// force every route in the app to render dynamically.
const COPY: Record<string, { title: string; desc: string; back: string }> = {
  en: {
    title: "Page Not Found",
    desc: "Sorry, the page you're looking for doesn't exist or has been moved.",
    back: "Back to Home",
  },
  zh: {
    title: "页面未找到",
    desc: "抱歉，您访问的页面不存在或已被移动。",
    back: "返回首页",
  },
  ja: {
    title: "ページが見つかりません",
    desc: "お探しのページは存在しないか、移動された可能性があります。",
    back: "ホームに戻る",
  },
  ko: {
    title: "페이지를 찾을 수 없습니다",
    desc: "찾으시는 페이지가 존재하지 않거나 이동된 페이지일 수 있습니다.",
    back: "홈으로 돌아가기",
  },
  ru: {
    title: "Страница не найдена",
    desc: "Извините, страница, которую вы ищете, не существует или была перемещена.",
    back: "Вернуться на главную",
  },
};

type Locale = keyof typeof COPY;

function pickLocale(pathname: string | null): Locale {
  const seg = pathname?.split("/")[1];
  if (seg && seg in COPY) return seg as Locale;
  if (typeof navigator !== "undefined") {
    const nav = navigator.language?.slice(0, 2);
    if (nav && nav in COPY) return nav as Locale;
  }
  return "en";
}

export default function NotFound() {
  const pathname = usePathname();
  // Server render defaults to "en" so the static HTML matches SSR output; the
  // locale refines on the client right after hydration.
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => {
    setLocale(pickLocale(pathname));
  }, [pathname]);
  const c = COPY[locale];

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl font-bold text-zinc-700">404</p>
      <h1 className="mt-4 font-display text-2xl text-zinc-100">{c.title}</h1>
      <p className="mt-3 text-zinc-400">{c.desc}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
      >
        {c.back}
      </Link>
    </div>
  );
}
