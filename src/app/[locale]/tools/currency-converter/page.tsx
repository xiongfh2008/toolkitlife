"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

interface Currency {
  code: string;
  symbol: string;
}

const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "CNY", symbol: "¥" },
  { code: "HKD", symbol: "HK$" },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
  { code: "CHF", symbol: "Fr" },
  { code: "KRW", symbol: "₩" },
  { code: "INR", symbol: "₹" },
  { code: "SGD", symbol: "S$" },
  { code: "NZD", symbol: "NZ$" },
  { code: "SEK", symbol: "kr" },
  { code: "NOK", symbol: "kr" },
  { code: "DKK", symbol: "kr" },
  { code: "PLN", symbol: "zł" },
  { code: "CZK", symbol: "Kč" },
  { code: "HUF", symbol: "Ft" },
  { code: "TRY", symbol: "₺" },
  { code: "BRL", symbol: "R$" },
  { code: "MXN", symbol: "MX$" },
  { code: "ZAR", symbol: "R" },
  { code: "AED", symbol: "د.إ" },
  { code: "SAR", symbol: "﷼" },
  { code: "THB", symbol: "฿" },
  { code: "MYR", symbol: "RM" },
  { code: "IDR", symbol: "Rp" },
  { code: "PHP", symbol: "₱" },
  { code: "VND", symbol: "₫" },
  { code: "RUB", symbol: "₽" },
  { code: "TWD", symbol: "NT$" },
  { code: "ILS", symbol: "₪" },
  { code: "CLP", symbol: "$" },
  { code: "COP", symbol: "$" },
  { code: "ARS", symbol: "$" },
  { code: "EGP", symbol: "E£" },
  { code: "NGN", symbol: "₦" },
  { code: "PKR", symbol: "₨" },
  { code: "BDT", symbol: "৳" },
  { code: "UAH", symbol: "₴" },
  { code: "KZT", symbol: "₸" },
];

/** Fallback rates (per 1 USD) — only used when every live API is unreachable. */
const STATIC_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 152, CNY: 7.15, HKD: 7.82,
  AUD: 1.53, CAD: 1.37, CHF: 0.88, KRW: 1340, INR: 84.5, SGD: 1.34,
  NZD: 1.66, SEK: 10.6, NOK: 10.9, DKK: 6.9, PLN: 4.0, CZK: 23.5,
  HUF: 365, TRY: 34, BRL: 5.6, MXN: 19.2, ZAR: 18.0, AED: 3.67,
  SAR: 3.75, THB: 34, MYR: 4.4, IDR: 15800, PHP: 58, VND: 25400,
  RUB: 92, TWD: 32.5, ILS: 3.7, CLP: 950, COP: 4200, ARS: 1000,
  EGP: 49, NGN: 1600, PKR: 278, BDT: 119, UAH: 41, KZT: 470,
};

/** Currencies highlighted in the cross-rates panel. */
const POPULAR = ["USD", "EUR", "GBP", "JPY", "CNY", "HKD", "KRW"];

type Source = "api" | "static";

interface LiveRates {
  rates: Record<string, number>;
  source: Source;
  date: string;
}

async function fetchRates(): Promise<LiveRates> {
  const endpoints: {
    url: string;
    pick: (j: Record<string, unknown>) => { rates?: Record<string, number>; date?: string };
  }[] = [
    {
      url: "https://open.er-api.com/v6/latest/USD",
      pick: (j) => ({
        rates: j.rates as Record<string, number> | undefined,
        date: j.time_last_update_utc as string | undefined,
      }),
    },
    {
      url: "https://api.frankfurter.app/latest?from=USD",
      pick: (j) => ({
        rates: j.rates as Record<string, number> | undefined,
        date: j.date as string | undefined,
      }),
    },
  ];
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url);
      if (!res.ok) continue;
      const j = (await res.json()) as Record<string, unknown>;
      const picked = ep.pick(j);
      if (
        picked.rates &&
        typeof picked.rates === "object" &&
        Object.keys(picked.rates).length > 0
      ) {
        return { rates: picked.rates, source: "api", date: picked.date ?? "" };
      }
    } catch {
      // try next endpoint
    }
  }
  return { rates: STATIC_RATES, source: "static", date: "" };
}

function formatMoney(n: number): string {
  if (!Number.isFinite(n)) return "–";
  if (n !== 0 && Math.abs(n) < 0.01) {
    return n.toLocaleString(undefined, { maximumSignificantDigits: 6 });
  }
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatRate(n: number): string {
  if (!Number.isFinite(n)) return "–";
  return n.toLocaleString(undefined, { maximumSignificantDigits: 6 });
}

export default function CurrencyConverterPage() {
  const t = useTranslations("tools.currency-converter");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const currencyNames = t.raw("currencies") as Record<string, string>;

  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [source, setSource] = useState<Source>("static");
  const [rateDate, setRateDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [amountStr, setAmountStr] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("CNY");

  useEffect(() => {
    let cancelled = false;
    fetchRates().then((r) => {
      if (cancelled) return;
      setRates(r.rates);
      setSource(r.source);
      setRateDate(r.date);
      setLoading(false);
      if (r.source === "static") setError(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const amount = useMemo(() => parseFloat(amountStr), [amountStr]);

  const result = useMemo(() => {
    if (!rates || !Number.isFinite(amount)) return null;
    const f = rates[from];
    const tRate = rates[to];
    if (!f || !tRate) return null;
    return (amount * tRate) / f;
  }, [rates, amount, from, to]);

  const unitRate = useMemo(() => {
    if (!rates) return null;
    const f = rates[from];
    const tRate = rates[to];
    if (!f || !tRate) return null;
    return tRate / f;
  }, [rates, from, to]);

  const swap = () => {
    const nextFrom = to;
    setTo(from);
    setFrom(nextFrom);
    if (result != null && Number.isFinite(result)) {
      setAmountStr(String(Number(result.toPrecision(10))));
    }
  };

  const popularRates = useMemo(() => {
    if (!rates) return [];
    const f = rates[from];
    if (!f) return [];
    return POPULAR.filter((c) => c !== from)
      .map((c) => ({ code: c, rate: rates[c] ? rates[c] / f : 0 }))
      .filter((r) => r.rate > 0);
  }, [rates, from]);

  const optionLabel = (c: Currency) => `${c.code} ${c.symbol} — ${currencyNames[c.code.toLowerCase()] ?? c.code}`;

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="currency-converter"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-lg border border-amber-800 bg-amber-900/20 p-3 text-sm text-amber-300">
            {t("labels.offline")}
          </div>
        )}

        {/* Converter card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.amount")}
              </label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-base text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.from")}
              </label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {optionLabel(c)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="my-4 flex items-center justify-center">
            <button
              onClick={swap}
              className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
              title={t("labels.swap")}
            >
              ⇅ {t("labels.swap")}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.to")}
              </label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {optionLabel(c)}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5">
              <div className="text-xs text-zinc-500">{t("labels.result")}</div>
              <div className="text-xl font-semibold text-zinc-100">
                {loading ? "…" : formatMoney(result ?? NaN)}
              </div>
              {unitRate != null && !loading && (
                <div className="mt-1 text-xs text-zinc-500">
                  1 {from} = {formatRate(unitRate)} {to}
                </div>
              )}
            </div>
          </div>

          {/* Rate metadata */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 ${
                source === "api"
                  ? "bg-emerald-900/40 text-emerald-400"
                  : "bg-amber-900/40 text-amber-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  source === "api" ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              {source === "api" ? t("labels.live") : t("labels.offline")}
            </span>
            {rateDate && (
              <span>
                {t("labels.lastUpdate")}: {rateDate}
              </span>
            )}
            {loading && <span>{t("labels.loading")}</span>}
          </div>
        </div>

        {/* Popular cross-rates */}
        {popularRates.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="mb-3 text-sm font-medium text-zinc-300">
              {t("labels.popularTitle", { currency: from })}
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {popularRates.map((r) => (
                <div
                  key={r.code}
                  className="rounded-lg border border-zinc-800 bg-zinc-800/40 px-3 py-2 text-center"
                >
                  <div className="text-xs text-zinc-500">{r.code}</div>
                  <div className="mt-0.5 text-sm font-medium text-zinc-100">
                    {formatRate(r.rate)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
