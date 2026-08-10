"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const TERM_YEARS = 30;

export default function MortgageAffordabilityCalculatorPage() {
  const t = useTranslations("tools.mortgage-affordability-calculator");
  const [income, setIncome] = useState("80000");
  const [debts, setDebts] = useState("500");
  const [downPayment, setDownPayment] = useState("40000");
  const [rate, setRate] = useState("6.5");

  const result = useMemo(() => {
    const annualIncome = parseFloat(income);
    const monthlyDebts = parseFloat(debts);
    const down = parseFloat(downPayment);
    const annualRate = parseFloat(rate);

    if (
      Number.isNaN(annualIncome) ||
      Number.isNaN(monthlyDebts) ||
      Number.isNaN(down) ||
      Number.isNaN(annualRate) ||
      annualIncome <= 0 ||
      down < 0 ||
      monthlyDebts < 0 ||
      annualRate < 0
    ) {
      return null;
    }

    const monthlyIncome = annualIncome / 12;
    const maxByFrontRatio = monthlyIncome * 0.28;
    const maxByBackRatio = monthlyIncome * 0.36 - monthlyDebts;
    const maxMonthlyPayment = Math.max(0, Math.min(maxByFrontRatio, maxByBackRatio));

    const r = annualRate / 100 / 12;
    const n = TERM_YEARS * 12;

    const maxLoan =
      r === 0
        ? maxMonthlyPayment * n
        : maxMonthlyPayment * (1 - Math.pow(1 + r, -n)) / r;

    const maxHomePrice = maxLoan + down;
    const loanAmount = Math.max(0, maxHomePrice - down);

    return {
      maxHomePrice,
      maxMonthlyPayment,
      loanAmount,
    };
  }, [income, debts, downPayment, rate]);

  const formatMoney = (value: number) =>
    value.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="mortgage-affordability-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.annualIncome")}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.monthlyDebts")}
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={debts}
              onChange={(e) => setDebts(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.downPayment")}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
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
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.maxHomePrice")}</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatMoney(result.maxHomePrice)}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.loanAmount")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {formatMoney(result.loanAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.maxMonthlyPayment")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {formatMoney(result.maxMonthlyPayment)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
