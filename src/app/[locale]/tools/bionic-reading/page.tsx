"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function bionicText(text: string) {
  return text
    .split(/(\s+)/)
    .map((part) => {
      if (!part.trim()) return part;
      const half = Math.ceil(part.length / 2);
      const bold = part.slice(0, half);
      const rest = part.slice(half);
      return `<b>${bold}</b>${rest}`;
    })
    .join("");
}

function stripHtml(html: string) {
  return html.replace(/<\/?b>/g, "");
}

export default function BionicReadingPage() {
  const t = useTranslations("tools.bionic-reading");
  const [input, setInput] = useState("");

  const html = useMemo(() => bionicText(input), [input]);
  const plain = useMemo(() => stripHtml(html), [html]);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="bionic-reading"
    >
      <div className="max-w-4xl space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-300">{t("labels.input")}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("placeholders.input")}
            rows={8}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-zinc-300">{t("labels.output")}</label>
            <CopyButton text={plain} className="text-xs px-2 py-1" />
          </div>
          <div
            className="min-h-[8rem] rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-lg leading-relaxed text-zinc-100"
            dangerouslySetInnerHTML={{ __html: html || `<span class="text-zinc-500">${t("placeholders.output")}</span>` }}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
