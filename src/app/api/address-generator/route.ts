import { NextRequest, NextResponse } from "next/server";
import {
  clientIp,
  generateAddresses,
  getAddressUpstreamConfig,
  rateLimit,
} from "@/lib/address-provider";
import type { AddressAdapterErrorCode, AddressGenerateRequest } from "@/lib/address-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COUNTRY_RE = /^[A-Z]{2}$/;
const ID_RE = /^[A-Za-z0-9:_-]{1,160}$/;
const TEXT_MAX = 300;
/** Hard cap for the public batch endpoint — upstream itself allows 50. */
const MAX_COUNT = 20;
const DISPLAY_LOCALES = new Set(["en", "zh-CN", "zh-TW", "ja", "ko", "de", "fr", "es", "pt"]);

const FILTER_TEXT_KEYS = ["region", "city", "district", "postcode"] as const;
const FILTER_ID_KEYS = ["regionId", "cityId", "districtId", "postcodeId"] as const;

/**
 * POST /api/address-generator
 * Body: { count: 1–20, filters: { country, regionId/cityId/districtId/
 * postcodeId/region/city/district/postcode, residential }, displayLocale? }
 *
 * Server-side adapter for the self-hosted Address API. The client never sees
 * the upstream token, URL, or the synthetic profile/card data the upstream
 * bundles alongside each address.
 */
export async function POST(request: NextRequest) {
  const cfg = getAddressUpstreamConfig();
  if (!cfg.enabled) {
    // Real mode is not configured — never fabricate results; the client keeps
    // simulated mode only.
    return NextResponse.json({ error: "REAL_MODE_DISABLED" }, { status: 503 });
  }

  const ip = clientIp(request);
  // Abuse protection: 20 generate calls per 5 minutes per IP.
  const limiter = rateLimit(`gen:${ip}`, 20, 5 * 60_000);
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "RATE_LIMITED" },
      { status: 429, headers: { "Retry-After": String(limiter.retryAfterSec) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const req = body as Partial<AddressGenerateRequest> & { filters?: Record<string, unknown> };
  if (!req || typeof req !== "object" || Array.isArray(req)) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }
  const count = req.count;
  if (!Number.isInteger(count) || (count as number) < 1 || (count as number) > MAX_COUNT) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }
  if (req.displayLocale !== undefined && !DISPLAY_LOCALES.has(req.displayLocale)) {
    return NextResponse.json({ error: "INVALID_DISPLAY_LOCALE" }, { status: 400 });
  }

  const rawFilters: Record<string, unknown> = req.filters ?? {};
  if (typeof rawFilters !== "object" || Array.isArray(rawFilters)) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }
  const country = String(rawFilters.country ?? "").toUpperCase();
  if (!COUNTRY_RE.test(country)) {
    return NextResponse.json({ error: "INVALID_COUNTRY" }, { status: 400 });
  }

  const filters: AddressGenerateRequest["filters"] = { country };
  for (const key of FILTER_TEXT_KEYS) {
    const value = rawFilters[key];
    if (value === undefined || value === "") continue;
    if (typeof value !== "string" || value.length > TEXT_MAX) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }
    filters[key] = value;
  }
  for (const key of FILTER_ID_KEYS) {
    const value = rawFilters[key];
    if (value === undefined || value === "") continue;
    if (typeof value !== "string" || !ID_RE.test(value)) {
      return NextResponse.json({ error: "INVALID_LOCATION" }, { status: 400 });
    }
    filters[key] = value;
  }
  if (rawFilters.residential !== undefined) {
    if (typeof rawFilters.residential !== "boolean") {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }
    filters.residential = rawFilters.residential;
  }

  const result = await generateAddresses({
    count: count as number,
    filters,
    ...(req.displayLocale ? { displayLocale: req.displayLocale } : {}),
  });

  if (!result.ok) {
    const headers: Record<string, string> = {};
    if (result.retryAfterSec) headers["Retry-After"] = String(result.retryAfterSec);
    const status = result.error === "RATE_LIMITED" ? 429 : result.status;
    return NextResponse.json(
      { error: result.error satisfies AddressAdapterErrorCode },
      { status, headers }
    );
  }

  return NextResponse.json(result.data);
}
