"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type ToolType = "rect" | "circle" | "arrow" | "line" | "text";

interface Annotation {
  type: ToolType;
  color: string;
  width: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  text?: string;
  textSize?: number;
}

const TOOLS: ToolType[] = ["rect", "circle", "arrow", "line", "text"];

export default function ScreenshotMarkupPage() {
  const t = useTranslations("tools.screenshot-markup");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [tool, setTool] = useState<ToolType>("rect");
  const [color, setColor] = useState("#ef4444");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [textValue, setTextValue] = useState("Note");
  const [textSize, setTextSize] = useState(28);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef<Annotation | null>(null);
  const display = useRef({ w: 0, h: 0, scale: 1 });

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const image = img;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const all = drawing.current ? [...annotations, drawing.current] : annotations;
    for (const a of all) drawAnnotation(ctx, a);
  }, [img, annotations]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => setImg(image);
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !img) return;
    const maxW = Math.min(wrap.clientWidth - 24, 900);
    const scale = Math.min(1, maxW / img.naturalWidth);
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    display.current = { w: canvas.width, h: canvas.height, scale };
    redraw();
  };

  useEffect(() => {
    if (img) setupCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const p = getPos(e);
    drawing.current = {
      type: tool,
      color,
      width: strokeWidth,
      x1: p.x,
      y1: p.y,
      x2: p.x,
      y2: p.y,
      text: tool === "text" ? textValue : undefined,
      textSize,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const p = getPos(e);
    drawing.current = { ...drawing.current, x2: p.x, y2: p.y };
    redraw();
  };

  const onPointerUp = () => {
    if (!drawing.current) return;
    const a = drawing.current;
    drawing.current = null;
    if (a.type === "text") {
      setAnnotations((prev) => [...prev, a]);
    } else {
      const dx = Math.abs(a.x2 - a.x1);
      const dy = Math.abs(a.y2 - a.y1);
      if (dx > 3 || dy > 3) setAnnotations((prev) => [...prev, a]);
    }
    redraw();
  };

  const handleDownload = () => {
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const s = img.naturalWidth / display.current.w;
    for (const a of annotations) {
      drawAnnotation(ctx, { ...a, x1: a.x1 * s, y1: a.y1 * s, x2: a.x2 * s, y2: a.y2 * s, width: a.width * s, textSize: (a.textSize ?? 28) * s });
    }
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "annotated.png";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, "image/png");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="screenshot-markup"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {!img ? (
          <div
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) loadFile(f);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("markup-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">✏️</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input id="markup-in" type="file" accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) loadFile(f);
              e.target.value = "";
            }} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {TOOLS.map((tl) => (
                <button
                  key={tl}
                  onClick={() => setTool(tl)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    tool === tl ? "bg-blue-600 text-white" : "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {t(`tools.${tl}`)}
                </button>
              ))}
              <span className="mx-1 h-6 w-px bg-zinc-700" />
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-10 cursor-pointer rounded border border-zinc-700 bg-transparent" />
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                {t("labels.width")}
                <input type="number" min={1} max={30} value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value) || 1)} className="w-16 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm" />
              </label>
              <span className="mx-1 h-6 w-px bg-zinc-700" />
              <button onClick={() => setAnnotations([])} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>
                {t("buttons.clear")}
              </button>
              <button onClick={handleDownload} className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}>
                {t("buttons.download")}
              </button>
            </div>

            {tool === "text" && (
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                <input
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  className="flex-1 rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100"
                />
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  {t("labels.textSize")}
                  <input type="number" min={10} max={120} value={textSize} onChange={(e) => setTextSize(Number(e.target.value) || 10)} className="w-16 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm" />
                </label>
                <span className="text-xs text-zinc-500">{t("labels.textHint")}</span>
              </div>
            )}

            <div ref={wrapRef} className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-2">
              <canvas
                ref={canvasRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className="mx-auto cursor-crosshair touch-none"
              />
            </div>
            <p className="text-xs text-zinc-500">{t("labels.hint")}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function drawAnnotation(ctx: CanvasRenderingContext2D, a: Annotation) {
  ctx.save();
  ctx.strokeStyle = a.color;
  ctx.fillStyle = a.color;
  ctx.lineWidth = a.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (a.type === "rect") {
    ctx.strokeRect(Math.min(a.x1, a.x2), Math.min(a.y1, a.y2), Math.abs(a.x2 - a.x1), Math.abs(a.y2 - a.y1));
  } else if (a.type === "circle") {
    const rx = Math.abs(a.x2 - a.x1) / 2;
    const ry = Math.abs(a.y2 - a.y1) / 2;
    ctx.beginPath();
    ctx.ellipse((a.x1 + a.x2) / 2, (a.y1 + a.y2) / 2, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (a.type === "line" || a.type === "arrow") {
    ctx.beginPath();
    ctx.moveTo(a.x1, a.y1);
    ctx.lineTo(a.x2, a.y2);
    ctx.stroke();
    if (a.type === "arrow") {
      const angle = Math.atan2(a.y2 - a.y1, a.x2 - a.x1);
      const head = Math.max(8, a.width * 2.5);
      ctx.beginPath();
      ctx.moveTo(a.x2, a.y2);
      ctx.lineTo(a.x2 - head * Math.cos(angle - Math.PI / 6), a.y2 - head * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(a.x2 - head * Math.cos(angle + Math.PI / 6), a.y2 - head * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }
  } else if (a.type === "text" && a.text) {
    ctx.font = `600 ${a.textSize ?? 28}px sans-serif`;
    ctx.textBaseline = "top";
    ctx.fillText(a.text, a.x1, a.y1);
  }
  ctx.restore();
}
