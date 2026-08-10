"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function CarLoanInterestDeductionCalculatorPage() {
  const t = useTranslations("tools.car-loan-interest-deduction-calculator");
  const [loanAmount, setLoanAmount] = useState("25000");
  const [rate, setRate] = useState("6");
  const [term, setTerm] = useState("5");
  const [taxBracket, setTaxBracket] = useState("22");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const calculate = () => {
    const p = parseFloat(loanAmount);
    const r = parseFloat(rate);
    const y = parseFloat(term);
    const bracket = parseFloat(taxBracket);

    if (
      Number.isNaN(p) ||
      Number.isNaN(r) ||
      Number.isNaN(y) ||
      Number.isNaN(bracket) ||
      p <= 0 ||
      y <= 0 ||
      bracket < 0 ||
      bracket > 100
    ) {
      return null;
    }

    const n = y * 12;
    const monthlyRate = r / 100 / 12;
    let monthly = 0;
    if (monthlyRate === 0) {
      monthly = p / n;
    } else {
      monthly = (p * (monthlyRate * Math.pow(1 + monthlyRate, n))) / (Math.pow(1 + monthlyRate, n) - 1);
    }

    let balance = p;
    let annualInterest = 0;
    for (let m = 1; m <= 12 && balance > 0; m++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthly - interestPayment;
      annualInterest += interestPayment;
      balance -= principalPayment;
    }

    const deductible = annualInterest * (bracket / 100);

    return {
      annualInterest: fmt(annualInterest),
      deductibleAmount: fmt(deductible),
      taxSavings: fmt(deductible),
      monthlyPayment: fmt(monthly),
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
      slug="car-loan-interest-deduction-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.loanAmount")}</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder={t("placeholders.loanAmount")}
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.taxBracket")}</label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={taxBracket}
              onChange={(e) => setTaxBracket(e.target.value)}
              placeholder={t("placeholders.taxBracket")}
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.deductibleAmount")}</h3>
              <CopyButton text={result.deductibleAmount} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.deductibleAmount}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.annualInterest")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.annualInterest}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.taxSavings")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.taxSavings}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.monthlyPayment")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.monthlyPayment}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
