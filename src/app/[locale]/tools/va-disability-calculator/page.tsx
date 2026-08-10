"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const BASE_RATES: Record<number, number> = {
  0: 0,
  10: 171.23,
  20: 338.49,
  30: 524.31,
  40: 755.28,
  50: 1075.16,
  60: 1361.88,
  70: 1716.28,
  80: 1995.01,
  90: 2241.91,
  100: 3737.85,
};

export default function VaDisabilityCalculatorPage() {
  const t = useTranslations("tools.va-disability-calculator");
  const [ratingsInput, setRatingsInput] = useState("");
  const [dependents, setDependents] = useState("0");
  const [result, setResult] = useState<{
    combinedRating: string;
    monthlyCompensation: string;
    roundedRating: string;
  } | null>(null);

  const calculate = () => {
    const ratings = ratingsInput
      .split(",")
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !Number.isNaN(n) && n > 0 && n <= 100);
    const deps = parseInt(dependents, 10);

    if (ratings.length === 0 || Number.isNaN(deps) || deps < 0) {
      setResult(null);
      return;
    }

    // VA combined rating approximation: combine in descending order, round to nearest 10
    const sorted = [...ratings].sort((a, b) => b - a);
    let combined = sorted[0];
    for (let i = 1; i < sorted.length; i++) {
      combined = combined + sorted[i] * (1 - combined / 100);
    }
    const rounded = Math.round(combined / 10) * 10;

    let monthly = BASE_RATES[rounded] || 0;
    monthly += deps * 100;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

    setResult({
      combinedRating: `${combined.toFixed(1)}%`,
      monthlyCompensation: fmt(monthly),
      roundedRating: `${rounded}%`,
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="va-disability-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.ratingsInput")}
            </label>
            <input
              type="text"
              value={ratingsInput}
              onChange={(e) => setRatingsInput(e.target.value)}
              placeholder="30, 20, 10"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.dependents")}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              placeholder="0"
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.monthlyCompensation")}</h3>
              <CopyButton text={result.monthlyCompensation} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.monthlyCompensation}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.combinedRating")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.combinedRating}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.roundedRating")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.roundedRating}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
