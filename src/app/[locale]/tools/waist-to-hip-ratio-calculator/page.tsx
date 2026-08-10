"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function WaistToHipRatioCalculatorPage() {
  const t = useTranslations("tools.waist-to-hip-ratio-calculator");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [result, setResult] = useState<{
    ratio: string;
    category: string;
  } | null>(null);

  const calculate = () => {
    const w = parseFloat(waist);
    const h = parseFloat(hip);

    if (Number.isNaN(w) || Number.isNaN(h) || w <= 0 || h <= 0) {
      setResult(null);
      return;
    }

    const ratio = w / h;
    let category = "low";

    if (gender === "male") {
      if (ratio >= 1.0) {
        category = "high";
      } else if (ratio >= 0.9) {
        category = "moderate";
      } else {
        category = "low";
      }
    } else {
      if (ratio >= 0.85) {
        category = "high";
      } else if (ratio >= 0.8) {
        category = "moderate";
      } else {
        category = "low";
      }
    }

    setResult({
      ratio: ratio.toFixed(2),
      category: t(`categories.${category}`),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="waist-to-hip-ratio-calculator"
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
              {t("labels.waist")}
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder="80"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.hip")}
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              placeholder="95"
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

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.ratio")}
                </p>
                <p className="text-3xl font-bold text-blue-400">
                  {result.ratio}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.category")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.category}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
