"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function BodyFatCalculatorPage() {
  const t = useTranslations("tools.body-fat-calculator");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [hip, setHip] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<{ bodyFat: string; category: string } | null>(null);

  const toInches = (value: number) => (unit === "metric" ? value / 2.54 : value);

  const calculate = () => {
    const w = parseFloat(waist);
    const n = parseFloat(neck);
    const h = parseFloat(height);
    const hp = gender === "female" ? parseFloat(hip) : 0;

    if (
      Number.isNaN(w) ||
      Number.isNaN(n) ||
      Number.isNaN(h) ||
      w <= 0 ||
      n <= 0 ||
      h <= 0
    ) {
      setResult(null);
      return;
    }

    if (gender === "female" && (Number.isNaN(hp) || hp <= 0)) {
      setResult(null);
      return;
    }

    const waistIn = toInches(w);
    const neckIn = toInches(n);
    const heightIn = toInches(h);
    const hipIn = gender === "female" ? toInches(hp) : 0;

    let bodyFat = 0;
    if (gender === "male") {
      bodyFat =
        86.01 * Math.log10(waistIn - neckIn) -
        70.041 * Math.log10(heightIn) +
        36.76;
    } else {
      bodyFat =
        163.205 * Math.log10(hipIn + waistIn - neckIn) -
        97.684 * Math.log10(heightIn) -
        78.387;
    }

    bodyFat = Math.max(0, bodyFat);

    let category = "obese";
    if (bodyFat < (gender === "male" ? 6 : 14)) {
      category = "essential";
    } else if (bodyFat < (gender === "male" ? 14 : 21)) {
      category = "athletes";
    } else if (bodyFat < (gender === "male" ? 18 : 25)) {
      category = "fitness";
    } else if (bodyFat < (gender === "male" ? 25 : 32)) {
      category = "average";
    }

    setResult({
      bodyFat: bodyFat.toFixed(1),
      category: t(`categories.${category}`),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="body-fat-calculator"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {unit === "metric" ? t("labels.waistCm") : t("labels.waistIn")}
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder={unit === "metric" ? "80" : "32"}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {unit === "metric" ? t("labels.neckCm") : t("labels.neckIn")}
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              placeholder={unit === "metric" ? "35" : "14"}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          {gender === "female" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {unit === "metric" ? t("labels.hipCm") : t("labels.hipIn")}
              </label>
              <input
                type="number"
                min="1"
                step="0.1"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                placeholder={unit === "metric" ? "95" : "38"}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {unit === "metric" ? t("labels.heightCm") : t("labels.heightIn")}
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unit === "metric" ? "175" : "69"}
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
            <div>
              <p className="text-sm text-zinc-400">{t("labels.bodyFat")}</p>
              <p className="text-3xl font-bold text-blue-400">{result.bodyFat}%</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">{t("labels.category")}</p>
              <p className="text-xl font-semibold text-zinc-200">{result.category}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
