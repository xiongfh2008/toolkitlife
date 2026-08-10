"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function DiscountCalculatorPage() {
  const t = useTranslations("tools.discount-calculator");
  const [original, setOriginal] = useState("");
  const [discount, setDiscount] = useState("");
  const [result, setResult] = useState<{
    finalPrice: string;
    amountSaved: string;
  } | null>(null);

  const calculate = (orig: string = original, disc: string = discount) => {
    const o = parseFloat(orig);
    const d = parseFloat(disc);
    if (
      Number.isNaN(o) ||
      Number.isNaN(d) ||
      o < 0 ||
      d < 0 ||
      d > 100
    ) {
      setResult(null);
      return;
    }

    const amountSaved = o * (d / 100);
    const finalPrice = o - amountSaved;
    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    setResult({
      finalPrice: fmt(finalPrice),
      amountSaved: fmt(amountSaved),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="discount-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.originalPrice")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={original}
              onChange={(e) => {
                setOriginal(e.target.value);
                calculate(e.target.value, discount);
              }}
              placeholder="100.00"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.discountPercentage")}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={discount}
              onChange={(e) => {
                setDiscount(e.target.value);
                calculate(original, e.target.value);
              }}
              placeholder="20"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.finalPrice")}
              </h3>
              <CopyButton
                text={result.finalPrice}
                className="text-xs px-2 py-1"
              />
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {result.finalPrice}
            </p>
            <div>
              <p className="text-sm text-zinc-400">{t("labels.amountSaved")}</p>
              <p className="text-xl font-semibold text-zinc-200">
                {result.amountSaved}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
