"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { analyzeImage } from "@/lib/ai-detector/analyzer.js";

type Stage = "idle" | "running" | "done" | "error";

interface Detection {
  code: string;
  title: string;
  hit: boolean;
  badgeText: string;
  badgeClass: string;
  desc: string;
  detail: string | null;
  confidence: string | null;
  category: string;
  aiEvidence: boolean;
}

export default function AiImageDetector() {
  const t = useTranslations("tools.ai-image-detector");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState("");
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = useCallback((f: File) => {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
    setStage("idle");
    setReport(null);
    setDetections([]);
    setError("");
  }, [preview]);

  const run = useCallback(async () => {
    if (!file) return;
    setStage("running");
    setReport(null);
    setDetections([]);
    setError("");
    abortRef.current = new AbortController();
    try {
      const result = await analyzeImage(file, {
        mode: "full",
        signal: abortRef.current.signal,
        onProgress: (p: { stage: string }) => setProgress(p.stage),
      });
      setReport(result.report);
      setDetections(result.details.detections);
      setStage("done");
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        setError((err as Error)?.message || String(err));
        setStage("error");
      }
    }
  }, [file]);

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const guideSteps = t.raw("guide.steps") as string[];

  const reportFile = (report?.file ?? null) as
    | { name: string; size: number; width: number; height: number; sha256: string }
    | null;
  const frequency = (report?.frequency ?? null) as
    | { applicable: boolean; confidence: string | null; score: number | null; positive: number | null; negative: number | null; positiveFamilies: string[] }
    | null;

  const badgeFor = (d: Detection) => {
    if (d.code.startsWith("marker.")) {
      return t(d.hit ? "badges.marker.hit" : "badges.marker.clean");
    }
    if (d.hit) return t(`badges.${d.code}`);
    return t("badges.clean");
  };
  const descFor = (d: Detection) => {
    if (d.code.startsWith("marker.")) {
      return t(d.hit ? "marker.hit" : "marker.clean", { brand: d.title });
    }
    return t(`descs.${d.code}`);
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors";

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="ai-image-detector"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
      guide={
        <div className="space-y-4 text-sm text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-100">{t("guide.heading")}</h2>
          <ol className="list-decimal list-inside space-y-2">
            {guideSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Upload */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) onFile(f);
          }}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-800/40 px-6 py-10 text-center"
        >
          {preview ? (
            <img
              src={preview}
              alt={file?.name ?? ""}
              className="h-40 w-40 rounded-xl object-contain"
            />
          ) : (
            <div className="text-4xl">🖼️</div>
          )}
          <p className="text-sm text-zinc-300">
            {file ? file.name : t("ui.drop")}
          </p>
          <p className="text-xs text-zinc-500">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : t("ui.hint")}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {file && stage === "idle" && (
              <button onClick={run} className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}>
                {t("ui.analyze")}
              </button>
            )}
            <button
              onClick={() => inputRef.current?.click()}
              className={`${btn} ${file ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "bg-blue-600 text-white hover:bg-blue-500"}`}
            >
              {file ? t("ui.change") : t("ui.browse")}
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }}
          />
        </div>

        {/* Progress */}
        {stage === "running" && (
          <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4 text-sm text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              {t("ui.analyzing")} — {t(`ui.stage.${progress.replace("frequency.", "")}`, { default: progress })}
            </div>
          </div>
        )}

        {/* Error */}
        {stage === "error" && (
          <div className="rounded-xl border border-red-800 bg-red-900/30 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Result */}
        {stage === "done" && report && (
          <div className="space-y-5">
            {/* Verdict */}
            <div
              className={`rounded-2xl border p-5 ${
                report.verdict === "none" || report.verdict === "edit"
                  ? "border-zinc-700 bg-zinc-800/40"
                  : "border-amber-700 bg-amber-900/20"
              }`}
            >
              <p className="text-xs uppercase tracking-wide text-zinc-500">{t("ui.verdict")}</p>
              <h3 className="mt-1 font-display text-xl text-zinc-100">
                {t(`verdict.${report.verdict as string}`)}
              </h3>
              <div className="mt-3 grid gap-1 text-xs text-zinc-400 sm:grid-cols-2">
                {reportFile && (
                  <>
                    <span>{t("ui.file")}: {reportFile.name}</span>
                    <span>{t("ui.size")}: {(reportFile.size / 1024).toFixed(1)} KB</span>
                    <span>{t("ui.dimensions")}: {reportFile.width}×{reportFile.height}</span>
                    <span className="truncate" title={reportFile.sha256}>
                      {t("ui.sha256")}: {reportFile.sha256.slice(0, 16)}…
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Detections */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-200">{t("ui.evidence")}</h3>
              <ul className="space-y-2">
                {detections.map((d, i) => (
                  <li
                    key={i}
                    className={`rounded-xl border p-4 text-sm ${
                      d.hit ? "border-amber-700/60 bg-amber-900/10" : "border-zinc-800 bg-zinc-900/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-zinc-200">{d.title}</span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${
                          d.hit
                            ? "bg-amber-600/20 text-amber-300"
                            : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {badgeFor(d)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">{descFor(d)}</p>
                    {d.detail && (
                      <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-zinc-950/60 p-2 text-[11px] text-zinc-500">
                        {d.detail}
                      </pre>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Frequency */}
            {frequency && frequency.applicable !== false && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm">
                <h3 className="font-semibold text-zinc-200">{t("ui.frequency")}</h3>
                <div className="mt-2 grid gap-2 text-xs text-zinc-400 sm:grid-cols-3">
                  <div>
                    <p className="text-zinc-500">{t("ui.frequencyScore")}</p>
                    <p className="text-lg font-semibold text-zinc-100">
                      {frequency.score ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500">{t("ui.confidence")}</p>
                    <p className="text-lg font-semibold text-zinc-100">
                      {frequency.confidence ? t(`detections.confidence.${frequency.confidence}`) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500">{t("ui.positive")}</p>
                    <p className="text-lg font-semibold text-zinc-100">
                      {frequency.positive ?? "—"} / {frequency.negative ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs leading-relaxed text-zinc-500">
              {t("ui.disclaimer")}
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
