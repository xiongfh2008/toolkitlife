"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function DividendCalculatorPage() {
  const t = useTranslations("tools.dividend-calculator");
  const [shares, setShares] = useState("");
  const [dividend, setDividend] = useState("");
  const [frequency, setFrequency] = useState("quarterly");
  const [result, setResult] = useState<{
    annual: string;
    monthly: string;
    perPeriod: string;
  } | null>(null);

  const calculate = (
    s = shares,
    d = dividend,
    f = frequency,
  ) => {
    const nShares = parseFloat(s);
    const divPerShare = parseFloat(d);
    if (
      Number.isNaN(nShares) ||
      Number.isNaN(divPerShare) ||
      nShares <= 0 ||
      divPerShare <= 0
    ) {
      setResult(null);
      return;
    }

    const periodsPerYear: Record<string, number> = {
      monthly: 12,
      quarterly: 4,
      semiannually: 2,
      annually: 1,
    };
    const perPeriod = nShares * divPerShare;
    const annual = perPeriod * periodsPerYear[f];
    const monthly = annual / 12;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    setResult({
      annual: fmt(annual),
      monthly: fmt(monthly),
      perPeriod: fmt(perPeriod),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="dividend-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.shares")}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={shares}
              onChange={(e) => {
                setShares(e.target.value);
                calculate(e.target.value, dividend, frequency);
              }}
              placeholder="100"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.dividendPerShare")}
            </label>
            <input
              type="number"
              min="0"
              step="0.001"
              value={dividend}
              onChange={(e) => {
                setDividend(e.target.value);
                calculate(shares, e.target.value, frequency);
              }}
              placeholder="0.50"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.frequency")}
          </label>
          <select
            value={frequency}
            onChange={(e) => {
              setFrequency(e.target.value);
              calculate(shares, dividend, e.target.value);
            }}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="monthly">{t("options.monthly")}</option>
            <option value="quarterly">{t("options.quarterly")}</option>
            <option value="semiannually">{t("options.semiannually")}</option>
            <option value="annually">{t("options.annually")}</option>
          </select>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.annualIncome")}
              </h3>
              <CopyButton
                text={`${result.annual}/year`}
                className="text-xs px-2 py-1"
              />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.annual}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.monthlyIncome")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.monthly}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.perPeriod")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.perPeriod}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
