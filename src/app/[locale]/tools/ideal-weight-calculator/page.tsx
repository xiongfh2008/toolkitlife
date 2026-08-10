"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

function cmToInches(cm: number) {
  return cm / 2.54;
}

function kgToLbs(kg: number) {
  return kg * 2.20462;
}

export default function IdealWeightCalculatorPage() {
  const t = useTranslations("tools.ideal-weight-calculator");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<{
    devine: string;
    robinson: string;
    miller: string;
    rangeKg: string;
    rangeLbs: string;
  } | null>(null);

  const calculate = () => {
    const h = parseFloat(height);
    if (Number.isNaN(h) || h <= 0) {
      setResult(null);
      return;
    }

    const inches = unit === "metric" ? cmToInches(h) : h;
    const overFiveFeet = Math.max(0, inches - 60);

    let devine = 0;
    let robinson = 0;
    let miller = 0;

    if (gender === "male") {
      devine = 50 + 2.3 * overFiveFeet;
      robinson = 52 + 1.9 * overFiveFeet;
      miller = 56.2 + 1.41 * overFiveFeet;
    } else {
      devine = 45.5 + 2.3 * overFiveFeet;
      robinson = 49 + 1.7 * overFiveFeet;
      miller = 53.1 + 1.36 * overFiveFeet;
    }

    const values = [devine, robinson, miller];
    const min = Math.min(...values);
    const max = Math.max(...values);

    const fmt = (v: number) => v.toFixed(1);

    setResult({
      devine: fmt(devine),
      robinson: fmt(robinson),
      miller: fmt(miller),
      rangeKg: `${fmt(min)} - ${fmt(max)}`,
      rangeLbs: `${fmt(kgToLbs(min))} - ${fmt(kgToLbs(max))}`,
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="ideal-weight-calculator"
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

        <button
          onClick={calculate}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.calculate")}
        </button>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div>
              <p className="text-sm text-zinc-400">{t("labels.idealRange")}</p>
              <p className="text-3xl font-bold text-blue-400">{result.rangeKg} kg</p>
              <p className="text-sm text-zinc-500">{result.rangeLbs} lbs</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.devine")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.devine} kg</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.robinson")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.robinson} kg</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.miller")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.miller} kg</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
