"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const WEEK_HEAD = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function drawCalendar(canvas: HTMLCanvasElement, year: number) {
  const dpr = window.devicePixelRatio || 1;
  const months = Array.from({ length: 12 }, (_, m) => {
    const first = new Date(year, m, 1);
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const startDow = (first.getDay() + 6) % 7; // Monday-first
    return { name: first.toLocaleDateString([], { month: "long" }), startDow, daysInMonth };
  });

  const cell = 30;
  const monthW = 7 * cell + 12;
  const monthH = cell * 8 + 10;
  const cols = 3;
  const pad = 16;
  const W = cols * monthW + (cols + 1) * pad;
  const rows = 4;
  const H = rows * monthH + (rows + 1) * pad + 60;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  ctx.fillStyle = "#18181b";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e4e4e7";
  ctx.font = "bold 26px Arial";
  ctx.textAlign = "center";
  ctx.fillText(String(year), W / 2, 40);

  months.forEach((m, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = pad + col * (monthW + pad);
    const y = 60 + pad + row * (monthH + pad);

    ctx.fillStyle = "#a1a1aa";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    ctx.fillText(m.name, x, y);

    WEEK_HEAD.forEach((d, dw) => {
      ctx.fillStyle = "#52525b";
      ctx.font = "11px Arial";
      ctx.textAlign = "center";
      ctx.fillText(d, x + 6 + dw * cell + cell / 2, y + 18);
    });

    let day = 1;
    for (let w = 0; w < 6 && day <= m.daysInMonth; w++) {
      for (let dw = 0; dw < 7 && day <= m.daysInMonth; dw++) {
        const cx = x + 6 + dw * cell;
        const cy = y + 24 + w * cell;
        const isWeekend = dw >= 5;
        ctx.fillStyle = isWeekend ? "#3f3f46" : "#27272a";
        ctx.fillRect(cx, cy, cell - 2, cell - 2);
        ctx.fillStyle = isWeekend ? "#d4d4d8" : "#e4e4e7";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(day), cx + (cell - 2) / 2, cy + (cell - 2) / 2 + 1);
        day++;
      }
    }
    ctx.textBaseline = "alphabetic";
  });
}

export default function CalendarPage() {
  const t = useTranslations("tools.calendar");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [year, setYear] = useState(new Date().getFullYear());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = () => {
    if (canvasRef.current) drawCalendar(canvasRef.current, year);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `calendar-${year}.png`;
    a.click();
  };

  const inputCls =
    "rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="calendar"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            min={1900}
            max={2100}
            value={year}
            onChange={(e) => setYear(Number(e.target.value) || new Date().getFullYear())}
            className={inputCls + " w-28"}
          />
          <button onClick={render} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500">
            {t("buttons.render")}
          </button>
          <button onClick={download} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500">
            {t("buttons.download")}
          </button>
        </div>
        <div className="flex justify-center overflow-auto rounded-lg">
          <canvas ref={canvasRef} className="max-w-full rounded-lg" />
        </div>
      </div>
    </ToolLayout>
  );
}
