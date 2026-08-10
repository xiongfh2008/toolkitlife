import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const IS_GD = "https://is.gd/create.php";
const TINYURL = "https://tinyurl.com/api-create.php";
const TIMEOUT_MS = 8000;

// is.gd 错误码：1=无效 URL、2=频率限制、5/6/7=自定义短链问题，其余为服务端异常
const IS_GD_INVALID_URL = 1;

function isValidUrl(raw: string): string | null {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  return u.toString();
}

async function fetchWithTimeout(url: string): Promise<Response> {
  return fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
}

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url") || "";
  const custom = (req.nextUrl.searchParams.get("custom") || "").trim();
  const target = isValidUrl(urlParam);
  if (!target) {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }

  // 主引擎：is.gd —— JSON 结构化错误，支持可选自定义短链
  const isgdQuery = new URLSearchParams({ format: "json", url: target });
  if (custom) isgdQuery.set("shorturl", custom);
  try {
    const res = await fetchWithTimeout(`${IS_GD}?${isgdQuery}`);
    const text = await res.text();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
    if (data?.shorturl) {
      return NextResponse.json({ shortUrl: data.shorturl, provider: "is.gd" });
    }
    // 无效 URL 属于用户输入错误，直接返回；限流/自定义短链问题等其余情况走 TinyURL 兜底
    if (data?.errorcode === IS_GD_INVALID_URL) {
      return NextResponse.json({ error: "invalid_url" }, { status: 400 });
    }
  } catch {
    // is.gd 网络失败 → 尝试 TinyURL
  }

  // 兜底引擎：TinyURL —— 纯文本返回，零解析成本
  try {
    const res = await fetchWithTimeout(`${TINYURL}?${new URLSearchParams({ url: target })}`);
    const text = (await res.text()).trim();
    if (/^https?:\/\/tinyurl\.com\//i.test(text)) {
      return NextResponse.json({ shortUrl: text, provider: "tinyurl" });
    }
  } catch {
    // TinyURL 也失败 → 返回统一错误
  }

  return NextResponse.json({ error: "shorten_failed" }, { status: 502 });
}
