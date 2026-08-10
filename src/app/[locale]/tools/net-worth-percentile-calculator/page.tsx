"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const COUNTRIES = ["us", "uk", "ca", "au", "de", "jp", "kr", "cn"] as const;

const PARAMS: Record<string, { median: number; sigma: number }> = {
  us: { median: 192900, sigma: 1.1 },
  uk: { median: 120000, sigma: 1.15 },
  ca: { median: 140000, sigma: 1.1 },
  au: { median: 170000, sigma: 1.1 },
  de: { median: 90000, sigma: 1.05 },
  jp: { median: 110000, sigma: 1.0 },
  kr: { median: 90000, sigma: 1.0 },
  cn: { median: 40000, sigma: 1.2 },
};

export default function NetWorthPercentileCalculatorPage() {
  const t = useTranslations("tools.net-worth-percentile-calculator");
  const [netWorth, setNetWorth] = useState("100000");
  const [country, setCountry] = useState("us");
  const [showError, setShowError] = useState(false);

  const calculate = () => {
    const nw = parseFloat(netWorth);
    if (Number.isNaN(nw)) return null;
    const params = PARAMS[country];
    const z = nw <= 0 ? -10 : Math.log(nw / params.median) / params.sigma;
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
      slug="net-worth-percentile-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.netWorth")}</label>
            <input
              type="number"
              step="1000"
              value={netWorth}
              onChange={(e) => setNetWorth(e.target.value)}
              placeholder={t("placeholders.netWorth")}
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
