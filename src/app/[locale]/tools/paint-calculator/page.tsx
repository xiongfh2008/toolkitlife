"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function PaintCalculatorPage() {
  const t = useTranslations("tools.paint-calculator");
  const [unit, setUnit] = useState<"metric" | "imperial">("imperial");
  const [wallArea, setWallArea] = useState("");
  const [openingsArea, setOpeningsArea] = useState("0");
  const [coats, setCoats] = useState("2");
  const [coverage, setCoverage] = useState("350");
  const [result, setResult] = useState<{
    paintNeeded: string;
    netArea: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const switchUnit = (u: "metric" | "imperial") => {
    setUnit(u);
    setCoverage(u === "imperial" ? "350" : "10");
    setResult(null);
    setError(null);
  };

  const calculate = () => {
    const wall = parseFloat(wallArea);
    const openings = parseFloat(openingsArea) || 0;
    const coatCount = parseFloat(coats);
    const cov = parseFloat(coverage);

    if (
      Number.isNaN(wall) ||
      wall <= 0 ||
      Number.isNaN(coatCount) ||
      coatCount <= 0 ||
      Number.isNaN(cov) ||
      cov <= 0 ||
      openings < 0
    ) {
      setResult(null);
      setError(null);
      return;
    }

    if (openings > wall) {
      setResult(null);
      setError(t("labels.error"));
      return;
    }

    const net = wall - openings;
    const paint = (net * coatCount) / cov;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, { maximumFractionDigits: 2 });

    setError(null);
    setResult({
      paintNeeded: `${fmt(paint)} ${
        unit === "imperial" ? t("units.gallons") : t("units.liters")
      }`,
      netArea: `${fmt(net)} ${
        unit === "imperial" ? t("units.squareFeet") : t("units.squareMeters")
      }`,
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="paint-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["imperial", "metric"] as const).map((u) => (
            <button
              key={u}
              onClick={() => switchUnit(u)}
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.wallArea")}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={wallArea}
              onChange={(e) => setWallArea(e.target.value)}
              placeholder={unit === "imperial" ? "350" : "40"}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.openingsArea")}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={openingsArea}
              onChange={(e) => setOpeningsArea(e.target.value)}
              placeholder={unit === "imperial" ? "50" : "5"}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.coats")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={coats}
              onChange={(e) => setCoats(e.target.value)}
              placeholder="2"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.coverage")}
            </label>
            <input
              type="number"
              min="0.1"
              step="1"
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              placeholder={unit === "imperial" ? "350" : "10"}
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
          <p className="text-sm font-medium text-red-400">{error}</p>
        )}

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.paintNeeded")}
              </h3>
              <CopyButton text={result.paintNeeded} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.paintNeeded}</p>
            <div>
              <p className="text-sm text-zinc-400">{t("labels.netArea")}</p>
              <p className="text-xl font-semibold text-zinc-200">{result.netArea}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
