"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function MedicareCostCalculatorPage() {
  const t = useTranslations("tools.medicare-cost-calculator");
  const [annualIncome, setAnnualIncome] = useState("");
  const [partB, setPartB] = useState(true);
  const [partD, setPartD] = useState(true);
  const [hospitalStays, setHospitalStays] = useState("0");
  const [result, setResult] = useState<{
    partBCost: string;
    partDCost: string;
    irmaaSurcharge: string;
    outOfPocket: string;
    annualEstimate: string;
  } | null>(null);

  const calculate = () => {
    const income = parseFloat(annualIncome);
    const stays = parseFloat(hospitalStays) || 0;

    if (
      Number.isNaN(income) ||
      income < 0 ||
      stays < 0
    ) {
      setResult(null);
      return;
    }

    const partBBase = partB ? 185 * 12 : 0;
    const partDBase = partD ? 35 * 12 : 0;

    let irmaa = 0;
    if (partB && income > 106000) {
      if (income <= 133000) irmaa = 70 * 12;
      else if (income <= 160000) irmaa = 175 * 12;
      else if (income <= 200000) irmaa = 280 * 12;
      else irmaa = 350 * 12;
    }

    const deductible = 1684;
    const hospitalCost = stays * 1700;
    const outOfPocket = deductible + hospitalCost;

    const annualEstimate = partBBase + partDBase + irmaa + outOfPocket;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

    setResult({
      partBCost: fmt(partBBase),
      partDCost: fmt(partDBase),
      irmaaSurcharge: fmt(irmaa),
      outOfPocket: fmt(outOfPocket),
      annualEstimate: fmt(annualEstimate),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="medicare-cost-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.annualIncome")}
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              placeholder="50000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.hospitalStays")}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={hospitalStays}
              onChange={(e) => setHospitalStays(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={partB}
              onChange={(e) => setPartB(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500/40"
            />
            {t("labels.partB")}
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={partD}
              onChange={(e) => setPartD(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500/40"
            />
            {t("labels.partD")}
          </label>
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.annualEstimate")}</h3>
              <CopyButton text={result.annualEstimate} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.annualEstimate}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.partBCost")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.partBCost}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.partDCost")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.partDCost}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.irmaaSurcharge")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.irmaaSurcharge}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.outOfPocket")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.outOfPocket}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
