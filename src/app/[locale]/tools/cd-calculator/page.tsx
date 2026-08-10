"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const FREQUENCIES = [
  { value: "1", key: "annually" },
  { value: "4", key: "quarterly" },
  { value: "12", key: "monthly" },
  { value: "365", key: "daily" },
] as const;

export default function CdCalculatorPage() {
  const t = useTranslations("tools.cd-calculator");
  const [deposit, setDeposit] = useState("10000");
  const [rate, setRate] = useState("4.5");
  const [term, setTerm] = useState("5");
  const [frequency, setFrequency] = useState("12");
  const [taxRate, setTaxRate] = useState("22");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const calculate = () => {
    const p = parseFloat(deposit);
    const r = parseFloat(rate);
    const years = parseFloat(term);
    const n = parseInt(frequency, 10);
    const tr = parseFloat(taxRate);

    if (
      Number.isNaN(p) ||
      Number.isNaN(r) ||
      Number.isNaN(years) ||
      Number.isNaN(n) ||
      Number.isNaN(tr) ||
      p < 0 ||
      r < 0 ||
      years <= 0 ||
      n <= 0 ||
      tr < 0
    ) {
      return null;
    }

    const amount = p * Math.pow(1 + r / 100 / n, n * years);
    const interest = amount - p;
    const tax = interest * (tr / 100);
    const afterTaxValue = amount - tax;

    return {
      maturityValue: fmt(amount),
      interestEarned: fmt(interest),
      tax: fmt(tax),
      afterTaxValue: fmt(afterTaxValue),
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
      slug="cd-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.deposit")}</label>
            <input
              type="number"
              min="0"
              step="100"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              placeholder={t("placeholders.deposit")}
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
              step="0.5"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder={t("placeholders.term")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.frequency")}</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {t(`options.${f.key}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.taxRate")}</label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              placeholder={t("placeholders.taxRate")}
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.maturityValue")}</h3>
              <CopyButton text={result.maturityValue} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.maturityValue}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.interestEarned")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.interestEarned}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.tax")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.tax}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.afterTaxValue")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.afterTaxValue}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
