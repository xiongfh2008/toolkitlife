"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function CssGridPage() {
  const t = useTranslations("tools.css-grid");
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(2);
  const [gap, setGap] = useState(16);
  const [itemCount, setItemCount] = useState(6);

  const css = useMemo(
    () => `display: grid;\ngrid-template-columns: repeat(${columns}, 1fr);\ngrid-template-rows: repeat(${rows}, 1fr);\ngap: ${gap}px;`,
    [columns, rows, gap]
  );

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="css-grid"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          {[
            { label: t("labels.columns"), value: columns, set: setColumns, min: 1, max: 8 },
            { label: t("labels.rows"), value: rows, set: setRows, min: 1, max: 8 },
            { label: t("labels.gap"), value: gap, set: setGap, min: 0, max: 64 },
            { label: t("labels.items"), value: itemCount, set: setItemCount, min: 1, max: 24 },
          ].map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-zinc-300">{c.label}</label>
                <span className="text-xs text-zinc-500">{c.value}{c.label === t("labels.gap") ? "px" : ""}</span>
              </div>
              <input
                type="range"
                min={c.min}
                max={c.max}
                value={c.value}
                onChange={(e) => c.set(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div
            className="min-h-64 rounded-lg border border-zinc-800 bg-zinc-900 p-4"
            style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, minmax(4rem, 1fr))`, gap }}
          >
            {Array.from({ length: itemCount }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white"
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <pre className="overflow-x-auto text-sm text-zinc-300">{css}</pre>
            <div className="mt-3">
              <CopyButton text={css} label={t("buttons.copy")} />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
