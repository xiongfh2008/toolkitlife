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

function calculateMean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function calculateMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

function calculateMode(values: number[]): number[] {
  const counts = new Map<number, number>();
  for (const v of values) {
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  let max = 0;
  for (const count of counts.values()) {
    if (count > max) max = count;
  }
  if (max <= 1) return [];
  return Array.from(counts.entries())
    .filter(([, count]) => count === max)
    .map(([value]) => value)
    .sort((a, b) => a - b);
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(4).replace(/\.?0+$/, "");
}

export default function MeanMedianModeCalculatorPage() {
  const t = useTranslations("tools.mean-median-mode-calculator");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    mean: number;
    median: number;
    mode: number[];
    count: number;
    sum: number;
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
      setResult({
        mean: calculateMean(values),
        median: calculateMedian(values),
        mode: calculateMode(values),
        count: values.length,
        sum: values.reduce((a, b) => a + b, 0),
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
      slug="mean-median-mode-calculator"
    >
      <div className="max-w-3xl space-y-4">
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
                <p className="text-sm text-zinc-400">{t("labels.sum")}</p>
                <p className="text-xl font-semibold text-zinc-200">{formatNumber(result.sum)}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.mean")}</p>
                <p className="text-3xl font-bold text-blue-400">{formatNumber(result.mean)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.median")}</p>
                <p className="text-3xl font-bold text-blue-400">{formatNumber(result.median)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.mode")}</p>
                <p className="text-3xl font-bold text-blue-400">
                  {result.mode.length > 0 ? result.mode.map(formatNumber).join(", ") : t("labels.noMode")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
