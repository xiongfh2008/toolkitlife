"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type DocFormat = "docx" | "pdf" | "text" | "unsupported";

interface DiffLine {
  type: "same" | "removed" | "added";
  text: string;
}

interface SideRow {
  leftNum: number | null;
  leftText: string | null;
  rightNum: number | null;
  rightText: string | null;
}

interface FileSlot {
  file: File | null;
  text: string;
  format: DocFormat;
  loading: boolean;
  error: string;
}

const JSZIP_CDN = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
const PDFJS_CDN = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";
const PDFJS_WORKER = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";

const TEXT_EXTS = new Set([
  "txt", "md", "markdown", "html", "htm", "json", "csv", "xml", "log", "js", "ts", "jsx", "tsx", "css", "yml", "yaml", "ini", "cfg", "py", "java", "c", "cpp", "go", "rs",
]);

function detectFormat(name: string): DocFormat {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "docx") return "docx";
  if (ext === "pdf") return "pdf";
  if (TEXT_EXTS.has(ext)) return "text";
  return "unsupported";
}

function loadModule(url: string): Promise<any> {
  return import(/* webpackIgnore: true */ url);
}

async function extractDocx(file: File): Promise<string> {
  const mod = await loadModule(JSZIP_CDN);
  const JSZip = (mod as any).default ?? (mod as any).JSZip ?? (window as any).JSZip;
  if (!JSZip) throw new Error("JSZip failed to load");
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const entry = zip.file("word/document.xml");
  if (!entry) throw new Error("Invalid .docx: word/document.xml not found");
  const xmlStr = await entry.async("string");
  const doc = new DOMParser().parseFromString(xmlStr, "application/xml");
  const paragraphs = doc.getElementsByTagName("w:p");
  const lines: string[] = [];
  for (let i = 0; i < paragraphs.length; i++) {
    let line = "";
    const runs = paragraphs[i].getElementsByTagName("w:t");
    for (let j = 0; j < runs.length; j++) line += runs[j].textContent ?? "";
    lines.push(line);
  }
  return lines.join("\n");
}

async function extractPdf(file: File): Promise<string> {
  const mod = await loadModule(PDFJS_CDN);
  const pdfjs = (mod as any).default ?? mod;
  pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  const buf = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buf }).promise;
  const lines: string[] = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    let lastY: number | null = null;
    let line = "";
    for (const item of (content.items as any[])) {
      if (typeof item.str !== "string") continue;
      const y = item.transform ? item.transform[5] : null;
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 2 && line) {
        lines.push(line);
        line = "";
      }
      if (y !== null) lastY = y;
      line += item.str;
    }
    if (line) lines.push(line);
    lines.push("");
  }
  return lines.join("\n");
}

async function extractText(file: File): Promise<string> {
  const fmt = detectFormat(file.name);
  if (fmt === "docx") return extractDocx(file);
  if (fmt === "pdf") return extractPdf(file);
  return file.text();
}

// 行级 LCS diff
function computeDiff(aLines: string[], bLines: string[]): DiffLine[] {
  const n = aLines.length;
  const m = bLines.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = aLines[i] === bLines[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const res: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (aLines[i] === bLines[j]) {
      res.push({ type: "same", text: aLines[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      res.push({ type: "removed", text: aLines[i] });
      i++;
    } else {
      res.push({ type: "added", text: bLines[j] });
      j++;
    }
  }
  while (i < n) {
    res.push({ type: "removed", text: aLines[i] });
    i++;
  }
  while (j < m) {
    res.push({ type: "added", text: bLines[j] });
    j++;
  }
  return res;
}

const emptySlot = (): FileSlot => ({ file: null, text: "", format: "unsupported", loading: false, error: "" });

export default function DocComparePage() {
  const t = useTranslations("tools.doc-compare");

  const [slotA, setSlotA] = useState<FileSlot>(emptySlot());
  const [slotB, setSlotB] = useState<FileSlot>(emptySlot());
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"side" | "merge">("side");
  const [dragOver, setDragOver] = useState<"A" | "B" | null>(null);

  const inputARef = useRef<HTMLInputElement | null>(null);
  const inputBRef = useRef<HTMLInputElement | null>(null);

  const fmtLabel = useCallback(
    (fmt: DocFormat) =>
      fmt === "docx" ? t("formats.docx") : fmt === "pdf" ? t("formats.pdf") : fmt === "text" ? t("formats.text") : t("formats.unsupported"),
    [t]
  );

  const handleFile = useCallback(
    async (file: File | null, setSlot: React.Dispatch<React.SetStateAction<FileSlot>>) => {
      if (!file) {
        setSlot(emptySlot());
        setDiff([]);
        return;
      }
      const format = detectFormat(file.name);
      setSlot({ file, text: "", format, loading: true, error: "" });
      setDiff([]);
      try {
        if (format === "unsupported") {
          setSlot({ file, text: "", format, loading: false, error: t("errors.unsupported") });
          return;
        }
        const text = await extractText(file);
        setSlot({ file, text, format, loading: false, error: "" });
      } catch (e) {
        setSlot({ file, text: "", format, loading: false, error: t("errors.readFailed") });
        console.error("[doc-compare] extraction failed:", e);
      }
    },
    [t]
  );

  const compare = useCallback(() => {
    setError("");
    if (!slotA.file || !slotB.file) {
      setError(t("errors.needBoth"));
      return;
    }
    if (slotA.loading || slotB.loading || slotA.error || slotB.error) {
      setError(t("errors.needBoth"));
      return;
    }
    setComparing(true);
    // 让 UI 先更新，再执行 diff（大文件不阻塞交互）
    setTimeout(() => {
      setDiff(computeDiff(slotA.text.split("\n"), slotB.text.split("\n")));
      setComparing(false);
    }, 30);
  }, [slotA, slotB, t]);

  const clear = () => {
    setSlotA(emptySlot());
    setSlotB(emptySlot());
    setDiff([]);
    setError("");
  };

  const exportDiff = () => {
    const out = diff
      .map((l) => `${l.type === "added" ? "+" : l.type === "removed" ? "-" : " "} ${l.text}`)
      .join("\n");
    const blob = new Blob([out], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "diff.txt";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = diff.reduce(
    (acc, l) => {
      if (l.type === "added") acc.added++;
      else if (l.type === "removed") acc.removed++;
      else acc.same++;
      return acc;
    },
    { added: 0, removed: 0, same: 0 }
  );

  // 将 diff 序列转换为左右并排的行映射（相同行对齐，删除/新增在对应侧留空）
  const sideRows: SideRow[] = [];
  {
    let ln = 0;
    let rn = 0;
    for (const line of diff) {
      if (line.type === "same") {
        ln++;
        rn++;
        sideRows.push({ leftNum: ln, leftText: line.text, rightNum: rn, rightText: line.text });
      } else if (line.type === "removed") {
        ln++;
        sideRows.push({ leftNum: ln, leftText: line.text, rightNum: null, rightText: null });
      } else {
        rn++;
        sideRows.push({ leftNum: null, leftText: null, rightNum: rn, rightText: line.text });
      }
    }
  }

  const renderSlot = (
    key: "A" | "B",
    slot: FileSlot,
    label: string,
    onPick: () => void,
    onFile: (f: File) => void,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => (
    <div
      className={`rounded-lg border p-4 transition-colors ${dragOver === key ? "border-blue-500 bg-blue-500/5" : "border-zinc-800 bg-zinc-900"}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(key);
      }}
      onDragLeave={() => setDragOver((k) => (k === key ? null : k))}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(null);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
    >
      <label className="mb-2 block text-sm font-medium text-zinc-300">{label}</label>
      <input ref={inputRef} type="file" accept=".docx,.pdf,.txt,.md,.html,.json,.csv,.xml,.log" className="hidden" onChange={(e) => onFile(e.target.files?.[0] as File)} />
      {!slot.file ? (
        <button
          onClick={onPick}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-800/50 py-10 text-zinc-400 transition-colors hover:border-blue-500 hover:text-blue-400"
        >
          <span className="text-sm">{t("labels.dropHint")}</span>
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm text-zinc-200">{slot.file.name}</span>
            <span className="shrink-0 rounded bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
              {fmtLabel(slot.format)}
            </span>
          </div>
          {slot.loading && <p className="text-xs text-zinc-400">{t("labels.loading")}</p>}
          {slot.error && <p className="text-xs text-red-400">{slot.error}</p>}
          {!slot.loading && !slot.error && slot.text && (
            <p className="text-xs text-zinc-500">
              {slot.text.split("\n").length} {t("labels.lines")}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => onFile(undefined as unknown as File)}
              className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
            >
              {t("buttons.remove")}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="doc-compare"
      faqs={t.raw("faqs") as FAQ[]}
      relatedTools={t.raw("relatedTools") as RelatedTool[]}
      keywords={t.raw("keywords") as string[]}
      guide={
        <>
          <h2>{t("guide.whatIs.title")}</h2>
          {(t.raw("guide.whatIs.body") as string[]).map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
          <h3>{t("guide.howTo.title")}</h3>
          <ul>
            {(t.raw("guide.howTo.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
          <h3>{t("guide.supported.title")}</h3>
          <ul>
            {(t.raw("guide.supported.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
          <h3>{t("guide.tips.title")}</h3>
          <ul>
            {(t.raw("guide.tips.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          {renderSlot("A", slotA, t("labels.fileA"), () => inputARef.current?.click(), (f) => handleFile(f, setSlotA), inputARef)}
          {renderSlot("B", slotB, t("labels.fileB"), () => inputBRef.current?.click(), (f) => handleFile(f, setSlotB), inputBRef)}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={compare}
            disabled={comparing}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("buttons.compare")}
          </button>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-700 px-6 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors"
          >
            {t("buttons.clear")}
          </button>
          {diff.length > 0 && (
            <button
              onClick={exportDiff}
              className="rounded-lg bg-zinc-700 px-6 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors"
            >
              {t("buttons.exportDiff")}
            </button>
          )}
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {diff.length > 0 && (
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-medium text-zinc-300">{t("labels.differences")}</h3>
                <span className="text-green-400">+{stats.added}</span>
                <span className="text-red-400">-{stats.removed}</span>
                <span className="text-zinc-500">{stats.same} {t("labels.unchanged")}</span>
              </div>
              <div className="flex rounded-lg bg-zinc-800 p-1 text-xs">
                <button
                  onClick={() => setView("side")}
                  className={`rounded-md px-3 py-1 transition-colors ${view === "side" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  {t("labels.viewSide")}
                </button>
                <button
                  onClick={() => setView("merge")}
                  className={`rounded-md px-3 py-1 transition-colors ${view === "merge" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  {t("labels.viewMerge")}
                </button>
              </div>
            </div>

            {view === "side" ? (
              <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                <div className="grid grid-cols-2 divide-x divide-zinc-800">
                  <div className="bg-zinc-800/60 px-4 py-1 text-xs font-medium text-zinc-400">{t("labels.fileA")}</div>
                  <div className="bg-zinc-800/60 px-4 py-1 text-xs font-medium text-zinc-400">{t("labels.fileB")}</div>
                  {sideRows.map((row, index) => (
                    <div key={index} className="contents">
                      <div
                        className={`flex min-w-0 font-mono text-sm ${
                          row.rightText === null ? "bg-red-500/10 text-red-400" : row.leftText === null ? "bg-zinc-800/30" : "text-zinc-300"
                        }`}
                      >
                        {row.leftNum !== null && (
                          <span className="w-10 shrink-0 select-none border-r border-zinc-800 pr-3 text-right opacity-50">{row.leftNum}</span>
                        )}
                        <span className="break-all whitespace-pre-wrap px-3 py-1">{row.leftText ?? ""}</span>
                      </div>
                      <div
                        className={`flex min-w-0 font-mono text-sm ${
                          row.leftText === null ? "bg-green-500/10 text-green-400" : row.rightText === null ? "bg-zinc-800/30" : "text-zinc-300"
                        }`}
                      >
                        {row.rightNum !== null && (
                          <span className="w-10 shrink-0 select-none border-r border-zinc-800 pr-3 text-right opacity-50">{row.rightNum}</span>
                        )}
                        <span className="break-all whitespace-pre-wrap px-3 py-1">{row.rightText ?? ""}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
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
                    <span className="break-all whitespace-pre-wrap">{line.text || " "}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
