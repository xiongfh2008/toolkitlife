"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Mode = "percentOf" | "whatPercent" | "percentChange";

export default function PercentageCalculatorPage() {
  const t = useTranslations("tools.percentage-calculator");
  const [mode, setMode] = useState<Mode>("percentOf");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState<string>("");

  const calculate = () => {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (Number.isNaN(x) || Number.isNaN(y)) {
      setResult("");
      return;
    }
    let value = 0;
    switch (mode) {
      case "percentOf":
        value = (x / 100) * y;
        break;
      case "whatPercent":
        value = y === 0 ? 0 : (x / y) * 100;
        break;
      case "percentChange":
        value = x === 0 ? 0 : ((y - x) / x) * 100;
        break;
    }
    const decimals = Number.isInteger(value) ? 0 : 4;
    setResult(value.toFixed(decimals));
  };

  const modes: Mode[] = ["percentOf", "whatPercent", "percentChange"];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="percentage-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setResult("");
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`options.${m}`)}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {mode === "percentOf" ? t("labels.percentage") : t("labels.value")}
            </label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {mode === "whatPercent" ? t("labels.of") : mode === "percentChange" ? t("labels.to") : t("labels.of")}
            </label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
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
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.result")}</h3>
              <CopyButton text={result} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result}{mode !== "percentOf" ? "%" : ""}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
