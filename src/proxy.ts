import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// IP 所属国家码（ISO 3166-1 alpha-2）→ 站点语言。
// 未列出的国家默认回落到 en。
const COUNTRY_TO_LOCALE: Record<string, string> = {
  CN: "zh", HK: "zh", MO: "zh", TW: "zh", SG: "zh", // 大中华区 / 新加坡
  JP: "ja", // 日本
  KR: "ko", // 韩国
  RU: "ru", BY: "ru", KZ: "ru", UA: "ru", // 俄语使用国
};

const handleI18nRouting = createMiddleware(routing);

// 预编译语言前缀匹配（单次正则 test，避免每次遍历数组）
const LOCALE_PREFIX_RE = new RegExp(`^/(${routing.locales.join("|")})(/|$)`);

// 从反向代理 / 边缘平台注入的国家头解析语言；无头时返回 undefined。
function getCountry(request: NextRequest): string | undefined {
  const country = (
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-country-code") ??
    ""
  ).toUpperCase();
  return country || undefined;
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // URL 已带语言前缀 → 直接交给 next-intl 处理（无需 IP 检测）
  const hasLocalePrefix = LOCALE_PREFIX_RE.test(pathname);

  // 用户手动选择过语言（NEXT_LOCALE cookie）→ 优先于 IP 检测
  if (!hasLocalePrefix && !request.cookies.get("NEXT_LOCALE")?.value) {
    const country = getCountry(request);
    if (country) {
      // 有国家头时由 IP 完全决定：映射到对应语言，未映射国家 → 默认 en
      const locale = COUNTRY_TO_LOCALE[country] ?? routing.defaultLocale;
      // 把检测结果注入 cookie，让 next-intl 的重定向逻辑（cookie 优先级）
      // 以该语言为目标重定向到 /{locale}{pathname}
      const nextRequest = new NextRequest(request);
      nextRequest.cookies.set("NEXT_LOCALE", locale);
      return handleI18nRouting(nextRequest);
    }
    // 无国家头（本地开发 / 无边缘头平台）：交给 next-intl 按浏览器语言兜底
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/", "/(zh|en|ja|ko|ru)/:path*"],
};
