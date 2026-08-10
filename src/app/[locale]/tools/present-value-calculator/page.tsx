"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type Freq = "annual" | "semi" | "quarterly" | "monthly";

const FREQ: Record<Freq, number> = { annual: 1, semi: 2, quarterly: 4, monthly: 12 };

export default function PresentValueCalculatorPage() {
  const t = useTranslations("tools.present-value-calculator");
  const [futureValue, setFutureValue] = useState("10000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("10");
  const [freq, setFreq] = useState<Freq>("annual");

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const fv = parseFloat(futureValue);
  const r = parseFloat(rate);
  const y = parseFloat(years);
  const valid = !Number.isNaN(fv) && !Number.isNaN(r) && !Number.isNaN(y) && fv > 0 && r >= 0 && y > 0;

  const m = FREQ[freq];
  let presentValue = 0;
  let discountFactor = 0;
  let totalInterest = 0;
  if (valid) {
    discountFactor = Math.pow(1 + r / 100 / m, m * y);
    presentValue = fv / discountFactor;
    totalInterest = fv - presentValue;
  }

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="present-value-calculator"
      keywords={keywords}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="max-w-3xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.futureValue")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={futureValue}
              onChange={(e) => setFutureValue(e.target.value)}
              placeholder={t("placeholders.futureValue")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.rate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder={t("placeholders.rate")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.years")}
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder={t("placeholders.years")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.compounding")}
            </label>
            <select
              value={freq}
              onChange={(e) => setFreq(e.target.value as Freq)}
              className={inputCls}
            >
              {(["annual", "semi", "quarterly", "monthly"] as Freq[]).map((f) => (
                <option key={f} value={f}>
                  {t(`freqs.${f}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {valid ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">{t("labels.presentValue")}</p>
              <p className="mt-1 text-2xl font-semibold text-green-400">
                {fmt(presentValue)}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">{t("labels.discountFactor")}</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-100">
                {discountFactor.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">{t("labels.totalInterest")}</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-100">
                {fmt(totalInterest)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-400">{t("errors.invalidInputs")}</p>
        )}
      </div>
    </ToolLayout>
  );
}
