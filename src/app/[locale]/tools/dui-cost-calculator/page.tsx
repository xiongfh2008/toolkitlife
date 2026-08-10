"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function DuiCostCalculatorPage() {
  const t = useTranslations("tools.dui-cost-calculator");
  const [fine, setFine] = useState("");
  const [lawyerFees, setLawyerFees] = useState("");
  const [insuranceIncrease, setInsuranceIncrease] = useState("");
  const [years, setYears] = useState("3");
  const [additionalFees, setAdditionalFees] = useState("");
  const [result, setResult] = useState<{
    insuranceTotal: string;
    directCosts: string;
    totalCost: string;
  } | null>(null);

  const calculate = () => {
    const fineAmount = parseFloat(fine) || 0;
    const lawyer = parseFloat(lawyerFees) || 0;
    const insurance = parseFloat(insuranceIncrease) || 0;
    const duration = parseFloat(years);
    const fees = parseFloat(additionalFees) || 0;

    if (
      Number.isNaN(duration) ||
      duration <= 0 ||
      fineAmount < 0 ||
      lawyer < 0 ||
      insurance < 0 ||
      fees < 0
    ) {
      setResult(null);
      return;
    }

    const insuranceTotal = insurance * 12 * duration;
    const directCosts = fineAmount + lawyer + fees;
    const totalCost = directCosts + insuranceTotal;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

    setResult({
      insuranceTotal: fmt(insuranceTotal),
      directCosts: fmt(directCosts),
      totalCost: fmt(totalCost),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="dui-cost-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.fine")}
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={fine}
              onChange={(e) => setFine(e.target.value)}
              placeholder="1500"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.lawyerFees")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={lawyerFees}
              onChange={(e) => setLawyerFees(e.target.value)}
              placeholder="3000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.insuranceIncrease")}
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={insuranceIncrease}
              onChange={(e) => setInsuranceIncrease(e.target.value)}
              placeholder="150"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.years")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="3"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.additionalFees")}
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={additionalFees}
              onChange={(e) => setAdditionalFees(e.target.value)}
              placeholder="500"
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.totalCost")}</h3>
              <CopyButton text={result.totalCost} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.totalCost}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.directCosts")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.directCosts}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.insuranceTotal")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.insuranceTotal}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
