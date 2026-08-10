"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function MortgagePayoffCalculatorPage() {
  const t = useTranslations("tools.mortgage-payoff-calculator");
  const [balance, setBalance] = useState("200000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [extraPayment, setExtraPayment] = useState("200");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const calculate = () => {
    const p = parseFloat(balance);
    const r = parseFloat(rate);
    const years = parseFloat(term);
    const extra = parseFloat(extraPayment);

    if (
      Number.isNaN(p) ||
      Number.isNaN(r) ||
      Number.isNaN(years) ||
      Number.isNaN(extra) ||
      p <= 0 ||
      r < 0 ||
      years <= 0 ||
      extra < 0
    ) {
      return null;
    }

    const n = years * 12;
    const monthlyRate = r / 100 / 12;
    const baseMonthly =
      monthlyRate === 0
        ? p / n
        : (p * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
          (Math.pow(1 + monthlyRate, n) - 1);

    // baseline
    let baselineBalance = p;
    let baselineInterest = 0;
    let baselineMonths = 0;
    while (baselineBalance > 0.01 && baselineMonths < n + 1200) {
      const interestPayment = baselineBalance * monthlyRate;
      const principalPayment = baseMonthly - interestPayment;
      baselineInterest += interestPayment;
      baselineBalance -= principalPayment;
      baselineMonths++;
    }

    // with extra
    let newBalance = p;
    let newInterest = 0;
    let newMonths = 0;
    while (newBalance > 0.01 && newMonths < n + 1200) {
      const interestPayment = newBalance * monthlyRate;
      let principalPayment = baseMonthly - interestPayment + extra;
      if (principalPayment >= newBalance + interestPayment) {
        principalPayment = newBalance;
        newBalance = 0;
      } else {
        newBalance -= principalPayment;
      }
      newInterest += interestPayment;
      newMonths++;
    }

    const monthsSaved = Math.max(0, baselineMonths - newMonths);
    const interestSaved = Math.max(0, baselineInterest - newInterest);

    return {
      baseMonthly: fmt(baseMonthly),
      monthsSaved: monthsSaved.toString(),
      interestSaved: fmt(interestSaved),
      newPayoffMonths: newMonths.toString(),
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
      slug="mortgage-payoff-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.remainingTerm")}</label>
            <input
              type="number"
              min="1"
              step="1"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder={t("placeholders.remainingTerm")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.extraPayment")}</label>
            <input
              type="number"
              min="0"
              step="10"
              value={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
              placeholder={t("placeholders.extraPayment")}
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.interestSaved")}</h3>
              <CopyButton text={result.interestSaved} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.interestSaved}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.monthsSaved")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.monthsSaved}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.baseMonthly")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.baseMonthly}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.newPayoffMonths")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.newPayoffMonths}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
