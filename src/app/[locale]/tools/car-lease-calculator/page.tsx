"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function CarLeaseCalculatorPage() {
  const t = useTranslations("tools.car-lease-calculator");
  const [msrp, setMsrp] = useState("35000");
  const [price, setPrice] = useState("33000");
  const [downPayment, setDownPayment] = useState("3000");
  const [residualPercent, setResidualPercent] = useState("58");
  const [moneyFactor, setMoneyFactor] = useState("0.00125");
  const [term, setTerm] = useState("36");
  const [taxRate, setTaxRate] = useState("8");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const calculate = () => {
    const msrpNum = parseFloat(msrp);
    const priceNum = parseFloat(price);
    const downNum = parseFloat(downPayment);
    const residualNum = parseFloat(residualPercent);
    const mf = parseFloat(moneyFactor);
    const months = parseFloat(term);
    const tax = parseFloat(taxRate);

    if (
      Number.isNaN(msrpNum) ||
      Number.isNaN(priceNum) ||
      Number.isNaN(downNum) ||
      Number.isNaN(residualNum) ||
      Number.isNaN(mf) ||
      Number.isNaN(months) ||
      Number.isNaN(tax) ||
      msrpNum <= 0 ||
      priceNum <= 0 ||
      months <= 0 ||
      residualNum < 0 ||
      residualNum > 100 ||
      downNum < 0 ||
      tax < 0
    ) {
      return null;
    }

    const capCost = priceNum - downNum;
    const residualValue = msrpNum * (residualNum / 100);
    const depreciation = (capCost - residualValue) / months;
    const rent = (capCost + residualValue) * mf;
    const monthlyPreTax = depreciation + rent;
    const monthlyTax = monthlyPreTax * (tax / 100);
    const monthlyPayment = monthlyPreTax + monthlyTax;
    const totalCost = monthlyPayment * months + downNum;

    return {
      monthlyPayment: fmt(monthlyPayment),
      monthlyPreTax: fmt(monthlyPreTax),
      monthlyTax: fmt(monthlyTax),
      depreciation: fmt(depreciation),
      rentCharge: fmt(rent),
      totalCost: fmt(totalCost),
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
      slug="car-lease-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.msrp")}</label>
            <input
              type="number"
              min="0"
              step="100"
              value={msrp}
              onChange={(e) => setMsrp(e.target.value)}
              placeholder={t("placeholders.msrp")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.negotiatedPrice")}</label>
            <input
              type="number"
              min="0"
              step="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={t("placeholders.negotiatedPrice")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.downPayment")}</label>
            <input
              type="number"
              min="0"
              step="100"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder={t("placeholders.downPayment")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.residualPercent")}</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={residualPercent}
              onChange={(e) => setResidualPercent(e.target.value)}
              placeholder={t("placeholders.residualPercent")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.moneyFactor")}</label>
            <input
              type="number"
              min="0"
              step="0.00001"
              value={moneyFactor}
              onChange={(e) => setMoneyFactor(e.target.value)}
              placeholder={t("placeholders.moneyFactor")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.term")}</label>
            <input
              type="number"
              min="1"
              step="1"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder={t("placeholders.term")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.taxRate")}</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.monthlyPayment")}</h3>
              <CopyButton text={result.monthlyPayment} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.monthlyPayment}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.monthlyPreTax")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.monthlyPreTax}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.monthlyTax")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.monthlyTax}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.depreciation")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.depreciation}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.rentCharge")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.rentCharge}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.totalCost")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.totalCost}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
