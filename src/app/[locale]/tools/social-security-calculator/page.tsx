"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function SocialSecurityCalculatorPage() {
  const t = useTranslations("tools.social-security-calculator");
  const [currentAge, setCurrentAge] = useState("35");
  const [retirementAge, setRetirementAge] = useState("67");
  const [aime, setAime] = useState("");
  const [yearsWorked, setYearsWorked] = useState("");
  const [result, setResult] = useState<{
    monthlyBenefit: string;
    annualBenefit: string;
    adjustment: string;
  } | null>(null);

  const calculate = () => {
    const age = parseFloat(currentAge);
    const retireAge = parseFloat(retirementAge);
    const monthlyAime = parseFloat(aime);
    const years = parseFloat(yearsWorked);

    if (
      Number.isNaN(age) ||
      Number.isNaN(retireAge) ||
      Number.isNaN(monthlyAime) ||
      Number.isNaN(years) ||
      age < 18 ||
      retireAge < 62 ||
      retireAge > 70 ||
      monthlyAime < 0 ||
      years <= 0
    ) {
      setResult(null);
      return;
    }

    // Simplified PIA formula (2026 bend points approximated)
    const pia =
      Math.min(monthlyAime, 1174) * 0.9 +
      Math.max(0, Math.min(monthlyAime, 7078) - 1174) * 0.32 +
      Math.max(0, monthlyAime - 7078) * 0.15;

    // Adjustment based on retirement age relative to 67
    const monthsFromFra = (retireAge - 67) * 12;
    const adjustmentFactor = 1 + monthsFromFra * 0.005667;

    const monthlyBenefit = pia * adjustmentFactor;
    const annualBenefit = monthlyBenefit * 12;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

    setResult({
      monthlyBenefit: fmt(monthlyBenefit),
      annualBenefit: fmt(annualBenefit),
      adjustment: `${((adjustmentFactor - 1) * 100).toFixed(1)}%`,
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="social-security-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.currentAge")}
            </label>
            <input
              type="number"
              min="18"
              step="1"
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
              placeholder="35"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.retirementAge")}
            </label>
            <input
              type="number"
              min="62"
              max="70"
              step="1"
              value={retirementAge}
              onChange={(e) => setRetirementAge(e.target.value)}
              placeholder="67"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.aime")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={aime}
              onChange={(e) => setAime(e.target.value)}
              placeholder="5000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.yearsWorked")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={yearsWorked}
              onChange={(e) => setYearsWorked(e.target.value)}
              placeholder="35"
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.monthlyBenefit")}</h3>
              <CopyButton text={result.monthlyBenefit} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.monthlyBenefit}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.annualBenefit")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.annualBenefit}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.adjustment")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.adjustment}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
