"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type Mode = "diff" | "add";

export default function DateCalculatorPage() {
  const t = useTranslations("tools.date-calculator");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [mode, setMode] = useState<Mode>("diff");
  const [date1, setDate1] = useState("2026-01-01");
  const [date2, setDate2] = useState("2026-12-31");
  const [days, setDays] = useState(30);
  const [result, setResult] = useState<{ text: string; detail?: string } | null>(null);

  const calculate = () => {
    if (mode === "diff") {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return;
      const ms = Math.abs(d2.getTime() - d1.getTime());
      const totalDays = Math.round(ms / 86400000);
      const weeks = Math.floor(totalDays / 7);
      const months = Math.round(totalDays / 30.44);
      setResult({ text: `${totalDays} ${t("labels.days")}`, detail: `${weeks} ${t("labels.weeks")} · ${months} ${t("labels.months")}` });
    } else {
      const d = new Date(date1);
      if (isNaN(d.getTime())) return;
      d.setDate(d.getDate() + days);
      setResult({ text: d.toLocaleDateString([], { year: "numeric", month: "long", day: "numeric", weekday: "long" }) });
    }
  };

  const inputCls =
    "rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="date-calculator"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("diff")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === "diff" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
          >
            {t("modes.diff")}
          </button>
          <button
            onClick={() => setMode("add")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === "add" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
          >
            {t("modes.add")}
          </button>
        </div>

        {mode === "diff" ? (
          <div className="flex flex-wrap items-center gap-3">
            <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className={inputCls} />
            <span className="text-zinc-500">→</span>
            <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className={inputCls} />
            <button onClick={calculate} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500">
              {t("buttons.calculate")}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className={inputCls} />
            <span className="text-zinc-500">+</span>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value) || 0)}
              className={inputCls + " w-24"}
            />
            <span className="text-sm text-zinc-400">{t("labels.days")}</span>
            <button onClick={calculate} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500">
              {t("buttons.calculate")}
            </button>
          </div>
        )}

        {result && (
          <div className="rounded-lg border border-zinc-800 p-4">
            <p className="text-xl font-semibold text-blue-400">{result.text}</p>
            {result.detail && <p className="mt-1 text-sm text-zinc-400">{result.detail}</p>}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
