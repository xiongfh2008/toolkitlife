"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const COUNTRIES = ["us", "uk", "ca", "au", "de", "jp", "kr", "cn"] as const;

const PARAMS: Record<string, { median: number; sigma: number }> = {
  us: { median: 52000, sigma: 0.85 },
  uk: { median: 42000, sigma: 0.9 },
  ca: { median: 48000, sigma: 0.85 },
  au: { median: 55000, sigma: 0.85 },
  de: { median: 46000, sigma: 0.8 },
  jp: { median: 38000, sigma: 0.75 },
  kr: { median: 36000, sigma: 0.75 },
  cn: { median: 16000, sigma: 0.95 },
};

export default function IncomePercentileCalculatorPage() {
  const t = useTranslations("tools.income-percentile-calculator");
  const [income, setIncome] = useState("60000");
  const [country, setCountry] = useState("us");
  const [showError, setShowError] = useState(false);

  const calculate = () => {
    const inc = parseFloat(income);
    if (Number.isNaN(inc) || inc < 0) return null;
    const params = PARAMS[country];
    const z = Math.log(inc / params.median) / params.sigma;
    const percentile = Math.round(100 / (1 + Math.exp(-z)));
    return {
      percentile: `${percentile}${t("labels.percentileSuffix")}`,
      median: params.median.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
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
      slug="income-percentile-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.country")}</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {t(`options.${c}`)}
                </option>
              ))}
            </select>
          </div>
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.estimatedPercentile")}</h3>
              <CopyButton text={result.percentile} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.percentile}</p>
            <p className="text-sm text-zinc-400">
              {t("labels.countryMedian")}: {result.median}
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
