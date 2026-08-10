"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function CreditCardPayoffCalculatorPage() {
  const t = useTranslations("tools.credit-card-payoff-calculator");
  const [balance, setBalance] = useState("");
  const [apr, setApr] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [result, setResult] = useState<{
    months: number;
    totalInterest: string;
    totalPaid: string;
  } | null>(null);
  const [error, setError] = useState("");

  const calculate = (
    bal = balance,
    rate = apr,
    payment = monthlyPayment,
  ) => {
    const b = parseFloat(bal);
    const r = parseFloat(rate);
    const p = parseFloat(payment);
    if (Number.isNaN(b) || Number.isNaN(r) || Number.isNaN(p)) {
      setResult(null);
      setError("");
      return;
    }
    if (b <= 0 || r < 0 || p <= 0) {
      setResult(null);
      setError("");
      return;
    }

    const monthlyRate = r / 100 / 12;
    if (monthlyRate === 0) {
      const months = Math.ceil(b / p);
      const totalPaid = months * p;
      const totalInterest = totalPaid - b;
      if (p < b / 1000) {
        setError(t("errors.paymentTooLow"));
        setResult(null);
        return;
      }
      setResult({
        months,
        totalInterest: fmt(totalInterest),
        totalPaid: fmt(totalPaid),
      });
      setError("");
      return;
    }

    if (p <= b * monthlyRate) {
      setError(t("errors.paymentTooLow"));
      setResult(null);
      return;
    }

    const months = Math.ceil(
      Math.log(p / (p - b * monthlyRate)) / Math.log(1 + monthlyRate),
    );
    let remaining = b;
    let totalInterest = 0;
    for (let i = 0; i < months; i++) {
      const interest = remaining * monthlyRate;
      totalInterest += interest;
      const principal = Math.min(p - interest, remaining);
      remaining -= principal;
      if (remaining <= 0) break;
    }
    const totalPaid = b + totalInterest;

    setResult({
      months,
      totalInterest: fmt(totalInterest),
      totalPaid: fmt(totalPaid),
    });
    setError("");
  };

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="credit-card-payoff-calculator"
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
              step="0.01"
              value={balance}
              onChange={(e) => {
                setBalance(e.target.value);
                calculate(e.target.value, apr, monthlyPayment);
              }}
              placeholder="5000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.apr")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={apr}
              onChange={(e) => {
                setApr(e.target.value);
                calculate(balance, e.target.value, monthlyPayment);
              }}
              placeholder="19.99"
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
              step="0.01"
              value={monthlyPayment}
              onChange={(e) => {
                setMonthlyPayment(e.target.value);
                calculate(balance, apr, e.target.value);
              }}
              placeholder="200"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && !error && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.payoffTime")}
              </h3>
              <CopyButton
                text={`${result.months} months, ${result.totalInterest} interest`}
                className="text-xs px-2 py-1"
              />
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {result.months} {t("labels.months")}
            </p>
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
                <p className="text-sm text-zinc-400">{t("labels.totalPaid")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.totalPaid}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
