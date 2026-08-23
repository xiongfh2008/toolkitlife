"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type Phase = "idle" | "waiting" | "ready" | "tooSoon" | "done";

export default function ReactionTimePage() {
  const t = useTranslations("tools.reaction-time");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [phase, setPhase] = useState<Phase>("idle");
  const [lastMs, setLastMs] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAtRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const start = () => {
    setPhase("waiting");
    setLastMs(0);
    timerRef.current = setTimeout(() => {
      setPhase("ready");
      startedAtRef.current = Date.now();
    }, 1000 + Math.random() * 3000);
  };

  const click = () => {
    if (phase === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase("tooSoon");
      return;
    }
    if (phase === "ready") {
      const ms = Date.now() - startedAtRef.current;
      setLastMs(ms);
      setResults((r) => [...r, ms].slice(-10));
      setPhase("done");
    }
  };

  const avg = results.length > 0 ? Math.round(results.reduce((a, b) => a + b, 0) / results.length) : 0;
  const best = results.length > 0 ? Math.min(...results) : 0;

  const bg =
    phase === "ready"
      ? "bg-emerald-600 hover:bg-emerald-500"
      : phase === "waiting"
        ? "bg-red-600"
        : phase === "tooSoon"
          ? "bg-zinc-700"
          : "bg-blue-600 hover:bg-blue-500";

  const label =
    phase === "ready"
      ? t("labels.clickNow")
      : phase === "waiting"
        ? t("labels.wait")
        : phase === "tooSoon"
          ? t("labels.tooSoon")
          : phase === "done"
            ? t("labels.result")
            : t("labels.clickNow");

  return (
    <ToolLayout
      title={t("title")}
      slug="reaction-time"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-6">
        <button
          onClick={phase === "idle" || phase === "done" || phase === "tooSoon" ? start : click}
          className={`flex h-64 w-full items-center justify-center rounded-2xl text-lg font-medium text-white transition-colors ${bg}`}
        >
          {phase === "done" && lastMs > 0 ? `${lastMs} ms` : label}
        </button>
        {results.length > 0 && (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-zinc-800 p-3">
              <p className="text-2xl font-semibold text-zinc-200">{best} ms</p>
              <p className="text-xs text-zinc-400">{t("labels.best")}</p>
            </div>
            <div className="rounded-lg border border-zinc-800 p-3">
              <p className="text-2xl font-semibold text-zinc-200">{avg} ms</p>
              <p className="text-xs text-zinc-400">{t("labels.average")}</p>
            </div>
            <div className="rounded-lg border border-zinc-800 p-3">
              <p className="text-2xl font-semibold text-zinc-200">{results.length}</p>
              <p className="text-xs text-zinc-400">{t("labels.attempts")}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
