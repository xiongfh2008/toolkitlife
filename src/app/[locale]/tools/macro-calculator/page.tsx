"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const presets = {
  balanced: { protein: 25, carbs: 45, fats: 30 },
  lowCarb: { protein: 40, carbs: 20, fats: 40 },
  highCarb: { protein: 20, carbs: 60, fats: 20 },
  keto: { protein: 25, carbs: 5, fats: 70 },
};

export default function MacroCalculatorPage() {
  const t = useTranslations("tools.macro-calculator");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("25");
  const [carbs, setCarbs] = useState("45");
  const [fats, setFats] = useState("30");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ protein: string; carbs: string; fats: string } | null>(null);

  const applyPreset = (key: keyof typeof presets) => {
    const p = presets[key];
    setProtein(String(p.protein));
    setCarbs(String(p.carbs));
    setFats(String(p.fats));
    setResult(null);
    setError("");
  };

  const calculate = () => {
    const c = parseFloat(calories);
    const p = parseFloat(protein);
    const cb = parseFloat(carbs);
    const f = parseFloat(fats);

    if (Number.isNaN(c) || c <= 0 || Number.isNaN(p) || Number.isNaN(cb) || Number.isNaN(f)) {
      setError(t("errors.invalid"));
      setResult(null);
      return;
    }

    const total = p + cb + f;
    if (Math.abs(total - 100) > 0.1) {
      setError(t("errors.total", { total: total.toFixed(1) }));
      setResult(null);
      return;
    }

    setError("");
    setResult({
      protein: ((c * (p / 100)) / 4).toFixed(1),
      carbs: ((c * (cb / 100)) / 4).toFixed(1),
      fats: ((c * (f / 100)) / 9).toFixed(1),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="macro-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.presets")}
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(presets) as (keyof typeof presets)[]).map((key) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className="rounded-lg bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                {t(`options.${key}`)}
              </button>
            ))}
          </div>
        </div>

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
              {t("labels.protein")}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="25"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.carbs")}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="45"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.fats")}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={fats}
              onChange={(e) => setFats(e.target.value)}
              placeholder="30"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={calculate}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.calculate")}
        </button>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <h3 className="text-sm font-medium text-zinc-300">{t("labels.dailyTargets")}</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.proteinGrams")}</p>
                <p className="text-2xl font-bold text-blue-400">{result.protein}g</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.carbsGrams")}</p>
                <p className="text-2xl font-bold text-blue-400">{result.carbs}g</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.fatsGrams")}</p>
                <p className="text-2xl font-bold text-blue-400">{result.fats}g</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
