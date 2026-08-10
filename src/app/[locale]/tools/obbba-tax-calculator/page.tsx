"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function ObbbaTaxCalculatorPage() {
  const t = useTranslations("tools.obbba-tax-calculator");
  const [businessIncome, setBusinessIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [taxRate, setTaxRate] = useState("21");
  const [result, setResult] = useState<{
    netIncome: string;
    estimatedTax: string;
    afterTaxProfit: string;
    effectiveRate: string;
  } | null>(null);

  const calculate = () => {
    const income = parseFloat(businessIncome);
    const expense = parseFloat(expenses) || 0;
    const rate = parseFloat(taxRate);
    if (Number.isNaN(income) || income < 0 || Number.isNaN(rate) || rate < 0) {
      setResult(null);
      return;
    }

    const netIncome = Math.max(0, income - expense);
    const tax = netIncome * (rate / 100);
    const afterTax = netIncome - tax;
    const effectiveRate = netIncome > 0 ? (tax / netIncome) * 100 : 0;

    const fmtCurrency = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });
    const fmtPercent = (v: number) =>
      `${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;

    setResult({
      netIncome: fmtCurrency(netIncome),
      estimatedTax: fmtCurrency(tax),
      afterTaxProfit: fmtCurrency(afterTax),
      effectiveRate: fmtPercent(effectiveRate),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="obbba-tax-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.businessIncome")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={businessIncome}
              onChange={(e) => setBusinessIncome(e.target.value)}
              placeholder="100000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.expenses")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              placeholder="30000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.taxRate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              placeholder="21"
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.estimatedTax")}</h3>
              <CopyButton text={result.estimatedTax} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.estimatedTax}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.netIncome")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.netIncome}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.afterTaxProfit")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.afterTaxProfit}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.effectiveRate")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.effectiveRate}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
