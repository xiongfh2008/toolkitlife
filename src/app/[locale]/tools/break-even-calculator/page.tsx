"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function BreakEvenCalculatorPage() {
  const t = useTranslations("tools.break-even-calculator");
  const [fixedCosts, setFixedCosts] = useState("1000");
  const [variableCost, setVariableCost] = useState("5");
  const [price, setPrice] = useState("15");

  const result = useMemo(() => {
    const fixed = parseFloat(fixedCosts);
    const variable = parseFloat(variableCost);
    const p = parseFloat(price);

    if (
      Number.isNaN(fixed) ||
      Number.isNaN(variable) ||
      Number.isNaN(p) ||
      fixed < 0 ||
      variable < 0 ||
      p < 0
    ) {
      return null;
    }

    const profitPerUnit = p - variable;

    if (profitPerUnit <= 0) {
      return { profitPerUnit, breakEvenUnits: null, breakEvenRevenue: null };
    }

    const units = fixed / profitPerUnit;
    return {
      profitPerUnit,
      breakEvenUnits: units,
      breakEvenRevenue: units * p,
    };
  }, [fixedCosts, variableCost, price]);

  const formatMoney = (value: number) =>
    value.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="break-even-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.fixedCosts")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.variableCost")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={variableCost}
              onChange={(e) => setVariableCost(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.pricePerUnit")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.profitPerUnit")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {formatMoney(result.profitPerUnit)}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.breakEvenUnits")}</p>
                <p className="text-2xl font-bold text-blue-400">
                  {result.breakEvenUnits !== null
                    ? Math.ceil(result.breakEvenUnits).toLocaleString()
                    : t("labels.notProfitable")}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.breakEvenRevenue")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.breakEvenRevenue !== null
                    ? formatMoney(result.breakEvenRevenue)
                    : t("labels.notProfitable")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
