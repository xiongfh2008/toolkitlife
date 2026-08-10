"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function CssBorderRadiusPage() {
  const t = useTranslations("tools.css-border-radius");
  const [unit, setUnit] = useState<"px" | "%">("px");
  const [tl, setTl] = useState(16);
  const [tr, setTr] = useState(16);
  const [br, setBr] = useState(16);
  const [bl, setBl] = useState(16);

  const css = useMemo(() => {
    const u = unit;
    const all = [tl, tr, br, bl];
    if (all.every((v) => v === tl)) return `border-radius: ${tl}${u};`;
    return `border-radius: ${tl}${u} ${tr}${u} ${br}${u} ${bl}${u};`;
  }, [tl, tr, br, bl, unit]);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="css-border-radius"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUnit("px")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${unit === "px" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
            >
              px
            </button>
            <button
              onClick={() => setUnit("%")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${unit === "%" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
            >
              %
            </button>
          </div>
          {[
            { label: t("labels.topLeft"), value: tl, set: setTl },
            { label: t("labels.topRight"), value: tr, set: setTr },
            { label: t("labels.bottomRight"), value: br, set: setBr },
            { label: t("labels.bottomLeft"), value: bl, set: setBl },
          ].map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-zinc-300">{c.label}</label>
                <span className="text-xs text-zinc-500">{c.value}{unit}</span>
              </div>
              <input
                type="range"
                min={0}
                max={unit === "px" ? 200 : 50}
                value={c.value}
                onChange={(e) => c.set(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex h-64 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
            <div
              className="h-40 w-40 bg-blue-600"
              style={{ borderRadius: `${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit}` }}
            />
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
