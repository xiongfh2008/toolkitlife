"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function StockProfitCalculatorPage() {
  const t = useTranslations("tools.stock-profit-calculator");
  const [shares, setShares] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [commission, setCommission] = useState("");
  const [result, setResult] = useState<{
    cost: string;
    revenue: string;
    profit: string;
    roi: string;
    breakEven: string;
  } | null>(null);

  const calculate = (
    s = shares,
    b = buyPrice,
    sell = sellPrice,
    c = commission,
  ) => {
    const nShares = parseFloat(s);
    const buy = parseFloat(b);
    const sellP = parseFloat(sell);
    const comm = parseFloat(c) || 0;
    if (
      Number.isNaN(nShares) ||
      Number.isNaN(buy) ||
      Number.isNaN(sellP) ||
      nShares <= 0 ||
      buy <= 0
    ) {
      setResult(null);
      return;
    }

    const cost = nShares * buy + comm;
    const revenue = nShares * sellP - comm;
    const profit = revenue - cost;
    const roi = cost > 0 ? (profit / cost) * 100 : 0;
    const breakEven = cost / nShares;
    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    setResult({
      cost: fmt(cost),
      revenue: fmt(revenue),
      profit: fmt(profit),
      roi: fmt(roi),
      breakEven: fmt(breakEven),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="stock-profit-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.shares")}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={shares}
              onChange={(e) => {
                setShares(e.target.value);
                calculate(e.target.value, buyPrice, sellPrice, commission);
              }}
              placeholder="100"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.buyPrice")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={buyPrice}
              onChange={(e) => {
                setBuyPrice(e.target.value);
                calculate(shares, e.target.value, sellPrice, commission);
              }}
              placeholder="50.00"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.sellPrice")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={sellPrice}
              onChange={(e) => {
                setSellPrice(e.target.value);
                calculate(shares, buyPrice, e.target.value, commission);
              }}
              placeholder="60.00"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.commission")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={commission}
              onChange={(e) => {
                setCommission(e.target.value);
                calculate(shares, buyPrice, sellPrice, e.target.value);
              }}
              placeholder="0.00"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.profitLoss")}
              </h3>
              <CopyButton
                text={`${result.profit} (${result.roi}%)`}
                className="text-xs px-2 py-1"
              />
            </div>
            <p
              className={`text-3xl font-bold ${
                parseFloat(result.profit) >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {result.profit}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.roi")}</p>
                <p className="text-xl font-semibold text-blue-400">
                  {result.roi}%
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.breakEven")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.breakEven}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.cost")}</p>
                <p className="text-lg font-medium text-zinc-200">
                  {result.cost}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.revenue")}</p>
                <p className="text-lg font-medium text-zinc-200">
                  {result.revenue}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
