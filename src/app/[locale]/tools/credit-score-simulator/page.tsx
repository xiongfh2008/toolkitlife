"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const ACTIONS = [
  { value: "none", key: "none" },
  { value: "payDownRevolving", key: "payDownRevolving" },
  { value: "onTimePayments6", key: "onTimePayments6" },
  { value: "onTimePayments12", key: "onTimePayments12" },
  { value: "missPayment30", key: "missPayment30" },
  { value: "missPayment90", key: "missPayment90" },
  { value: "hardInquiry", key: "hardInquiry" },
  { value: "newAccount", key: "newAccount" },
  { value: "maxOutCard", key: "maxOutCard" },
  { value: "settleDebt", key: "settleDebt" },
] as const;

const IMPACTS: Record<string, number> = {
  none: 0,
  payDownRevolving: 25,
  onTimePayments6: 15,
  onTimePayments12: 35,
  missPayment30: -40,
  missPayment90: -90,
  hardInquiry: -5,
  newAccount: -10,
  maxOutCard: -45,
  settleDebt: -50,
};

export default function CreditScoreSimulatorPage() {
  const t = useTranslations("tools.credit-score-simulator");
  const [score, setScore] = useState("700");
  const [action, setAction] = useState("none");
  const [showError, setShowError] = useState(false);

  const calculate = () => {
    const s = parseInt(score, 10);
    if (Number.isNaN(s) || s < 300 || s > 850) return null;
    const impact = IMPACTS[action];
    const newScore = Math.max(300, Math.min(850, s + impact));
    const change = newScore - s;
    return {
      newScore: newScore.toString(),
      change: (change >= 0 ? `+${change}` : `${change}`),
      impactLabel: t(`results.${action}`),
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
      slug="credit-score-simulator"
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.currentScore")}</label>
            <input
              type="number"
              min="300"
              max="850"
              step="1"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder={t("placeholders.currentScore")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.action")}</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              {ACTIONS.map((a) => (
                <option key={a.value} value={a.value}>
                  {t(`options.${a.key}`)}
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.estimatedScore")}</h3>
              <CopyButton text={result.newScore} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.newScore}</p>
            <p className="text-sm text-zinc-400">
              {t("labels.change")}: {result.change}
            </p>
            <p className="text-sm text-zinc-400">{result.impactLabel}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
