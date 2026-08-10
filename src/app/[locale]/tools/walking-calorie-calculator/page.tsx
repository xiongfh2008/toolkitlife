"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

function metForSpeed(speedKmh: number): number {
  if (speedKmh < 3.2) return 2.0;
  if (speedKmh < 4.8) return 3.0;
  if (speedKmh < 6.4) return 3.5;
  if (speedKmh < 8.0) return 5.0;
  return 8.0;
}

export default function WalkingCalorieCalculatorPage() {
  const t = useTranslations("tools.walking-calorie-calculator");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [mode, setMode] = useState<"distance" | "steps">("distance");
  const [weight, setWeight] = useState("70");
  const [distance, setDistance] = useState("5");
  const [steps, setSteps] = useState("7000");
  const [speed, setSpeed] = useState("5");
  const [result, setResult] = useState<{
    calories: string;
    duration: string;
    distanceKm: string;
  } | null>(null);
  const [error, setError] = useState(false);

  const calculate = () => {
    const w = parseFloat(weight);
    const s = parseFloat(speed);
    if (Number.isNaN(w) || w <= 0 || Number.isNaN(s) || s <= 0) {
      setError(true);
      setResult(null);
      return;
    }

    let distanceKm = 0;
    if (mode === "distance") {
      const d = parseFloat(distance);
      if (Number.isNaN(d) || d <= 0) {
        setError(true);
        setResult(null);
        return;
      }
      distanceKm = unit === "metric" ? d : d * 1.609344;
    } else {
      const st = parseFloat(steps);
      if (Number.isNaN(st) || st <= 0) {
        setError(true);
        setResult(null);
        return;
      }
      distanceKm = st * 0.000762;
    }

    const weightKg = unit === "metric" ? w : w * 0.45359237;
    const speedKmh = unit === "metric" ? s : s * 1.609344;
    const hours = distanceKm / speedKmh;
    const calories = metForSpeed(speedKmh) * weightKg * hours;

    setError(false);
    setResult({
      calories: Math.round(calories).toLocaleString(),
      duration: `${Math.floor(hours * 60)} ${t("labels.minutes")}`,
      distanceKm: distanceKm.toFixed(2),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="walking-calorie-calculator"
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

        <div className="flex flex-wrap gap-2">
          {(["distance", "steps"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setResult(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`options.${m}`)}
            </button>
          ))}
        </div>

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
          {mode === "distance" ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {unit === "metric"
                  ? t("labels.distanceKm")
                  : t("labels.distanceMile")}
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="5"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.steps")}
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="7000"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {unit === "metric" ? t("labels.speedKmh") : t("labels.speedMph")}
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              placeholder="5"
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
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.calories")}</p>
                <p className="text-3xl font-bold text-blue-400">
                  {result.calories}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.duration")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.duration}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.distanceKm")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.distanceKm} km
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
