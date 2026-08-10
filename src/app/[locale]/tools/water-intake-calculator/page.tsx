"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const activityMultipliers = {
  sedentary: 1,
  light: 1.1,
  moderate: 1.2,
  active: 1.35,
  veryActive: 1.5,
};

export default function WaterIntakeCalculatorPage() {
  const t = useTranslations("tools.water-intake-calculator");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<keyof typeof activityMultipliers>("sedentary");
  const [result, setResult] = useState<{ ml: string; oz: string; cups: string } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    if (Number.isNaN(w) || w <= 0) {
      setResult(null);
      return;
    }

    let ml = 0;
    if (unit === "metric") {
      ml = w * 35 * activityMultipliers[activity];
    } else {
      const oz = w * 0.5 * activityMultipliers[activity] + 12;
      ml = oz * 29.5735;
    }

    const oz = ml / 29.5735;
    const cups = oz / 8;

    setResult({
      ml: Math.round(ml).toLocaleString(),
      oz: oz.toFixed(1),
      cups: cups.toFixed(1),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="water-intake-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["metric", "imperial"] as const).map((u) => (
            <button
              key={u}
              onClick={() => {
                setUnit(u);
                setResult(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                unit === u
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`options.${u}`)}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {unit === "metric" ? t("labels.weightKg") : t("labels.weightLbs")}
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === "metric" ? "70" : "150"}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.activityLevel")}
            </label>
            <select
              value={activity}
              onChange={(e) =>
                setActivity(e.target.value as keyof typeof activityMultipliers)
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            >
              {(Object.keys(activityMultipliers) as (keyof typeof activityMultipliers)[]).map(
                (key) => (
                  <option key={key} value={key}>
                    {t(`options.${key}`)}
                  </option>
                )
              )}
            </select>
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
            <div>
              <p className="text-sm text-zinc-400">{t("labels.dailyWater")}</p>
              <p className="text-3xl font-bold text-blue-400">{result.ml} ml</p>
              <p className="text-sm text-zinc-500">
                {result.oz} oz / {result.cups} {t("labels.cups")}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
