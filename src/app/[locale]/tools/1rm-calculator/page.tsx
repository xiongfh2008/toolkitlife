"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const FORMULAS = [
  "epley",
  "brzycki",
  "lombardi",
  "mayhew",
  "oconner",
  "average",
] as const;

function estimate1RM(formula: string, weight: number, reps: number): number {
  switch (formula) {
    case "epley":
      return weight * (1 + reps / 30);
    case "brzycki":
      return weight / (1.0278 - 0.0278 * reps);
    case "lombardi":
      return weight * Math.pow(reps, 0.1);
    case "mayhew":
      return (weight * 100) / (52.2 + 41.9 * Math.exp(-0.055 * reps));
    case "oconner":
      return weight * (1 + reps / 40);
    default:
      return weight * (1 + reps / 30);
  }
}

export default function OneRepMaxCalculatorPage() {
  const t = useTranslations("tools.1rm-calculator");
  const [weight, setWeight] = useState("70");
  const [reps, setReps] = useState("5");
  const [formula, setFormula] = useState<(typeof FORMULAS)[number]>("epley");
  const [result, setResult] = useState<{
    value: string;
    breakdown: Record<string, string>;
  } | null>(null);
  const [error, setError] = useState(false);

  const calculate = () => {
    const w = parseFloat(weight);
    const r = parseFloat(reps);
    if (Number.isNaN(w) || Number.isNaN(r) || w <= 0 || r < 1 || r > 50) {
      setError(true);
      setResult(null);
      return;
    }
    setError(false);

    const breakdown: Record<string, string> = {};
    FORMULAS.slice(0, -1).forEach((f) => {
      breakdown[f] = estimate1RM(f, w, r).toFixed(1);
    });

    let value: number;
    if (formula === "average") {
      const sum = FORMULAS.slice(0, -1).reduce(
        (acc, f) => acc + estimate1RM(f, w, r),
        0
      );
      value = sum / (FORMULAS.length - 1);
    } else {
      value = estimate1RM(formula, w, r);
    }

    setResult({
      value: value.toFixed(1),
      breakdown,
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="1rm-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.weight")}
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.reps")}
            </label>
            <input
              type="number"
              min="1"
              max="50"
              step="1"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="5"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.formula")}
            </label>
            <select
              value={formula}
              onChange={(e) =>
                setFormula(e.target.value as (typeof FORMULAS)[number])
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            >
              {FORMULAS.map((f) => (
                <option key={f} value={f}>
                  {t(`options.${f}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.calculate")}
        </button>

        {error && (
          <p className="text-sm text-red-400">{t("errors.invalid")}</p>
        )}

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.oneRepMax")}</p>
                <p className="text-3xl font-bold text-blue-400">
                  {result.value}
                </p>
              </div>
              <CopyButton text={result.value} className="text-xs px-2 py-1" />
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-300 mb-2">
                {t("labels.formulaResults")}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(result.breakdown).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-zinc-800 px-4 py-2"
                  >
                    <span className="text-sm text-zinc-400">
                      {t(`options.${key}`)}
                    </span>
                    <span className="text-sm font-semibold text-zinc-200">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              {t("formulaNote")}
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
