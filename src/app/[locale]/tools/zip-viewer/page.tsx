"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import JSZip from "jszip";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

interface Entry {
  name: string;
  size: number;
  dir: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ZipViewerPage() {
  const t = useTranslations("tools.zip-viewer");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [entries, setEntries] = useState<Entry[]>([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (file?: File) => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const zip = await JSZip.loadAsync(file);
      const list: Entry[] = [];
      zip.forEach((name, entry) => {
        if (!entry.dir) {
          // uncompressedSize is not exposed on the public type; read it from the
          // internal compressed object so we can list sizes without inflating.
          const raw = entry as unknown as { _data?: { uncompressedSize?: number } };
          list.push({ name, size: raw._data?.uncompressedSize ?? 0, dir: false });
        }
      });
      list.sort((a, b) => a.name.localeCompare(b.name));
      setEntries(list);
      setFileName(file.name);
    } catch {
      setError(t("labels.invalid"));
      setEntries([]);
      setFileName("");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <ToolLayout
      title={t("title")}
      slug="zip-viewer"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800">
          <span>{t("buttons.choose")}</span>
          <input ref={inputRef} type="file" accept=".zip,application/zip" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        {loading && <p className="text-sm text-zinc-400">{t("labels.loading")}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {entries.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-zinc-800">
            <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
              {fileName} · {t("labels.count", { count: entries.length })}
            </div>
            <ul className="max-h-96 overflow-y-auto divide-y divide-zinc-800/70">
              {entries.map((e) => (
                <li key={e.name} className="flex items-center justify-between gap-4 px-4 py-2 text-sm">
                  <span className="truncate text-zinc-200" title={e.name}>
                    {e.name}
                  </span>
                  <span className="shrink-0 text-xs text-zinc-500">{formatSize(e.size)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
