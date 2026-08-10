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

const TIMING = [
  { value: "end", key: "end" },
  { value: "begin", key: "begin" },
] as const;

export default function FutureValueCalculatorPage() {
  const t = useTranslations("tools.future-value-calculator");
  const [presentValue, setPresentValue] = useState("1000");
  const [payment, setPayment] = useState("100");
  const [rate, setRate] = useState("6");
  const [years, setYears] = useState("10");
  const [frequency, setFrequency] = useState("12");
  const [timing, setTiming] = useState("end");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const calculate = () => {
    const pv = parseFloat(presentValue);
    const pmt = parseFloat(payment);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const n = parseInt(frequency, 10);

    if (
      Number.isNaN(pv) ||
      Number.isNaN(pmt) ||
      Number.isNaN(r) ||
      Number.isNaN(y) ||
      Number.isNaN(n) ||
      y <= 0 ||
      n <= 0
    ) {
      return null;
    }

    const ratePerPeriod = r / 100 / n;
    const periods = y * n;
    const fvLump = pv * Math.pow(1 + ratePerPeriod, periods);
    const fvAnnuity =
      ratePerPeriod === 0
        ? pmt * periods
        : pmt * ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod);
    const fv = timing === "begin" ? fvLump + fvAnnuity * (1 + ratePerPeriod) : fvLump + fvAnnuity;
    const totalContributions = pv + pmt * periods;
    const totalInterest = fv - totalContributions;

    return {
      futureValue: fmt(fv),
      totalContributions: fmt(totalContributions),
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
      slug="future-value-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.presentValue")}</label>
            <input
              type="number"
              step="100"
              value={presentValue}
              onChange={(e) => setPresentValue(e.target.value)}
              placeholder={t("placeholders.presentValue")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.timing")}</label>
            <select
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              {TIMING.map((f) => (
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.futureValue")}</h3>
              <CopyButton text={result.futureValue} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.futureValue}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalContributions")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalContributions}</p>
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
