"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function FireCalculatorPage() {
  const t = useTranslations("tools.fire-calculator");
  const [savings, setSavings] = useState("100000");
  const [expenses, setExpenses] = useState("40000");
  const [rate, setRate] = useState("7");

  const result = useMemo(() => {
    const s = parseFloat(savings);
    const e = parseFloat(expenses);
    const r = parseFloat(rate);

    if (Number.isNaN(s) || Number.isNaN(e) || s < 0 || e <= 0) {
      return null;
    }

    const fireNumber = e * 25;
    let yearsToFi: number | null = null;

    if (s >= fireNumber) {
      yearsToFi = 0;
    } else if (!Number.isNaN(r) && r > 0) {
      yearsToFi = Math.log(fireNumber / s) / Math.log(1 + r / 100);
    }

    return { fireNumber, yearsToFi };
  }, [savings, expenses, rate]);

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
      slug="fire-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.currentSavings")}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.annualExpenses")}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.expectedReturn")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.fireNumber")}</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatMoney(result.fireNumber)}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.yearsToFi")}</p>
                <p className="text-2xl font-bold text-blue-400">
                  {result.yearsToFi !== null
                    ? `${result.yearsToFi <= 0 ? "0" : result.yearsToFi.toFixed(1)} ${t("labels.years")}`
                    : t("labels.never")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
