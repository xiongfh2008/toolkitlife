"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const frequencies = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
  annual: 1,
};

export default function PaycheckCalculatorPage() {
  const t = useTranslations("tools.paycheck-calculator");
  const [gross, setGross] = useState("");
  const [frequency, setFrequency] = useState<keyof typeof frequencies>("biweekly");
  const [taxRate, setTaxRate] = useState("20");
  const [deductions, setDeductions] = useState("");
  const [result, setResult] = useState<{
    grossPay: string;
    taxes: string;
    deductions: string;
    netPay: string;
  } | null>(null);

  const calculate = () => {
    const g = parseFloat(gross);
    const tax = parseFloat(taxRate);
    const ded = parseFloat(deductions || "0");

    if (Number.isNaN(g) || g <= 0 || Number.isNaN(tax) || Number.isNaN(ded)) {
      setResult(null);
      return;
    }

    const taxes = g * (tax / 100);
    const net = Math.max(0, g - taxes - ded);

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    setResult({
      grossPay: fmt(g),
      taxes: fmt(taxes),
      deductions: fmt(ded),
      netPay: fmt(net),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="paycheck-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.grossPay")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={gross}
              onChange={(e) => setGross(e.target.value)}
              placeholder="2000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.frequency")}
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as keyof typeof frequencies)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            >
              {(Object.keys(frequencies) as (keyof typeof frequencies)[]).map((key) => (
                <option key={key} value={key}>
                  {t(`options.${key}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.taxRate")}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              placeholder="20"
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
              step="0.01"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              placeholder="100"
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
            <div>
              <p className="text-sm text-zinc-400">{t("labels.netPay")}</p>
              <p className="text-3xl font-bold text-blue-400">{result.netPay}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.grossPay")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.grossPay}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.taxes")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.taxes}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.deductions")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.deductions}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
