"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const BRACKETS = [
  { limit: 11600, rate: 0.1 },
  { limit: 47150, rate: 0.12 },
  { limit: 100525, rate: 0.22 },
  { limit: 191950, rate: 0.24 },
  { limit: 243725, rate: 0.32 },
  { limit: 609350, rate: 0.35 },
  { limit: Infinity, rate: 0.37 },
];

export default function IncomeTaxCalculatorPage() {
  const t = useTranslations("tools.income-tax-calculator");
  const [income, setIncome] = useState("");
  const [deductions, setDeductions] = useState("");
  const [result, setResult] = useState<{
    taxableIncome: string;
    federalTax: string;
    effectiveRate: string;
    takeHome: string;
  } | null>(null);

  const calculate = () => {
    const inc = parseFloat(income);
    const ded = parseFloat(deductions) || 0;
    if (Number.isNaN(inc) || inc < 0) {
      setResult(null);
      return;
    }

    const taxable = Math.max(0, inc - ded);
    let remaining = taxable;
    let previous = 0;
    let tax = 0;
    for (const bracket of BRACKETS) {
      if (remaining <= 0) break;
      const amount = Math.min(remaining, bracket.limit - previous);
      tax += amount * bracket.rate;
      remaining -= amount;
      previous = bracket.limit;
    }

    const takeHome = inc - tax;
    const effectiveRate = taxable > 0 ? (tax / taxable) * 100 : 0;

    const fmtCurrency = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });
    const fmtPercent = (v: number) =>
      `${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;

    setResult({
      taxableIncome: fmtCurrency(taxable),
      federalTax: fmtCurrency(tax),
      effectiveRate: fmtPercent(effectiveRate),
      takeHome: fmtCurrency(takeHome),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="income-tax-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.income")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="60000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.deductions")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.calculate")}
        </button>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.federalTax")}</h3>
              <CopyButton text={result.federalTax} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.federalTax}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.taxableIncome")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.taxableIncome}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.effectiveRate")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.effectiveRate}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.takeHome")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.takeHome}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
