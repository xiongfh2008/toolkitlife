"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type Gender = "boy" | "girl";

export default function HeightPredictPage() {
  const t = useTranslations("tools.height-predict");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [gender, setGender] = useState<Gender>("boy");
  const [father, setFather] = useState(175);
  const [mother, setMother] = useState(163);
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    if (!father || !mother) return;
    // Common prediction formulas (cm).
    const base = gender === "boy" ? (father + mother) / 2 + 6.5 : (father + mother) / 2 - 6.5;
    setResult(Math.round(base));
  };

  const inputCls =
    "rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="height-predict"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["boy", "girl"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${gender === g ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
            >
              {t(`genders.${g}`)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-zinc-400">{t("labels.father")}</label>
          <input type="number" value={father} onChange={(e) => setFather(Number(e.target.value))} className={inputCls + " w-24"} />
          <span className="text-sm text-zinc-500">cm</span>
          <label className="text-sm text-zinc-400">{t("labels.mother")}</label>
          <input type="number" value={mother} onChange={(e) => setMother(Number(e.target.value))} className={inputCls + " w-24"} />
          <span className="text-sm text-zinc-500">cm</span>
          <button onClick={calculate} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500">
            {t("buttons.calculate")}
          </button>
        </div>
        {result !== null && (
          <div className="rounded-lg border border-zinc-800 p-4">
            <p className="text-sm text-zinc-400">{t("labels.estimate")}</p>
            <p className="mt-1 text-3xl font-semibold text-blue-400">{result} cm</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
