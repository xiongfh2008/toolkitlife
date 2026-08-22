"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Mode = "chars" | "words" | "lines";

export default function ReverseTextPage() {
  const t = useTranslations("tools.reverse-text");
  const [mode, setMode] = useState<Mode>("chars");
  const [input, setInput] = useState("");

  const reverse = (text: string, m: Mode) => {
    if (!text) return "";
    if (m === "chars") return [...text].reverse().join("");
    if (m === "words") {
      return text.split(/\s+/).filter(Boolean).reverse().join(" ");
    }
    return text.split(/\n/).reverse().join("\n");
  };

  const output = reverse(input, mode);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="reverse-text"
    >
      <div className="space-y-4">
        {/* Mode toggle */}
        <div className="flex flex-wrap gap-2">
          {(["chars", "words", "lines"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`buttons.${m}`)}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Input */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.input")}</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("labels.enterText")}
              rows={10}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
            />
          </div>

          {/* Output */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.output")}</label>
              {output && <CopyButton text={output} className="text-xs px-2 py-1" />}
            </div>
            <textarea
              value={output}
              readOnly
              rows={10}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-300 outline-none resize-y"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
