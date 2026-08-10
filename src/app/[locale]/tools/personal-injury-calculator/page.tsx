"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function PersonalInjuryCalculatorPage() {
  const t = useTranslations("tools.personal-injury-calculator");
  const [medicalExpenses, setMedicalExpenses] = useState("");
  const [lostWages, setLostWages] = useState("");
  const [propertyDamage, setPropertyDamage] = useState("");
  const [futureMedical, setFutureMedical] = useState("");
  const [painMultiplier, setPainMultiplier] = useState("2");
  const [result, setResult] = useState<{
    economicDamages: string;
    painAndSuffering: string;
    totalEstimate: string;
  } | null>(null);

  const calculate = () => {
    const medical = parseFloat(medicalExpenses);
    const wages = parseFloat(lostWages) || 0;
    const property = parseFloat(propertyDamage) || 0;
    const future = parseFloat(futureMedical) || 0;
    const multiplier = parseFloat(painMultiplier);

    if (
      Number.isNaN(medical) ||
      Number.isNaN(multiplier) ||
      medical < 0 ||
      wages < 0 ||
      property < 0 ||
      future < 0 ||
      multiplier < 1
    ) {
      setResult(null);
      return;
    }

    const economicDamages = medical + wages + property + future;
    const painAndSuffering = medical * multiplier;
    const totalEstimate = economicDamages + painAndSuffering;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

    setResult({
      economicDamages: fmt(economicDamages),
      painAndSuffering: fmt(painAndSuffering),
      totalEstimate: fmt(totalEstimate),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="personal-injury-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.medicalExpenses")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={medicalExpenses}
              onChange={(e) => setMedicalExpenses(e.target.value)}
              placeholder="10000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.lostWages")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={lostWages}
              onChange={(e) => setLostWages(e.target.value)}
              placeholder="5000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.propertyDamage")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={propertyDamage}
              onChange={(e) => setPropertyDamage(e.target.value)}
              placeholder="2000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.futureMedical")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={futureMedical}
              onChange={(e) => setFutureMedical(e.target.value)}
              placeholder="3000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.painMultiplier")}
            </label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.5"
              value={painMultiplier}
              onChange={(e) => setPainMultiplier(e.target.value)}
              placeholder="2"
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.totalEstimate")}</h3>
              <CopyButton text={result.totalEstimate} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.totalEstimate}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.economicDamages")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.economicDamages}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.painAndSuffering")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.painAndSuffering}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
