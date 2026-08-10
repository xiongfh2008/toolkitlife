"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function RoiCalculatorPage() {
  const t = useTranslations("tools.roi-calculator");
  const [invested, setInvested] = useState("");
  const [returned, setReturned] = useState("");
  const [result, setResult] = useState<{
    roi: string;
    profit: string;
  } | null>(null);

  const calculate = (inv: string = invested, ret: string = returned) => {
    const investment = parseFloat(inv);
    const finalValue = parseFloat(ret);
    if (
      Number.isNaN(investment) ||
      Number.isNaN(finalValue) ||
      investment <= 0
    ) {
      setResult(null);
      return;
    }

    const profit = finalValue - investment;
    const roi = (profit / investment) * 100;
    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    setResult({
      roi: fmt(roi),
      profit: fmt(profit),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="roi-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.investedAmount")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={invested}
              onChange={(e) => {
                setInvested(e.target.value);
                calculate(e.target.value, returned);
              }}
              placeholder="1000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.returnedAmount")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={returned}
              onChange={(e) => {
                setReturned(e.target.value);
                calculate(invested, e.target.value);
              }}
              placeholder="1200"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.roi")}
              </h3>
              <CopyButton text={`${result.roi}%`} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.roi}%</p>
            <div>
              <p className="text-sm text-zinc-400">{t("labels.profitLoss")}</p>
              <p
                className={`text-xl font-semibold ${
                  parseFloat(result.profit) >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {result.profit}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
