"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function ConcreteCalculatorPage() {
  const t = useTranslations("tools.concrete-calculator");
  const [unit, setUnit] = useState<"metric" | "imperial">("imperial");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [result, setResult] = useState<{
    volume: string;
    bags: string;
    bagLabel: string;
  } | null>(null);

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const d = parseFloat(depth);

    if (
      Number.isNaN(l) ||
      Number.isNaN(w) ||
      Number.isNaN(d) ||
      l <= 0 ||
      w <= 0 ||
      d <= 0
    ) {
      setResult(null);
      return;
    }

    let volumePrimary = 0;
    let bagCount = 0;

    if (unit === "imperial") {
      const cubicFeet = l * w * (d / 12);
      volumePrimary = cubicFeet / 27;
      bagCount = Math.ceil(cubicFeet / 0.6);
    } else {
      volumePrimary = l * w * d;
      bagCount = Math.ceil(volumePrimary / 0.015);
    }

    const fmt = (v: number) =>
      v.toLocaleString(undefined, { maximumFractionDigits: 2 });

    setResult({
      volume: `${fmt(volumePrimary)} ${
        unit === "imperial" ? t("units.cubicYards") : t("units.cubicMeters")
      }`,
      bags: bagCount.toLocaleString(),
      bagLabel:
        unit === "imperial" ? t("units.eightyLb") : t("units.twentyFiveKg"),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="concrete-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["imperial", "metric"] as const).map((u) => (
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
              {t("labels.length")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder={unit === "imperial" ? "10" : "3"}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.width")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder={unit === "imperial" ? "10" : "3"}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.depth")}
            </label>
            <input
              type="number"
              min="0"
              step="0.25"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              placeholder={unit === "imperial" ? "4" : "0.1"}
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.volume")}
              </h3>
              <CopyButton text={result.volume} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.volume}</p>
            <div>
              <p className="text-sm text-zinc-400">
                {t("labels.bags")} ({result.bagLabel})
              </p>
              <p className="text-xl font-semibold text-zinc-200">{result.bags}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
