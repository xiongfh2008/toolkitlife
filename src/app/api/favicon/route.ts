import { NextRequest, NextResponse } from "next/server";

// Proxy for the Google favicon service so the client can fetch & download
// site icons without CORS issues. Only ever fetches from Google's fixed host.
export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain")?.trim() ?? "";
  if (!domain || !/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(domain)) {
    return NextResponse.json({ error: "invalid domain" }, { status: 400 });
  }
  try {
    const res = await fetch(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`, {
      cache: "force-cache",
    });
    if (!res.ok) return NextResponse.json({ error: "not found" }, { status: 502 });
    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/png",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }
}
