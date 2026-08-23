"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function SchulteGridPage() {
  const t = useTranslations("tools.schulte-grid");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [size, setSize] = useState(5);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [next, setNext] = useState(1);
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<number | null>(null);

  const build = () => {
    const n = size * size;
    const arr = Array.from({ length: n }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setNumbers(arr);
    setNext(1);
    setStarted(true);
    setElapsed(0);
  };

  useEffect(() => {
    if (!started || next > size * size) return;
    const id = setInterval(() => setElapsed((e) => e + 100), 100);
    return () => clearInterval(id);
  }, [started, next, size]);

  const clickNumber = (v: number) => {
    if (v === next) {
      setNext((n) => n + 1);
      if (v === size * size) {
        const ms = elapsed;
        setStarted(false);
        if (best === null || ms < best) setBest(ms);
      }
    }
  };

  return (
    <ToolLayout
      title={t("title")}
      slug="schulte-grid"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-zinc-300">{t("labels.size")}</label>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none">
            {[3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} × {n}
              </option>
            ))}
          </select>
          <button onClick={build} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500">
            {t("buttons.start")}
          </button>
          <span className="text-sm text-zinc-400">
            {started ? `${t("labels.time")}: ${(elapsed / 1000).toFixed(1)}s` : ""}
            {best !== null ? `  ${t("labels.best")}: ${(best / 1000).toFixed(1)}s` : ""}
          </span>
        </div>
        {numbers.length > 0 && (
          <>
            <p className="text-sm text-zinc-400">
              {t("labels.next")}: <span className="font-semibold text-blue-400">{next}</span>
            </p>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
            >
              {numbers.map((v, i) => (
                <button
                  key={i}
                  onClick={() => clickNumber(v)}
                  className="flex aspect-square items-center justify-center rounded-md border border-zinc-800 text-lg font-medium text-zinc-200 transition-colors hover:border-blue-500 hover:text-blue-400"
                >
                  {v}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
