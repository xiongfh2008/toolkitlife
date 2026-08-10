"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const PRESETS = {
  standard: { carbs: 5, protein: 25, fat: 70 },
  highProtein: { carbs: 5, protein: 35, fat: 60 },
  therapeutic: { carbs: 2, protein: 8, fat: 90 },
} as const;

export default function KetoCalculatorPage() {
  const t = useTranslations("tools.keto-calculator");
  const [calories, setCalories] = useState("2000");
  const [preset, setPreset] = useState<keyof typeof PRESETS>("standard");
  const [result, setResult] = useState<{
    carbs: string;
    protein: string;
    fat: string;
  } | null>(null);
  const [error, setError] = useState(false);

  const calculate = () => {
    const c = parseFloat(calories);
    if (Number.isNaN(c) || c <= 0) {
      setError(true);
      setResult(null);
      return;
    }
    setError(false);

    const ratio = PRESETS[preset];
    const carbs = Math.round((c * (ratio.carbs / 100)) / 4);
    const protein = Math.round((c * (ratio.protein / 100)) / 4);
    const fat = Math.round((c * (ratio.fat / 100)) / 9);

    setResult({
      carbs: carbs.toString(),
      protein: protein.toString(),
      fat: fat.toString(),
    });
  };

  const presets = Object.keys(PRESETS) as Array<keyof typeof PRESETS>;

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="keto-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.calories")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="2000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.preset")}
            </label>
            <select
              value={preset}
              onChange={(e) =>
                setPreset(e.target.value as keyof typeof PRESETS)
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            >
              {presets.map((p) => (
                <option key={p} value={p}>
                  {t(`options.${p}`)}
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
            <p className="text-sm font-medium text-zinc-300">
              {t("labels.macroTargets")}
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-zinc-800 p-4 text-center">
                <p className="text-sm text-zinc-400">{t("labels.carbs")}</p>
                <p className="text-2xl font-bold text-blue-400">
                  {result.carbs}g
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800 p-4 text-center">
                <p className="text-sm text-zinc-400">{t("labels.protein")}</p>
                <p className="text-2xl font-bold text-blue-400">
                  {result.protein}g
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800 p-4 text-center">
                <p className="text-sm text-zinc-400">{t("labels.fat")}</p>
                <p className="text-2xl font-bold text-blue-400">
                  {result.fat}g
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
