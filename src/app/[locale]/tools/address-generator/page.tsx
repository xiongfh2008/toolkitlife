"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface AddressData {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: string;
  longitude: string;
  full: string;
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
  const coords = includeCoords
    ? ` (${a.latitude}, ${a.longitude})`
    : "";
  return `${a.street}, ${a.city}, ${a.state}, ${a.zip}, ${a.country}${coords}`;
}

export default function AddressGeneratorPage() {
  const t = useTranslations("tools.address-generator");
  const [locale, setLocale] = useState("en_US");
  const [count, setCount] = useState(5);
  const [includeCoords, setIncludeCoords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [error, setError] = useState("");
  const [copiedIdx, setCopiedIdx] = useState(-1);
  const [copiedAll, setCopiedAll] = useState(false);

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
      const rows: AddressData[] = [];
      for (let i = 0; i < count; i++) {
        const row: AddressData = {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state?.() ?? "",
          zip: faker.location.zipCode(),
          country: COUNTRIES.find((c) => c.locale === locale)?.name ?? faker.location.country(),
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
          full: "",
        };
        row.full = buildFull(row, includeCoords);
        rows.push(row);
      }
      setAddresses(rows);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setLoading(false);
    }
  }, [locale, count, includeCoords, t]);

  const copyOne = useCallback(
    async (idx: number, text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(-1), 1200);
      } catch {
        setError(t("errors.copyFailed"));
      }
    },
    [t]
  );

  const allText = useMemo(
    () => addresses.map((a) => a.full).join("\n\n"),
    [addresses]
  );

  const copyAll = useCallback(async () => {
    if (!allText) return;
    try {
      await navigator.clipboard.writeText(allText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1200);
    } catch {
      setError(t("errors.copyFailed"));
    }
  }, [allText, t]);

  const download = useCallback(
    (type: "txt" | "csv") => {
      if (addresses.length === 0) return;
      let content = "";
      let filename = `addresses.${type}`;
      if (type === "csv") {
        content =
          "street,city,state,zip,country,latitude,longitude\n" +
          addresses
            .map((a) =>
              [a.street, a.city, a.state, a.zip, a.country, a.latitude, a.longitude]
                .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                .join(",")
            )
            .join("\n");
        filename = `addresses-${locale}.csv`;
      } else {
        content = allText;
        filename = `addresses-${locale}.txt`;
      }
      const blob = new Blob(["\uFEFF" + content], {
        type: type === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8",
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    },
    [addresses, allText, locale]
  );

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="address-generator"
    >
      <div className="space-y-4">
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 space-y-4">
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

          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">{error}</div>
          )}
        </div>

        {addresses.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {addresses.map((a, i) => (
              <div
                key={i}
                className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1">
                  <p className="text-sm text-zinc-200 leading-relaxed">{a.full}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-zinc-500">
                    <span>{t("labels.city")}: {a.city}</span>
                    <span>{t("labels.zip")}: {a.zip}</span>
                    {includeCoords && (
                      <span>
                        {a.latitude}, {a.longitude}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => copyOne(i, a.full)}
                  className={`${btn} self-start ${copiedIdx === i ? "bg-green-600 text-white" : "bg-zinc-700 hover:bg-zinc-600 text-zinc-200"}`}
                >
                  {copiedIdx === i ? t("labels.copied") : t("labels.copy")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
