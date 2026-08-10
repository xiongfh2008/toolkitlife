"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function DownPaymentCalculatorPage() {
  const t = useTranslations("tools.down-payment-calculator");
  const [homePrice, setHomePrice] = useState("");
  const [downPercent, setDownPercent] = useState("");
  const [downAmount, setDownAmount] = useState("");

  const [result, setResult] = useState<{
    downPayment: string;
    loanAmount: string;
    ratio: string;
  } | null>(null);

  const calculateByPercent = (
    price = homePrice,
    percent = downPercent,
    amount = downAmount,
  ) => {
    const priceN = parseFloat(price);
    const percentN = parseFloat(percent);
    if (!Number.isNaN(priceN) && !Number.isNaN(percentN) && priceN > 0) {
      const dp = (priceN * percentN) / 100;
      const loan = priceN - dp;
      setDownAmount(fmt(dp));
      setResult({
        downPayment: fmt(dp),
        loanAmount: fmt(loan),
        ratio: fmt(percentN),
      });
      return;
    }
    calculateByAmount(price, amount);
  };

  const calculateByAmount = (
    price = homePrice,
    amount = downAmount,
  ) => {
    const priceN = parseFloat(price);
    const amountN = parseFloat(amount);
    if (!Number.isNaN(priceN) && !Number.isNaN(amountN) && priceN > 0) {
      const ratio = (amountN / priceN) * 100;
      const loan = priceN - amountN;
      setDownPercent(fmt(ratio));
      setResult({
        downPayment: fmt(amountN),
        loanAmount: fmt(loan),
        ratio: fmt(ratio),
      });
      return;
    }
    setResult(null);
  };

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="down-payment-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.homePrice")}
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={homePrice}
            onChange={(e) => {
              setHomePrice(e.target.value);
              calculateByPercent(e.target.value, downPercent, downAmount);
            }}
            placeholder="400000"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.downPaymentPercent")}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={downPercent}
              onChange={(e) => {
                setDownPercent(e.target.value);
                calculateByPercent(homePrice, e.target.value, downAmount);
              }}
              placeholder="20"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.downPaymentAmount")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={downAmount}
              onChange={(e) => {
                setDownAmount(e.target.value);
                calculateByAmount(homePrice, e.target.value);
              }}
              placeholder="80000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.summary")}
              </h3>
              <CopyButton
                text={`Down ${result.downPayment} (${result.ratio}%), Loan ${result.loanAmount}`}
                className="text-xs px-2 py-1"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.downPayment")}
                </p>
                <p className="text-xl font-semibold text-blue-400">
                  {result.downPayment}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.downPaymentRatio")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.ratio}%
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {t("labels.loanAmount")}
                </p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.loanAmount}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
