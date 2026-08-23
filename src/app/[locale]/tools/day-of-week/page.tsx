"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function DayOfWeekPage() {
  const t = useTranslations("tools.day-of-week");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [date, setDate] = useState("2026-01-01");
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return;
    setResult(d.toLocaleDateString([], { weekday: "long" }));
  };

  return (
    <ToolLayout
      title={t("title")}
      slug="day-of-week"
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
        <div className="mt-4 rounded-lg border border-zinc-800 p-6 text-center">
          <p className="text-3xl font-semibold text-blue-400">{result}</p>
          <p className="mt-1 text-sm text-zinc-400">{t("labels.result")}</p>
        </div>
      )}
    </ToolLayout>
  );
}
