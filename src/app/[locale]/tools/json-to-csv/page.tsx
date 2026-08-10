"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function convertToCsv(data: unknown[]): string {
  if (data.length === 0) return "";

  const keys = Array.from(new Set(data.flatMap((row) => (row && typeof row === "object" ? Object.keys(row) : []))));
  const escape = (value: unknown): string => {
    const text = value === null || value === undefined ? "" : String(value);
    if (text.includes(",") || text.includes('"') || text.includes("\n") || text.includes("\r")) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const rows = [
    keys.join(","),
    ...data.map((row) =>
      keys
        .map((key) => escape((row && typeof row === "object") ? (row as Record<string, unknown>)[key] : ""))
        .join(",")
    ),
  ];
  return rows.join("\n");
}

export default function JsonToCsvPage() {
  const t = useTranslations("tools.json-to-csv");
  const [input, setInput] = useState("");
  const [csv, setCsv] = useState("");
  const [error, setError] = useState("");

  const handleConvert = () => {
    try {
      const parsed = JSON.parse(input);
      const data = Array.isArray(parsed) ? parsed : [parsed];
      setCsv(convertToCsv(data));
      setError("");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : t("labels.errorFallback");
      setError(message);
      setCsv("");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="json-to-csv"
    >
      <div className="max-w-4xl space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleConvert}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            {t("buttons.convert")}
          </button>
          {csv && (
            <>
              <CopyButton text={csv} label={t("buttons.copy")} />
              <button
                onClick={handleDownload}
                className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors"
              >
                {t("buttons.download")}
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.input")}</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("labels.inputPlaceholder")}
              rows={16}
              spellCheck={false}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.output")}</label>
            <textarea
              value={csv}
              readOnly
              rows={16}
              placeholder={t("labels.outputPlaceholder")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 resize-y"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
