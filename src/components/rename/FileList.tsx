"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { FileEntry } from "@/lib/rename/types";

interface FileListProps {
  items: FileEntry[];
  maxFiles: number;
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  onClear: () => void;
  onSortFiles: (by: "name" | "size", order: "asc" | "desc") => void;
  onReorder: (from: number, to: number) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileList({
  items,
  maxFiles,
  onAdd,
  onRemove,
  onToggleSelect,
  onSelectAll,
  onClear,
  onSortFiles,
  onReorder,
}: FileListProps) {
  const t = useTranslations("tools.batch-rename");
  const inputRef = useRef<HTMLInputElement>(null);
  const dirRef = useRef<HTMLInputElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onAdd(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleSort = (by: "name" | "size") => {
    const next = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(next);
    onSortFiles(by, next);
  };

  const allSelected = items.length > 0 && items.every((f) => f.selected);

  if (items.length === 0) {
    return (
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          onAdd(Array.from(e.dataTransfer.files));
        }}
        onDragOver={(e) => e.preventDefault()}
        className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-10 text-center transition-colors hover:border-zinc-500"
      >
        <div className="mb-3 text-3xl">📁</div>
        <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
        <p className="mt-1 text-sm text-zinc-500">{t("upload.formats", { max: maxFiles })}</p>
        <p className="mt-1 text-xs text-zinc-500">{t("upload.folderHint")}</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
        />
        <input
          ref={dirRef}
          type="file"
          onChange={handleChange}
          {...({ webkitdirectory: "", directory: "" } as Record<string, unknown>)}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/60">
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 px-3 py-2">
        <span className="text-sm font-medium text-zinc-300">{t("labels.files")}</span>
        <span className="text-xs text-zinc-500">
          {items.length} / {maxFiles}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => handleSort("name")}
            className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition-colors hover:border-blue-500/50 hover:text-blue-400"
            title={t("labels.sortByName")}
          >
            {t("labels.sortByName")} {sortOrder === "asc" ? "↑" : "↓"}
          </button>
          <button
            onClick={() => handleSort("size")}
            className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition-colors hover:border-blue-500/50 hover:text-blue-400"
            title={t("labels.sortBySize")}
          >
            {t("labels.sortBySize")} {sortOrder === "asc" ? "↑" : "↓"}
          </button>
          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-200">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="accent-blue-500"
            />
            {t("labels.selectAll")}
          </label>
          <button
            onClick={() => inputRef.current?.click()}
            className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition-colors hover:border-blue-500/50 hover:text-blue-400"
          >
            {t("labels.addFiles")}
          </button>
          <button
            onClick={() => dirRef.current?.click()}
            className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition-colors hover:border-blue-500/50 hover:text-blue-400"
          >
            {t("labels.addFolder")}
          </button>
          <button
            onClick={onClear}
            className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition-colors hover:border-red-500/50 hover:text-red-400"
          >
            {t("buttons.newBatch")}
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
        />
        <input
          ref={dirRef}
          type="file"
          onChange={handleChange}
          {...({ webkitdirectory: "", directory: "" } as Record<string, unknown>)}
          className="hidden"
        />
      </div>

      <div className="max-h-80 flex-1 overflow-auto">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null && dragIndex !== index) onReorder(dragIndex, index);
              setDragIndex(null);
            }}
            onDragEnd={() => setDragIndex(null)}
            className={`flex items-center gap-2 border-b border-zinc-800/60 px-3 py-2 text-xs ${
              dragIndex === index ? "bg-zinc-800" : ""
            } ${dragIndex !== null ? "cursor-grab" : ""}`}
          >
            <input
              type="checkbox"
              checked={item.selected}
              onChange={() => onToggleSelect(item.id)}
              className="shrink-0 accent-blue-500"
              aria-label={t("labels.selectFile")}
            />
            <span className="min-w-0 flex-1 truncate text-zinc-300" title={item.name}>
              {item.name}
            </span>
            <span className="shrink-0 text-zinc-500">{formatSize(item.file.size)}</span>
            <button
              onClick={() => onRemove(item.id)}
              className="shrink-0 text-zinc-600 transition-colors hover:text-red-400"
              title={t("labels.remove")}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <p className="border-t border-zinc-800 px-3 py-1.5 text-[11px] text-zinc-500">
        {t("labels.reorderHint")}
      </p>
    </div>
  );
}
