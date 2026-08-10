"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const GOAL_MULTIPLIERS = {
  maintain: 1.2,
  lose: 1.4,
  gain: 1.8,
} as const;

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.0,
  light: 1.1,
  moderate: 1.2,
  active: 1.3,
  veryActive: 1.5,
} as const;

export default function ProteinCalculatorPage() {
  const t = useTranslations("tools.protein-calculator");
  const [weight, setWeight] = useState("70");
  const [goal, setGoal] = useState<keyof typeof GOAL_MULTIPLIERS>("maintain");
  const [activityLevel, setActivityLevel] = useState<keyof typeof ACTIVITY_MULTIPLIERS>("moderate");

  const calculate = () => {
    const w = parseFloat(weight);
    if (Number.isNaN(w) || w <= 0) return null;

    const baseProtein = w * GOAL_MULTIPLIERS[goal];
    const protein = Math.round(baseProtein * ACTIVITY_MULTIPLIERS[activityLevel]);

    return {
      protein: protein.toString(),
      range: `${Math.round(protein * 0.9)}g - ${Math.round(protein * 1.1)}g`,
    };
  };

  const result = calculate();

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="protein-calculator"
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
              {t("labels.goal")}
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as keyof typeof GOAL_MULTIPLIERS)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              {(Object.keys(GOAL_MULTIPLIERS) as Array<keyof typeof GOAL_MULTIPLIERS>).map((g) => (
                <option key={g} value={g}>
                  {t(`options.${g}`)}
                </option>
              ))}
            </select>
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
            <div>
              <p className="text-sm text-zinc-400">{t("labels.protein")}</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-blue-400">{result.protein}g</p>
                <CopyButton text={`${result.protein}g`} className="text-xs px-2 py-1" />
              </div>
              <p className="text-sm text-zinc-500 mt-1">{t("labels.range")}: {result.range}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
