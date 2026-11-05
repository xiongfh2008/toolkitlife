import { NextRequest, NextResponse } from "next/server";
import {
  cacheGet,
  cacheSet,
  clientIp,
  fetchLocations,
  getAddressUpstreamConfig,
  rateLimit,
} from "@/lib/address-provider";
import type { AddressField } from "@/lib/address-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS: AddressField[] = ["region", "city", "district", "postcode"];
const COUNTRY_RE = /^[A-Z]{2}$/;
const ID_RE = /^[A-Za-z0-9:_-]{1,160}$/;

/**
 * GET /api/address-generator/locations
 *   ?country=US&field=city&q=…&regionId=…&cityId=…&residential=true
 *
 * Proxies the upstream location catalog (GET /api/v1/locations/search) with
 * strict parameter validation and a 5-minute server-side cache, so dropdown
 * options always reflect data that actually exists upstream.
 */
export async function GET(request: NextRequest) {
  const cfg = getAddressUpstreamConfig();
  if (!cfg.enabled) {
    return NextResponse.json({ error: "REAL_MODE_DISABLED" }, { status: 503 });
  }

  const ip = clientIp(request);
  const limiter = rateLimit(`loc:${ip}`, 60, 60_000);
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "RATE_LIMITED" },
      { status: 429, headers: { "Retry-After": String(limiter.retryAfterSec) } }
    );
  }

  const country = (request.nextUrl.searchParams.get("country") ?? "").toUpperCase();
  const field = request.nextUrl.searchParams.get("field") ?? "";
  const q = request.nextUrl.searchParams.get("q") ?? undefined;
  const regionId = request.nextUrl.searchParams.get("regionId") ?? undefined;
  const cityId = request.nextUrl.searchParams.get("cityId") ?? undefined;
  const residential = request.nextUrl.searchParams.get("residential") === "true";

  if (!COUNTRY_RE.test(country)) {
    return NextResponse.json({ error: "INVALID_COUNTRY" }, { status: 400 });
  }
  if (!FIELDS.includes(field as AddressField)) {
    return NextResponse.json({ error: "INVALID_LOCATION" }, { status: 400 });
  }
  if (regionId && !ID_RE.test(regionId)) {
    return NextResponse.json({ error: "INVALID_LOCATION" }, { status: 400 });
  }
  if (cityId && !ID_RE.test(cityId)) {
    return NextResponse.json({ error: "INVALID_LOCATION" }, { status: 400 });
  }

  const cacheKey = `address:loc:${country}:${field}:${q ?? ""}:${regionId ?? ""}:${cityId ?? ""}:${residential}`;
  const cached = cacheGet(cacheKey);
  if (cached) return NextResponse.json(cached);

  const result = await fetchLocations(country, field as AddressField, {
    q: q || undefined,
    regionId: regionId || undefined,
    cityId: cityId || undefined,
    limit: 200,
    residential,
  });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  cacheSet(cacheKey, result, 300_000);
  return NextResponse.json(result);
}
