"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const FREQUENCIES = [
  { value: "1", key: "annually" },
  { value: "4", key: "quarterly" },
  { value: "12", key: "monthly" },
] as const;

const TYPES = [
  { value: "ordinary", key: "ordinary" },
  { value: "due", key: "due" },
] as const;

export default function AnnuityCalculatorPage() {
  const t = useTranslations("tools.annuity-calculator");
  const [payment, setPayment] = useState("500");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("20");
  const [frequency, setFrequency] = useState("12");
  const [type, setType] = useState("ordinary");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const calculate = () => {
    const pmt = parseFloat(payment);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const n = parseInt(frequency, 10);

    if (
      Number.isNaN(pmt) ||
      Number.isNaN(r) ||
      Number.isNaN(y) ||
      Number.isNaN(n) ||
      pmt < 0 ||
      r < 0 ||
      y <= 0 ||
      n <= 0
    ) {
      return null;
    }

    const i = r / 100 / n;
    const periods = y * n;
    const factor = type === "due" ? 1 + i : 1;

    let pv = 0;
    let fv = 0;
    if (i === 0) {
      pv = pmt * periods;
      fv = pmt * periods;
    } else {
      pv = pmt * ((1 - Math.pow(1 + i, -periods)) / i) * factor;
      fv = pmt * ((Math.pow(1 + i, periods) - 1) / i) * factor;
    }

    return {
      presentValue: fmt(pv),
      futureValue: fmt(fv),
      totalPayments: fmt(pmt * periods),
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
      slug="annuity-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.payment")}</label>
            <input
              type="number"
              min="0"
              step="10"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              placeholder={t("placeholders.payment")}
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.type")}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              {TYPES.map((f) => (
                <option key={f.value} value={f.value}>
                  {t(`options.${f.key}`)}
                </option>
              ))}
            </select>
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
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.presentValue")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-blue-400">{result.presentValue}</p>
                  <CopyButton text={result.presentValue} className="text-xs px-2 py-1" />
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.futureValue")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.futureValue}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalPayments")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalPayments}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
