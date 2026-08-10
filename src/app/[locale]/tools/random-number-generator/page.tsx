"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function RandomNumberGeneratorPage() {
  const t = useTranslations("tools.random-number-generator");
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<number | null>(null);

  const generate = () => {
    const lower = Math.min(min, max);
    const upper = Math.max(min, max);
    const value = Math.floor(Math.random() * (upper - lower + 1)) + lower;
    setResult(value);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="random-number-generator"
    >
      <div className="max-w-xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.min")}</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value || "0", 10))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.max")}</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value || "0", 10))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <button
          onClick={generate}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.generate")}
        </button>

        {result !== null && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.result")}</h3>
              <CopyButton text={String(result)} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
