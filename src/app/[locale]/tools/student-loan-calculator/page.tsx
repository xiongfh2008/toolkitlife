"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function StudentLoanCalculatorPage() {
  const t = useTranslations("tools.student-loan-calculator");
  const [amount, setAmount] = useState("30000");
  const [rate, setRate] = useState("5.5");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const principal = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const termYears = parseFloat(years);
    if ([principal, annualRate, termYears].some((v) => Number.isNaN(v)) || principal <= 0 || termYears <= 0)
      return null;

    const monthlyRate = annualRate / 100 / 12;
    const months = termYears * 12;
    const payment =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    const totalCost = payment * months;
    const totalInterest = totalCost - principal;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });

    return {
      payment: fmt(payment),
      totalInterest: fmt(totalInterest),
      totalCost: fmt(totalCost),
    };
  }, [amount, rate, years]);

  const inputClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="student-loan-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.loanAmount")}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t("placeholders.loanAmount")}
              className={inputClass}
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
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder={t("placeholders.interestRate")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.termYears")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder={t("placeholders.termYears")}
              className={inputClass}
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div>
              <p className="text-sm text-zinc-400">{t("labels.monthlyPayment")}</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-blue-400">{result.payment}</p>
                <CopyButton text={result.payment} className="text-xs px-2 py-1" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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
