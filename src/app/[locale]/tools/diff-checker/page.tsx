"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface DiffLine {
  type: "same" | "removed" | "added";
  text: string;
}

function computeDiff(original: string, modified: string): DiffLine[] {
  const origLines = original.split("\n");
  const modLines = modified.split("\n");
  const diff: DiffLine[] = [];
  let i = 0;
  let j = 0;

  while (i < origLines.length || j < modLines.length) {
    if (i < origLines.length && j < modLines.length && origLines[i] === modLines[j]) {
      diff.push({ type: "same", text: origLines[i] });
      i += 1;
      j += 1;
    } else if (j < modLines.length && (i >= origLines.length || origLines[i] !== modLines[j])) {
      diff.push({ type: "added", text: modLines[j] });
      j += 1;
    } else if (i < origLines.length) {
      diff.push({ type: "removed", text: origLines[i] });
      i += 1;
    }
  }

  return diff;
}

export default function DiffCheckerPage() {
  const t = useTranslations("tools.diff-checker");
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diff, setDiff] = useState<DiffLine[]>([]);

  const compare = () => {
    setDiff(computeDiff(original, modified));
  };

  const clear = () => {
    setOriginal("");
    setModified("");
    setDiff([]);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="diff-checker"
    >
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.original")}</label>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              rows={10}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.modified")}</label>
            <textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              rows={10}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={compare}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            {t("buttons.compare")}
          </button>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-700 px-6 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors"
          >
            {t("buttons.clear")}
          </button>
        </div>

        {diff.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-300">{t("labels.differences")}</h3>
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
              {diff.map((line, index) => (
                <div
                  key={index}
                  className={`flex px-4 py-1 font-mono text-sm ${
                    line.type === "added"
                      ? "bg-green-500/10 text-green-400"
                      : line.type === "removed"
                      ? "bg-red-500/10 text-red-400"
                      : "text-zinc-300"
                  }`}
                >
                  <span className="w-6 shrink-0 select-none opacity-70">
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </span>
                  <span className="break-all">{line.text || " "}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
