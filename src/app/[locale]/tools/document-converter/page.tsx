"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { loadPandoc } from "@/lib/pandoc";

const FORMATS: { id: string; label: string; ext: string; text: boolean }[] = [
  { id: "markdown", label: "Markdown", ext: "md", text: true },
  { id: "html", label: "HTML", ext: "html", text: true },
  { id: "docx", label: "Word (DOCX)", ext: "docx", text: false },
  { id: "odt", label: "OpenDocument (ODT)", ext: "odt", text: false },
  { id: "epub", label: "EPUB", ext: "epub", text: false },
  { id: "plain", label: "Plain Text", ext: "txt", text: true },
  { id: "latex", label: "LaTeX", ext: "tex", text: true },
  { id: "rst", label: "reStructuredText", ext: "rst", text: true },
  { id: "org", label: "Org Mode", ext: "org", text: true },
  { id: "asciidoc", label: "AsciiDoc", ext: "adoc", text: true },
];

const EXT_TO_FORMAT: Record<string, string> = {
  md: "markdown",
  markdown: "markdown",
  html: "html",
  htm: "html",
  docx: "docx",
  odt: "odt",
  epub: "epub",
  rst: "rst",
  tex: "latex",
  latex: "latex",
  org: "org",
  txt: "plain",
  adoc: "asciidoc",
  asciidoc: "asciidoc",
};

type Step = "upload" | "settings" | "processing" | "done";

export default function DocumentConverter() {
  const t = useTranslations("tools.document-converter");

  const [file, setFile] = useState<File | null>(null);
  const [inputFormat, setInputFormat] = useState("markdown");
  const [outputFormat, setOutputFormat] = useState("docx");
  const [step, setStep] = useState<Step>("upload");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultName, setResultName] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [error, setError] = useState("");

  const handleUpload = useCallback((f: File) => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    const ext = (f.name.split(".").pop() || "").toLowerCase();
    const detected = EXT_TO_FORMAT[ext] || "markdown";
    setFile(f);
    setInputFormat(detected);
    setStep("settings");
    setError("");
    setResultUrl("");
    setPreviewText("");
  }, [resultUrl]);

  const outCfg = FORMATS.find((f) => f.id === outputFormat)!;

  const convert = async () => {
    if (!file) return;
    setStep("processing");
    setProgress(0);
    setError("");
    try {
      setStatusMsg(t("processing.statusDownloading"));
      const instance = await loadPandoc((p) => setProgress(Math.min(55, Math.round(p * 55))));

      setStatusMsg(t("processing.statusConverting"));
      const files: Record<string, string | Blob> = {};
      files[file.name] = file;
      const outputName = `output.${outCfg.ext}`;
      const result = await instance.convert(
        { from: inputFormat, to: outputFormat, "output-file": outputName },
        null,
        files
      );

      const blob = result.files[outputName];
      if (!blob || blob.size < 1) {
        const detail = (result.stderr || "").trim().split("\n").pop() || "";
        throw new Error(t("errors.failed") + (detail ? ` (${detail})` : ""));
      }

      if (outCfg.text) {
        setStatusMsg(t("processing.statusReading"));
        setPreviewText(await blob.text());
      }
      setResultUrl(URL.createObjectURL(blob));
      setResultName(`${file.name.replace(/\.[^.]+$/, "")}.${outCfg.ext}`);
      setProgress(100);
      setStep("done");
    } catch (err) {
      console.error(err);
      setError(t("errors.prefix") + (err instanceof Error ? err.message : String(err)));
      setStep("settings");
    }
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setResultUrl("");
    setStep("upload");
    setProgress(0);
    setError("");
    setPreviewText("");
  };

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="document-converter"
      faqs={t.raw("faqs") as FAQ[]}
      relatedTools={t.raw("relatedTools") as RelatedTool[]}
      keywords={t.raw("keywords") as string[]}
      guide={
        <div className="space-y-4 text-sm text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-100">{t("guide.heading")}</h2>
          <ol className="list-inside list-decimal space-y-2">
            {(t.raw("guide.steps") as string[]).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      }
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
        )}

        {step === "upload" && (
          <div
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) handleUpload(f);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("doc-input")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-700 p-16 text-center transition-all hover:border-blue-500 hover:bg-zinc-900/50"
          >
            <div className="mb-4 text-5xl">📄</div>
            <p className="mb-2 text-lg text-zinc-300">{t("upload.title")}</p>
            <p className="text-sm text-zinc-500">{t("upload.subtitle")}</p>
            <input
              id="doc-input"
              type="file"
              accept=".md,.markdown,.html,.htm,.docx,.odt,.epub,.rst,.tex,.latex,.org,.txt,.adoc,.asciidoc"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </div>
        )}

        {step === "settings" && file && (
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">
              <p className="font-medium text-zinc-200">{file.name}</p>
              <p className="mt-1">{(file.size / 1024).toFixed(1)} KB · {t("labels.detected")}: <strong className="text-zinc-200">{FORMATS.find((f) => f.id === inputFormat)?.label ?? inputFormat}</strong></p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">{t("labels.inputFormat")}</label>
                <select
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
                >
                  {FORMATS.filter((f) => f.id !== outputFormat).map((f) => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">{t("labels.outputFormat")}</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
                >
                  {FORMATS.filter((f) => f.id !== inputFormat).map((f) => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={convert}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              >
                {t("buttons.convert")}
              </button>
              <button onClick={reset} className="rounded-lg bg-zinc-800 px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-700">
                {t("buttons.newFile")}
              </button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <div className="mb-4 text-5xl">⚙️</div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-100">{t("processing.title")}</h3>
            <p className="mb-6 text-sm text-zinc-400">{statusMsg}</p>
            <div className="mx-auto max-w-md">
              <div className="mb-1 flex justify-between text-sm text-zinc-400">
                <span>{t("processing.label")}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <p className="mt-4 text-xs text-zinc-500">{t("processing.keepOpen")}</p>
          </div>
        )}

        {step === "done" && file && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
            <div className="mb-4 text-5xl">✅</div>
            <h3 className="mb-4 text-xl font-semibold text-zinc-100">{t("done.title")}</h3>
            {outCfg.text && previewText && (
              <div className="mb-6 text-left">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">{t("done.preview")}</p>
                <textarea
                  readOnly
                  value={previewText.slice(0, 20000)}
                  className="h-64 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 outline-none"
                />
              </div>
            )}
            <div className="flex justify-center gap-3">
              <a
                href={resultUrl}
                download={resultName}
                className="inline-block rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-500"
              >
                {t("buttons.download")}
              </a>
              <button onClick={() => { setStep("settings"); setResultUrl(""); setError(""); }} className="rounded-lg bg-zinc-800 px-6 py-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-700">
                {t("buttons.adjust")}
              </button>
              <button onClick={reset} className="rounded-lg bg-zinc-800 px-6 py-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-700">
                {t("buttons.newFile")}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
