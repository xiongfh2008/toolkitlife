"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

interface Palette {
  bg: string[];
  fg: string[];
}

const PALETTES: Palette[] = [
  { bg: ["#c0392b", "#e74c3c", "#d35400", "#e67e22", "#b03a2e", "#a93226"], fg: ["#27ae60", "#2ecc71", "#16a085", "#1e8449", "#229954"] },
  { bg: ["#27ae60", "#2ecc71", "#16a085", "#1e8449", "#229954"], fg: ["#c0392b", "#e74c3c", "#d35400", "#e67e22", "#b03a2e"] },
];

const OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function drawPlate(canvas: HTMLCanvasElement, digit: number) {
  const off = document.createElement("canvas");
  off.width = 200;
  off.height = 200;
  const octx = off.getContext("2d");
  if (!octx) return;
  octx.fillStyle = "#000";
  octx.fillRect(0, 0, 200, 200);
  octx.fillStyle = "#fff";
  octx.font = "bold 150px Arial";
  octx.textAlign = "center";
  octx.textBaseline = "middle";
  octx.fillText(String(digit), 100, 108);
  const data = octx.getImageData(0, 0, 200, 200).data;

  const size = 320;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.fillStyle = "#27272a";
  ctx.fillRect(0, 0, size, size);

  const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
  const step = 18;
  const radius = 7;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const sx = Math.floor((x / size) * 200);
      const sy = Math.floor((y / size) * 200);
      const idx = (sy * 200 + sx) * 4;
      const inDigit = data[idx + 3] > 128;
      const colors = inDigit ? palette.fg : palette.bg;
      const jx = x + (Math.random() - 0.5) * 8;
      const jy = y + (Math.random() - 0.5) * 8;
      ctx.beginPath();
      ctx.arc(jx, jy, radius, 0, Math.PI * 2);
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fill();
    }
  }
}

export default function ColorBlindnessTestPage() {
  const t = useTranslations("tools.color-blindness-test");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [digit, setDigit] = useState<number>(5);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const newPlate = () => {
    const d = 1 + Math.floor(Math.random() * 9);
    setDigit(d);
    setFeedback(null);
    if (canvasRef.current) drawPlate(canvasRef.current, d);
  };

  const pick = (v: number | "none") => {
    const ok = typeof v === "number" && v === digit;
    setFeedback(ok);
    setTotal((x) => x + 1);
    if (ok) setCorrect((x) => x + 1);
  };

  return (
    <ToolLayout
      title={t("title")}
      slug="color-blindness-test"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        <div className="flex justify-center">
          <canvas ref={canvasRef} className="w-64 max-w-full rounded-xl border border-zinc-800" />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {OPTIONS.map((o) => (
            <button
              key={o}
              onClick={() => pick(o)}
              className="h-10 w-10 rounded-lg border border-zinc-700 text-sm font-medium text-zinc-200 hover:border-blue-500 hover:text-blue-400"
            >
              {o}
            </button>
          ))}
          <button
            onClick={() => pick("none")}
            className="h-10 rounded-lg border border-zinc-700 px-3 text-sm text-zinc-400 hover:border-zinc-500"
          >
            {t("labels.none")}
          </button>
        </div>
        {feedback !== null && (
          <p className={`text-center text-sm ${feedback ? "text-emerald-400" : "text-red-400"}`}>
            {feedback ? t("labels.correct") : `${t("labels.wrong")} (${digit})`}
          </p>
        )}
        <div className="flex items-center justify-center gap-4">
          <button onClick={newPlate} className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500">
            {t("buttons.next")}
          </button>
          <span className="text-sm text-zinc-400">
            {t("labels.score")}: {correct}/{total}
          </span>
        </div>
        {total === 0 && <p className="text-center text-xs text-zinc-600">{t("labels.hint")}</p>}
      </div>
    </ToolLayout>
  );
}
