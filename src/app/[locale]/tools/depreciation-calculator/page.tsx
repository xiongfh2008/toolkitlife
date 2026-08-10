"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function DepreciationCalculatorPage() {
  const t = useTranslations("tools.depreciation-calculator");
  const [cost, setCost] = useState("20000");
  const [salvage, setSalvage] = useState("2000");
  const [years, setYears] = useState("5");

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const costNum = parseFloat(cost);
  const salvageNum = parseFloat(salvage);
  const yearsNum = parseFloat(years);
  const valid =
    !Number.isNaN(costNum) &&
    !Number.isNaN(salvageNum) &&
    !Number.isNaN(yearsNum) &&
    costNum > 0 &&
    salvageNum >= 0 &&
    salvageNum < costNum &&
    yearsNum > 0 &&
    Number.isInteger(yearsNum);

  let straightLine = 0;
  let ddbRate = 0;
  let firstYearDdb = 0;
  let rows: { year: number; slValue: number; slDep: number; ddbValue: number; ddbDep: number }[] = [];
  if (valid) {
    straightLine = (costNum - salvageNum) / yearsNum;
    ddbRate = 2 / yearsNum;
    firstYearDdb = costNum * ddbRate;
    let slValue = costNum;
    let ddbValue = costNum;
    rows = Array.from({ length: yearsNum }, (_, i) => {
      const year = i + 1;
      const slDep = year === yearsNum ? slValue - salvageNum : straightLine;
      slValue = year === yearsNum ? salvageNum : slValue - slDep;
      const ddbDep = Math.min(ddbValue * ddbRate, ddbValue - salvageNum);
      ddbValue -= ddbDep;
      return { year, slValue, slDep, ddbValue, ddbDep };
    });
  }

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="depreciation-calculator"
      keywords={keywords}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="max-w-3xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.cost")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder={t("placeholders.cost")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.salvage")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={salvage}
              onChange={(e) => setSalvage(e.target.value)}
              placeholder={t("placeholders.salvage")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.years")}
            </label>
            <input
              type="number"
              min="1"
              max="50"
              step="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder={t("placeholders.years")}
              className={inputCls}
            />
          </div>
        </div>

        {valid ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500">{t("labels.straightLine")}</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-100">
                  {fmt(straightLine)}
                  <span className="text-xs font-normal text-zinc-500">/yr</span>
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500">{t("labels.ddbFirstYear")}</p>
                <p className="mt-1 text-2xl font-semibold text-green-400">
                  {fmt(firstYearDdb)}
                  <span className="text-xs font-normal text-zinc-500">/yr</span>
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                    <th className="px-4 py-3">{t("table.year")}</th>
                    <th className="px-4 py-3">{t("table.slDep")}</th>
                    <th className="px-4 py-3">{t("table.slValue")}</th>
                    <th className="px-4 py-3">{t("table.ddbDep")}</th>
                    <th className="px-4 py-3">{t("table.ddbValue")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.year} className="border-b border-zinc-800/60 last:border-0">
                      <td className="px-4 py-2 text-zinc-200">{row.year}</td>
                      <td className="px-4 py-2 text-zinc-400">{fmt(row.slDep)}</td>
                      <td className="px-4 py-2 text-zinc-400">{fmt(row.slValue)}</td>
                      <td className="px-4 py-2 text-zinc-400">{fmt(row.ddbDep)}</td>
                      <td className="px-4 py-2 text-zinc-400">{fmt(row.ddbValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-sm text-red-400">{t("errors.invalidInputs")}</p>
        )}
      </div>
    </ToolLayout>
  );
}
