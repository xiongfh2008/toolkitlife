"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function VatCalculatorPage() {
  const t = useTranslations("tools.vat-calculator");
  const [amount, setAmount] = useState("100");
  const [rate, setRate] = useState("20");
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");

  const result = useMemo(() => {
    const a = parseFloat(amount);
    const r = parseFloat(rate);

    if (Number.isNaN(a) || Number.isNaN(r) || a < 0 || r < 0) {
      return null;
    }

    const rateDecimal = r / 100;

    if (mode === "exclusive") {
      const vat = a * rateDecimal;
      return { net: a, gross: a + vat, vat };
    }

    const net = a / (1 + rateDecimal);
    const vat = a - net;
    return { net, gross: a, vat };
  }, [amount, rate, mode]);

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
      slug="vat-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.amount")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.vatRate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.mode")}
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as "exclusive" | "inclusive")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              <option value="exclusive">{t("options.exclusive")}</option>
              <option value="inclusive">{t("options.inclusive")}</option>
            </select>
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.netAmount")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold text-zinc-200">
                    {formatMoney(result.net)}
                  </p>
                  <CopyButton text={formatMoney(result.net)} className="text-xs px-2 py-1" />
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.vatAmount")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold text-zinc-200">
                    {formatMoney(result.vat)}
                  </p>
                  <CopyButton text={formatMoney(result.vat)} className="text-xs px-2 py-1" />
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.grossAmount")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold text-zinc-200">
                    {formatMoney(result.gross)}
                  </p>
                  <CopyButton text={formatMoney(result.gross)} className="text-xs px-2 py-1" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
