"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function WeightLossCalculatorPage() {
  const t = useTranslations("tools.weight-loss-calculator");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [currentWeight, setCurrentWeight] = useState("80");
  const [targetWeight, setTargetWeight] = useState("70");
  const [dailyDeficit, setDailyDeficit] = useState("500");
  const [result, setResult] = useState<{
    days: string;
    goalDate: string;
    weeklyLoss: string;
    totalDeficit: string;
  } | null>(null);
  const [error, setError] = useState(false);

  const calculate = () => {
    const current = parseFloat(currentWeight);
    const target = parseFloat(targetWeight);
    const deficit = parseFloat(dailyDeficit);

    if (
      Number.isNaN(current) ||
      Number.isNaN(target) ||
      Number.isNaN(deficit) ||
      current <= 0 ||
      target <= 0 ||
      deficit <= 0 ||
      (unit === "kg" && target >= current) ||
      (unit === "lbs" && target >= current)
    ) {
      setError(true);
      setResult(null);
      return;
    }
    setError(false);

    const toLose = current - target;
    const caloriesPerUnit = unit === "kg" ? 7700 : 3500;
    const totalDeficit = toLose * caloriesPerUnit;
    const days = Math.ceil(totalDeficit / deficit);
    const weeklyLoss = (deficit * 7) / caloriesPerUnit;

    const goalDate = new Date();
    goalDate.setDate(goalDate.getDate() + days);

    setResult({
      days: days.toLocaleString(),
      goalDate: goalDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      weeklyLoss: weeklyLoss.toFixed(2),
      totalDeficit: Math.round(totalDeficit).toLocaleString(),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="weight-loss-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["kg", "lbs"] as const).map((u) => (
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

        <div className="grid gap-4 sm:grid-cols-3">
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
              placeholder="80"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.targetWeight")}
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              placeholder="70"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.dailyDeficit")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={dailyDeficit}
              onChange={(e) => setDailyDeficit(e.target.value)}
              placeholder="500"
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.daysToGoal")}</p>
                <p className="text-3xl font-bold text-blue-400">
                  {result.days}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.goalDate")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.goalDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.weeklyLoss")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.weeklyLoss} {unit}/{t("labels.perWeek")}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.totalDeficit")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.totalDeficit} {t("labels.kcal")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
