"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function DebtToIncomeCalculatorPage() {
  const t = useTranslations("tools.debt-to-income-calculator");
  const [income, setIncome] = useState("5000");
  const [rent, setRent] = useState("1200");
  const [car, setCar] = useState("400");
  const [creditCards, setCreditCards] = useState("150");
  const [studentLoans, setStudentLoans] = useState("300");
  const [other, setOther] = useState("100");
  const [showError, setShowError] = useState(false);

  const calculate = () => {
    const inc = parseFloat(income);
    const debts =
      (parseFloat(rent) || 0) +
      (parseFloat(car) || 0) +
      (parseFloat(creditCards) || 0) +
      (parseFloat(studentLoans) || 0) +
      (parseFloat(other) || 0);

    if (Number.isNaN(inc) || inc <= 0) {
      return null;
    }

    const ratio = (debts / inc) * 100;
    let verdict: string;
    if (ratio <= 20) verdict = t("results.excellent");
    else if (ratio <= 36) verdict = t("results.good");
    else if (ratio <= 43) verdict = t("results.fair");
    else verdict = t("results.high");

    return {
      totalDebt: debts.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
      ratio: ratio.toFixed(2) + "%",
      verdict,
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
      slug="debt-to-income-calculator"
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
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.monthlyIncome")}</label>
          <input
            type="number"
            min="0"
            step="100"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder={t("placeholders.monthlyIncome")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.rentMortgage")}</label>
            <input
              type="number"
              min="0"
              step="10"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              placeholder={t("placeholders.rentMortgage")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.carPayment")}</label>
            <input
              type="number"
              min="0"
              step="10"
              value={car}
              onChange={(e) => setCar(e.target.value)}
              placeholder={t("placeholders.carPayment")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.creditCards")}</label>
            <input
              type="number"
              min="0"
              step="10"
              value={creditCards}
              onChange={(e) => setCreditCards(e.target.value)}
              placeholder={t("placeholders.creditCards")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.studentLoans")}</label>
            <input
              type="number"
              min="0"
              step="10"
              value={studentLoans}
              onChange={(e) => setStudentLoans(e.target.value)}
              placeholder={t("placeholders.studentLoans")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.otherDebts")}</label>
            <input
              type="number"
              min="0"
              step="10"
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder={t("placeholders.otherDebts")}
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.dtiRatio")}</h3>
              <CopyButton text={result.ratio} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.ratio}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalMonthlyDebt")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalDebt}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.verdict")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.verdict}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
