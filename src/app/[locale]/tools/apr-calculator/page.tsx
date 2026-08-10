"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function solveApr(payment: number, netProceeds: number, months: number): number {
  let r = 0.005;
  for (let i = 0; i < 100; i++) {
    const pow = Math.pow(1 + r, -months);
    const f = (payment * (1 - pow)) / r - netProceeds;
    const df =
      payment *
      ((months * pow) / (1 + r) - (1 - pow) / (r * r));
    if (Math.abs(f) < 1e-8) break;
    const next = r - f / df;
    if (next <= 0) {
      r = r / 2;
      continue;
    }
    if (Math.abs(next - r) < 1e-8) {
      r = next;
      break;
    }
    r = next;
  }
  return r * 12 * 100;
}

export default function AprCalculatorPage() {
  const t = useTranslations("tools.apr-calculator");
  const [amount, setAmount] = useState("10000");
  const [fees, setFees] = useState("500");
  const [rate, setRate] = useState("6");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const loan = parseFloat(amount);
    const feeTotal = parseFloat(fees);
    const annualRate = parseFloat(rate);
    const termYears = parseFloat(years);
    if (
      [loan, feeTotal, annualRate, termYears].some((v) => Number.isNaN(v)) ||
      loan <= 0 ||
      termYears <= 0
    )
      return null;

    const monthlyRate = annualRate / 100 / 12;
    const months = termYears * 12;
    const payment =
      monthlyRate === 0
        ? loan / months
        : (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    const netProceeds = loan - feeTotal;
    if (netProceeds <= 0) return null;
    const apr = solveApr(payment, netProceeds, months);
    const totalCost = payment * months + feeTotal;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });

    return { apr: `${apr.toFixed(3)}%`, totalCost: fmt(totalCost) };
  }, [amount, fees, rate, years]);

  const inputClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="apr-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
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
              {t("labels.fees")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              placeholder={t("placeholders.fees")}
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.apr")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-blue-400">{result.apr}</p>
                  <CopyButton text={result.apr} className="text-xs px-2 py-1" />
                </div>
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
