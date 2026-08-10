"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function SquareFootageCalculatorPage() {
  const t = useTranslations("tools.square-footage-calculator");
  const [shape, setShape] = useState<"rectangle" | "circle" | "triangle">("rectangle");
  const [unit, setUnit] = useState<"metric" | "imperial">("imperial");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState<{
    area: string;
    other: string;
  } | null>(null);

  const calculate = () => {
    const valA = parseFloat(a);
    const valB = parseFloat(b);
    let areaPrimary = 0;

    if (shape === "rectangle") {
      if (
        Number.isNaN(valA) ||
        Number.isNaN(valB) ||
        valA <= 0 ||
        valB <= 0
      ) {
        setResult(null);
        return;
      }
      areaPrimary = valA * valB;
    } else if (shape === "circle") {
      if (Number.isNaN(valA) || valA <= 0) {
        setResult(null);
        return;
      }
      areaPrimary = Math.PI * valA * valA;
    } else {
      if (
        Number.isNaN(valA) ||
        Number.isNaN(valB) ||
        valA <= 0 ||
        valB <= 0
      ) {
        setResult(null);
        return;
      }
      areaPrimary = (valA * valB) / 2;
    }

    const primaryUnit = unit === "imperial" ? t("units.squareFeet") : t("units.squareMeters");
    const otherUnit = unit === "imperial" ? t("units.squareMeters") : t("units.squareFeet");
    const otherArea =
      unit === "imperial"
        ? areaPrimary * 0.09290304
        : areaPrimary / 0.09290304;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, { maximumFractionDigits: 2 });

    setResult({
      area: `${fmt(areaPrimary)} ${primaryUnit}`,
      other: `${fmt(otherArea)} ${otherUnit}`,
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="square-footage-calculator"
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

        <div className="flex flex-wrap gap-2">
          {(["rectangle", "circle", "triangle"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setShape(s);
                setA("");
                setB("");
                setResult(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                shape === s
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`options.${s}`)}
            </button>
          ))}
        </div>

        {shape === "rectangle" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.length")}
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder={unit === "imperial" ? "12" : "4"}
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
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder={unit === "imperial" ? "10" : "3"}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
        )}

        {shape === "circle" && (
          <div className="max-w-sm">
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.radius")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder={unit === "imperial" ? "6" : "2"}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        )}

        {shape === "triangle" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.base")}
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder={unit === "imperial" ? "10" : "3"}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.height")}
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder={unit === "imperial" ? "8" : "2.5"}
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.area")}</h3>
              <CopyButton text={result.area} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.area}</p>
            <p className="text-sm text-zinc-400">
              {t("labels.areaInOther")}: <span className="font-semibold text-zinc-200">{result.other}</span>
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
