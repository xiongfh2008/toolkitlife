import Link from "next/link";
import { headers } from "next/headers";

// Root 404 — renders for any unmatched URL. The locale is injected as the
// "x-locale" response header by the i18n proxy (the statically-rendered
// not-found page has no usePathname access), which makes this page dynamic.
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
    desc: "찾으시는 페이지가 존재하지 않거나 이동되었을 수 있습니다.",
    back: "홈으로 돌아가기",
  },
  ru: {
    title: "Страница не найдена",
    desc: "Извините, страница, которую вы ищете, не существует или была перемещена.",
    back: "Вернуться на главную",
  },
};

export default async function NotFound() {
  const h = await headers();
  const locale = (h.get("x-locale") ?? "en") as keyof typeof COPY;
  const c = COPY[locale] ?? COPY.en;

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
