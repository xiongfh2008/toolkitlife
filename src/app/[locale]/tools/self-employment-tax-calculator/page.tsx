"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function SelfEmploymentTaxCalculatorPage() {
  const t = useTranslations("tools.self-employment-tax-calculator");
  const [netIncome, setNetIncome] = useState("60000");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const calculate = () => {
    const income = parseFloat(netIncome);
    if (Number.isNaN(income) || income < 0) return null;

    const seTaxable = income * 0.9235;
    const seTax = seTaxable * 0.153;
    const deductible = seTax * 0.5;

    return {
      seTaxableIncome: fmt(seTaxable),
      seTax: fmt(seTax),
      deductiblePortion: fmt(deductible),
      effectiveRate: `${((seTax / income) * 100).toFixed(2)}%`,
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
      slug="self-employment-tax-calculator"
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
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.netIncome")}</label>
          <input
            type="number"
            min="0"
            step="1000"
            value={netIncome}
            onChange={(e) => setNetIncome(e.target.value)}
            placeholder={t("placeholders.netIncome")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.seTax")}</h3>
              <CopyButton text={result.seTax} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.seTax}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.seTaxableIncome")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.seTaxableIncome}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.deductiblePortion")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.deductiblePortion}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.effectiveRate")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.effectiveRate}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
