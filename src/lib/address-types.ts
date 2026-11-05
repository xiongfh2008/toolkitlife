/**
 * Types for the real-address integration with the self-hosted Address API
 * (https://github.com/daimon3332/address, docs/API.zh-CN.md).
 *
 * Only the fields ToolkitLife actually consumes are typed here. The upstream
 * response also carries synthetic profile / payment-card / extensions data
 * which this integration deliberately never surfaces to clients.
 */

/** Result of GET /api/v1/availability */
export interface AddressAvailabilityCountry {
  /** ISO 3166-1 alpha-2 code, e.g. "US" */
  code: string;
  available: true;
  residentialAvailable: boolean;
}

/** One option from GET /api/v1/locations/search (official LocationOption shape) */
export interface AddressLocationOption {
  value: string;
  label: string;
  availableCount?: number;
  disabled?: boolean;
  id?: string;
  parentId?: string;
  parentValue?: string;
  parentLabel?: string;
  regionId?: string;
  regionValue?: string;
  regionLabel?: string;
  native?: string;
  en?: string;
  zhCN?: string;
}

export type AddressField = "region" | "city" | "district" | "postcode";

export interface AddressLocationsResponse {
  options: AddressLocationOption[];
  nextCursor?: string;
}

export type AddressMatchLevel = "street" | "premise" | "subpremise";
export type AddressPropertyType = "residential" | "unknown";

/** Data-source evidence attached to a real address (official AddressEvidence) */
export interface AddressEvidence {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  sourceFamily: string;
  sourceLicense?: string;
  sourceLicenseUrl?: string;
  attribution?: string;
  attributionUrl?: string;
  type: "address_existence" | "residential_use" | "coordinate" | "building_status";
  value: string;
  observedAt: string;
}

export interface AddressComponents {
  houseNumber?: string;
  buildingName?: string;
  unit?: string;
  street?: string;
  locality?: string;
  district?: string;
  admin1?: string;
  admin1Code?: string;
  postcode?: string;
}

/** The client-facing projection of an upstream GeneratedBundle.address */
export interface RealAddress {
  /** Stable pool address id (usable with POST /address-translation) */
  id: string;
  countryCode: string;
  formattedAddress: string;
  nativeAddress: string;
  nativeLanguage: string;
  variants: {
    native: string;
    en?: string;
    zhCN?: string;
  };
  components: AddressComponents;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  matchLevel: AddressMatchLevel;
  propertyType: AddressPropertyType;
  /** Deduplicated source list for display (source name / url / license) */
  sources: Array<{
    sourceName: string;
    sourceUrl?: string;
    sourceLicense?: string;
    attributionUrl?: string;
  }>;
  generatedAt: string;
}

export interface RealGenerateResult {
  returnedCount: number;
  requestedCount: number;
  exhausted: boolean;
  results: RealAddress[];
}

export interface RealGenerateFilters {
  country: string;
  regionId?: string;
  cityId?: string;
  districtId?: string;
  postcodeId?: string;
  region?: string;
  city?: string;
  district?: string;
  postcode?: string;
  residential?: boolean;
}

/** POST body accepted by /api/address-generator */
export interface AddressGenerateRequest {
  count: number;
  filters: RealGenerateFilters;
  /** Optional display translation, e.g. "en" | "zh-CN" | "ja" … */
  displayLocale?: string;
}

/** Machine-readable error codes returned by the ToolkitLife adapter routes */
export type AddressAdapterErrorCode =
  | "REAL_MODE_DISABLED" // ADDRESS_REAL_ENABLED not turned on
  | "UPSTREAM_UNAVAILABLE" // upstream timeout / 5xx / DNS
  | "UPSTREAM_AUTH" // upstream rejected our token (details never exposed)
  | "RATE_LIMITED" // ToolkitLife-side or upstream rate limit
  | "NO_COVERAGE" // upstream NO_POOL_COVERAGE
  | "INVALID_COUNTRY"
  | "INVALID_LOCATION"
  | "INVALID_REQUEST"
  | "INVALID_DISPLAY_LOCALE";
