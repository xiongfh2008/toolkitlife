"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import { CITY_ANCHORS } from "@/data/address-cities";
import { buildCsv, downloadBlob } from "@/lib/csv";
import type {
  AddressAvailabilityCountry,
  AddressLocationOption,
  RealAddress,
} from "@/lib/address-types";

interface AddressData {
  street: string;
  city: string;
  region: string;
  zip: string;
  country: string;
  latitude: string;
  longitude: string;
}

interface CountryOption {
  locale: string;
  flag: string;
  name: string;
}

const COUNTRIES: CountryOption[] = [
  { locale: "zh_CN", flag: "🇨🇳", name: "China" },
  { locale: "en_US", flag: "🇺🇸", name: "United States" },
  { locale: "en_GB", flag: "🇬🇧", name: "United Kingdom" },
  { locale: "zh_TW", flag: "🇹🇼", name: "Taiwan" },
  { locale: "ja", flag: "🇯🇵", name: "Japan" },
  { locale: "ko", flag: "🇰🇷", name: "South Korea" },
  { locale: "de", flag: "🇩🇪", name: "Germany" },
  { locale: "fr", flag: "🇫🇷", name: "France" },
  { locale: "es", flag: "🇪🇸", name: "Spain" },
  { locale: "it", flag: "🇮🇹", name: "Italy" },
  { locale: "ru", flag: "🇷🇺", name: "Russia" },
  { locale: "pt_BR", flag: "🇧🇷", name: "Brazil" },
  { locale: "nl", flag: "🇳🇱", name: "Netherlands" },
  { locale: "en_AU", flag: "🇦🇺", name: "Australia" },
  { locale: "en_CA", flag: "🇨🇦", name: "Canada" },
  { locale: "en_IN", flag: "🇮🇳", name: "India" },
  { locale: "es_MX", flag: "🇲🇽", name: "Mexico" },
  { locale: "tr", flag: "🇹🇷", name: "Türkiye" },
  { locale: "ar", flag: "🇦🇪", name: "UAE / Arabic" },
  { locale: "vi", flag: "🇻🇳", name: "Vietnam" },
  { locale: "th", flag: "🇹🇭", name: "Thailand" },
  { locale: "id_ID", flag: "🇮🇩", name: "Indonesia" },
  { locale: "pl", flag: "🇵🇱", name: "Poland" },
  { locale: "sv", flag: "🇸🇪", name: "Sweden" },
];

/** 静态导入映射，让打包器可分析动态加载路径 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LOCALE_LOADERS: Record<string, () => Promise<any>> = {
  zh_CN: () => import("@faker-js/faker/locale/zh_CN"),
  en_US: () => import("@faker-js/faker/locale/en_US"),
  en_GB: () => import("@faker-js/faker/locale/en_GB"),
  zh_TW: () => import("@faker-js/faker/locale/zh_TW"),
  ja: () => import("@faker-js/faker/locale/ja"),
  ko: () => import("@faker-js/faker/locale/ko"),
  de: () => import("@faker-js/faker/locale/de"),
  fr: () => import("@faker-js/faker/locale/fr"),
  es: () => import("@faker-js/faker/locale/es"),
  it: () => import("@faker-js/faker/locale/it"),
  ru: () => import("@faker-js/faker/locale/ru"),
  pt_BR: () => import("@faker-js/faker/locale/pt_BR"),
  nl: () => import("@faker-js/faker/locale/nl"),
  en_AU: () => import("@faker-js/faker/locale/en_AU"),
  en_CA: () => import("@faker-js/faker/locale/en_CA"),
  en_IN: () => import("@faker-js/faker/locale/en_IN"),
  es_MX: () => import("@faker-js/faker/locale/es_MX"),
  tr: () => import("@faker-js/faker/locale/tr"),
  ar: () => import("@faker-js/faker/locale/ar"),
  vi: () => import("@faker-js/faker/locale/vi"),
  th: () => import("@faker-js/faker/locale/th"),
  id_ID: () => import("@faker-js/faker/locale/id_ID"),
  pl: () => import("@faker-js/faker/locale/pl"),
  sv: () => import("@faker-js/faker/locale/sv"),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fakerCache: Record<string, any> = {};

function buildFull(a: AddressData, includeCoords: boolean): string {
  const coords = includeCoords ? ` (${a.latitude}, ${a.longitude})` : "";
  const region = a.region ? `${a.region}, ` : "";
  // Missing fields stay out of the formatted line — never invent values.
  const zip = a.zip ? `${a.zip}, ` : "";
  return `${a.street}, ${a.city}, ${region}${zip}${a.country}${coords}`;
}

/* --------------------------- real-mode helpers ----------------------------- */

function flagOf(code: string): string {
  if (!/^[A-Z]{2}$/.test(code)) return "🏳️";
  return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)));
}

function countryName(code: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale, "en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

const DISPLAY_LOCALES: Array<{ value: string; label: string }> = [
  { value: "en", label: "English" },
  { value: "zh-CN", label: "简体中文" },
  { value: "zh-TW", label: "繁體中文" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "pt", label: "Português" },
];

/** Map adapter error codes to localized message keys (never raw upstream text). */
function realErrorKey(code: string): string {
  switch (code) {
    case "RATE_LIMITED":
      return "errors.rateLimited";
    case "NO_COVERAGE":
      return "errors.noCoverage";
    case "INVALID_COUNTRY":
    case "INVALID_LOCATION":
    case "INVALID_REQUEST":
    case "INVALID_DISPLAY_LOCALE":
      return "errors.invalidRequest";
    default:
      // UPSTREAM_UNAVAILABLE / UPSTREAM_AUTH / REAL_MODE_DISABLED
      return "errors.realUnavailable";
  }
}

export default function AddressGeneratorPage() {
  const t = useTranslations("tools.address-generator");
  const siteLocale = useLocale();

  /* ------------------------------ shared state ------------------------------ */
  const [copiedIdx, setCopiedIdx] = useState(-1);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyOne = useCallback(
    async (idx: number, text: string, onError?: () => void) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(-1), 1200);
      } catch {
        onError?.();
      }
    },
    []
  );

  const copyAllText = useCallback(async (text: string, onError: () => void) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1200);
    } catch {
      onError();
    }
  }, []);

  /* ----------------------------- simulated mode ----------------------------- */
  const [mode, setMode] = useState<"simulated" | "real">("simulated");
  const [locale, setLocale] = useState("en_US");
  const [count, setCount] = useState(5);
  const [includeCoords, setIncludeCoords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [error, setError] = useState("");

  const availability = useAvailability();

  const generate = useCallback(async () => {
    setError("");
    setCopiedIdx(-1);
    setCopiedAll(false);
    setLoading(true);
    try {
      const loader = LOCALE_LOADERS[locale];
      if (!loader) throw new Error("no-locale");
      if (!fakerCache[locale]) {
        const mod = await loader();
        // v10 的 locale 子路径模块只导出命名导出 faker（无 default），两者都兼容
        fakerCache[locale] = mod.default ?? mod.faker;
      }
      const faker = fakerCache[locale];
      const anchors = CITY_ANCHORS[locale] ?? [];
      if (anchors.length === 0) throw new Error("no-anchors");
      const rows: AddressData[] = [];
      for (let i = 0; i < count; i++) {
        // 城市锚点保证 城市/州省/邮编/坐标 内部一致；街道名仍由 faker 虚构
        const anchor = anchors[Math.floor(Math.random() * anchors.length)];
        const zip = anchor.zips[Math.floor(Math.random() * anchor.zips.length)];
        // ±0.05°（约 5km）抖动：坐标只表示大致区域，不是精确门牌位置
        const jitter = () => (Math.random() - 0.5) * 0.1;
        rows.push({
          street: faker.location.streetAddress(),
          city: anchor.city,
          region: anchor.region,
          zip,
          country: COUNTRIES.find((c) => c.locale === locale)?.name ?? "",
          latitude: (anchor.lat + jitter()).toFixed(4),
          longitude: (anchor.lng + jitter()).toFixed(4),
        });
      }
      setAddresses(rows);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setLoading(false);
    }
  }, [locale, count, t]);

  // The coords toggle re-applies instantly: display, copy and export always
  // derive from the same buildFull(includeCoords) so they can never disagree.
  const allText = useMemo(
    () => addresses.map((a) => buildFull(a, includeCoords)).join("\n\n"),
    [addresses, includeCoords]
  );

  const download = useCallback(
    (type: "txt" | "csv") => {
      if (addresses.length === 0) return;
      let content = "";
      let filename = `addresses.${type}`;
      if (type === "csv") {
        content = buildCsv(
          ["street", "city", "region", "zip", "country", "latitude", "longitude"],
          addresses.map((a) => [a.street, a.city, a.region, a.zip, a.country, a.latitude, a.longitude])
        );
        filename = `addresses-${locale}.csv`;
      } else {
        content = allText;
        filename = `addresses-${locale}.txt`;
      }
      downloadBlob(content, filename, type === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8");
    },
    [addresses, allText, locale]
  );

  /* ------------------------------- real mode -------------------------------- */
  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="address-generator"
    >
      <RealModeSection
        t={t}
        siteLocale={siteLocale}
        availability={availability}
        mode={mode}
        setMode={setMode}
        active={mode === "real"}
        onCopyOne={copyOne}
        copiedIdx={copiedIdx}
        copiedAll={copiedAll}
        onCopyAll={copyAllText}
      />
      {mode === "simulated" || !availability?.enabled ? (
        <SimulatedSection
          t={t}
          locale={locale}
          setLocale={setLocale}
          count={count}
          setCount={setCount}
          includeCoords={includeCoords}
          setIncludeCoords={setIncludeCoords}
          loading={loading}
          addresses={addresses}
          error={error}
          onCopyError={() => setError(t("errors.copyFailed"))}
          generate={generate}
          allText={allText}
          copyOne={copyOne}
          copiedIdx={copiedIdx}
          copiedAll={copiedAll}
          copyAll={() => copyAllText(allText, () => setError(t("errors.copyFailed")))}
          download={download}
        />
      ) : null}
    </ToolLayout>
  );
}

/* ------------------------- availability hook -------------------------------- */

function useAvailability(): { enabled: boolean; countries: AddressAvailabilityCountry[] } | null {
  const [availability, setAvailability] = useState<{
    enabled: boolean;
    countries: AddressAvailabilityCountry[];
  } | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/address-generator/availability", {
          signal: AbortSignal.timeout(15_000),
        });
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok || !data || data.error) {
          // Service misconfigured or unavailable → simulated mode only.
          setAvailability({ enabled: false, countries: [] });
          return;
        }
        setAvailability({
          enabled: data.enabled === true && Array.isArray(data.countries) && data.countries.length > 0,
          countries: Array.isArray(data.countries) ? data.countries : [],
        });
      } catch {
        if (!cancelled) setAvailability({ enabled: false, countries: [] });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return availability;
}

/* --------------------------- simulated section ------------------------------ */

function SimulatedSection(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  locale: string;
  setLocale: (v: string) => void;
  count: number;
  setCount: (v: number) => void;
  includeCoords: boolean;
  setIncludeCoords: (v: boolean) => void;
  loading: boolean;
  addresses: AddressData[];
  error: string;
  onCopyError: () => void;
  generate: () => void;
  allText: string;
  copyOne: (idx: number, text: string, onError?: () => void) => void;
  copiedIdx: number;
  copiedAll: boolean;
  copyAll: () => void;
  download: (type: "txt" | "csv") => void;
}) {
  const { t, locale, setLocale, count, setCount, includeCoords, setIncludeCoords, loading, addresses, error, onCopyError, generate, copyOne, copiedIdx, copiedAll, copyAll, download } = props;
  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">{error}</div>
      )}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 space-y-4">
        <p className="text-xs text-amber-300/90 bg-amber-950/30 border border-amber-800/40 rounded-lg px-3 py-2">
          {t("labels.modeSimulatedHint")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">{t("labels.country")}</label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500 transition-colors"
            >
              {COUNTRIES.map((c) => (
                <option key={c.locale} value={c.locale}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">{t("labels.count")}</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500 transition-colors"
            >
              {[1, 2, 3, 5, 8, 10, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeCoords}
            onChange={(e) => setIncludeCoords(e.target.checked)}
            className="rounded border-zinc-600 bg-zinc-900 accent-blue-500"
          />
          {t("labels.coords")}
        </label>
        {includeCoords && (
          <p className="text-xs text-zinc-500">{t("labels.coordsNote")}</p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={generate}
            disabled={loading}
            className={`${btn} bg-blue-600 hover:bg-blue-500 text-white px-6`}
          >
            {loading ? t("labels.generating") : t("labels.generate")}
          </button>
          {addresses.length > 0 && (
            <>
              <button
                onClick={copyAll}
                className={`${btn} ${copiedAll ? "bg-green-600 text-white" : "bg-zinc-700 hover:bg-zinc-600 text-zinc-200"}`}
              >
                {copiedAll ? t("labels.copied") : t("labels.copyAll")}
              </button>
              <button
                onClick={() => download("txt")}
                className={`${btn} bg-zinc-700 hover:bg-zinc-600 text-zinc-200`}
              >
                {t("labels.downloadTxt")}
              </button>
              <button
                onClick={() => download("csv")}
                className={`${btn} bg-zinc-700 hover:bg-zinc-600 text-zinc-200`}
              >
                CSV
              </button>
            </>
          )}
        </div>
      </div>

      {addresses.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((a, i) => (
            <div
              key={i}
              className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 flex flex-col justify-between gap-3"
            >
              <div className="space-y-1">
                <p className="text-sm text-zinc-200 leading-relaxed">{buildFull(a, includeCoords)}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-zinc-500">
                  <span>{t("labels.city")}: {a.city}</span>
                  <span>{t("labels.region")}: {a.region}</span>
                  {a.zip ? (
                    <span>{t("labels.zip")}: {a.zip}</span>
                  ) : (
                    <span>{t("labels.zip")}: {t("labels.notProvided")}</span>
                  )}
                  {includeCoords && (
                    <span>
                      {a.latitude}, {a.longitude}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => copyOne(i, buildFull(a, includeCoords), onCopyError)}
                className={`${btn} self-start ${copiedIdx === i ? "bg-green-600 text-white" : "bg-zinc-700 hover:bg-zinc-600 text-zinc-200"}`}
              >
                {copiedIdx === i ? t("labels.copied") : t("labels.copy")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- real section --------------------------------- */

function RealModeSection(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  siteLocale: string;
  availability: { enabled: boolean; countries: AddressAvailabilityCountry[] } | null;
  mode: "simulated" | "real";
  setMode: (m: "simulated" | "real") => void;
  active: boolean;
  onCopyOne: (idx: number, text: string, onError?: () => void) => void;
  copiedIdx: number;
  copiedAll: boolean;
  onCopyAll: (text: string, onError: () => void) => void;
}) {
  const { t, siteLocale, availability, mode, setMode, active } = props;
  const showToggle = availability?.enabled === true;

  const [country, setCountry] = useState("");
  const [regionSel, setRegionSel] = useState<AddressLocationOption | null>(null);
  const [citySel, setCitySel] = useState<AddressLocationOption | null>(null);
  const [districtSel, setDistrictSel] = useState<AddressLocationOption | null>(null);
  const [postcodeSel, setPostcodeSel] = useState<AddressLocationOption | null>(null);
  const [residential, setResidential] = useState(false);
  const [displayLocale, setDisplayLocale] = useState("");
  const [count, setCount] = useState(5);
  // Fetched option lists are stored together with the dependency tuple they
  // were fetched for; the render derives emptiness from staleness instead of
  // clearing state synchronously inside effects.
  const [regionsData, setRegionsData] = useState<{
    forCountry: string; residential: boolean; options: AddressLocationOption[];
  } | null>(null);
  const [citiesData, setCitiesData] = useState<{
    forRegion: string; residential: boolean; options: AddressLocationOption[];
  } | null>(null);
  const [detailData, setDetailData] = useState<{
    forCity: string; residential: boolean; districts: AddressLocationOption[];
    postcodes: AddressLocationOption[];
  } | null>(null);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RealAddress[]>([]);
  const [error, setError] = useState("");
  const [exhaustedNote, setExhaustedNote] = useState(false);

  const selectedCountry = availability?.countries.find((c) => c.code === country);

  // Fetch option lists from ToolkitLife's own API. Effects only fetch — the
  // derived option lists below hide stale data by key match.
  useEffect(() => {
    if (!active || !country) return;
    let cancelled = false;
    (async () => {
      setOptionsLoading(true);
      try {
        const opts = await loadOptionList(country, 'region', {}, String(residential));
        if (!cancelled) setRegionsData({ forCountry: country, residential, options: opts });
      } catch {
        if (!cancelled) setError(t('errors.optionsUnavailable'));
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, country, residential]);

  useEffect(() => {
    if (!active || !country || !regionSel) return;
    let cancelled = false;
    const forRegion = regionSel.id ?? regionSel.value;
    (async () => {
      setOptionsLoading(true);
      try {
        const opts = await loadOptionList(country, 'city', { regionId: forRegion }, String(residential));
        if (!cancelled) setCitiesData({ forRegion, residential, options: opts });
      } catch {
        if (!cancelled) setError(t('errors.optionsUnavailable'));
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, country, regionSel, residential]);

  useEffect(() => {
    if (!active || !country || !citySel) return;
    let cancelled = false;
    const forCity = citySel.id ?? citySel.value;
    (async () => {
      setOptionsLoading(true);
      try {
        const [districts, postcodes] = await Promise.all([
          loadOptionList(country, 'district', { regionId: regionSel?.id ?? regionSel?.value, cityId: forCity }, String(residential)),
          loadOptionList(country, 'postcode', { regionId: regionSel?.id ?? regionSel?.value, cityId: forCity }, String(residential)),
        ]);
        if (!cancelled) setDetailData({ forCity, residential, districts, postcodes });
      } catch {
        if (!cancelled) setError(t('errors.optionsUnavailable'));
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, country, citySel, regionSel, residential]);

  // Derived (staleness-aware) option lists.
  const options = {
    regions:
      regionsData && regionsData.forCountry === country && regionsData.residential === residential
        ? regionsData.options
        : [],
    cities:
      citiesData && regionSel && citiesData.forRegion === (regionSel.id ?? regionSel.value) && citiesData.residential === residential
        ? citiesData.options
        : [],
    districts:
      detailData && citySel && detailData.forCity === (citySel.id ?? citySel.value) && detailData.residential === residential
        ? detailData.districts
        : [],
    postcodes:
      detailData && citySel && detailData.forCity === (citySel.id ?? citySel.value) && detailData.residential === residential
        ? detailData.postcodes
        : [],
  };

  // Reset downstream filters when an upstream filter changes.
  const changeCountry = (code: string) => {
    setCountry(code);
    setRegionSel(null);
    setCitySel(null);
    setDistrictSel(null);
    setPostcodeSel(null);
    setResidential(false);
    setError("");
    setExhaustedNote(false);
  };
  const changeRegion = (opt: AddressLocationOption | null) => {
    setRegionSel(opt);
    setCitySel(null);
    setDistrictSel(null);
    setPostcodeSel(null);
    setError("");
    setExhaustedNote(false);
  };
  const changeCity = (opt: AddressLocationOption | null) => {
    setCitySel(opt);
    setDistrictSel(null);
    setPostcodeSel(null);
    setError("");
    setExhaustedNote(false);
  };

  const generateReal = useCallback(async () => {
    setError("");
    setExhaustedNote(false);
    setLoading(true);
    try {
      const filters: Record<string, unknown> = { country };
      if (regionSel?.id || regionSel?.value) filters.regionId = regionSel.id ?? regionSel.value;
      if (citySel?.id || citySel?.value) filters.cityId = citySel.id ?? citySel.value;
      if (districtSel?.id || districtSel?.value) filters.districtId = districtSel.id ?? districtSel.value;
      if (postcodeSel?.id || postcodeSel?.value) filters.postcodeId = postcodeSel.id ?? postcodeSel.value;
      if (residential) filters.residential = true;
      const res = await fetch("/api/address-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          count,
          filters,
          ...(displayLocale ? { displayLocale } : {}),
        }),
        signal: AbortSignal.timeout(30_000),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.error) {
        setError(t(realErrorKey(data?.error ?? "UPSTREAM_UNAVAILABLE")));
        return; // keep existing filters and previous results
      }
      setResults(data.results ?? []);
      setExhaustedNote(data.exhausted === true);
    } catch {
      setError(t("errors.realUnavailable"));
    } finally {
      setLoading(false);
    }
  }, [country, regionSel, citySel, districtSel, postcodeSel, residential, displayLocale, count, t]);

  const allRealText = useMemo(
    () => results.map((r) => r.formattedAddress).join("\n\n"),
    [results]
  );

  const downloadReal = useCallback(
    (type: "txt" | "csv") => {
      if (results.length === 0) return;
      let content = "";
      let filename = "";
      if (type === "csv") {
        content = buildCsv(
          ["formatted_address", "native_address", "street", "city", "district", "region", "postcode", "country", "latitude", "longitude", "match_level", "property_type", "source"],
          results.map((r) => [
            r.formattedAddress,
            r.nativeAddress,
            r.components.street ?? "",
            r.components.locality ?? "",
            r.components.district ?? "",
            r.components.admin1 ?? "",
            r.components.postcode ?? "",
            r.countryCode,
            r.coordinates ? String(r.coordinates.latitude) : "",
            r.coordinates ? String(r.coordinates.longitude) : "",
            r.matchLevel,
            r.propertyType,
            r.sources.map((s) => s.sourceName).join("; "),
          ])
        );
        filename = `real-addresses-${country.toLowerCase()}.csv`;
      } else {
        content = allRealText;
        filename = `real-addresses-${country.toLowerCase()}.txt`;
      }
      downloadBlob(content, filename, type === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8");
    },
    [results, allRealText, country]
  );

  if (!showToggle) return null;

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const selectCls =
    "w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500 transition-colors disabled:opacity-50";

  return (
    <div className="space-y-4 mb-6">
      {/* Mode toggle */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 space-y-1">
        <label className="block text-sm text-zinc-300 mb-2">{t("labels.mode")}</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode("simulated")}
            className={`${btn} ${mode === "simulated" ? "bg-blue-600 text-white" : "bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-zinc-500"}`}
          >
            🎲 {t("labels.modeSimulated")}
          </button>
          <button
            onClick={() => setMode("real")}
            className={`${btn} ${mode === "real" ? "bg-blue-600 text-white" : "bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-zinc-500"}`}
          >
            🌍 {t("labels.modeReal")}
          </button>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          {mode === "real" ? t("labels.modeRealHint") : t("labels.modeSimulatedHint")}
        </p>
      </div>

      {active && (
        <>
          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">{error}</div>
          )}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">{t("labels.country")}</label>
                <select
                  value={country}
                  onChange={(e) => changeCountry(e.target.value)}
                  className={selectCls}
                >
                  <option value="">—</option>
                  {(availability?.countries ?? []).map((c) => (
                    <option key={c.code} value={c.code}>
                      {flagOf(c.code)} {countryName(c.code, siteLocale)}
                    </option>
                  ))}
                </select>
              </div>

              {options.regions.length > 0 && (
                <div>
                  <label className="block text-sm text-zinc-300 mb-1.5">{t("labels.region")}</label>
                  <select
                    value={regionSel ? (regionSel.id ?? regionSel.value) : ""}
                    onChange={(e) => {
                      const opt = options.regions.find((o) => (o.id ?? o.value) === e.target.value) ?? null;
                      changeRegion(opt);
                    }}
                    className={selectCls}
                    disabled={optionsLoading}
                  >
                    <option value="">—</option>
                    {options.regions.map((o) => (
                      <option key={o.id ?? o.value} value={o.id ?? o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {options.cities.length > 0 && (
                <div>
                  <label className="block text-sm text-zinc-300 mb-1.5">{t("labels.city")}</label>
                  <select
                    value={citySel ? (citySel.id ?? citySel.value) : ""}
                    onChange={(e) => {
                      const opt = options.cities.find((o) => (o.id ?? o.value) === e.target.value) ?? null;
                      changeCity(opt);
                    }}
                    className={selectCls}
                    disabled={optionsLoading}
                  >
                    <option value="">—</option>
                    {options.cities.map((o) => (
                      <option key={o.id ?? o.value} value={o.id ?? o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {options.districts.length > 0 && (
                <div>
                  <label className="block text-sm text-zinc-300 mb-1.5">{t("labels.district")}</label>
                  <select
                    value={districtSel ? (districtSel.id ?? districtSel.value) : ""}
                    onChange={(e) => {
                      const opt = options.districts.find((o) => (o.id ?? o.value) === e.target.value) ?? null;
                      setDistrictSel(opt);
                      setError("");
                    }}
                    className={selectCls}
                    disabled={optionsLoading}
                  >
                    <option value="">—</option>
                    {options.districts.map((o) => (
                      <option key={o.id ?? o.value} value={o.id ?? o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {options.postcodes.length > 0 && (
                <div>
                  <label className="block text-sm text-zinc-300 mb-1.5">{t("labels.postcode")}</label>
                  <select
                    value={postcodeSel ? (postcodeSel.id ?? postcodeSel.value) : ""}
                    onChange={(e) => {
                      const opt = options.postcodes.find((o) => (o.id ?? o.value) === e.target.value) ?? null;
                      setPostcodeSel(opt);
                      setError("");
                    }}
                    className={selectCls}
                    disabled={optionsLoading}
                  >
                    <option value="">—</option>
                    {options.postcodes.map((o) => (
                      <option key={o.id ?? o.value} value={o.id ?? o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">{t("labels.count")}</label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className={selectCls}
                >
                  {[1, 2, 3, 5, 8, 10, 15, 20].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">{t("labels.displayLanguage")}</label>
                <select
                  value={displayLocale}
                  onChange={(e) => setDisplayLocale(e.target.value)}
                  className={selectCls}
                >
                  <option value="">{t("labels.displayOriginal")}</option>
                  {DISPLAY_LOCALES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCountry?.residentialAvailable && (
              <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={residential}
                  onChange={(e) => {
                    setResidential(e.target.checked);
                    setError("");
                  }}
                  className="rounded border-zinc-600 bg-zinc-900 accent-blue-500"
                />
                {t("labels.residential")}
              </label>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={generateReal}
                disabled={loading || !country}
                className={`${btn} bg-blue-600 hover:bg-blue-500 text-white px-6`}
              >
                {loading ? t("labels.generating") : t("labels.generate")}
              </button>
              {results.length > 0 && (
                <>
                  <button
                    onClick={() => props.onCopyAll(allRealText, () => setError(t("errors.copyFailed")))}
                    className={`${btn} ${props.copiedAll ? "bg-green-600 text-white" : "bg-zinc-700 hover:bg-zinc-600 text-zinc-200"}`}
                  >
                    {props.copiedAll ? t("labels.copied") : t("labels.copyAll")}
                  </button>
                  <button
                    onClick={() => downloadReal("txt")}
                    className={`${btn} bg-zinc-700 hover:bg-zinc-600 text-zinc-200`}
                  >
                    {t("labels.downloadTxt")}
                  </button>
                  <button
                    onClick={() => downloadReal("csv")}
                    className={`${btn} bg-zinc-700 hover:bg-zinc-600 text-zinc-200`}
                  >
                    CSV
                  </button>
                </>
              )}
            </div>

            {exhaustedNote && results.length > 0 && (
              <div className="bg-amber-900/20 border border-amber-800/40 rounded-lg p-3 text-sm text-amber-200/90">
                {t("errors.exhausted")} ({results.length})
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((r, i) => (
                <div
                  key={`${r.id}:${i}`}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <p className="text-sm text-zinc-100 leading-relaxed font-medium">{r.formattedAddress}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-zinc-500">
                      <span>
                        {flagOf(r.countryCode)} {countryName(r.countryCode, siteLocale)}
                      </span>
                      {r.components.admin1 && <span>{r.components.admin1}</span>}
                      {r.components.locality && <span>{r.components.locality}</span>}
                      {r.components.district && <span>{r.components.district}</span>}
                      <span>
                        {t("labels.postcode")}: {r.components.postcode || t("labels.notProvided")}
                      </span>
                      {r.coordinates && (
                        <span>
                          {r.coordinates.latitude.toFixed(5)}, {r.coordinates.longitude.toFixed(5)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="rounded bg-zinc-900 border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-400">
                        {t("labels.precision")}:{" "}
                        {r.matchLevel === "premise"
                          ? t("labels.precisionPremise")
                          : r.matchLevel === "subpremise"
                            ? t("labels.precisionSubpremise")
                            : t("labels.precisionStreet")}
                      </span>
                      {r.propertyType === "residential" && (
                        <span className="rounded bg-green-900/40 border border-green-800/50 px-2 py-0.5 text-[11px] text-green-300">
                          {t("labels.residentialBadge")}
                        </span>
                      )}
                      {r.sources.slice(0, 2).map((s) => (
                        <span
                          key={s.sourceName}
                          className="rounded bg-zinc-900 border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-400"
                        >
                          {t("labels.source")}: {s.sourceName}
                          {s.sourceLicense ? ` (${s.sourceLicense})` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => props.onCopyOne(i, r.formattedAddress, () => setError(t("errors.copyFailed")))}
                    className={`${btn} self-start ${props.copiedIdx === i ? "bg-green-600 text-white" : "bg-zinc-700 hover:bg-zinc-600 text-zinc-200"}`}
                  >
                    {props.copiedIdx === i ? t("labels.copied") : t("labels.copy")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

async function loadOptionList(
  country: string,
  field: "region" | "city" | "district" | "postcode",
  params: { regionId?: string; cityId?: string },
  residential: string
): Promise<AddressLocationOption[]> {
  const qs = new URLSearchParams({ country, field, residential });
  if (params.regionId) qs.set("regionId", params.regionId);
  if (params.cityId) qs.set("cityId", params.cityId);
  const res = await fetch(`/api/address-generator/locations?${qs.toString()}`, {
    signal: AbortSignal.timeout(15_000),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data || data.error) return [];
  return Array.isArray(data.options) ? data.options : [];
}
