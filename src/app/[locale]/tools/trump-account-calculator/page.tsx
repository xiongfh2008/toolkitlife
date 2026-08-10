"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function TrumpAccountCalculatorPage() {
  const t = useTranslations("tools.trump-account-calculator");
  const [balance, setBalance] = useState("0");
  const [contribution, setContribution] = useState("7000");
  const [match, setMatch] = useState("0");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("20");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const calculate = () => {
    const b = parseFloat(balance);
    const c = parseFloat(contribution);
    const m = parseFloat(match);
    const r = parseFloat(rate);
    const y = parseFloat(years);

    if (
      Number.isNaN(b) ||
      Number.isNaN(c) ||
      Number.isNaN(m) ||
      Number.isNaN(r) ||
      Number.isNaN(y) ||
      b < 0 ||
      c < 0 ||
      m < 0 ||
      r < 0 ||
      y <= 0
    ) {
      return null;
    }

    const annualReturn = r / 100;
    const totalContribution = c * y;
    const employerMatch = c * (m / 100) * y;
    const fv =
      b * Math.pow(1 + annualReturn, y) +
      (c + c * (m / 100)) *
        (annualReturn === 0
          ? y
          : (Math.pow(1 + annualReturn, y) - 1) / annualReturn);
    const totalInvested = b + totalContribution + employerMatch;
    const totalInterest = fv - totalInvested;

    return {
      futureValue: fmt(fv),
      totalContributions: fmt(totalContribution),
      employerMatch: fmt(employerMatch),
      totalInterest: fmt(totalInterest),
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
      slug="trump-account-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.annualContribution")}</label>
            <input
              type="number"
              min="0"
              step="100"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              placeholder={t("placeholders.annualContribution")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.employerMatch")}</label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={match}
              onChange={(e) => setMatch(e.target.value)}
              placeholder={t("placeholders.employerMatch")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.rate")}</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder={t("placeholders.rate")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.years")}</label>
            <input
              type="number"
              min="1"
              step="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder={t("placeholders.years")}
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.futureValue")}</h3>
              <CopyButton text={result.futureValue} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.futureValue}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalContributions")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalContributions}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.employerMatch")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.employerMatch}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalInterest")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalInterest}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
