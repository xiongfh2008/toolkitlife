"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function HomeAffordabilityCalculatorPage() {
  const t = useTranslations("tools.home-affordability-calculator");
  const [income, setIncome] = useState("80000");
  const [debts, setDebts] = useState("1000");
  const [downPayment, setDownPayment] = useState("50000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [dtiLimit, setDtiLimit] = useState("36");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const calculate = () => {
    const inc = parseFloat(income);
    const debt = parseFloat(debts);
    const down = parseFloat(downPayment);
    const r = parseFloat(rate);
    const y = parseFloat(term);
    const limit = parseFloat(dtiLimit);

    if (
      Number.isNaN(inc) ||
      Number.isNaN(debt) ||
      Number.isNaN(down) ||
      Number.isNaN(r) ||
      Number.isNaN(y) ||
      Number.isNaN(limit) ||
      inc <= 0 ||
      y <= 0 ||
      limit <= 0
    ) {
      return null;
    }

    const maxMonthly = (inc / 12) * (limit / 100) - debt;
    if (maxMonthly <= 0) return { maxMonthly: fmt(0), maxHomePrice: fmt(down), loanAmount: fmt(0) };

    const n = y * 12;
    const monthlyRate = r / 100 / 12;
    const loanAmount =
      monthlyRate === 0
        ? maxMonthly * n
        : (maxMonthly * (Math.pow(1 + monthlyRate, n) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, n));
    const maxHomePrice = loanAmount + down;

    return {
      maxMonthly: fmt(maxMonthly),
      loanAmount: fmt(loanAmount),
      maxHomePrice: fmt(maxHomePrice),
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
      slug="home-affordability-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.monthlyDebts")}</label>
            <input
              type="number"
              min="0"
              step="50"
              value={debts}
              onChange={(e) => setDebts(e.target.value)}
              placeholder={t("placeholders.monthlyDebts")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.downPayment")}</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder={t("placeholders.downPayment")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.rate")}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder={t("placeholders.rate")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.term")}</label>
            <input
              type="number"
              min="1"
              step="1"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder={t("placeholders.term")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.dtiLimit")}</label>
            <input
              type="number"
              min="1"
              max="100"
              step="1"
              value={dtiLimit}
              onChange={(e) => setDtiLimit(e.target.value)}
              placeholder={t("placeholders.dtiLimit")}
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.maxHomePrice")}</h3>
              <CopyButton text={result.maxHomePrice} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.maxHomePrice}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.maxMonthlyPayment")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.maxMonthly}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.loanAmount")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.loanAmount}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
