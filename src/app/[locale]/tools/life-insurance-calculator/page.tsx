"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function LifeInsuranceCalculatorPage() {
  const t = useTranslations("tools.life-insurance-calculator");
  const [income, setIncome] = useState("75000");
  const [years, setYears] = useState("10");
  const [debts, setDebts] = useState("200000");
  const [expenses, setExpenses] = useState("100000");
  const [savings, setSavings] = useState("50000");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const calculate = () => {
    const inc = parseFloat(income);
    const y = parseFloat(years);
    const d = parseFloat(debts);
    const e = parseFloat(expenses);
    const s = parseFloat(savings);

    if (
      Number.isNaN(inc) ||
      Number.isNaN(y) ||
      Number.isNaN(d) ||
      Number.isNaN(e) ||
      Number.isNaN(s) ||
      inc < 0 ||
      y <= 0 ||
      d < 0 ||
      e < 0 ||
      s < 0
    ) {
      return null;
    }

    const needed = inc * y + d + e - s;
    return {
      recommendedCoverage: fmt(Math.max(0, needed)),
      incomeReplacement: fmt(inc * y),
      totalObligations: fmt(d + e),
    };
  };

  const result = calculate();
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const guideIntro = t.raw("guide.intro") as { title: string; paragraphs: string[] };
  const guideSections = t.raw("guide.sections") as { title: string; paragraphs?: string[]; items?: string[] }[];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="life-insurance-calculator"
      keywords={keywords}
      faqs={faqs}
      relatedTools={relatedTools}
      guide={
        <>
          <h2>{guideIntro.title}</h2>
          {guideIntro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {guideSections.map((section, i) => (
            <section key={i}>
              <h3>{section.title}</h3>
              {section.paragraphs?.map((p, j) => <p key={j}>{p}</p>)}
              {section.items && (
                <ul>
                  {section.items.map((item, k) => (
                    <li key={k}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </>
      }
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.annualIncome")}</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder={t("placeholders.annualIncome")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.yearsToReplace")}</label>
            <input
              type="number"
              min="1"
              step="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder={t("placeholders.yearsToReplace")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.debts")}</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={debts}
              onChange={(e) => setDebts(e.target.value)}
              placeholder={t("placeholders.debts")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.futureExpenses")}</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              placeholder={t("placeholders.futureExpenses")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.savings")}</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              placeholder={t("placeholders.savings")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <button
          onClick={() => setShowError(true)}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.calculate")}
        </button>

        {showError && !result && <p className="text-sm text-red-400">{t("errors.invalidInputs")}</p>}

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.recommendedCoverage")}</h3>
              <CopyButton text={result.recommendedCoverage} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.recommendedCoverage}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.incomeReplacement")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.incomeReplacement}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalObligations")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalObligations}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
