"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function ProfitMarginCalculatorPage() {
  const t = useTranslations("tools.profit-margin-calculator");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState<{
    profit: string;
    margin: string;
    markup: string;
  } | null>(null);

  const calculate = () => {
    const c = parseFloat(cost);
    const p = parseFloat(price);
    if (Number.isNaN(c) || Number.isNaN(p) || c < 0 || p <= 0) {
      setResult(null);
      return;
    }

    const profit = p - c;
    const margin = (profit / p) * 100;
    const markup = c > 0 ? (profit / c) * 100 : 0;

    const fmtCurrency = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });
    const fmtPercent = (v: number) =>
      `${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;

    setResult({
      profit: fmtCurrency(profit),
      margin: fmtPercent(margin),
      markup: fmtPercent(markup),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="profit-margin-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.cost")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="50"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.price")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="75"
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.profitMargin")}</h3>
              <CopyButton text={result.margin} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.margin}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.profit")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.profit}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.markup")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.markup}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
