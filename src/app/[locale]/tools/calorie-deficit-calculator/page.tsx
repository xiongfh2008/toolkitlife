"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
} as const;

export default function CalorieDeficitCalculatorPage() {
  const t = useTranslations("tools.calorie-deficit-calculator");
  const [currentWeight, setCurrentWeight] = useState("70");
  const [goalWeight, setGoalWeight] = useState("65");
  const [timeframe, setTimeframe] = useState("12");
  const [activityLevel, setActivityLevel] = useState<keyof typeof ACTIVITY_MULTIPLIERS>("moderate");

  const calculate = () => {
    const current = parseFloat(currentWeight);
    const goal = parseFloat(goalWeight);
    const weeks = parseFloat(timeframe);

    if (
      Number.isNaN(current) ||
      Number.isNaN(goal) ||
      Number.isNaN(weeks) ||
      current <= 0 ||
      goal <= 0 ||
      weeks <= 0
    ) {
      return null;
    }

    const bmr = 10 * current + 6.25 * 170 - 5 * 30 + 5;
    const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
    const weightDiffKg = current - goal;
    const totalDeficit = weightDiffKg * 7700;
    const dailyDeficit = totalDeficit / (weeks * 7);
    const dailyCalories = Math.max(1200, tdee - dailyDeficit);

    return {
      dailyDeficit: Math.round(dailyDeficit).toLocaleString(),
      dailyCalories: Math.round(dailyCalories).toLocaleString(),
      totalDeficit: Math.round(totalDeficit).toLocaleString(),
    };
  };

  const result = calculate();

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="calorie-deficit-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.currentWeight")}
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="70"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.goalWeight")}
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
              placeholder="65"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.timeframe")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="12"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.activityLevel")}
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as keyof typeof ACTIVITY_MULTIPLIERS)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              {(Object.keys(ACTIVITY_MULTIPLIERS) as Array<keyof typeof ACTIVITY_MULTIPLIERS>).map((level) => (
                <option key={level} value={level}>
                  {t(`options.${level}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.dailyCalories")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-blue-400">{result.dailyCalories}</p>
                  <CopyButton text={result.dailyCalories} className="text-xs px-2 py-1" />
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.dailyDeficit")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.dailyDeficit}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalDeficit")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalDeficit}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
