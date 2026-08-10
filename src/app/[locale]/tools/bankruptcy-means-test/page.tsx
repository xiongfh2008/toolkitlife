"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function BankruptcyMeansTestPage() {
  const t = useTranslations("tools.bankruptcy-means-test");
  const [householdIncome, setHouseholdIncome] = useState("");
  const [householdSize, setHouseholdSize] = useState("1");
  const [stateMedianIncome, setStateMedianIncome] = useState("");
  const [result, setResult] = useState<{
    medianForSize: string;
    diff: string;
    eligible: boolean;
  } | null>(null);

  const calculate = () => {
    const income = parseFloat(householdIncome);
    const size = parseInt(householdSize, 10);
    const median = parseFloat(stateMedianIncome);

    if (
      Number.isNaN(income) ||
      Number.isNaN(size) ||
      Number.isNaN(median) ||
      income < 0 ||
      median <= 0 ||
      size < 1
    ) {
      setResult(null);
      return;
    }

    const medianForSize = median * (1 + (size - 1) * 0.25);
    const eligible = income <= medianForSize;
    const diff = income - medianForSize;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

    setResult({
      medianForSize: fmt(medianForSize),
      diff: fmt(Math.abs(diff)),
      eligible,
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="bankruptcy-means-test"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.householdIncome")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={householdIncome}
              onChange={(e) => setHouseholdIncome(e.target.value)}
              placeholder="50000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.householdSize")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={householdSize}
              onChange={(e) => setHouseholdSize(e.target.value)}
              placeholder="1"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.stateMedianIncome")}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={stateMedianIncome}
              onChange={(e) => setStateMedianIncome(e.target.value)}
              placeholder="60000"
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
          <div
            className={`rounded-lg border p-5 space-y-4 ${
              result.eligible
                ? "border-green-800 bg-green-900/20"
                : "border-red-800 bg-red-900/20"
            }`}
          >
            <div>
              <p className="text-sm text-zinc-400">{t("labels.status")}</p>
              <p
                className={`text-2xl font-bold ${
                  result.eligible ? "text-green-400" : "text-red-400"
                }`}
              >
                {result.eligible ? t("options.eligible") : t("options.notEligible")}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.medianForSize")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.medianForSize}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.diff")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.diff}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
