// Standalone mock of the Address API contract for e2e smoke tests.
//   node scripts/mock-address-upstream.mjs [port]
// Implements the same fixtures as the inline mock in
// scripts/test-address-integration.mjs. NOT used in production.
import http from "node:http";

const TOKEN = "mock-token-123";
const port = Number(process.argv[2]) || 8790;

const bundleFor = (n) => ({
  address: {
    id: `pool-v2-addr-mock-${n}`,
    countryCode: "US",
    nativeAddress: `40${n} Mock Avenue Southwest, Seattle, WA, 9811${n}`,
    formattedAddress: `40${n} Mock Avenue Southwest, Seattle, WA, 9811${n}`,
    nativeLanguage: "en",
    addressVariants: { en: `40${n} Mock Avenue Southwest, Seattle, WA, 9811${n}` },
    components: {
      houseNumber: `40${n}`,
      street: "Mock Avenue Southwest",
      locality: "Seattle",
      admin1: "Washington",
      admin1Code: "WA",
      postcode: `9811${n}`,
    },
    coordinates: { latitude: 47.56 + n / 1000, longitude: -122.4 },
    addressStatus: "verified",
    propertyType: "residential",
    matchLevel: n % 2 === 0 ? "premise" : "street",
    verificationLevel: "L2",
    sourceUpdatedAt: "2026-09-01T00:00:00Z",
    verifiedAt: "2026-09-02T00:00:00Z",
    expiresAt: "2027-09-02T00:00:00Z",
    evidence: [
      {
        sourceId: "overture",
        sourceName: "Overture Maps",
        sourceUrl: "https://docs.overturemaps.org",
        sourceFamily: "overture",
        sourceLicense: "CDLA-Permissive 2.0",
        type: "address_existence",
        value: "yes",
        observedAt: "2026-09-01T00:00:00Z",
      },
    ],
    exclusionFlags: [],
  },
  profile: { fullName: "Jane Doe", email: "jane@outlook.com", phone: "+1 555 000 0000" },
  card: { network: "Visa", number: "4111 1111 1111 1111", cvc: "123", testDataOnly: true },
  extensions: { job: { title: "Engineer" } },
  googleMaps: { status: "map_query", embedUrl: "https://maps.google.com" },
});

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://mock");
  const json = (status, body) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
  };
  if ((req.headers.authorization ?? "") !== `Bearer ${TOKEN}`) {
    return json(401, { error: { code: "UNAUTHORIZED", message: "bad token" } });
  }
  if (url.pathname === "/api/v1/availability") {
    return json(200, {
      data: [
        { code: "US", available: true, residentialAvailable: true },
        { code: "CN", available: true, residentialAvailable: true },
        { code: "DE", available: true, residentialAvailable: false },
      ],
    });
  }
  if (url.pathname === "/api/v1/locations/search") {
    const field = url.searchParams.get("field");
    const options =
      field === "region"
        ? [{ value: "Washington", label: "Washington", id: "loc-region-wa", availableCount: 3 }]
        : field === "city"
          ? [{ value: "Seattle", label: "Seattle", id: "loc-city-sea", regionId: "loc-region-wa", availableCount: 3 }]
          : [];
    return json(200, {
      data: {
        regions: field === "region" ? options : [],
        cities: field === "city" ? options : [],
        districts: [],
        postcodes: [],
        matches: options,
      },
    });
  }
  if (url.pathname === "/api/v1/generate") {
    return json(200, { data: { requestId: "r1", country: "US", residential: true, filterMatchLevel: "exact", result: bundleFor(1) } });
  }
  if (url.pathname === "/api/v1/generate/batch") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const payload = JSON.parse(body);
      const count = Math.min(payload.count, 3);
      json(200, {
        data: {
          requestId: "rb",
          requestedCount: payload.count,
          returnedCount: count,
          unique: true,
          exhausted: count < payload.count,
          filters: payload.filters,
          results: Array.from({ length: count }, (_, i) => bundleFor(i + 1)),
        },
      });
    });
    return;
  }
  if (url.pathname === "/api/v1/address-translation") {
    return json(200, { data: { unavailable: true } });
  }
  json(404, { error: { code: "NOT_FOUND" } });
});

server.listen(port, "127.0.0.1", () => console.log(`mock address upstream on http://127.0.0.1:${port}`));
