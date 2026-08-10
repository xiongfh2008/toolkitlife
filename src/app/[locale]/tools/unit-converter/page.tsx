"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type Category = "Length" | "Weight" | "Temperature" | "Data" | "Time";

interface UnitDef {
  key: string;
  abbr: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const units: Record<Category, UnitDef[]> = {
  Length: [
    { key: "millimeters", abbr: "mm", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "centimeters", abbr: "cm", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { key: "meters", abbr: "m", toBase: (v) => v, fromBase: (v) => v },
    { key: "kilometers", abbr: "km", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { key: "inches", abbr: "in", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { key: "feet", abbr: "ft", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { key: "yards", abbr: "yd", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { key: "miles", abbr: "mi", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  ],
  Weight: [
    { key: "milligrams", abbr: "mg", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { key: "grams", abbr: "g", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "kilograms", abbr: "kg", toBase: (v) => v, fromBase: (v) => v },
    { key: "ounces", abbr: "oz", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { key: "pounds", abbr: "lb", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { key: "metricTons", abbr: "ton", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  ],
  Temperature: [
    { key: "celsius", abbr: "\u00B0C", toBase: (v) => v, fromBase: (v) => v },
    { key: "fahrenheit", abbr: "\u00B0F", toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
    { key: "kelvin", abbr: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  Data: [
    { key: "bytes", abbr: "B", toBase: (v) => v, fromBase: (v) => v },
    { key: "kilobytes", abbr: "KB", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    { key: "megabytes", abbr: "MB", toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
    { key: "gigabytes", abbr: "GB", toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
    { key: "terabytes", abbr: "TB", toBase: (v) => v * 1.0995e12, fromBase: (v) => v / 1.0995e12 },
    { key: "petabytes", abbr: "PB", toBase: (v) => v * 1.1259e15, fromBase: (v) => v / 1.1259e15 },
  ],
  Time: [
    { key: "milliseconds", abbr: "ms", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "seconds", abbr: "s", toBase: (v) => v, fromBase: (v) => v },
    { key: "minutes", abbr: "min", toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    { key: "hours", abbr: "hr", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { key: "days", abbr: "day", toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    { key: "weeks", abbr: "week", toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    { key: "months", abbr: "month", toBase: (v) => v * 2629800, fromBase: (v) => v / 2629800 },
    { key: "years", abbr: "year", toBase: (v) => v * 31557600, fromBase: (v) => v / 31557600 },
  ],
};

const categories: Category[] = ["Length", "Weight", "Temperature", "Data", "Time"];

export default function UnitConverterPage() {
  const t = useTranslations("tools.unit-converter");
  const [category, setCategory] = useState<Category>("Length");
  const [inputVal, setInputVal] = useState("1");
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);

  const currentUnits = units[category];
  const categoryLabels = t.raw("labels.categories") as Record<Category, string>;
  const unitNames = t.raw("units") as Record<string, string>;

  const result = useMemo(() => {
    const num = parseFloat(inputVal);
    if (isNaN(num)) return "";
    const baseVal = currentUnits[fromUnit].toBase(num);
    const converted = currentUnits[toUnit].fromBase(baseVal);
    if (Math.abs(converted) < 0.001 && converted !== 0) {
      return converted.toExponential(6);
    }
    return parseFloat(converted.toPrecision(10)).toString();
  }, [inputVal, fromUnit, toUnit, currentUnits]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result) setInputVal(result);
  };

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setFromUnit(0);
    setToUnit(1);
    setInputVal("1");
  };

  const commonConversions = useMemo(() => {
    const num = parseFloat(inputVal);
    if (isNaN(num)) return [];
    const baseVal = currentUnits[fromUnit].toBase(num);
    return currentUnits
      .map((u, i) => ({
        key: u.key,
        abbr: u.abbr,
        value: parseFloat(u.fromBase(baseVal).toPrecision(8)),
        idx: i,
      }))
      .filter((u) => u.idx !== fromUnit);
  }, [inputVal, fromUnit, currentUnits]);

  const guideSteps = t.raw("guide.howToUse.steps") as string[];
  const useCaseItems = t.raw("guide.useCases.items") as string[];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="unit-converter"
      keywords={t.raw("metadata.keywords") as string[]}
      guide={
        <>
          <h2>{t("guide.introduction.title")}</h2>
          <p>{t("guide.introduction.p1")}</p>
          <p>{t("guide.introduction.p2")}</p>

          <h3>{t("guide.howToUse.title")}</h3>
          <ul>
            {guideSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>

          <h3>{t("guide.supportedCategories.title")}</h3>
          <p>{t("guide.supportedCategories.body")}</p>

          <h3>{t("guide.tips.title")}</h3>
          <p>{t("guide.tips.body")}</p>

          <h3>{t("guide.useCases.title")}</h3>
          <ul>
            {useCaseItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      }
      faqs={t.raw("faqs") as FAQ[]}
      relatedTools={t.raw("relatedTools") as RelatedTool[]}
    >
      <div className="space-y-6">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-4">
            {/* From */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">{t("labels.from")}</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 outline-none focus:border-blue-500"
              >
                {currentUnits.map((u, i) => (
                  <option key={i} value={i}>
                    {t("labels.unitOption", { name: unitNames[u.key], abbr: u.abbr })}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 text-lg text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            {/* Swap */}
            <button
              onClick={swap}
              className="mb-2 rounded-lg bg-zinc-800 p-3 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
              title={t("labels.swapTitle")}
            >
              &#8644;
            </button>

            {/* To */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">{t("labels.to")}</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 outline-none focus:border-blue-500"
              >
                {currentUnits.map((u, i) => (
                  <option key={i} value={i}>
                    {t("labels.unitOption", { name: unitNames[u.key], abbr: u.abbr })}
                  </option>
                ))}
              </select>
              <div className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 text-lg font-medium text-blue-400">
                {result || "0"}
              </div>
            </div>
          </div>
        </div>

        {/* Reference table */}
        {commonConversions.length > 0 && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-3 text-sm font-semibold text-zinc-300">
              {t("labels.referenceTitle", { inputVal, abbr: currentUnits[fromUnit].abbr })}
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {commonConversions.map((c) => (
                <div key={c.idx} className="flex items-center justify-between rounded bg-zinc-800 px-3 py-2">
                  <span className="text-sm text-zinc-400">{unitNames[c.key]}</span>
                  <span className="font-mono text-sm text-zinc-200">
                    {typeof c.value === "number" && Math.abs(c.value) < 0.001 && c.value !== 0
                      ? c.value.toExponential(4)
                      : c.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
