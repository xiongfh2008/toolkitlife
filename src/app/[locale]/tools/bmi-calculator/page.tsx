"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function BmiCalculatorPage() {
  const t = useTranslations("tools.bmi-calculator");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [result, setResult] = useState<{
    bmi: string;
    category: string;
  } | null>(null);

  const calculate = () => {
    let bmi = 0;

    if (unit === "metric") {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);
      if (Number.isNaN(h) || Number.isNaN(w) || h <= 0 || w <= 0) {
        setResult(null);
        return;
      }
      const meters = h / 100;
      bmi = w / (meters * meters);
    } else {
      const ft = parseFloat(heightFt);
      const inc = parseFloat(heightIn || "0");
      const w = parseFloat(weightLbs);
      if (
        Number.isNaN(ft) ||
        Number.isNaN(inc) ||
        Number.isNaN(w) ||
        w <= 0
      ) {
        setResult(null);
        return;
      }
      const totalInches = ft * 12 + inc;
      if (totalInches <= 0) {
        setResult(null);
        return;
      }
      bmi = (703 * w) / (totalInches * totalInches);
    }

    let category = "obese";
    if (bmi < 18.5) {
      category = "underweight";
    } else if (bmi < 25) {
      category = "normalWeight";
    } else if (bmi < 30) {
      category = "overweight";
    }

    setResult({
      bmi: bmi.toFixed(1),
      category: t(`categories.${category}`),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="bmi-calculator"
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

        {unit === "metric" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.heightCm")}
              </label>
              <input
                type="number"
                min="1"
                step="0.1"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="175"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.weightKg")}
              </label>
              <input
                type="number"
                min="1"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="70"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.heightFt")}
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="5"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.heightIn")}
              </label>
              <input
                type="number"
                min="0"
                max="11"
                step="1"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="9"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.weightLbs")}
              </label>
              <input
                type="number"
                min="1"
                step="0.1"
                value={weightLbs}
                onChange={(e) => setWeightLbs(e.target.value)}
                placeholder="160"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
        )}

        <button
          onClick={calculate}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.calculate")}
        </button>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div>
              <p className="text-sm text-zinc-400">{t("labels.bmi")}</p>
              <p className="text-3xl font-bold text-blue-400">{result.bmi}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">{t("labels.category")}</p>
              <p className="text-xl font-semibold text-zinc-200">
                {result.category}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
