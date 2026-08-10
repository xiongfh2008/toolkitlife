"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function RefinanceCalculatorPage() {
  const t = useTranslations("tools.refinance-calculator");
  const [balance, setBalance] = useState("300000");
  const [currentRate, setCurrentRate] = useState("6.5");
  const [currentTerm, setCurrentTerm] = useState("25");
  const [newRate, setNewRate] = useState("5.5");
  const [newTerm, setNewTerm] = useState("30");
  const [closingCosts, setClosingCosts] = useState("5000");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const payment = (principal: number, rate: number, years: number) => {
    const n = years * 12;
    const mr = rate / 100 / 12;
    if (mr === 0) return principal / n;
    return (principal * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
  };

  const calculate = () => {
    const b = parseFloat(balance);
    const cr = parseFloat(currentRate);
    const ct = parseFloat(currentTerm);
    const nr = parseFloat(newRate);
    const nt = parseFloat(newTerm);
    const cc = parseFloat(closingCosts);

    if (
      Number.isNaN(b) ||
      Number.isNaN(cr) ||
      Number.isNaN(ct) ||
      Number.isNaN(nr) ||
      Number.isNaN(nt) ||
      Number.isNaN(cc) ||
      b <= 0 ||
      ct <= 0 ||
      nt <= 0 ||
      cc < 0
    ) {
      return null;
    }

    const currentMonthly = payment(b, cr, ct);
    const newMonthly = payment(b, nr, nt);
    const monthlySavings = currentMonthly - newMonthly;
    const breakEven = monthlySavings > 0 ? cc / monthlySavings : Infinity;
    const currentTotalInterest = currentMonthly * ct * 12 - b;
    const newTotalInterest = newMonthly * nt * 12 - b;

    return {
      currentMonthly: fmt(currentMonthly),
      newMonthly: fmt(newMonthly),
      monthlySavings: fmt(monthlySavings),
      breakEven: Number.isFinite(breakEven) ? Math.ceil(breakEven) : null,
      currentTotalInterest: fmt(currentTotalInterest),
      newTotalInterest: fmt(newTotalInterest),
      totalInterestSavings: fmt(currentTotalInterest - newTotalInterest),
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
      slug="refinance-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.currentBalance")}</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder={t("placeholders.currentBalance")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.currentRate")}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={currentRate}
              onChange={(e) => setCurrentRate(e.target.value)}
              placeholder={t("placeholders.currentRate")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.currentTerm")}</label>
            <input
              type="number"
              min="1"
              step="1"
              value={currentTerm}
              onChange={(e) => setCurrentTerm(e.target.value)}
              placeholder={t("placeholders.currentTerm")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.newRate")}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder={t("placeholders.newRate")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.newTerm")}</label>
            <input
              type="number"
              min="1"
              step="1"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              placeholder={t("placeholders.newTerm")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.closingCosts")}</label>
            <input
              type="number"
              min="0"
              step="100"
              value={closingCosts}
              onChange={(e) => setClosingCosts(e.target.value)}
              placeholder={t("placeholders.closingCosts")}
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

        {showError && !result && (
          <p className="text-sm text-red-400">{t("errors.invalidInputs")}</p>
        )}

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.monthlySavings")}</h3>
              <CopyButton text={result.monthlySavings} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.monthlySavings}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.currentMonthly")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.currentMonthly}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.newMonthly")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.newMonthly}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.breakEven")}</p>
                <p className="text-xl font-semibold text-zinc-200">
                  {result.breakEven !== null ? `${result.breakEven} ${t("labels.months")}` : t("labels.never")}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalInterestSavings")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalInterestSavings}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.currentTotalInterest")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.currentTotalInterest}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.newTotalInterest")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.newTotalInterest}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
