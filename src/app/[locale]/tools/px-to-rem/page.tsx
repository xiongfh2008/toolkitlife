"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const BASE_OPTIONS = [14, 15, 16, 17, 18, 20];

export default function PxToRemPage() {
  const t = useTranslations("tools.px-to-rem");
  const [base, setBase] = useState(16);
  const [px, setPx] = useState("");
  const [rem, setRem] = useState("");

  const pxToRem = (v: string) => (v === "" ? "" : String(Number(v) / base));
  const remToPx = (v: string) => (v === "" ? "" : String(Number(v) * base));

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="px-to-rem"
    >
      <div className="max-w-xl space-y-6">
        {/* Base font size */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">{t("labels.baseFontSize")}</label>
          <div className="flex flex-wrap gap-2">
            {BASE_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setBase(n)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  base === n ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {n}px
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* px -> rem */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.pxToRem")}</label>
            <input
              type="number"
              inputMode="decimal"
              value={px}
              onChange={(e) => setPx(e.target.value)}
              placeholder="16"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
            <p className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-lg font-bold text-blue-400">
              {pxToRem(px)} rem
            </p>
          </div>

          {/* rem -> px */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.remToPx")}</label>
            <input
              type="number"
              inputMode="decimal"
              value={rem}
              onChange={(e) => setRem(e.target.value)}
              placeholder="1"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
            <p className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-lg font-bold text-blue-400">
              {remToPx(rem)} px
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-500">{t("labels.hint", { base })}</p>
      </div>
    </ToolLayout>
  );
}
