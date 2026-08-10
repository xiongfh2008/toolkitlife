"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function DebtPayoffCalculatorPage() {
  const t = useTranslations("tools.debt-payoff-calculator");
  const [balance, setBalance] = useState("5000");
  const [rate, setRate] = useState("18");
  const [payment, setPayment] = useState("200");
  const [result, setResult] = useState<{
    months: number;
    totalInterest: number;
    totalPaid: number;
    payoffDate: string;
  } | null>(null);

  const calculate = () => {
    const b = parseFloat(balance);
    const r = parseFloat(rate);
    const p = parseFloat(payment);

    if (
      Number.isNaN(b) ||
      Number.isNaN(r) ||
      Number.isNaN(p) ||
      b <= 0 ||
      r < 0 ||
      p <= 0 ||
      p <= (b * r) / 1200
    ) {
      setResult(null);
      return;
    }

    const monthlyRate = r / 100 / 12;
    let remaining = b;
    let months = 0;
    let totalInterest = 0;

    while (remaining > 0 && months < 1200) {
      const interest = remaining * monthlyRate;
      totalInterest += interest;
      const principal = Math.min(p - interest, remaining);
      remaining -= principal;
      months += 1;
    }

    const totalPaid = b + totalInterest;
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + months);

    setResult({
      months,
      totalInterest,
      totalPaid,
      payoffDate: payoffDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      }),
    });
  };

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="debt-payoff-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.balance")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="5000"
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
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="18"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.monthlyPayment")}
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              placeholder="200"
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.monthsToPayoff")}
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  {result.months}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.payoffDate")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.payoffDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.totalInterest")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {fmt(result.totalInterest)}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.totalPaid")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {fmt(result.totalPaid)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
