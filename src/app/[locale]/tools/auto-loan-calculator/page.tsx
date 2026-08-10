"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function AutoLoanCalculatorPage() {
  const t = useTranslations("tools.auto-loan-calculator");
  const [price, setPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [tradeIn, setTradeIn] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [result, setResult] = useState<{
    monthlyPayment: string;
    loanAmount: string;
    totalInterest: string;
    totalCost: string;
  } | null>(null);

  const calculate = () => {
    const pPrice = parseFloat(price);
    const pDown = parseFloat(downPayment) || 0;
    const pTrade = parseFloat(tradeIn) || 0;
    const r = parseFloat(rate);
    const years = parseFloat(term);

    if (
      Number.isNaN(pPrice) ||
      Number.isNaN(r) ||
      Number.isNaN(years) ||
      pPrice <= 0 ||
      years <= 0
    ) {
      setResult(null);
      return;
    }

    const principal = Math.max(0, pPrice - pDown - pTrade);
    const n = years * 12;
    const monthlyRate = r / 100 / 12;
    let monthly = 0;
    if (monthlyRate === 0) {
      monthly = principal / n;
    } else {
      monthly =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
        (Math.pow(1 + monthlyRate, n) - 1);
    }

    const totalCost = monthly * n;
    const totalInterest = totalCost - principal;
    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });

    setResult({
      monthlyPayment: fmt(monthly),
      loanAmount: fmt(principal),
      totalInterest: fmt(totalInterest),
      totalCost: fmt(totalCost),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="auto-loan-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.carPrice")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="30000"
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
              step="100"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder="5000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.tradeIn")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={tradeIn}
              onChange={(e) => setTradeIn(e.target.value)}
              placeholder="4000"
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
              placeholder="5.5"
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
              <CopyButton text={result.monthlyPayment} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.monthlyPayment}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.loanAmount")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.loanAmount}</p>
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
