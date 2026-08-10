"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

function parseNumbers(input: string): number[] {
  const parts = input.split(/[,\s\n]+/).filter((p) => p.trim() !== "");
  return parts.map((p) => {
    const n = parseFloat(p);
    if (Number.isNaN(n)) throw new Error("invalid");
    return n;
  });
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(6).replace(/\.?0+$/, "");
}

export default function StandardDeviationCalculatorPage() {
  const t = useTranslations("tools.standard-deviation-calculator");
  const [input, setInput] = useState("");
  const [type, setType] = useState<"population" | "sample">("sample");
  const [result, setResult] = useState<{
    count: number;
    mean: number;
    variance: number;
    stdDev: number;
  } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    setResult(null);
    try {
      const values = parseNumbers(input);
      if (values.length === 0) {
        setError(t("errors.empty"));
        return;
      }
      if (type === "sample" && values.length < 2) {
        setError(t("errors.sampleSize"));
        return;
      }
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
      const divisor = type === "population" ? values.length : values.length - 1;
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / divisor;
      setResult({
        count: values.length,
        mean,
        variance,
        stdDev: Math.sqrt(variance),
      });
    } catch {
      setError(t("errors.invalid"));
    }
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="standard-deviation-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.type")}
          </label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as "population" | "sample");
              setResult(null);
              setError("");
            }}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="sample">{t("options.sample")}</option>
            <option value="population">{t("options.population")}</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.numbers")}
          </label>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setResult(null);
              setError("");
            }}
            placeholder={t("labels.placeholder")}
            rows={5}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
          />
        </div>

        <button
          onClick={calculate}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.calculate")}
        </button>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.count")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.count}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.mean")}</p>
                <p className="text-xl font-semibold text-zinc-200">{formatNumber(result.mean)}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.variance")}</p>
                <p className="text-3xl font-bold text-blue-400">{formatNumber(result.variance)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.stdDev")}</p>
                <p className="text-3xl font-bold text-blue-400">{formatNumber(result.stdDev)}</p>
              </div>
            </div>
            <p className="text-sm text-zinc-500">{t("labels.typeNote")}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
