"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function ClaudeCodeTextFormatterPage() {
  const t = useTranslations("tools.claude-code-text-formatter");
  const [input, setInput] = useState("");
  const [stripAnsi, setStripAnsi] = useState(true);
  const [stripControl, setStripControl] = useState(true);
  const [stripLineNumbers, setStripLineNumbers] = useState(false);
  const [output, setOutput] = useState("");

  const format = () => {
    let text = input;
    if (stripAnsi) {
      text = text.replace(/\u001b\[[0-9;]*[a-zA-Z]/g, "");
    }
    if (stripControl) {
      text = text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "");
    }
    if (stripLineNumbers) {
      text = text
        .split("\n")
        .map((line) => line.replace(/^\s*\d+[\]:).\s]+/, ""))
        .join("\n");
    }
    setOutput(text);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="claude-code-text-formatter"
    >
      <div className="max-w-4xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={stripAnsi}
              onChange={(e) => setStripAnsi(e.target.checked)}
              className="rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
            />
            {t("labels.stripAnsi")}
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={stripControl}
              onChange={(e) => setStripControl(e.target.checked)}
              className="rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
            />
            {t("labels.stripControl")}
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={stripLineNumbers}
              onChange={(e) => setStripLineNumbers(e.target.checked)}
              className="rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
            />
            {t("labels.stripLineNumbers")}
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">{t("labels.input")}</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholders.input")}
              rows={12}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 font-mono"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-300">{t("labels.output")}</label>
              <CopyButton text={output} className="text-xs px-2 py-1" />
            </div>
            <textarea
              value={output}
              readOnly
              placeholder={t("placeholders.output")}
              rows={12}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={format}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            {t("buttons.format")}
          </button>
          <button
            onClick={() => {
              setInput("");
              setOutput("");
            }}
            className="rounded-lg bg-zinc-700 px-6 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors"
          >
            {t("buttons.clear")}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
