"use client";

import { useTranslations } from "next-intl";
import type { PreviewResult } from "@/lib/rename/types";

interface PreviewTableProps {
  preview: PreviewResult[];
  zipping: boolean;
  copied: boolean;
  hasAutoFix: boolean;
  onDownload: () => void;
  onDownloadAll: () => void;
  onDownloadScript: () => void;
  onCopy: () => void;
  onAutoFix: () => void;
  onResetAutoFix: () => void;
}

const btn =
  "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export default function PreviewTable({
  preview,
  zipping,
  copied,
  hasAutoFix,
  onDownload,
  onDownloadAll,
  onDownloadScript,
  onCopy,
  onAutoFix,
  onResetAutoFix,
}: PreviewTableProps) {
  const t = useTranslations("tools.batch-rename");
  const renamedCount = preview.filter((r) => r.hasChange).length;
  const conflictCount = preview.filter((r) => r.conflict).length;
  const hasConflict = conflictCount > 0;

  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/60">
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 px-3 py-2">
        <span className="text-sm font-medium text-zinc-300">{t("labels.preview")}</span>
        <span className="text-xs text-zinc-500">{t("labels.renamedCount", { renamed: renamedCount, total: preview.length })}</span>
        {hasConflict && (
          <span className="ml-auto text-xs text-red-400">
            {t("labels.conflictCount", { count: conflictCount })}
          </span>
        )}
      </div>

      <div className="max-h-72 flex-1 overflow-auto">
        {preview.length === 0 ? (
          <p className="py-8 text-center text-xs text-zinc-500">{t("labels.noFiles")}</p>
        ) : renamedCount === 0 ? (
          <p className="py-8 text-center text-xs text-zinc-500">{t("labels.noChange")}</p>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-zinc-900">
              <tr className="text-zinc-500">
                <th className="px-3 py-2 font-medium">{t("labels.originalName")}</th>
                <th className="px-3 py-2 font-medium">→</th>
                <th className="px-3 py-2 font-medium">{t("labels.newName")}</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((r) => {
                if (!r.hasChange) return null;
                return (
                  <tr
                    key={r.fileId}
                    className={`border-t border-zinc-800/60 ${
                      r.conflict ? "bg-red-500/5" : ""
                    }`}
                  >
                    <td className="max-w-[140px] truncate px-3 py-1.5 text-zinc-500" title={r.original}>
                      {r.original}
                    </td>
                    <td className="px-3 py-1.5 text-zinc-600">→</td>
                    <td
                      className={`max-w-[160px] truncate px-3 py-1.5 font-mono ${
                        r.conflict ? "text-red-400" : "text-blue-400"
                      }`}
                      title={r.newName}
                    >
                      {r.newName}
                      {r.conflict && (
                        <span className="ml-1.5 rounded bg-red-500/15 px-1 py-0.5 text-[10px] text-red-400">
                          {r.error ? t("labels.invalid") : t("labels.conflict")}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="space-y-2 border-t border-zinc-800 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onDownload}
            disabled={zipping || renamedCount === 0}
            className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
          >
            {zipping ? t("status.zipping") : t("buttons.downloadZip")}
          </button>
          <button
            onClick={onDownloadAll}
            disabled={renamedCount === 0}
            className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
            title={t("labels.downloadAllHint")}
          >
            {t("buttons.downloadAll")}
          </button>
          <button
            onClick={onDownloadScript}
            disabled={renamedCount === 0}
            className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
            title={t("labels.downloadScriptHint")}
          >
            {t("buttons.downloadScript")}
          </button>
          <button
            onClick={onCopy}
            disabled={renamedCount === 0}
            className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
          >
            {copied ? t("labels.copied") : t("buttons.copy")}
          </button>
          {hasConflict && (
            <button
              onClick={hasAutoFix ? onResetAutoFix : onAutoFix}
              className={`${btn} ${
                hasAutoFix
                  ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  : "bg-amber-600 text-white hover:bg-amber-500"
              }`}
            >
              {hasAutoFix ? t("buttons.undoFix") : t("buttons.autoFix")}
            </button>
          )}
        </div>
        {hasConflict && !hasAutoFix && (
          <p className="text-[11px] text-amber-400">{t("labels.conflictHint")}</p>
        )}
      </div>
    </div>
  );
}
