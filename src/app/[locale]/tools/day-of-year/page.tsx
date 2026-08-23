"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function DayOfYearPage() {
  const t = useTranslations("tools.day-of-year");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [date, setDate] = useState("2026-01-01");
  const [result, setResult] = useState<{ day: number; total: number; left: number } | null>(null);

  const calculate = () => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return;
    const year = d.getFullYear();
    const start = new Date(year, 0, 1);
    const day = Math.floor((d.getTime() - start.getTime()) / 86400000) + 1;
    const daysInYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 366 : 365;
    setResult({ day, total: daysInYear, left: daysInYear - day });
  };

  return (
    <ToolLayout
      title={t("title")}
      slug="day-of-year"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
        />
        <button onClick={calculate} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500">
          {t("buttons.calculate")}
        </button>
      </div>
      {result && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 p-4 text-center">
            <p className="text-3xl font-semibold text-blue-400">{result.day}</p>
            <p className="mt-1 text-xs text-zinc-400">{t("labels.dayOfYear")}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 p-4 text-center">
            <p className="text-3xl font-semibold text-zinc-200">{result.total}</p>
            <p className="mt-1 text-xs text-zinc-400">{t("labels.totalDays")}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 p-4 text-center">
            <p className="text-3xl font-semibold text-emerald-400">{result.left}</p>
            <p className="mt-1 text-xs text-zinc-400">{t("labels.daysLeft")}</p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
