"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseData(input: string): string[][] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      if (line.includes("\t")) {
        return line.split("\t").map((cell) => cell.trim());
      }
      return line.split(",").map((cell) => cell.trim());
    });
}

export default function HtmlTableGeneratorPage() {
  const t = useTranslations("tools.html-table-generator");
  const [input, setInput] = useState("Name,Age,City\nAlice,30,New York\nBob,25,Los Angeles");
  const [firstRowHeader, setFirstRowHeader] = useState(true);

  const html = useMemo(() => {
    const rows = parseData(input);
    if (rows.length === 0) return "";

    const bodyRows = firstRowHeader ? rows.slice(1) : rows;
    const headerRow = firstRowHeader ? rows[0] : null;

    let output = "<table>\n";
    if (headerRow) {
      output += "  <thead>\n    <tr>\n";
      output += headerRow.map((cell) => `      <th>${escapeHtml(cell)}</th>`).join("\n");
      output += "\n    </tr>\n  </thead>\n";
    }
    output += "  <tbody>\n";
    bodyRows.forEach((row) => {
      output += "    <tr>\n";
      output += row.map((cell) => `      <td>${escapeHtml(cell)}</td>`).join("\n");
      output += "\n    </tr>\n";
    });
    output += "  </tbody>\n</table>";
    return output;
  }, [input, firstRowHeader]);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="html-table-generator"
    >
      <div className="max-w-4xl space-y-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.input")}</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("labels.inputPlaceholder")}
              rows={10}
              spellCheck={false}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={firstRowHeader}
              onChange={(e) => setFirstRowHeader(e.target.checked)}
              className="rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
            />
            {t("labels.firstRowHeader")}
          </label>
        </div>

        {html && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.output")}</label>
              <CopyButton text={html} label={t("buttons.copy")} />
            </div>
            <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm text-zinc-300">
              {html}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
