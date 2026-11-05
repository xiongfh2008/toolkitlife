/**
 * Server-side adapter for the self-hosted Address API
 * (https://github.com/daimon3332/address — official contract in
 * docs/API.zh-CN.md of that project).
 *
 * Security model:
 *  - The API token lives only in server env vars (never NEXT_PUBLIC_*).
 *  - Browsers only ever talk to ToolkitLife's own /api/address-generator
 *    routes; those routes forward to the fixed ADDRESS_API_BASE_URL origin.
 *  - Only an allowlist of upstream paths is callable; the base URL is
 *    normalised to a bare origin so no path/query can be smuggled in.
 *  - Upstream synthetic profile / payment-card / extensions data is stripped
 *    before anything reaches the client.
 *  - Per-IP in-memory rate limiting protects the upstream from abuse.
 */

import type {
  AddressAdapterErrorCode,
  AddressAvailabilityCountry,
  AddressField,
  AddressGenerateRequest,
  AddressLocationsResponse,
  AddressLocationOption,
  RealAddress,
  RealGenerateResult,
} from "./address-types";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export interface AddressUpstreamConfig {
  enabled: boolean;
  baseUrl?: string;
  token?: string;
}

export function getAddressUpstreamConfig(): AddressUpstreamConfig {
  const raw = (process.env.ADDRESS_API_BASE_URL ?? "").trim();
  const token = (process.env.ADDRESS_API_TOKEN ?? "").trim();
  const enabledFlag = process.env.ADDRESS_REAL_ENABLED === "true";

  let baseUrl: string | undefined;
  if (raw) {
    try {
      const u = new URL(raw);
      // Only https, or plain http for localhost/private-network deployments.
      const isLocal =
        u.hostname === "localhost" ||
        u.hostname === "127.0.0.1" ||
        u.hostname === "::1" ||
        u.hostname.endsWith(".local") ||
        /^10\./.test(u.hostname) ||
        /^192\.168\./.test(u.hostname) ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(u.hostname);
      if (u.protocol === "https:" || (u.protocol === "http:" && isLocal)) {
        // Origin only — drop any configured path/query so downstream code
        // can never be tricked into requesting an arbitrary upstream URL.
        baseUrl = u.origin;
      }
    } catch {
      baseUrl = undefined;
    }
  }

  return {
    enabled: enabledFlag && Boolean(baseUrl) && Boolean(token),
    baseUrl,
    token,
  };
}

// ---------------------------------------------------------------------------
// Upstream fetch (allowlisted paths only)
// ---------------------------------------------------------------------------

const UPSTREAM_TIMEOUT_MS = Number(process.env.ADDRESS_UPSTREAM_TIMEOUT_MS) || 10_000;

export interface UpstreamResult {
  ok: boolean;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json?: any;
  errorCode?: AddressAdapterErrorCode;
  retryAfterSec?: number;
}

/**
 * Only these upstream paths are callable. The full URL (including query
 * string) must start with one of them — anything else is rejected, so no
 * caller can turn this adapter into an open proxy.
 */
const ALLOWED_UPSTREAM_PATHS = [
  "/api/v1/availability",
  "/api/v1/countries",
  "/api/v1/locations/search",
  "/api/v1/generate",
  "/api/v1/generate/batch",
  "/api/v1/address-translation",
] as const;

export function isAllowedUpstreamPath(fullPath: string): boolean {
  if (fullPath.includes("..") || fullPath.includes("#")) return false;
  return ALLOWED_UPSTREAM_PATHS.some((p) => fullPath === p || fullPath.startsWith(`${p}?`));
}

export async function upstreamJson(
  fullPath: string,
  init: RequestInit = {},
  timeoutMs = UPSTREAM_TIMEOUT_MS
): Promise<UpstreamResult> {
  const cfg = getAddressUpstreamConfig();
  if (!cfg.enabled || !cfg.baseUrl || !cfg.token) {
    return { ok: false, status: 503, errorCode: "REAL_MODE_DISABLED" };
  }
  if (!isAllowedUpstreamPath(fullPath)) {
    return { ok: false, status: 400, errorCode: "INVALID_REQUEST" };
  }
  try {
    const res = await fetch(`${cfg.baseUrl}${fullPath}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(init.headers ?? {}),
      },
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let json: any;
    try {
      json = await res.json();
    } catch {
      json = undefined;
    }

    if (res.ok) return { ok: true, status: res.status, json };

    // Official error shape: { error: { code, message } }
    const upstreamCode: string | undefined = json?.error?.code;

    if (res.status === 401 || res.status === 403) {
      // Token problem — never leak details to the client.
      return { ok: false, status: 502, errorCode: "UPSTREAM_AUTH" };
    }
    if (res.status === 429) {
      const retryHeader = res.headers.get("Retry-After");
      const retryAfterSec = retryHeader ? Number(retryHeader) || 60 : 60;
      return { ok: false, status: 429, errorCode: "RATE_LIMITED", retryAfterSec };
    }
    if (upstreamCode === "NO_POOL_COVERAGE") {
      return { ok: false, status: 404, errorCode: "NO_COVERAGE" };
    }
    if (upstreamCode === "INVALID_COUNTRY") {
      return { ok: false, status: 400, errorCode: "INVALID_COUNTRY" };
    }
    if (upstreamCode === "INVALID_LOCATION" || upstreamCode === "INVALID_FIELD" || upstreamCode === "INVALID_RESIDENTIAL") {
      return { ok: false, status: 400, errorCode: "INVALID_LOCATION" };
    }
    if (res.status === 400) {
      return { ok: false, status: 400, errorCode: "INVALID_REQUEST" };
    }
    return { ok: false, status: 503, errorCode: "UPSTREAM_UNAVAILABLE" };
  } catch {
    // AbortError (timeout) / network failure / DNS — all mapped to one code.
    return { ok: false, status: 503, errorCode: "UPSTREAM_UNAVAILABLE" };
  }
}

// ---------------------------------------------------------------------------
// Per-IP rate limiting (sliding window, in-memory)
// ---------------------------------------------------------------------------

const rateBuckets = new Map<string, number[]>();
const RATE_BUCKET_MAX_KEYS = 10_000;

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  if (rateBuckets.size > RATE_BUCKET_MAX_KEYS) rateBuckets.clear();
  const hits = (rateBuckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    const oldest = hits[0];
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)) };
  }
  hits.push(now);
  rateBuckets.set(key, hits);
  return { allowed: true, retryAfterSec: 0 };
}

export function clientIp(request: Request): string {
  // Take the LAST entry of the forwarding chain: each trusted proxy APPENDS
  // the previous hop, so the right-most value is the one our own edge added —
  // a client-spoofed "x-forwarded-for: 1.2.3.4" ends up first and must not be
  // trusted for rate limiting.
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const parts = fwd.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

// ---------------------------------------------------------------------------
// Response mapping — official GeneratedBundle.address → client-facing shape
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAddress(a: any): RealAddress {
  const evidence = Array.isArray(a?.evidence) ? a.evidence : [];
  const sources: RealAddress["sources"] = [];
  const seen = new Set<string>();
  for (const e of evidence) {
    if (!e?.sourceName || seen.has(e.sourceName)) continue;
    seen.add(e.sourceName);
    sources.push({
      sourceName: String(e.sourceName),
      ...(e.sourceUrl ? { sourceUrl: String(e.sourceUrl) } : {}),
      ...(e.sourceLicense ? { sourceLicense: String(e.sourceLicense) } : {}),
      ...(e.attributionUrl ? { attributionUrl: String(e.attributionUrl) } : {}),
    });
  }

  const c = a?.components ?? {};
  const pick = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : undefined);

  return {
    id: String(a?.id ?? ""),
    countryCode: String(a?.countryCode ?? ""),
    formattedAddress: String(a?.formattedAddress ?? ""),
    nativeAddress: String(a?.nativeAddress ?? a?.formattedAddress ?? ""),
    nativeLanguage: String(a?.nativeLanguage ?? ""),
    variants: {
      native: String(a?.nativeAddress ?? ""),
      ...(typeof a?.addressVariants?.en === "string" ? { en: a.addressVariants.en } : {}),
      ...(typeof a?.addressVariants?.["zh-CN"] === "string" ? { zhCN: a.addressVariants["zh-CN"] } : {}),
    },
    components: {
      houseNumber: pick(c.houseNumber),
      buildingName: pick(c.buildingName),
      unit: pick(c.unit),
      street: pick(c.street),
      locality: pick(c.locality),
      district: pick(c.district),
      admin1: pick(c.admin1),
      admin1Code: pick(c.admin1Code),
      postcode: pick(c.postcode),
    },
    coordinates:
      Number.isFinite(a?.coordinates?.latitude) && Number.isFinite(a?.coordinates?.longitude)
        ? { latitude: a.coordinates.latitude, longitude: a.coordinates.longitude }
        : undefined,
    matchLevel: (["street", "premise", "subpremise"] as const).includes(a?.matchLevel)
      ? a.matchLevel
      : "street",
    propertyType: a?.propertyType === "residential" ? "residential" : "unknown",
    sources,
    generatedAt: String(a?.generatedAt ?? new Date().toISOString()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBundle(bundle: any): RealAddress {
  // Only .address crosses the boundary — profile / card / extensions /
  // googleMaps are synthetic or unrelated and are dropped here.
  return mapAddress(bundle?.address);
}

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

export async function fetchAvailability(): Promise<AddressAvailabilityCountry[] | null> {
  const res = await upstreamJson("/api/v1/availability");
  if (!res.ok || !Array.isArray(res.json?.data)) return null;
  const countries: AddressAvailabilityCountry[] = [];
  for (const entry of res.json.data) {
    if (typeof entry?.code !== "string" || entry?.available !== true) continue;
    countries.push({
      code: entry.code,
      available: true,
      residentialAvailable: entry.residentialAvailable === true,
    });
  }
  return countries;
}

export async function fetchLocations(
  country: string,
  field: AddressField,
  params: { q?: string; regionId?: string; cityId?: string; limit?: number; residential?: boolean }
): Promise<AddressLocationsResponse | { error: AddressAdapterErrorCode; status: number }> {
  const search = new URLSearchParams({ country, field });
  if (params.q) search.set("q", params.q.slice(0, 100));
  if (params.regionId) search.set("regionId", params.regionId.slice(0, 160));
  if (params.cityId) search.set("cityId", params.cityId.slice(0, 160));
  search.set("limit", String(Math.min(Math.max(params.limit ?? 100, 20), 200)));
  // Count options against the same residential pool the generate call will
  // use, so a selected option always has eligible addresses behind it.
  search.set("residential", String(params.residential === true));

  const res = await upstreamJson(`/api/v1/locations/search?${search.toString()}`);
  if (!res.ok) return { error: res.errorCode ?? "UPSTREAM_UNAVAILABLE", status: res.status };
  const data = res.json?.data;
  if (!data) return { error: "UPSTREAM_UNAVAILABLE", status: 502 };
  const keyByField: Record<AddressField, string> = {
    region: "regions",
    city: "cities",
    district: "districts",
    postcode: "postcodes",
  };
  const list: AddressLocationOption[] = Array.isArray(data[keyByField[field]])
    ? data[keyByField[field]].filter((o: AddressLocationOption) => typeof o?.value === "string" && typeof o?.label === "string")
    : [];
  return {
    options: list,
    ...(typeof data.nextCursor === "string" ? { nextCursor: data.nextCursor } : {}),
  };
}

const DISPLAY_LOCALES = new Set(["en", "zh-CN", "zh-TW", "ja", "ko", "de", "fr", "es", "pt"]);

export async function translateAddress(
  addressId: string,
  targetLocale: string
): Promise<string | null> {
  if (!DISPLAY_LOCALES.has(targetLocale) || !addressId || addressId.length > 160) return null;
  const res = await upstreamJson("/api/v1/address-translation", {
    method: "POST",
    body: JSON.stringify({ addressId, targetLocale }),
  });
  if (!res.ok) return null; // contract: fall back to the original address
  const data = res.json?.data;
  // { unavailable: true } / { fallback: true } → client shows the original.
  if (!data || data.unavailable || data.fallback) return null;
  return typeof data.singleLine === "string" && data.singleLine ? data.singleLine : null;
}

export async function generateAddresses(
  body: AddressGenerateRequest
): Promise<
  | { ok: true; data: RealGenerateResult }
  | { ok: false; error: AddressAdapterErrorCode; status: number; retryAfterSec?: number }
> {
  const { count, filters } = body;
  const residential = filters.residential === true;

  if (count === 1) {
    const q = new URLSearchParams({ country: filters.country });
    if (filters.regionId) q.set("regionId", filters.regionId);
    if (filters.cityId) q.set("cityId", filters.cityId);
    if (filters.districtId) q.set("districtId", filters.districtId);
    if (filters.postcodeId) q.set("postcodeId", filters.postcodeId);
    if (filters.region) q.set("region", filters.region.slice(0, 300));
    if (filters.city) q.set("city", filters.city.slice(0, 300));
    if (filters.district) q.set("district", filters.district.slice(0, 300));
    if (filters.postcode) q.set("postcode", filters.postcode.slice(0, 300));
    q.set("residential", String(residential));

    const res = await upstreamJson(`/api/v1/generate?${q.toString()}`);
    if (!res.ok) {
      return { ok: false, error: res.errorCode ?? "UPSTREAM_UNAVAILABLE", status: res.status, ...(res.retryAfterSec ? { retryAfterSec: res.retryAfterSec } : {}) };
    }
    const bundle = res.json?.data?.result;
    if (!bundle) return { ok: false, error: "UPSTREAM_UNAVAILABLE", status: 502 };
    const address = mapBundle(bundle);
    if (body.displayLocale) {
      address.formattedAddress = (await translateAddress(address.id, body.displayLocale)) ?? address.formattedAddress;
    }
    return { ok: true, data: { returnedCount: 1, requestedCount: 1, exhausted: false, results: [address] } };
  }

  // Batch: official POST /generate/batch, count 1–50 (we cap at 20 upstream of
  // this), unique by default. Exhaustion is reported, never padded.
  const res = await upstreamJson("/api/v1/generate/batch", {
    method: "POST",
    body: JSON.stringify({
      count,
      filters: {
        country: filters.country,
        ...(filters.regionId ? { regionId: filters.regionId } : {}),
        ...(filters.cityId ? { cityId: filters.cityId } : {}),
        ...(filters.districtId ? { districtId: filters.districtId } : {}),
        ...(filters.postcodeId ? { postcodeId: filters.postcodeId } : {}),
        ...(filters.region ? { region: filters.region.slice(0, 300) } : {}),
        ...(filters.city ? { city: filters.city.slice(0, 300) } : {}),
        ...(filters.district ? { district: filters.district.slice(0, 300) } : {}),
        ...(filters.postcode ? { postcode: filters.postcode.slice(0, 300) } : {}),
        residential,
      },
      options: { unique: true },
    }),
  });
  if (!res.ok) {
    return { ok: false, error: res.errorCode ?? "UPSTREAM_UNAVAILABLE", status: res.status, ...(res.retryAfterSec ? { retryAfterSec: res.retryAfterSec } : {}) };
  }
  const data = res.json?.data;
  if (!data || !Array.isArray(data.results) || data.results.length === 0) {
    return { ok: false, error: "NO_COVERAGE", status: 404 };
  }
  const results = data.results.map(mapBundle);
  if (body.displayLocale) {
    // Translations are independent per address id — run them concurrently so a
    // 20-address batch stays within serverless function time limits.
    await Promise.all(
      results.map(async (address: RealAddress) => {
        const translated = await translateAddress(address.id, body.displayLocale!);
        if (translated) address.formattedAddress = translated;
      })
    );
  }
  return {
    ok: true,
    data: {
      returnedCount: results.length,
      requestedCount: count,
      exhausted: data.exhausted === true,
      results,
    },
  };
}

// ---------------------------------------------------------------------------
// In-memory caches for cheap upstream reads (availability / catalog)
// ---------------------------------------------------------------------------

interface CacheEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_MAX_KEYS = 500;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cacheGet(key: string): any | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cacheSet(key: string, value: any, ttlMs: number): void {
  if (cache.size > CACHE_MAX_KEYS) cache.clear();
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}
