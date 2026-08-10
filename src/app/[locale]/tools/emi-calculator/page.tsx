"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function EmiCalculatorPage() {
  const t = useTranslations("tools.emi-calculator");
  const [principal, setPrincipal] = useState("300000");
  const [rate, setRate] = useState("7.5");
  const [years, setYears] = useState("20");
  const [prepayment, setPrepayment] = useState("0");
  const [showError, setShowError] = useState(false);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const extra = parseFloat(prepayment);

    if (
      Number.isNaN(p) ||
      Number.isNaN(r) ||
      Number.isNaN(y) ||
      Number.isNaN(extra) ||
      p <= 0 ||
      y <= 0 ||
      extra < 0
    ) {
      return null;
    }

    const n = y * 12;
    const monthlyRate = r / 100 / 12;
    let emi = 0;
    if (monthlyRate === 0) {
      emi = p / n;
    } else {
      emi = (p * (monthlyRate * Math.pow(1 + monthlyRate, n))) / (Math.pow(1 + monthlyRate, n) - 1);
    }

    const schedule: { month: number; interest: number; principal: number; balance: number }[] = [];
    let balance = p;
    let totalInterest = 0;
    let month = 1;
    while (balance > 0.01 && month <= n + extra * 100) {
      const interestPayment = balance * monthlyRate;
      let principalPayment = emi - interestPayment + extra;
      if (principalPayment >= balance + interestPayment) {
        principalPayment = balance;
        balance = 0;
      } else {
        balance = balance - principalPayment;
      }
      totalInterest += interestPayment;
      if (schedule.length < 12) {
        schedule.push({ month, interest: interestPayment, principal: principalPayment, balance: Math.max(0, balance) });
      }
      month++;
      if (balance <= 0) break;
    }

    const actualMonths = month - 1;
    const totalPayment = emi * actualMonths + extra * actualMonths;

    return {
      emi: fmt(emi + extra),
      baseEmi: fmt(emi),
      totalPayment: fmt(totalPayment),
      totalInterest: fmt(totalInterest),
      actualMonths,
      schedule,
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
      slug="emi-calculator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.principal")}</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder={t("placeholders.principal")}
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.prepayment")}</label>
            <input
              type="number"
              min="0"
              step="10"
              value={prepayment}
              onChange={(e) => setPrepayment(e.target.value)}
              placeholder={t("placeholders.prepayment")}
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
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-300">{t("labels.emi")}</h3>
                <CopyButton text={result.emi} className="text-xs px-2 py-1" />
              </div>
              <p className="text-3xl font-bold text-blue-400">{result.emi}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-zinc-400">{t("labels.totalPayment")}</p>
                  <p className="text-xl font-semibold text-zinc-200">{result.totalPayment}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">{t("labels.totalInterest")}</p>
                  <p className="text-xl font-semibold text-zinc-200">{result.totalInterest}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">{t("labels.actualMonths")}</p>
                  <p className="text-xl font-semibold text-zinc-200">{result.actualMonths}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">{t("labels.baseEmi")}</p>
                  <p className="text-xl font-semibold text-zinc-200">{result.baseEmi}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="mb-3 text-sm font-medium text-zinc-300">{t("labels.schedule")}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-zinc-400">
                    <tr>
                      <th className="pb-2 pr-4">{t("labels.month")}</th>
                      <th className="pb-2 pr-4">{t("labels.interestPaid")}</th>
                      <th className="pb-2 pr-4">{t("labels.principalPaid")}</th>
                      <th className="pb-2">{t("labels.remainingBalance")}</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-200">
                    {result.schedule.map((row) => (
                      <tr key={row.month} className="border-t border-zinc-800">
                        <td className="py-2 pr-4">{row.month}</td>
                        <td className="py-2 pr-4">{fmt(row.interest)}</td>
                        <td className="py-2 pr-4">{fmt(row.principal)}</td>
                        <td className="py-2">{fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
