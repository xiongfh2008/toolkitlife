"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const TYPES = ["A", "B", "AB", "O"] as const;

// Possible child blood types from a given father/mother genotype pair.
const POSSIBLE: Record<string, string[]> = {
  "A,A": ["A", "O"],
  "A,B": ["A", "B", "AB", "O"],
  "A,AB": ["A", "B", "AB"],
  "A,O": ["A", "O"],
  "B,B": ["B", "O"],
  "B,AB": ["A", "B", "AB"],
  "B,O": ["B", "O"],
  "AB,AB": ["A", "B", "AB"],
  "AB,O": ["A", "B"],
  "O,O": ["O"],
};

function possibleChildren(father: string, mother: string): string[] {
  const key = [father, mother]
    .sort((a, b) => TYPES.indexOf(a as (typeof TYPES)[number]) - TYPES.indexOf(b as (typeof TYPES)[number]))
    .join(",");
  return POSSIBLE[key] ?? [];
}

export default function BloodTypePage() {
  const t = useTranslations("tools.blood-type");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [father, setFather] = useState<string>("A");
  const [mother, setMother] = useState<string>("B");
  const possible = possibleChildren(father, mother);
  const impossible = TYPES.filter((x) => !possible.includes(x));

  const selectCls =
    "rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="blood-type"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-zinc-400">{t("labels.father")}</label>
          <select value={father} onChange={(e) => setFather(e.target.value)} className={selectCls}>
            {TYPES.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
          <label className="text-sm text-zinc-400">{t("labels.mother")}</label>
          <select value={mother} onChange={(e) => setMother(e.target.value)} className={selectCls}>
            {TYPES.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border border-zinc-800 p-4">
          <p className="text-sm text-zinc-400">{t("labels.possible")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {possible.map((x) => (
              <span key={x} className="rounded-full bg-emerald-600/20 px-4 py-1.5 text-sm font-semibold text-emerald-300">
                {x}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 p-4">
          <p className="text-sm text-zinc-400">{t("labels.impossible")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {impossible.map((x) => (
              <span key={x} className="rounded-full bg-red-600/15 px-4 py-1.5 text-sm text-zinc-500 line-through">
                {x}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
