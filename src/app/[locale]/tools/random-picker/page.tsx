"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function RandomPickerPage() {
  const t = useTranslations("tools.random-picker");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [text, setText] = useState("");
  const [count, setCount] = useState(1);
  const [picked, setPicked] = useState<string[]>([]);

  const parseList = () =>
    text
      .split(/\n|,|，|;|；/)
      .map((s) => s.trim())
      .filter(Boolean);

  const pick = () => {
    const list = parseList();
    if (list.length === 0) return;
    const n = Math.max(1, Math.min(count, list.length));
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    setPicked(shuffled.slice(0, n));
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="random-picker"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.list")}</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder={t("labels.placeholder")}
            className={inputCls}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-zinc-300">{t("labels.count")}</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            className="w-20 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={pick}
            disabled={parseList().length === 0}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {t("buttons.pick")}
          </button>
        </div>
        {picked.length > 0 && (
          <div className="rounded-lg border border-zinc-800 p-4">
            <p className="mb-2 text-sm text-zinc-400">{t("labels.result")}</p>
            <div className="flex flex-wrap gap-2">
              {picked.map((p, i) => (
                <span key={i} className="rounded-full bg-blue-600/20 px-3 py-1 text-sm font-medium text-blue-300">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
