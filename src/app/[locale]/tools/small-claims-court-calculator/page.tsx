"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function filingFee(amount: number): number {
  if (amount <= 1500) return 30;
  if (amount <= 5000) return 50;
  if (amount <= 10000) return 75;
  return 100;
}

export default function SmallClaimsCourtCalculatorPage() {
  const t = useTranslations("tools.small-claims-court-calculator");
  const [claimAmount, setClaimAmount] = useState("");
  const [serviceFee, setServiceFee] = useState("40");
  const [result, setResult] = useState<{
    filingFee: string;
    serviceFee: string;
    totalCost: string;
  } | null>(null);

  const calculate = () => {
    const amount = parseFloat(claimAmount);
    const service = parseFloat(serviceFee) || 0;

    if (Number.isNaN(amount) || amount < 0 || service < 0) {
      setResult(null);
      return;
    }

    const fee = filingFee(amount);
    const total = fee + service;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

    setResult({
      filingFee: fmt(fee),
      serviceFee: fmt(service),
      totalCost: fmt(total),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="small-claims-court-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.claimAmount")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              placeholder="3000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.serviceFee")}
            </label>
            <input
              type="number"
              min="0"
              step="5"
              value={serviceFee}
              onChange={(e) => setServiceFee(e.target.value)}
              placeholder="40"
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.totalCost")}</h3>
              <CopyButton text={result.totalCost} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.totalCost}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.filingFee")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.filingFee}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.serviceFee")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.serviceFee}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
