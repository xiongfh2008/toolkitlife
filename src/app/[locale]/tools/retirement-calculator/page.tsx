"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function RetirementCalculatorPage() {
  const t = useTranslations("tools.retirement-calculator");
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("65");
  const [currentSavings, setCurrentSavings] = useState("50000");
  const [monthlyContribution, setMonthlyContribution] = useState("500");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [inflationRate, setInflationRate] = useState("2.5");

  const calculate = () => {
    const age = parseFloat(currentAge);
    const retireAge = parseFloat(retirementAge);
    const savings = parseFloat(currentSavings);
    const monthly = parseFloat(monthlyContribution);
    const returnRate = parseFloat(annualReturn);
    const inflation = parseFloat(inflationRate);

    if (
      Number.isNaN(age) ||
      Number.isNaN(retireAge) ||
      Number.isNaN(savings) ||
      Number.isNaN(monthly) ||
      Number.isNaN(returnRate) ||
      Number.isNaN(inflation) ||
      age < 0 ||
      retireAge <= age ||
      savings < 0 ||
      monthly < 0 ||
      returnRate < 0
    ) {
      return null;
    }

    const yearsToRetire = retireAge - age;
    const months = yearsToRetire * 12;
    const monthlyRate = returnRate / 100 / 12;
    const realMonthlyRate = (returnRate - inflation) / 100 / 12;

    const nominalSavings =
      savings * Math.pow(1 + monthlyRate, months) +
      (monthlyRate === 0
        ? monthly * months
        : monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));

    const realSavings =
      savings * Math.pow(1 + realMonthlyRate, months) +
      (realMonthlyRate === 0
        ? monthly * months
        : monthly * ((Math.pow(1 + realMonthlyRate, months) - 1) / realMonthlyRate));

    const monthlyIncome = realSavings / 25 / 12;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

    return {
      yearsToRetire: yearsToRetire.toString(),
      retirementSavings: fmt(nominalSavings),
      realRetirementSavings: fmt(realSavings),
      monthlyIncome: fmt(monthlyIncome),
    };
  };

  const result = calculate();

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="retirement-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.currentAge")}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
              placeholder="30"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.retirementAge")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={retirementAge}
              onChange={(e) => setRetirementAge(e.target.value)}
              placeholder="65"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.currentSavings")}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              placeholder="50000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.monthlyContribution")}
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              placeholder="500"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.annualReturn")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
              placeholder="7"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.inflationRate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              placeholder="2.5"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.retirementSavings")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-blue-400">{result.retirementSavings}</p>
                  <CopyButton text={result.retirementSavings} className="text-xs px-2 py-1" />
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.monthlyIncome")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.monthlyIncome}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.yearsToRetire")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.yearsToRetire}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.realRetirementSavings")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.realRetirementSavings}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
