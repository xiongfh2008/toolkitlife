"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

interface FontOption {
  name: string;
  family: string;
}

type Mode = "draw" | "type" | "upload";

const COLORS = ["#000000", "#1a365d", "#1e3a5f", "#4a1a2e", "#2d3748"];

export default function DigitalSignaturePage() {
  const t = useTranslations("tools.digital-signature");

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const fonts = t.raw("fontOptions") as FontOption[];
  const modes = t.raw("modes") as Record<Mode, string>;

  const [mode, setMode] = useState<Mode>("draw");
  const [typedName, setTypedName] = useState("");
  const [selectedFont, setSelectedFont] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    setHasSignature(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== "draw") return;
    e.preventDefault();
    setIsDrawing(true);
    lastPosRef.current = getPos(e);
  }, [mode, getPos]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || mode !== "draw" || !lastPosRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e);

    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPosRef.current = pos;
    setHasSignature(true);
  }, [isDrawing, mode, selectedColor, getPos]);

  const endDraw = useCallback(() => {
    setIsDrawing(false);
    lastPosRef.current = null;
  }, []);

  const renderTyped = useCallback((name?: string) => {
    const text = name ?? typedName;
    if (!text.trim()) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    const font = fonts[selectedFont];
    ctx.fillStyle = selectedColor;
    ctx.font = `italic 42px ${font.family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.offsetWidth / 2, canvas.offsetHeight / 2);
    setHasSignature(true);
  }, [typedName, selectedFont, selectedColor, fonts]);

  const handleUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      const scale = Math.min(canvas.offsetWidth / img.width, canvas.offsetHeight / img.height) * 0.8;
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (canvas.offsetWidth - w) / 2, (canvas.offsetHeight - h) / 2, w, h);
      setHasSignature(true);
    };
    img.src = URL.createObjectURL(file);
  }, []);

  const downloadPNG = useCallback(() => {
    const canvas = canvasRef.current!;
    const a = document.createElement("a");
    a.download = "signature.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  }, []);

  const downloadSVG = useCallback(() => {
    const canvas = canvasRef.current!;
    const dataUrl = canvas.toDataURL("image/png");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.offsetWidth}" height="${canvas.offsetHeight}">
      <image href="${dataUrl}" width="${canvas.offsetWidth}" height="${canvas.offsetHeight}"/>
    </svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.download = "signature.svg";
    a.href = URL.createObjectURL(blob);
    a.click();
  }, []);

  const copyToClipboard = useCallback(async () => {
    const canvas = canvasRef.current!;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      } catch { /* clipboard may not be available */ }
    });
  }, []);

  const setModeAndClear = (m: Mode) => {
    setMode(m);
    clearCanvas();
    if (m === "type" && typedName.trim()) {
      renderTyped();
    }
  };

  const btn = "rounded-lg px-4 py-2 text-sm font-medium transition-colors";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="digital-signature"
      keywords={keywords}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        {/* Mode tabs */}
        <div className="flex flex-wrap gap-2">
          {(["draw", "type", "upload"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setModeAndClear(m)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {modes[m]}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {mode === "type" && (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={typedName}
                onChange={(e) => { const v = e.target.value; setTypedName(v); setHasSignature(v.trim().length > 0); if (mode === "type") renderTyped(v); }}
                placeholder={t("placeholder")}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
              <select
                value={selectedFont}
                onChange={(e) => { const i = Number(e.target.value); setSelectedFont(i); if (mode === "type") renderTyped(); }}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
              >
                {fonts.map((f, i) => (
                  <option key={i} value={i}>{f.name}</option>
                ))}
              </select>
            </div>
          )}

          {mode === "upload" && (
            <div className="flex items-center gap-3">
              <input
                id="sig-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
              <button
                onClick={() => document.getElementById("sig-upload")?.click()}
                className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                {t("upload.drop")}
              </button>
              <span className="text-xs text-zinc-500">{t("upload.formats")}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">{t("labels.color")}</span>
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => { setSelectedColor(c); if (mode === "type") renderTyped(); }}
                className={`h-6 w-6 rounded-full border-2 transition-colors ${
                  selectedColor === c ? "border-blue-500" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="relative h-48 overflow-hidden rounded-lg border border-zinc-700 bg-white sm:h-56">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full touch-none"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
          {mode === "draw" && !hasSignature && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-zinc-400">
              {t("canvas.placeholder")}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button onClick={clearCanvas} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>
            {t("buttons.clear")}
          </button>
          <button onClick={copyToClipboard} disabled={!hasSignature} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50`}>
            {t("buttons.copy")}
          </button>
          <button onClick={downloadPNG} disabled={!hasSignature} className={`${btn} bg-green-600 text-white hover:bg-green-500 disabled:opacity-50`}>
            {t("buttons.downloadPng")}
          </button>
          <button onClick={downloadSVG} disabled={!hasSignature} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50`}>
            {t("buttons.svg")}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
