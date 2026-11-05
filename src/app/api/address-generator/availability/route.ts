import { NextResponse } from "next/server";
import {
  cacheGet,
  cacheSet,
  clientIp,
  fetchAvailability,
  getAddressUpstreamConfig,
  rateLimit,
} from "@/lib/address-provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/address-generator/availability
 *
 * Reports whether real-address mode is enabled and, when it is, which
 * countries currently have synchronized address data. Availability comes from
 * the upstream /api/v1/availability endpoint — never a hardcoded "supported
 * countries" list, so only countries with actual data are offered.
 *
 * Returns 200 even when the feature is disabled so the client can quietly
 * stay in simulated-only mode.
 */
export async function GET(request: Request) {
  const cfg = getAddressUpstreamConfig();
  if (!cfg.enabled) {
    return NextResponse.json({ enabled: false, countries: [] });
  }

  const ip = clientIp(request);
  const limiter = rateLimit(`avail:${ip}`, 30, 60_000);
  if (!limiter.allowed) {
    return NextResponse.json(
      { enabled: true, error: "RATE_LIMITED" },
      { status: 429, headers: { "Retry-After": String(limiter.retryAfterSec) } }
    );
  }

  // Cache upstream availability for 60s (matches upstream's own cache header).
  const cacheKey = "address:availability";
  let countries = cacheGet(cacheKey) as Awaited<ReturnType<typeof fetchAvailability>> | undefined;
  if (countries === undefined) {
    countries = await fetchAvailability();
    if (countries === null) {
      return NextResponse.json(
        { enabled: true, error: "UPSTREAM_UNAVAILABLE" },
        { status: 503 }
      );
    }
    cacheSet(cacheKey, countries, 60_000);
  }

  return NextResponse.json({ enabled: true, countries });
}
