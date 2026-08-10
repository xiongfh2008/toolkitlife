"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function AlimonyCalculatorPage() {
  const t = useTranslations("tools.alimony-calculator");
  const [payerIncome, setPayerIncome] = useState("");
  const [recipientIncome, setRecipientIncome] = useState("");
  const [yearsMarried, setYearsMarried] = useState("");
  const [result, setResult] = useState<{
    monthlyAlimony: string;
    annualAlimony: string;
    durationYears: string;
  } | null>(null);

  const calculate = () => {
    const payer = parseFloat(payerIncome);
    const recipient = parseFloat(recipientIncome);
    const years = parseFloat(yearsMarried);

    if (
      Number.isNaN(payer) ||
      Number.isNaN(recipient) ||
      Number.isNaN(years) ||
      payer < 0 ||
      recipient < 0 ||
      years <= 0 ||
      payer <= recipient
    ) {
      setResult(null);
      return;
    }

    const incomeGap = payer - recipient;
    const baseRate = 0.3;
    const durationFactor = Math.min(years / 10, 1);
    const monthlyAlimony = incomeGap * baseRate * durationFactor;
    const annualAlimony = monthlyAlimony * 12;
    const durationYears = Math.max(1, Math.round(years * 0.5));

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

    setResult({
      monthlyAlimony: fmt(monthlyAlimony),
      annualAlimony: fmt(annualAlimony),
      durationYears: durationYears.toString(),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="alimony-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.payerIncome")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={payerIncome}
              onChange={(e) => setPayerIncome(e.target.value)}
              placeholder="8000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.recipientIncome")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={recipientIncome}
              onChange={(e) => setRecipientIncome(e.target.value)}
              placeholder="3000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.yearsMarried")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={yearsMarried}
              onChange={(e) => setYearsMarried(e.target.value)}
              placeholder="8"
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.monthlyAlimony")}</h3>
              <CopyButton text={result.monthlyAlimony} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.monthlyAlimony}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.annualAlimony")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.annualAlimony}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.durationYears")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.durationYears}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
