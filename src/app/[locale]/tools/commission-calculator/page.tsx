"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function CommissionCalculatorPage() {
  const t = useTranslations("tools.commission-calculator");
  const [saleAmount, setSaleAmount] = useState("50000");
  const [rate, setRate] = useState("5");
  const [fixedFee, setFixedFee] = useState("0");
  const [taxRate, setTaxRate] = useState("0");

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const calculate = () => {
    const s = parseFloat(saleAmount);
    const r = parseFloat(rate);
    const f = parseFloat(fixedFee);
    const tx = parseFloat(taxRate);
    if (
      Number.isNaN(s) ||
      Number.isNaN(r) ||
      Number.isNaN(f) ||
      Number.isNaN(tx) ||
      s <= 0 ||
      r < 0 ||
      f < 0 ||
      tx < 0
    ) {
      return null;
    }
    const commission = s * (r / 100) + f;
    const commissionTax = commission * (tx / 100);
    const netCommission = commission - commissionTax;
    const sellerNet = s - commission;
    return {
      commission: fmt(commission),
      commissionTax: fmt(commissionTax),
      netCommission: fmt(netCommission),
      sellerNet: fmt(sellerNet),
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
      slug="commission-calculator"
      keywords={keywords}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="max-w-3xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.saleAmount")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={saleAmount}
              onChange={(e) => setSaleAmount(e.target.value)}
              placeholder={t("placeholders.saleAmount")}
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
              {t("labels.fixedFee")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={fixedFee}
              onChange={(e) => setFixedFee(e.target.value)}
              placeholder={t("placeholders.fixedFee")}
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
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">{t("labels.commission")}</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-100">
                {result.commission}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">{t("labels.netCommission")}</p>
              <p className="mt-1 text-2xl font-semibold text-green-400">
                {result.netCommission}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">{t("labels.commissionTax")}</p>
              <p className="mt-1 text-xl text-zinc-200">{result.commissionTax}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">{t("labels.sellerNet")}</p>
              <p className="mt-1 text-xl text-zinc-200">{result.sellerNet}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-400">{t("errors.invalidInputs")}</p>
        )}
      </div>
    </ToolLayout>
  );
}
