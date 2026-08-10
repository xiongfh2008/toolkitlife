"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function LoanCalculatorPage() {
  const t = useTranslations("tools.loan-calculator");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [termUnit, setTermUnit] = useState<"years" | "months">("years");
  const [result, setResult] = useState<{
    monthly: string;
    totalInterest: string;
    totalPayment: string;
  } | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const nInput = parseFloat(term);
    if (
      Number.isNaN(p) ||
      Number.isNaN(r) ||
      Number.isNaN(nInput) ||
      p <= 0 ||
      nInput <= 0
    ) {
      setResult(null);
      return;
    }

    const n = termUnit === "years" ? nInput * 12 : nInput;
    const monthlyRate = r / 100 / 12;
    let monthly = 0;
    if (monthlyRate === 0) {
      monthly = p / n;
    } else {
      monthly =
        (p * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
        (Math.pow(1 + monthlyRate, n) - 1);
    }

    const totalPayment = monthly * n;
    const totalInterest = totalPayment - p;
    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    setResult({
      monthly: fmt(monthly),
      totalInterest: fmt(totalInterest),
      totalPayment: fmt(totalPayment),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="loan-calculator"
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
              step="0.01"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="10000"
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
              placeholder="5"
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
              placeholder="5"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.termUnit")}
            </label>
            <select
              value={termUnit}
              onChange={(e) =>
                setTermUnit(e.target.value as "years" | "months")
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="years">{t("options.years")}</option>
              <option value="months">{t("options.months")}</option>
            </select>
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
                {t("labels.monthlyPayment")}
              </h3>
              <CopyButton text={result.monthly} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.monthly}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.totalInterest")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.totalInterest}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.totalPayment")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.totalPayment}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
