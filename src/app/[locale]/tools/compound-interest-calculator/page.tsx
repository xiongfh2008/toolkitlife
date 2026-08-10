"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const FREQUENCIES = [
  { value: "1", key: "annually" },
  { value: "2", key: "semiannually" },
  { value: "4", key: "quarterly" },
  { value: "12", key: "monthly" },
  { value: "52", key: "weekly" },
  { value: "365", key: "daily" },
] as const;

export default function CompoundInterestCalculatorPage() {
  const t = useTranslations("tools.compound-interest-calculator");
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5");
  const [time, setTime] = useState("10");
  const [frequency, setFrequency] = useState("12");
  const [contribution, setContribution] = useState("100");

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const years = parseFloat(time);
    const n = parseInt(frequency, 10);
    const pmt = parseFloat(contribution);

    if (
      Number.isNaN(p) ||
      Number.isNaN(r) ||
      Number.isNaN(years) ||
      Number.isNaN(n) ||
      Number.isNaN(pmt) ||
      p < 0 ||
      r < 0 ||
      years <= 0 ||
      n <= 0
    ) {
      return null;
    }

    const ratePerPeriod = r / 100 / n;
    const periods = years * n;
    const amount =
      p * Math.pow(1 + ratePerPeriod, periods) +
      (ratePerPeriod === 0
        ? pmt * periods
        : pmt * ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod));
    const totalContributions = p + pmt * periods;
    const totalInterest = amount - totalContributions;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });

    return {
      finalAmount: fmt(amount),
      totalContributions: fmt(totalContributions),
      totalInterest: fmt(totalInterest),
    };
  };

  const result = calculate();

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="compound-interest-calculator"
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
              step="100"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="10000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.rate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="5"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.time")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="10"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.frequency")}
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {t(`options.${f.key}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.contribution")}
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              placeholder="100"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.finalAmount")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-blue-400">{result.finalAmount}</p>
                  <CopyButton text={result.finalAmount} className="text-xs px-2 py-1" />
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalContributions")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalContributions}</p>
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
