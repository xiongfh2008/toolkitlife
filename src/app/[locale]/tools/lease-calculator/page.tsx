"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function LeaseCalculatorPage() {
  const t = useTranslations("tools.lease-calculator");
  const [price, setPrice] = useState("30000");
  const [downPayment, setDownPayment] = useState("2000");
  const [residualPercent, setResidualPercent] = useState("55");
  const [annualRate, setAnnualRate] = useState("4.5");
  const [term, setTerm] = useState("36");
  const [taxRate, setTaxRate] = useState("7");

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const calculate = () => {
    const p = parseFloat(price);
    const d = parseFloat(downPayment);
    const rp = parseFloat(residualPercent);
    const apr = parseFloat(annualRate);
    const n = parseFloat(term);
    const tx = parseFloat(taxRate);
    if (
      Number.isNaN(p) ||
      Number.isNaN(d) ||
      Number.isNaN(rp) ||
      Number.isNaN(apr) ||
      Number.isNaN(n) ||
      Number.isNaN(tx) ||
      p <= 0 ||
      n <= 0 ||
      rp < 0 ||
      rp > 100 ||
      d < 0 ||
      apr < 0 ||
      tx < 0
    ) {
      return null;
    }
    const capCost = p - d;
    const residualValue = p * (rp / 100);
    const moneyFactor = apr / 100 / 2400;
    const depreciation = (capCost - residualValue) / n;
    const rentCharge = (capCost + residualValue) * moneyFactor;
    const monthlyPreTax = depreciation + rentCharge;
    const monthlyTax = monthlyPreTax * (tx / 100);
    const monthlyPayment = monthlyPreTax + monthlyTax;
    const totalCost = monthlyPayment * n + d;
    return {
      monthlyPayment: fmt(monthlyPayment),
      monthlyPreTax: fmt(monthlyPreTax),
      monthlyTax: fmt(monthlyTax),
      depreciation: fmt(depreciation),
      rentCharge: fmt(rentCharge),
      totalCost: fmt(totalCost),
      residualValue: fmt(residualValue),
    };
  };

  const result = calculate();
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
      slug="lease-calculator"
      keywords={keywords}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="max-w-3xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
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
              placeholder={t("placeholders.price")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.downPayment")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder={t("placeholders.downPayment")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.residualPercent")}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={residualPercent}
              onChange={(e) => setResidualPercent(e.target.value)}
              placeholder={t("placeholders.residualPercent")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.annualRate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              placeholder={t("placeholders.annualRate")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.term")}
            </label>
            <input
              type="number"
              min="1"
              max="120"
              step="1"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder={t("placeholders.term")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.taxRate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              placeholder={t("placeholders.taxRate")}
              className={inputCls}
            />
          </div>
        </div>

        {result ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500">{t("labels.monthlyPayment")}</p>
                <p className="mt-1 text-3xl font-bold text-green-400">
                  {result.monthlyPayment}
                  <span className="text-sm font-normal text-zinc-500">/mo</span>
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500">{t("labels.totalCost")}</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-100">
                  {result.totalCost}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500">{t("labels.depreciation")}</p>
                <p className="mt-1 text-lg text-zinc-200">{result.depreciation}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500">{t("labels.rentCharge")}</p>
                <p className="mt-1 text-lg text-zinc-200">{result.rentCharge}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500">{t("labels.monthlyPreTax")}</p>
                <p className="mt-1 text-lg text-zinc-200">{result.monthlyPreTax}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500">{t("labels.residualValue")}</p>
                <p className="mt-1 text-lg text-zinc-200">{result.residualValue}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-red-400">{t("errors.invalidInputs")}</p>
        )}
      </div>
    </ToolLayout>
  );
}
