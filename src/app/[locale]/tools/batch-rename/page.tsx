"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import JSZip from "jszip";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import FileList from "@/components/rename/FileList";
import RulePanel from "@/components/rename/RulePanel";
import PreviewTable from "@/components/rename/PreviewTable";
import { autoFixConflicts, computePreview } from "@/lib/rename/rules";
import { getDefaultConfig } from "@/lib/rename/types";
import type {
  ExtensionScope,
  FileEntry,
  PreviewResult,
  RenameRule,
  RuleConfig,
  RuleType,
} from "@/lib/rename/types";

const MAX_FILES = 1000;

function genId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function toEntry(file: File): FileEntry {
  const lastDot = file.name.lastIndexOf(".");
  const baseName = lastDot > 0 ? file.name.slice(0, lastDot) : file.name;
  const extension = lastDot > 0 ? file.name.slice(lastDot) : "";
  return { id: genId(), name: file.name, baseName, extension, file, selected: true };
}

export default function BatchRenamePage() {
  const t = useTranslations("tools.batch-rename");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [files, setFiles] = useState<FileEntry[]>([]);
  const [rules, setRules] = useState<RenameRule[]>([]);
  const [scope, setScope] = useState<ExtensionScope>("name");
  // 自动修复结果与产生它的文件/规则快照绑定，参数变化后自动失效
  const [autoFix, setAutoFix] = useState<{ params: string; result: PreviewResult[] } | null>(null);
  const [zipping, setZipping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const previewParams = useMemo(() => {
    const fileKey = files.map((f) => `${f.id}:${f.selected ? 1 : 0}`).join("|");
    return `${scope}|${fileKey}|${JSON.stringify(rules)}`;
  }, [files, rules, scope]);

  const basePreview = useMemo(
    () => computePreview(files, rules, scope),
    [files, rules, scope]
  );
  const preview = autoFix && autoFix.params === previewParams ? autoFix.result : basePreview;
  const hasAutoFix = autoFix !== null && autoFix.params === previewParams;

  // ── 文件操作 ──

  const addFiles = useCallback((incoming: File[]) => {
    setError("");
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      const next = [...prev];
      for (const file of incoming) {
        if (existing.has(file.name)) continue;
        if (next.length >= MAX_FILES) break;
        existing.add(file.name);
        next.push(toEntry(file));
      }
      return next;
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const toggleFileSelection = useCallback((id: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f)));
  }, []);

  const selectAll = useCallback((selected: boolean) => {
    setFiles((prev) => prev.map((f) => ({ ...f, selected })));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
    setRules([]);
    setAutoFix(null);
    setError("");
    setCopied(false);
  }, []);

  const sortFiles = useCallback((by: "name" | "size", order: "asc" | "desc") => {
    setFiles((prev) => {
      const next = [...prev];
      next.sort((a, b) => {
        const cmp =
          by === "name"
            ? a.baseName.localeCompare(b.baseName, undefined, { numeric: true, sensitivity: "base" })
            : a.file.size - b.file.size;
        return order === "asc" ? cmp : -cmp;
      });
      return next;
    });
  }, []);

  const reorderFiles = useCallback((from: number, to: number) => {
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  // ── 规则操作 ──

  const addRule = useCallback((type: RuleType) => {
    setRules((prev) => [
      ...prev,
      { id: genId(), enabled: true, ruleConfig: getDefaultConfig(type) },
    ]);
  }, []);

  const updateRuleConfig = useCallback((id: string, config: RuleConfig) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ruleConfig: config } : r)));
  }, []);

  const toggleRule = useCallback((id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }, []);

  const removeRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const moveRule = useCallback((id: string, dir: -1 | 1) => {
    setRules((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      const to = idx + dir;
      if (idx === -1 || to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[to]] = [next[to], next[idx]];
      return next;
    });
  }, []);

  const cloneRule = useCallback((id: string) => {
    setRules((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      if (idx === -1) return prev;
      const source = prev[idx];
      const clone: RenameRule = {
        id: genId(),
        enabled: source.enabled,
        ruleConfig: JSON.parse(JSON.stringify(source.ruleConfig)),
      };
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
  }, []);

  const clearRules = useCallback(() => setRules([]), []);

  // ── 执行 ──

  const downloadZip = useCallback(async () => {
    if (files.length === 0 || zipping) return;
    setZipping(true);
    setError("");
    try {
      const fileMap = new Map(files.map((f) => [f.id, f]));
      const zip = new JSZip();
      for (const r of preview) {
        const entry = fileMap.get(r.fileId);
        if (!entry) continue;
        zip.file(r.newName, entry.file);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "renamed-files.zip";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setZipping(false);
    }
  }, [files, preview, zipping, t]);

  const copyList = useCallback(async () => {
    const text = preview
      .filter((r) => r.hasChange)
      .map((r) => `${r.original} → ${r.newName}`)
      .join("\n");
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }, [preview]);

  // 逐个下载：浏览器逐个触发下载（同名文件浏览器会自动追加编号）
  const downloadAll = useCallback(() => {
    const fileMap = new Map(files.map((f) => [f.id, f]));
    const urls: string[] = [];
    for (const r of preview) {
      if (!r.hasChange) continue;
      const entry = fileMap.get(r.fileId);
      if (!entry) continue;
      const url = URL.createObjectURL(new Blob([entry.file], { type: entry.file.type }));
      urls.push(url);
      const a = document.createElement("a");
      a.href = url;
      a.download = r.newName;
      a.click();
    }
    setTimeout(() => urls.forEach((u) => URL.revokeObjectURL(u)), 5000);
  }, [files, preview]);

  // CMD 批处理脚本：用户在本地运行即可重命名原文件（仅 Windows）
  const downloadScript = useCallback(() => {
    const escapeCmd = (s: string) => s.replace(/%/g, "%%");
    const lines: string[] = [
      "@echo off",
      "chcp 65001 >nul",
      "setlocal DisableDelayedExpansion",
      "rem Generated by ToolkitLife Batch Rename",
      'cd /d "%~dp0"',
    ];
    for (const r of preview) {
      if (!r.hasChange) continue;
      lines.push(`ren "${escapeCmd(r.original)}" "${escapeCmd(r.newName)}"`);
    }
    lines.push("pause");
    const blob = new Blob([lines.join("\r\n")], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rename-files.cmd";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, [files, preview]);

  return (
    <ToolLayout
      title={t("title")}
      slug="batch-rename"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <section className="lg:col-span-1">
            <FileList
              items={files}
              maxFiles={MAX_FILES}
              onAdd={addFiles}
              onRemove={removeFile}
              onToggleSelect={toggleFileSelection}
              onSelectAll={selectAll}
              onClear={clearAll}
              onSortFiles={sortFiles}
              onReorder={reorderFiles}
            />
          </section>
          <section className="lg:col-span-1">
            <RulePanel
              rules={rules}
              scope={scope}
              onAddRule={addRule}
              onUpdateRuleConfig={updateRuleConfig}
              onToggleRule={toggleRule}
              onRemoveRule={removeRule}
              onMoveRule={moveRule}
              onCloneRule={cloneRule}
              onSetScope={setScope}
              onClearRules={clearRules}
            />
          </section>
          <section className="lg:col-span-1">
            <PreviewTable
              preview={preview}
              zipping={zipping}
              copied={copied}
              hasAutoFix={hasAutoFix}
              onDownload={() => void downloadZip()}
              onDownloadAll={downloadAll}
              onDownloadScript={downloadScript}
              onCopy={() => void copyList()}
              onAutoFix={() =>
                setAutoFix({ params: previewParams, result: autoFixConflicts(basePreview) })
              }
              onResetAutoFix={() => setAutoFix(null)}
            />
          </section>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </ToolLayout>
  );
}
