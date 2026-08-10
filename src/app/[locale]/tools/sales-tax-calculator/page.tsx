"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function SalesTaxCalculatorPage() {
  const t = useTranslations("tools.sales-tax-calculator");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [mode, setMode] = useState<"add" | "extract">("add");
  const [result, setResult] = useState<{
    subtotal: string;
    tax: string;
    total: string;
  } | null>(null);

  const calculate = () => {
    const a = parseFloat(amount);
    const r = parseFloat(rate);
    if (Number.isNaN(a) || Number.isNaN(r) || a < 0 || r < 0) {
      setResult(null);
      return;
    }

    const taxRate = r / 100;
    let subtotal = a;
    let tax = 0;
    let total = a;

    if (mode === "add") {
      tax = a * taxRate;
      total = a + tax;
    } else {
      subtotal = a / (1 + taxRate);
      tax = a - subtotal;
    }

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    setResult({
      subtotal: fmt(subtotal),
      tax: fmt(tax),
      total: fmt(total),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="sales-tax-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["add", "extract"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setResult(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`options.${m}`)}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {mode === "add" ? t("labels.amount") : t("labels.totalAmount")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
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
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="8.25"
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
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.total")}
              </h3>
              <CopyButton text={result.total} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.total}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.subtotal")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.subtotal}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.tax")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.tax}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
