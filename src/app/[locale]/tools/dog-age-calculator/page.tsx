"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type Size = "small" | "medium" | "large";

const SIZE_OFFSET: Record<Size, number> = { small: -2, medium: 0, large: 2 };

export default function DogAgeCalculatorPage() {
  const t = useTranslations("tools.dog-age-calculator");
  const [dogAge, setDogAge] = useState("5");
  const [size, setSize] = useState<Size>("medium");

  const fmt = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 1 });

  const humanYearsFor = (age: number, offset: number) => {
    if (age <= 1) return 15 + offset;
    if (age <= 2) return 24 + offset;
    return Math.round((16 * Math.log(age) + 31 + offset) * 10) / 10;
  };

  const dogNum = parseFloat(dogAge);
  const valid = !Number.isNaN(dogNum) && dogNum > 0 && dogNum <= 30;
  const offset = SIZE_OFFSET[size];
  const humanAge = valid ? humanYearsFor(dogNum, offset) : null;

  const tableRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20].map(
    (age) => ({
      dog: age,
      small: humanYearsFor(age, SIZE_OFFSET.small),
      medium: humanYearsFor(age, SIZE_OFFSET.medium),
      large: humanYearsFor(age, SIZE_OFFSET.large),
    })
  );

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
      slug="dog-age-calculator"
      keywords={keywords}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="max-w-3xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.dogAge")}
            </label>
            <input
              type="number"
              min="0.1"
              max="30"
              step="0.1"
              value={dogAge}
              onChange={(e) => setDogAge(e.target.value)}
              placeholder={t("placeholders.dogAge")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.size")}
            </label>
            <div className="flex gap-2">
              {(["small", "medium", "large"] as Size[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    size === s
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {t(`sizes.${s}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {humanAge !== null ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
            <p className="text-sm text-zinc-400">{t("results.humanAge")}</p>
            <p className="mt-2 text-4xl font-bold text-blue-400">{fmt(humanAge)}</p>
            <p className="mt-2 text-sm text-zinc-500">
              {t("results.note", { dog: fmt(dogNum), human: fmt(humanAge) })}
            </p>
          </div>
        ) : (
          <p className="text-sm text-red-400">{t("errors.invalidInputs")}</p>
        )}

        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                <th className="px-4 py-3">{t("table.dogAge")}</th>
                <th className="px-4 py-3">{t("table.small")}</th>
                <th className="px-4 py-3">{t("table.medium")}</th>
                <th className="px-4 py-3">{t("table.large")}</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.dog} className="border-b border-zinc-800/60 last:border-0">
                  <td className="px-4 py-2 text-zinc-200">{row.dog}</td>
                  <td className="px-4 py-2 text-zinc-400">{fmt(row.small)}</td>
                  <td className="px-4 py-2 text-zinc-400">{fmt(row.medium)}</td>
                  <td className="px-4 py-2 text-zinc-400">{fmt(row.large)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  );
}
