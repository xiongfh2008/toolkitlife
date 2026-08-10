"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function TileCalculatorPage() {
  const t = useTranslations("tools.tile-calculator");
  const [unit, setUnit] = useState<"metric" | "imperial">("imperial");
  const [area, setArea] = useState("");
  const [tileWidth, setTileWidth] = useState("");
  const [tileHeight, setTileHeight] = useState("");
  const [waste, setWaste] = useState("10");
  const [boxSize, setBoxSize] = useState("");
  const [result, setResult] = useState<{
    tiles: string;
    boxes?: string;
  } | null>(null);

  const calculate = () => {
    const a = parseFloat(area);
    const tw = parseFloat(tileWidth);
    const th = parseFloat(tileHeight);
    const wastePct = parseFloat(waste) || 0;
    const box = parseFloat(boxSize);

    if (
      Number.isNaN(a) ||
      Number.isNaN(tw) ||
      Number.isNaN(th) ||
      a <= 0 ||
      tw <= 0 ||
      th <= 0 ||
      wastePct < 0
    ) {
      setResult(null);
      return;
    }

    let tileArea = 0;
    if (unit === "imperial") {
      tileArea = (tw * th) / 144;
    } else {
      tileArea = (tw * th) / 10000;
    }

    const tilesNeeded = Math.ceil((a / tileArea) * (1 + wastePct / 100));
    const boxesNeeded =
      !Number.isNaN(box) && box > 0 ? Math.ceil(tilesNeeded / box) : undefined;

    setResult({
      tiles: tilesNeeded.toLocaleString(),
      boxes: boxesNeeded?.toLocaleString(),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="tile-calculator"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.area")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder={unit === "imperial" ? "50" : "10"}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.tileWidth")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={tileWidth}
              onChange={(e) => setTileWidth(e.target.value)}
              placeholder={unit === "imperial" ? "12" : "30"}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.tileHeight")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={tileHeight}
              onChange={(e) => setTileHeight(e.target.value)}
              placeholder={unit === "imperial" ? "12" : "30"}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.waste")}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={waste}
              onChange={(e) => setWaste(e.target.value)}
              placeholder="10"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.boxSize")}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={boxSize}
              onChange={(e) => setBoxSize(e.target.value)}
              placeholder={unit === "imperial" ? "10" : "5"}
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
                {t("labels.tilesNeeded")}
              </h3>
              <CopyButton text={result.tiles} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.tiles}</p>
            {result.boxes && (
              <div>
                <p className="text-sm text-zinc-400">{t("labels.boxesNeeded")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.boxes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
