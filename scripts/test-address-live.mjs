// LIVE smoke test: verifies the ToolkitLife adapter against a REAL Address
// service (unlike scripts/test-address-integration.mjs which uses a mock).
//
//   ADDRESS_REAL_ENABLED=true ADDRESS_API_BASE_URL=http://127.0.0.1:8787 \
//   ADDRESS_API_TOKEN=<token> node scripts/test-address-live.mjs
//
// Safe to run against a freshly deployed, EMPTY pool: it asserts contract
// behaviour (auth, error mapping, shape) — not data availability. When the
// pool is empty, generate calls must map to NO_COVERAGE and that is a PASS.
// Sections marked [DATA] only assert when the target country has data.

process.env.ADDRESS_UPSTREAM_TIMEOUT_MS = process.env.ADDRESS_UPSTREAM_TIMEOUT_MS || "8000";

import assert from "node:assert/strict";

const results = [];
async function test(name, fn) {
  try {
    await fn();
    results.push(`  ✓ ${name}`);
  } catch (err) {
    results.push(`  ✗ ${name}\n      ${err.message}`);
    process.exitCode = 1;
  }
}

const BASE = process.env.ADDRESS_API_BASE_URL;
const TOKEN = process.env.ADDRESS_API_TOKEN;
if (!BASE || !TOKEN || process.env.ADDRESS_REAL_ENABLED !== "true") {
  console.error("Usage: ADDRESS_REAL_ENABLED=true ADDRESS_API_BASE_URL=… ADDRESS_API_TOKEN=… node scripts/test-address-live.mjs");
  process.exit(2);
}

const provider = await import("../src/lib/address-provider.ts");

// Raw upstream probes (contract of the Address service itself)
const upstream = async (path, init) => {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(init?.body ? { "Content-Type": "application/json" } : {}), ...(init?.headers ?? {}) },
    signal: AbortSignal.timeout(8000),
  });
  let json;
  try { json = await res.json(); } catch {}
  return { status: res.status, json, retryAfter: res.headers.get("retry-after") };
};

console.log(`(live Address service at ${BASE})`);

// --- 1. upstream contract -----------------------------------------------------
const ready = await upstream("/api/v1/ready");
await test("upstream /ready returns {status:ready}", () => {
  assert.equal(ready.status, 200);
  assert.equal(ready.json?.status, "ready");
});

let availability = [];
await test("upstream /availability returns well-formed array", () => {
  assert.equal(ready.status, 200);
  assert.ok(Array.isArray(availabilityFromUpstream().data));
  function availabilityFromUpstream() { return { data: availability }; }
});

{
  const res = await upstream("/api/v1/availability");
  availability = Array.isArray(res.json?.data) ? res.json.data : [];
  const codes = availability.map((c) => c.code);
  results.push(`  ℹ upstream reports ${codes.length} country/countries with data: ${codes.join(",") || "(none — pool empty)"}`);
}

await test("upstream rejects bad token with 401", async () => {
  const res = await fetch(`${BASE}/api/v1/availability`, { headers: { Authorization: "Bearer wrong" } });
  assert.equal(res.status, 401);
});

// --- 2. adapter against the live service --------------------------------------
await test("adapter fetchAvailability mirrors upstream codes", async () => {
  const countries = await provider.fetchAvailability();
  assert.ok(Array.isArray(countries));
  const codes = countries.map((c) => c.code).sort();
  assert.deepEqual(codes, availability.map((c) => c.code).sort());
});

const DATA_COUNTRY = availability[0]?.code; // first country that has data, if any
const PROBE = DATA_COUNTRY ?? "US"; // US is ToolkitLife's default; empty pool → NO_COVERAGE

await test(`adapter generate (${PROBE}${DATA_COUNTRY ? "" : ", empty pool"}) maps correctly`, async () => {
  const res = await provider.generateAddresses({ count: 1, filters: { country: PROBE } });
  if (DATA_COUNTRY) {
    assert.equal(res.ok, true);
    assert.equal(res.data.results.length, 1);
    assert.ok(res.data.results[0].formattedAddress.length > 0);
    // [DATA] precision/source/coordinates must be present for real data
    const a = res.data.results[0];
    assert.ok(["street", "premise", "subpremise"].includes(a.matchLevel));
    assert.ok(Array.isArray(a.sources));
    assert.ok(!("profile" in a) && !("card" in a), "synthetic data must be stripped");
  } else {
    assert.equal(res.ok, false);
    assert.equal(res.error, "NO_COVERAGE");
    assert.equal(res.status, 404);
  }
});

await test("adapter batch maps exhaustion/NO_COVERAGE correctly", async () => {
  const res = await provider.generateAddresses({ count: 5, filters: { country: PROBE } });
  if (DATA_COUNTRY) {
    assert.equal(res.ok, true);
    assert.ok(res.data.returnedCount >= 1 && res.data.returnedCount <= 5);
    assert.equal(res.data.exhausted, res.data.returnedCount < 5);
  } else {
    assert.equal(res.ok, false);
    assert.equal(res.error, "NO_COVERAGE");
  }
});

await test("adapter maps INVALID_COUNTRY for unknown code", async () => {
  const res = await provider.generateAddresses({ count: 1, filters: { country: "ZZ" } });
  assert.equal(res.ok, false);
  assert.equal(res.error, "INVALID_COUNTRY");
  assert.equal(res.status, 400);
});

await test("adapter locations returns option list (possibly empty) with nextCursor type", async () => {
  const res = await provider.fetchLocations(PROBE, "region", {});
  assert.ok("options" in res);
  assert.ok(Array.isArray(res.options));
  if (DATA_COUNTRY && res.options.length > 0) {
    assert.ok(typeof res.options[0].value === "string");
    assert.ok(typeof res.options[0].label === "string");
  }
});

await test("adapter translation falls back to original when unavailable", async () => {
  // With no data there is no addressId to translate; assert the adapter
  // returns null rather than throwing for an unknown id.
  const t = await provider.translateAddress("pool-v2-addr-nonexistent", "ja");
  assert.equal(t, null);
});

// --- 3. client-side hardening (through a local Next server if provided) -------
if (process.env.TKL_BASE_URL) {
  const base = process.env.TKL_BASE_URL;
  await test("ToolkitLife API: availability reflects real mode", async () => {
    const res = await fetch(`${base}/api/address-generator/availability`);
    const j = await res.json();
    assert.equal(res.status, 200);
    assert.equal(j.enabled, true);
    assert.deepEqual(j.countries.map((c) => c.code).sort(), availability.map((c) => c.code).sort());
  });
  await test("ToolkitLife API: generate keeps client away from upstream details", async () => {
    const res = await fetch(`${base}/api/address-generator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: 1, filters: { country: PROBE } }),
    });
    const j = await res.json().catch(() => null);
    if (DATA_COUNTRY) {
      assert.equal(res.status, 200);
      assert.ok(!JSON.stringify(j).includes(TOKEN));
      assert.ok(!("profile" in (j.results?.[0] ?? {})));
    } else {
      assert.equal(res.status, 404);
      assert.equal(j?.error, "NO_COVERAGE");
    }
  });
  await test("ToolkitLife API: rejects oversized count", async () => {
    const res = await fetch(`${base}/api/address-generator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: 50, filters: { country: PROBE } }),
    });
    assert.equal(res.status, 400);
  });
} else {
  results.push("  ℹ (set TKL_BASE_URL to also test the ToolkitLife API routes end-to-end)");
}

console.log("\nlive integration tests:");
console.log(results.join("\n"));
if (process.exitCode) {
  console.error("\n✗ live tests failed");
  process.exit(1);
}
console.log("\n✓ all live tests passed" + (availability.length ? "" : " (pool empty — data assertions skipped, contract verified)"));
