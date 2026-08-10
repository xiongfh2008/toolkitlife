"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function shortTermRate(income: number): number {
  const brackets = [11925, 48475, 103350, 197300, 250525, 626350];
  const rates = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];
  let i = 0;
  while (i < brackets.length && income > brackets[i]) i++;
  return rates[i];
}

function longTermRate(income: number): number {
  if (income <= 48350) return 0;
  if (income <= 533400) return 0.15;
  return 0.2;
}

export default function CapitalGainsTaxCalculatorPage() {
  const t = useTranslations("tools.capital-gains-tax-calculator");
  const [costBasis, setCostBasis] = useState("10000");
  const [salePrice, setSalePrice] = useState("15000");
  const [holdingYears, setHoldingYears] = useState("2");
  const [taxableIncome, setTaxableIncome] = useState("75000");

  const result = useMemo(() => {
    const basis = parseFloat(costBasis);
    const sale = parseFloat(salePrice);
    const years = parseFloat(holdingYears);
    const income = parseFloat(taxableIncome);
    if ([basis, sale, years, income].some((v) => Number.isNaN(v))) return null;

    const gain = sale - basis;
    const isLongTerm = years > 1;
    const rate = isLongTerm ? longTermRate(income) : shortTermRate(income);
    const tax = Math.max(0, gain) * rate;
    return { gain, tax, rate, isLongTerm };
  }, [costBasis, salePrice, holdingYears, taxableIncome]);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`;

  const inputClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="capital-gains-tax-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.costBasis")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={costBasis}
              onChange={(e) => setCostBasis(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.salePrice")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.holdingPeriod")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={holdingYears}
              onChange={(e) => setHoldingYears(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.taxableIncome")}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={taxableIncome}
              onChange={(e) => setTaxableIncome(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.capitalGain")}</p>
                <p
                  className={`text-xl font-semibold ${
                    result.gain >= 0 ? "text-zinc-200" : "text-red-400"
                  }`}
                >
                  {fmt(result.gain)}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.holdingType")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.isLongTerm ? t("options.longTerm") : t("options.shortTerm")}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.estimatedTax")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-blue-400">{fmt(result.tax)}</p>
                  <CopyButton text={fmt(result.tax)} className="text-xs px-2 py-1" />
                </div>
                <p className="text-xs text-zinc-500">{fmtPct(result.rate)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
