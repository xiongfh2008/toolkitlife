"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function StudentLoanTaxBombCalculatorPage() {
  const t = useTranslations("tools.student-loan-tax-bomb-calculator");
  const [balance, setBalance] = useState("50000");
  const [forgivenAmount, setForgivenAmount] = useState("50000");
  const [taxBracket, setTaxBracket] = useState("22");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const calculate = () => {
    const b = parseFloat(balance);
    const f = parseFloat(forgivenAmount);
    const bracket = parseFloat(taxBracket);

    if (
      Number.isNaN(b) ||
      Number.isNaN(f) ||
      Number.isNaN(bracket) ||
      b < 0 ||
      f < 0 ||
      f > b ||
      bracket < 0 ||
      bracket > 100
    ) {
      return null;
    }

    const taxDue = f * (bracket / 100);
    const effectiveRate = ((taxDue / b) * 100).toFixed(2) + "%";

    return {
      forgivenAmount: fmt(f),
      taxDue: fmt(taxDue),
      effectiveRate,
      remainingBalance: fmt(b - f),
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
      slug="student-loan-tax-bomb-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.forgivenAmount")}</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={forgivenAmount}
              onChange={(e) => setForgivenAmount(e.target.value)}
              placeholder={t("placeholders.forgivenAmount")}
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.estimatedTaxDue")}</h3>
              <CopyButton text={result.taxDue} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.taxDue}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.forgivenAmount")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.forgivenAmount}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.effectiveTaxRate")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.effectiveRate}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.remainingBalance")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.remainingBalance}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
