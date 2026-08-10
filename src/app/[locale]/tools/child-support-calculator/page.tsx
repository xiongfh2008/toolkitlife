"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const CHILD_MULTIPLIERS = [0, 0.17, 0.25, 0.29, 0.31, 0.34];

export default function ChildSupportCalculatorPage() {
  const t = useTranslations("tools.child-support-calculator");
  const [parent1Income, setParent1Income] = useState("");
  const [parent2Income, setParent2Income] = useState("");
  const [children, setChildren] = useState("1");
  const [custodyPercent, setCustodyPercent] = useState("50");
  const [result, setResult] = useState<{
    parent1Share: string;
    parent2Share: string;
    monthlySupport: string;
    payer: string;
  } | null>(null);

  const calculate = () => {
    const p1 = parseFloat(parent1Income);
    const p2 = parseFloat(parent2Income);
    const c = parseInt(children, 10);
    const custody = parseFloat(custodyPercent);

    if (
      Number.isNaN(p1) ||
      Number.isNaN(p2) ||
      Number.isNaN(c) ||
      Number.isNaN(custody) ||
      p1 < 0 ||
      p2 < 0 ||
      c < 1 ||
      custody < 0 ||
      custody > 100
    ) {
      setResult(null);
      return;
    }

    const combinedIncome = p1 + p2;
    if (combinedIncome <= 0) {
      setResult(null);
      return;
    }

    const multiplier = CHILD_MULTIPLIERS[Math.min(c, 5)];
    const baseSupport = combinedIncome * multiplier;
    const p1Share = (p1 / combinedIncome) * baseSupport;
    const p2Share = (p2 / combinedIncome) * baseSupport;

    const custodyRatio = custody / 100;
    const p1Obligation = p1Share * (1 - custodyRatio);
    const p2Obligation = p2Share * custodyRatio;

    const netSupport = p2Obligation - p1Obligation;
    const monthlySupport = Math.abs(netSupport);
    const payer = netSupport > 0 ? t("options.parent1") : t("options.parent2");

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

    setResult({
      parent1Share: fmt(p1Share),
      parent2Share: fmt(p2Share),
      monthlySupport: fmt(monthlySupport),
      payer,
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="child-support-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.parent1Income")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={parent1Income}
              onChange={(e) => setParent1Income(e.target.value)}
              placeholder="5000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.parent2Income")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={parent2Income}
              onChange={(e) => setParent2Income(e.target.value)}
              placeholder="4000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.children")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={children}
              onChange={(e) => setChildren(e.target.value)}
              placeholder="1"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.custodyPercent")}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={custodyPercent}
              onChange={(e) => setCustodyPercent(e.target.value)}
              placeholder="50"
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.monthlySupport")}</h3>
              <CopyButton text={result.monthlySupport} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.monthlySupport}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.payer")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.payer}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.parent1Share")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.parent1Share}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.parent2Share")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.parent2Share}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
