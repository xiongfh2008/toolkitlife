"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function SavingsCalculatorPage() {
  const t = useTranslations("tools.savings-calculator");
  const [initialSavings, setInitialSavings] = useState("5000");
  const [monthlyDeposit, setMonthlyDeposit] = useState("200");
  const [interestRate, setInterestRate] = useState("4");
  const [years, setYears] = useState("10");

  const calculate = () => {
    const initial = parseFloat(initialSavings);
    const monthly = parseFloat(monthlyDeposit);
    const rate = parseFloat(interestRate);
    const y = parseFloat(years);

    if (
      Number.isNaN(initial) ||
      Number.isNaN(monthly) ||
      Number.isNaN(rate) ||
      Number.isNaN(y) ||
      initial < 0 ||
      monthly < 0 ||
      rate < 0 ||
      y <= 0
    ) {
      return null;
    }

    const monthlyRate = rate / 100 / 12;
    const months = y * 12;
    const totalSavings =
      initial * Math.pow(1 + monthlyRate, months) +
      (monthlyRate === 0
        ? monthly * months
        : monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
    const totalDeposits = initial + monthly * months;
    const totalInterest = totalSavings - totalDeposits;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });

    return {
      totalSavings: fmt(totalSavings),
      totalDeposits: fmt(totalDeposits),
      totalInterest: fmt(totalInterest),
    };
  };

  const result = calculate();

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="savings-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.initialSavings")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={initialSavings}
              onChange={(e) => setInitialSavings(e.target.value)}
              placeholder="5000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.monthlyDeposit")}
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(e.target.value)}
              placeholder="200"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.interestRate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="4"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.years")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="10"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalSavings")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-blue-400">{result.totalSavings}</p>
                  <CopyButton text={result.totalSavings} className="text-xs px-2 py-1" />
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalDeposits")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalDeposits}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalInterest")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalInterest}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
