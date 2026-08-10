"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function findLineCol(text: string, position: number): { line: number; col: number } {
  const lines = text.slice(0, position).split("\n");
  return { line: lines.length, col: lines[lines.length - 1].length + 1 };
}

export default function JsonValidatorPage() {
  const t = useTranslations("tools.json-validator");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const validate = useCallback(() => {
    if (!input.trim()) {
      setError(t("labels.empty"));
      setOutput("");
      return;
    }
    try {
      JSON.parse(input);
      setError("");
      setOutput(t("labels.valid"));
    } catch (e: unknown) {
      let msg = t("labels.errorFallback");
      if (e instanceof SyntaxError && e.message) {
        const match = e.message.match(/position\s+(\d+)/i);
        const pos = match ? parseInt(match[1], 10) : -1;
        if (pos >= 0) {
          const { line, col } = findLineCol(input, pos);
          msg = `${e.message} (${t("labels.line")} ${line}, ${t("labels.column")} ${col})`;
        } else {
          msg = e.message;
        }
      }
      setError(msg);
      setOutput("");
    }
  }, [input, t]);

  const format = useCallback(() => {
    if (!input.trim()) {
      setError(t("labels.empty"));
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e: unknown) {
      let msg = t("labels.errorFallback");
      if (e instanceof SyntaxError && e.message) {
        msg = e.message;
      }
      setError(msg);
      setOutput("");
    }
  }, [input, t]);

  const minify = useCallback(() => {
    if (!input.trim()) {
      setError(t("labels.empty"));
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e: unknown) {
      let msg = t("labels.errorFallback");
      if (e instanceof SyntaxError && e.message) {
        msg = e.message;
      }
      setError(msg);
      setOutput("");
    }
  }, [input, t]);

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="json-validator"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={validate} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
            {t("buttons.validate")}
          </button>
          <button onClick={format} className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors">
            {t("buttons.format")}
          </button>
          <button onClick={minify} className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors">
            {t("buttons.minify")}
          </button>
          <button onClick={clear} className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-700 transition-colors">
            {t("buttons.clear")}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {output && !error && (
          <div className="rounded-lg border border-green-800 bg-green-950 p-3 text-sm text-green-400 flex items-center justify-between">
            <span>{output}</span>
            <CopyButton text={output} className="text-xs px-2 py-1" />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.input")}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("labels.inputPlaceholder")}
            rows={20}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
            spellCheck={false}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
