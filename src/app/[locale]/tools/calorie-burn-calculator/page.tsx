"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Activity {
  key: string;
  met: number;
}

export default function CalorieBurnCalculatorPage() {
  const t = useTranslations("tools.calorie-burn-calculator");
  const [activityKey, setActivityKey] = useState("walking");
  const [duration, setDuration] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg");
  const [result, setResult] = useState<{
    calories: number;
    label: string;
  } | null>(null);

  const activities: Activity[] = [
    { key: "walking", met: 3.5 },
    { key: "running", met: 9.8 },
    { key: "cycling", met: 7.5 },
    { key: "swimming", met: 8.0 },
    { key: "yoga", met: 2.5 },
    { key: "weightlifting", met: 3.0 },
    { key: "hiit", met: 11.0 },
    { key: "hiking", met: 6.0 },
    { key: "jumpingRope", met: 12.0 },
    { key: "elliptical", met: 5.0 },
  ];

  const calculate = (
    key = activityKey,
    dur = duration,
    w = weight,
    u = unit,
  ) => {
    const durN = parseFloat(dur);
    const weightN = parseFloat(w);
    if (
      Number.isNaN(durN) ||
      Number.isNaN(weightN) ||
      durN <= 0 ||
      weightN <= 0
    ) {
      setResult(null);
      return;
    }

    const weightKg = u === "kg" ? weightN : weightN * 0.453592;
    const activity = activities.find((a) => a.key === key);
    if (!activity) return;

    const calories = Math.round((activity.met * weightKg * 3.5 * durN) / 200);
    setResult({
      calories,
      label: t(`activities.${key}`),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="calorie-burn-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.activity")}
          </label>
          <select
            value={activityKey}
            onChange={(e) => {
              setActivityKey(e.target.value);
              calculate(e.target.value, duration, weight, unit);
            }}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          >
            {activities.map((a) => (
              <option key={a.key} value={a.key}>
                {t(`activities.${a.key}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.duration")}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
                calculate(activityKey, e.target.value, weight, unit);
              }}
              placeholder="30"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
            <p className="mt-1 text-xs text-zinc-500">{t("labels.minutes")}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.weight")}
            </label>
            <div className="flex">
              <input
                type="number"
                min="0"
                step="0.1"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  calculate(activityKey, duration, e.target.value, unit);
                }}
                placeholder="70"
                className="w-full rounded-l-lg border border-r-0 border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
              <select
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value);
                  calculate(activityKey, duration, weight, e.target.value);
                }}
                className="rounded-r-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
              >
                <option value="kg">{t("options.kg")}</option>
                <option value="lbs">{t("options.lbs")}</option>
              </select>
            </div>
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.caloriesBurned")}
              </h3>
              <CopyButton
                text={`${result.calories} kcal`}
                className="text-xs px-2 py-1"
              />
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {result.calories} {t("labels.kcal")}
            </p>
            <p className="text-sm text-zinc-400">
              {t("labels.activityLabel")}: {result.label}
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
