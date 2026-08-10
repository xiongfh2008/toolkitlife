"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function MortgageCalculatorPage() {
  const t = useTranslations("tools.mortgage-calculator");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [taxes, setTaxes] = useState("");
  const [insurance, setInsurance] = useState("");
  const [pmi, setPmi] = useState("");
  const [result, setResult] = useState<{
    principalAndInterest: string;
    totalMonthly: string;
    totalCost: string;
    totalInterest: string;
  } | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const years = parseFloat(term);
    if (
      Number.isNaN(p) ||
      Number.isNaN(r) ||
      Number.isNaN(years) ||
      p <= 0 ||
      years <= 0
    ) {
      setResult(null);
      return;
    }

    const n = years * 12;
    const monthlyRate = r / 100 / 12;
    let pi = 0;
    if (monthlyRate === 0) {
      pi = p / n;
    } else {
      pi =
        (p * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
        (Math.pow(1 + monthlyRate, n) - 1);
    }

    const tVal = parseFloat(taxes) || 0;
    const iVal = parseFloat(insurance) || 0;
    const pVal = parseFloat(pmi) || 0;
    const totalMonthly = pi + tVal / 12 + iVal / 12 + pVal;
    const totalCost = totalMonthly * n;
    const totalInterest = pi * n - p;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });

    setResult({
      principalAndInterest: fmt(pi),
      totalMonthly: fmt(totalMonthly),
      totalCost: fmt(totalCost),
      totalInterest: fmt(totalInterest),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="mortgage-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.principal")}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="300000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.annualRate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="6.5"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.term")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="30"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.propertyTaxes")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={taxes}
              onChange={(e) => setTaxes(e.target.value)}
              placeholder="2400"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.homeInsurance")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              placeholder="1200"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.pmi")}
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={pmi}
              onChange={(e) => setPmi(e.target.value)}
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
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.totalMonthlyPayment")}
              </h3>
              <CopyButton text={result.totalMonthly} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.totalMonthly}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.principalAndInterest")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.principalAndInterest}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalInterest")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalInterest}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalCost")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalCost}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
