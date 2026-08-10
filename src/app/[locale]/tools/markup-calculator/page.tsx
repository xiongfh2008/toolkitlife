"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function MarkupCalculatorPage() {
  const t = useTranslations("tools.markup-calculator");
  const [cost, setCost] = useState("100");
  const [margin, setMargin] = useState("30");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const calculate = () => {
    const c = parseFloat(cost);
    const m = parseFloat(margin);
    if (Number.isNaN(c) || Number.isNaN(m) || c < 0 || m < 0 || m >= 100) {
      return null;
    }
    const sellingPrice = c / (1 - m / 100);
    const markupAmount = sellingPrice - c;
    const markupPercent = (markupAmount / c) * 100;
    return {
      sellingPrice: fmt(sellingPrice),
      markupAmount: fmt(markupAmount),
      markupPercent: `${markupPercent.toFixed(2)}%`,
      marginPercent: `${m.toFixed(2)}%`,
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
      slug="markup-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.cost")}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder={t("placeholders.cost")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.margin")}</label>
            <input
              type="number"
              min="0"
              max="99.99"
              step="0.1"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              placeholder={t("placeholders.margin")}
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.sellingPrice")}</h3>
              <CopyButton text={result.sellingPrice} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.sellingPrice}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.markupAmount")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.markupAmount}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.markupPercent")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.markupPercent}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.marginPercent")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.marginPercent}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
