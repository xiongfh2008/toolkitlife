"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function CssFlexboxPage() {
  const t = useTranslations("tools.css-flexbox");
  const [direction, setDirection] = useState("row");
  const [justify, setJustify] = useState("center");
  const [align, setAlign] = useState("center");
  const [wrap, setWrap] = useState("nowrap");
  const [gap, setGap] = useState(16);
  const [itemCount, setItemCount] = useState(5);

  const css = useMemo(
    () =>
      `display: flex;\nflex-direction: ${direction};\njustify-content: ${justify};\nalign-items: ${align};\nflex-wrap: ${wrap};\ngap: ${gap}px;`,
    [direction, justify, align, wrap, gap]
  );

  const select = (label: string, value: string, onChange: (v: string) => void, options: string[]) => (
    <div>
      <label className="mb-1 block text-sm text-zinc-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="css-flexbox"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          {select(t("labels.direction"), direction, setDirection, ["row", "row-reverse", "column", "column-reverse"])}
          {select(t("labels.justifyContent"), justify, setJustify, ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"])}
          {select(t("labels.alignItems"), align, setAlign, ["flex-start", "center", "flex-end", "stretch", "baseline"])}
          {select(t("labels.flexWrap"), wrap, setWrap, ["nowrap", "wrap", "wrap-reverse"])}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-zinc-300">{t("labels.gap")}</label>
              <span className="text-xs text-zinc-500">{gap}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={64}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-zinc-300">{t("labels.items")}</label>
              <span className="text-xs text-zinc-500">{itemCount}</span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="min-h-64 rounded-lg border border-zinc-800 bg-zinc-900 p-4"
            style={{
              display: "flex",
              flexDirection: direction as React.CSSProperties["flexDirection"],
              justifyContent: justify as React.CSSProperties["justifyContent"],
              alignItems: align as React.CSSProperties["alignItems"],
              flexWrap: wrap as React.CSSProperties["flexWrap"],
              gap,
            }}
          >
            {Array.from({ length: itemCount }).map((_, i) => (
              <div
                key={i}
                className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white"
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
