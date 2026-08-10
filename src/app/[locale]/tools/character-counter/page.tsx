"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function CharacterCounterPage() {
  const t = useTranslations("tools.character-counter");
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const charCount = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split("\n").length : 0;
    const bytes = new Blob([text]).size;
    return { charCount, words, lines, bytes };
  }, [text]);

  const statsList = [
    { label: t("labels.characters"), value: stats.charCount },
    { label: t("labels.words"), value: stats.words },
    { label: t("labels.lines"), value: stats.lines },
    { label: t("labels.bytes"), value: stats.bytes },
  ];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="character-counter"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">{t("labels.enterText")}</label>
            {text && <CopyButton text={text} className="text-xs px-2 py-1" />}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("labels.placeholder")}
            rows={14}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
          />
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <h3 className="mb-3 text-sm font-semibold text-zinc-300">{t("labels.statistics")}</h3>
          <div className="space-y-2">
            {statsList.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">{s.label}</span>
                <span className="font-mono text-sm font-medium text-zinc-200">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
