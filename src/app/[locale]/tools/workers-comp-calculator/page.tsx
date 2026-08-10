"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function WorkersCompCalculatorPage() {
  const t = useTranslations("tools.workers-comp-calculator");
  const [weeklyWage, setWeeklyWage] = useState("");
  const [disabilityPercent, setDisabilityPercent] = useState("");
  const [weeks, setWeeks] = useState("");
  const [stateFactor, setStateFactor] = useState("1.0");
  const [result, setResult] = useState<{
    weeklyBenefit: string;
    totalBenefit: string;
    replacementRate: string;
  } | null>(null);

  const calculate = () => {
    const wage = parseFloat(weeklyWage);
    const percent = parseFloat(disabilityPercent);
    const duration = parseFloat(weeks);
    const factor = parseFloat(stateFactor);

    if (
      Number.isNaN(wage) ||
      Number.isNaN(percent) ||
      Number.isNaN(duration) ||
      Number.isNaN(factor) ||
      wage < 0 ||
      percent < 0 ||
      percent > 100 ||
      duration <= 0 ||
      factor <= 0
    ) {
      setResult(null);
      return;
    }

    const replacementRate = 0.667;
    const weeklyBenefit = wage * replacementRate * (percent / 100) * factor;
    const totalBenefit = weeklyBenefit * duration;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

    setResult({
      weeklyBenefit: fmt(weeklyBenefit),
      totalBenefit: fmt(totalBenefit),
      replacementRate: `${(replacementRate * 100).toFixed(1)}%`,
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="workers-comp-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.weeklyWage")}
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={weeklyWage}
              onChange={(e) => setWeeklyWage(e.target.value)}
              placeholder="1000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.disabilityPercent")}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={disabilityPercent}
              onChange={(e) => setDisabilityPercent(e.target.value)}
              placeholder="50"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.weeks")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={weeks}
              onChange={(e) => setWeeks(e.target.value)}
              placeholder="20"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.stateFactor")}
            </label>
            <input
              type="number"
              min="0.1"
              step="0.05"
              value={stateFactor}
              onChange={(e) => setStateFactor(e.target.value)}
              placeholder="1.0"
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.totalBenefit")}</h3>
              <CopyButton text={result.totalBenefit} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.totalBenefit}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.weeklyBenefit")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.weeklyBenefit}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.replacementRate")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.replacementRate}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
