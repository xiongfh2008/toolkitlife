"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function MonteCarloPiPage() {
  const t = useTranslations("tools.monte-carlo-pi");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [points, setPoints] = useState(10000);
  const [estimate, setEstimate] = useState<number | null>(null);
  const [inside, setInside] = useState(0);
  const [total, setTotal] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const run = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // background
    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, size, size);
    // quarter circle
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI / 2);
    ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeRect(0, 0, size, size);

    const n = Math.min(200000, points);
    let inCount = 0;
    for (let i = 0; i < n; i++) {
      const x = Math.random();
      const y = Math.random();
      const inCircle = x * x + y * y <= 1;
      if (inCircle) inCount++;
      ctx.fillStyle = inCircle ? "rgba(16, 185, 129, 0.6)" : "rgba(244, 63, 94, 0.6)";
      ctx.fillRect(x * size, y * size, 1.5, 1.5);
    }
    const est = (4 * inCount) / n;
    setEstimate(est);
    setInside(inCount);
    setTotal(n);
  };

  const err = estimate !== null ? Math.abs(estimate - Math.PI) : 0;

  return (
    <ToolLayout
      title={t("title")}
      slug="monte-carlo-pi"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-zinc-300">{t("labels.points")}</label>
          <input
            type="number"
            min={100}
            max={200000}
            step={100}
            value={points}
            onChange={(e) => setPoints(Math.max(100, Math.min(200000, Number(e.target.value) || 1000)))}
            className="w-28 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
          />
          <button onClick={run} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500">
            {t("buttons.run")}
          </button>
        </div>
        <canvas ref={canvasRef} className="w-full max-w-md rounded-lg border border-zinc-800" />
        {estimate !== null && (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-800 p-3 text-center">
              <p className="text-xl font-semibold text-blue-400">{estimate.toFixed(5)}</p>
              <p className="text-xs text-zinc-400">{t("labels.estimate")}</p>
            </div>
            <div className="rounded-lg border border-zinc-800 p-3 text-center">
              <p className="text-xl font-semibold text-zinc-200">{inside} / {total}</p>
              <p className="text-xs text-zinc-400">{t("labels.inside")}</p>
            </div>
            <div className="rounded-lg border border-zinc-800 p-3 text-center">
              <p className="text-xl font-semibold text-emerald-400">{err.toFixed(5)}</p>
              <p className="text-xs text-zinc-400">{t("labels.accuracy")}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
