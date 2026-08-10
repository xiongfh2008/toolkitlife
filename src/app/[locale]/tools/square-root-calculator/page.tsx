"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function SquareRootCalculatorPage() {
  const t = useTranslations("tools.square-root-calculator");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [type, setType] = useState<"real" | "complex">("real");
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    setResult("");
    const num = parseFloat(value);
    if (Number.isNaN(num)) {
      setError(t("errors.invalid"));
      return;
    }
    if (num >= 0) {
      const root = Math.sqrt(num);
      setResult(formatNumber(root));
      setType("real");
    } else {
      const root = Math.sqrt(Math.abs(num));
      setResult(`${formatNumber(root)}i`);
      setType("complex");
    }
  };

  const formatNumber = (n: number): string => {
    if (Number.isInteger(n)) return n.toString();
    return n.toFixed(6).replace(/\.?0+$/, "");
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="square-root-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.value")}
          </label>
          <input
            type="number"
            step="any"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setResult("");
              setError("");
            }}
            placeholder={t("labels.placeholder")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
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
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {type === "real" ? t("labels.realResult") : t("labels.complexResult")}
              </h3>
              <CopyButton text={result} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400 break-all">{result}</p>
            {type === "complex" && (
              <p className="mt-1 text-sm text-zinc-500">{t("labels.complexNote")}</p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
