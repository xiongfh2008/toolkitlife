"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const WIDMARK_R: Record<string, number> = {
  male: 0.68,
  female: 0.55,
};

const METABOLISM = 0.015;
const ALCOHOL_PER_DRINK = 14;

export default function BloodAlcoholCalculatorPage() {
  const t = useTranslations("tools.blood-alcohol-calculator");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("70");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [drinks, setDrinks] = useState("2");
  const [hours, setHours] = useState("2");
  const [result, setResult] = useState<{
    bac: string;
    status: string;
  } | null>(null);
  const [error, setError] = useState(false);

  const calculate = () => {
    const w = parseFloat(weight);
    const d = parseFloat(drinks);
    const h = parseFloat(hours);
    if (
      Number.isNaN(w) ||
      Number.isNaN(d) ||
      Number.isNaN(h) ||
      w <= 0 ||
      d < 0 ||
      h < 0
    ) {
      setError(true);
      setResult(null);
      return;
    }
    setError(false);

    const weightKg = weightUnit === "kg" ? w : w * 0.45359237;
    const weightGrams = weightKg * 1000;
    const alcoholGrams = d * ALCOHOL_PER_DRINK;

    const rawBac =
      (alcoholGrams / (WIDMARK_R[gender] * weightGrams)) * 100 - METABOLISM * h;
    const bac = Math.max(0, rawBac);

    let status = "safe";
    if (bac >= 0.08) status = "dangerous";
    else if (bac >= 0.05) status = "illegal";
    else if (bac >= 0.02) status = "impaired";

    setResult({
      bac: bac.toFixed(3),
      status,
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="blood-alcohol-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.gender")}
          </label>
          <div className="flex flex-wrap gap-2">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGender(g);
                  setResult(null);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  gender === g
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {t(`options.${g}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
              {t("labels.weightUnit")}
            </label>
            <div className="flex flex-wrap gap-2">
              {(["kg", "lbs"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    setWeightUnit(u);
                    setResult(null);
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    weightUnit === u
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {t(`options.${u}`)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.drinks")}
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={drinks}
              onChange={(e) => setDrinks(e.target.value)}
              placeholder="2"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.hours")}
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="2"
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

        {error && (
          <p className="text-sm text-red-400">{t("errors.invalid")}</p>
        )}

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div>
              <p className="text-sm text-zinc-400">{t("labels.bac")}</p>
              <p className="text-3xl font-bold text-blue-400">{result.bac}%</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">{t("labels.bacStatus")}</p>
              <p className="text-xl font-semibold text-zinc-200">
                {t(`categories.${result.status}`)}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
