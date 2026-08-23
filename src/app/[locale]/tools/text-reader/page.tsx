"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function TextReaderPage() {
  const t = useTranslations("tools.text-reader");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [showReader, setShowReader] = useState(false);

  const start = () => setShowReader(true);

  const btnCls =
    "rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500";

  return (
    <ToolLayout
      title={t("title")}
      slug="text-reader"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder={t("labels.placeholder")}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-zinc-400">{t("labels.fontSize")}</label>
          <input type="range" min={12} max={40} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-40" />
          <span className="w-10 text-sm text-zinc-400">{fontSize}px</span>
          <label className="text-sm text-zinc-400">{t("labels.lineHeight")}</label>
          <input type="range" min={1.2} max={2.6} step={0.1} value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="w-40" />
          <span className="w-10 text-sm text-zinc-400">{lineHeight.toFixed(1)}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={start} className={btnCls}>
            {t("buttons.read")}
          </button>
          {showReader && (
            <button onClick={() => setShowReader(false)} className="rounded-lg border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800">
              {t("buttons.hide")}
            </button>
          )}
        </div>
        {showReader && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6">
            {text.trim() ? (
              <div
                className="whitespace-pre-wrap text-zinc-100"
                style={{ fontSize: `${fontSize}px`, lineHeight }}
              >
                {text}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">{t("labels.empty")}</p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
