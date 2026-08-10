"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const SIZES = [128, 256, 512, 1024] as const;
const LEVELS = ["L", "M", "Q", "H"] as const;
const STYLES = ["classic", "rounded", "dots", "diamond", "plus"] as const;
type Style = (typeof STYLES)[number];
type LogoShape = "square" | "circle";

const CROP_VIEW = 320; // 裁剪视口尺寸
const CROP_OUT = 256; // 裁剪输出尺寸

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawModule(ctx: CanvasRenderingContext2D, x: number, y: number, cell: number, style: Style) {
  ctx.beginPath();
  switch (style) {
    case "classic":
      ctx.fillRect(x, y, cell, cell);
      break;
    case "rounded": {
      roundRect(ctx, x, y, cell, cell, cell * 0.3);
      ctx.fill();
      break;
    }
    case "dots":
      ctx.arc(x + cell / 2, y + cell / 2, cell * 0.46, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "diamond":
      ctx.moveTo(x + cell / 2, y + cell * 0.06);
      ctx.lineTo(x + cell * 0.94, y + cell / 2);
      ctx.lineTo(x + cell / 2, y + cell * 0.94);
      ctx.lineTo(x + cell * 0.06, y + cell / 2);
      ctx.closePath();
      ctx.fill();
      break;
    case "plus": {
      const bw = cell * 0.3;
      ctx.fillRect(x + (cell - bw) / 2, y, bw, cell);
      ctx.fillRect(x, y + (cell - bw) / 2, cell, bw);
      break;
    }
  }
}

const loadImg = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export default function QRCodeGeneratorPage() {
  const t = useTranslations("tools.qr-code-generator");

  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(256);
  const [ecLevel, setEcLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [style, setStyle] = useState<Style>("classic");
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [logoShape, setLogoShape] = useState<LogoShape>("square");
  const [dataUrl, setDataUrl] = useState("");

  // 裁剪器状态
  const [cropOpen, setCropOpen] = useState(false);
  const [cropImg, setCropImg] = useState<HTMLImageElement | null>(null);
  const [cropType, setCropType] = useState<LogoShape>("square");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const generateQR = useCallback(
    async (opts: {
      text: string;
      size: number;
      ecLevel: (typeof LEVELS)[number];
      fgColor: string;
      bgColor: string;
      style: Style;
      logoDataUrl: string;
      logoShape: LogoShape;
    }) => {
      if (!opts.text.trim()) {
        setDataUrl("");
        return;
      }
      try {
        const qr = QRCode.create(opts.text, { errorCorrectionLevel: opts.ecLevel });
        const count = qr.modules.size;
        const margin = 2;
        const cell = opts.size / (count + margin * 2);
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = opts.size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = opts.bgColor;
        ctx.fillRect(0, 0, opts.size, opts.size);
        ctx.fillStyle = opts.fgColor;
        for (let r = 0; r < count; r++) {
          for (let c = 0; c < count; c++) {
            if (qr.modules.data[r * count + c]) {
              drawModule(ctx, (c + margin) * cell, (r + margin) * cell, cell, opts.style);
            }
          }
        }
        if (opts.logoDataUrl) {
          const img = await loadImg(opts.logoDataUrl);
          const logoSize = opts.size * 0.22;
          const pad = logoSize * 1.28;
          const cx = opts.size / 2;
          const cy = opts.size / 2;
          ctx.fillStyle = opts.bgColor;
          ctx.beginPath();
          roundRect(ctx, cx - pad / 2, cy - pad / 2, pad, pad, pad * 0.2);
          ctx.fill();
          ctx.save();
          if (opts.logoShape === "circle") {
            ctx.beginPath();
            ctx.arc(cx, cy, logoSize / 2, 0, Math.PI * 2);
            ctx.clip();
          }
          ctx.drawImage(img, cx - logoSize / 2, cy - logoSize / 2, logoSize, logoSize);
          ctx.restore();
        }
        setDataUrl(canvas.toDataURL("image/png"));
      } catch {
        setDataUrl("");
      }
    },
    []
  );

  const updateQR = useCallback(() => {
    generateQR({ text, size, ecLevel: logoDataUrl ? "Q" : ecLevel, fgColor, bgColor, style, logoDataUrl, logoShape });
  }, [text, size, ecLevel, fgColor, bgColor, style, logoDataUrl, logoShape, generateQR]);

  // 任一参数变化自动重绘（含 LOGO 确认/移除后的预览刷新）
  useEffect(() => {
    updateQR();
  }, [updateQR]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = dataUrl;
    link.click();
  };

  const handleCopyImage = async () => {
    if (!dataUrl) return;
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    } catch {
      // fallback: do nothing
    }
  };

  // ---- LOGO 上传与裁剪 ----
  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        setCropImg(img);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setCropType("square");
        setCropOpen(true);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  const drawCropPreview = useCallback(() => {
    const canvas = previewRef.current;
    if (!canvas || !cropImg) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const V = CROP_VIEW;
    ctx.clearRect(0, 0, V, V);
    const base = Math.min(V / cropImg.width, V / cropImg.height);
    const sw = cropImg.width * base * zoom;
    const sh = cropImg.height * base * zoom;
    const maxX = Math.max(0, (sw - V) / 2);
    const maxY = Math.max(0, (sh - V) / 2);
    const ox = Math.max(-maxX, Math.min(maxX, offset.x));
    const oy = Math.max(-maxY, Math.min(maxY, offset.y));
    ctx.drawImage(cropImg, V / 2 - sw / 2 + ox, V / 2 - sh / 2 + oy, sw, sh);
  }, [cropImg, zoom, offset]);

  useEffect(() => {
    drawCropPreview();
  }, [drawCropPreview]);

  const confirmCrop = useCallback(() => {
    if (!cropImg) return;
    const OUT = CROP_OUT;
    const V = CROP_VIEW;
    const c = document.createElement("canvas");
    c.width = c.height = OUT;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const base = Math.min(V / cropImg.width, V / cropImg.height);
    const sw = cropImg.width * base * zoom;
    const sh = cropImg.height * base * zoom;
    const maxX = Math.max(0, (sw - V) / 2);
    const maxY = Math.max(0, (sh - V) / 2);
    const ox = Math.max(-maxX, Math.min(maxX, offset.x));
    const oy = Math.max(-maxY, Math.min(maxY, offset.y));
    const s = OUT / V;
    ctx.save();
    if (cropType === "circle") {
      ctx.beginPath();
      ctx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2);
      ctx.clip();
    }
    ctx.drawImage(cropImg, (V / 2 - sw / 2 + ox) * s, (V / 2 - sh / 2 + oy) * s, sw * s, sh * s);
    ctx.restore();
    setLogoDataUrl(c.toDataURL("image/png"));
    setLogoShape(cropType);
    setCropOpen(false);
  }, [cropImg, zoom, offset, cropType]);

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="qr-code-generator"
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
          <p dangerouslySetInnerHTML={{ __html: t("guide.howTo.intro") }} />
          <ul>
            {(t.raw("guide.howTo.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t("guide.errorCorrection.title")}</h3>
          <p dangerouslySetInnerHTML={{ __html: t("guide.errorCorrection.body") }} />
          <ul>
            {(t.raw("guide.errorCorrection.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t("guide.tips.title")}</h3>
          <ul>
            {(t.raw("guide.tips.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t("guide.useCases.title")}</h3>
          <ul>
            {(t.raw("guide.useCases.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.textUrl")}</label>
            <textarea
              value={text}
              onChange={(e) => {
                const v = e.target.value;
                setText(v);
              }}
              rows={3}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              placeholder={t("placeholder")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.size")}</label>
              <select
                value={size}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setSize(v);
                }}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 outline-none focus:border-blue-500"
              >
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {t(`sizes.${s}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.errorCorrection")}</label>
              <select
                value={ecLevel}
                onChange={(e) => {
                  const v = e.target.value as "L" | "M" | "Q" | "H";
                  setEcLevel(v);
                }}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 outline-none focus:border-blue-500"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {t(`errorLevels.${l}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.style")}</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStyle(s);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    style === s
                      ? "bg-blue-600 text-white"
                      : "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {t(`styles.${s}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.logo")}</label>
            <div className="flex flex-wrap items-center gap-3">
              {logoDataUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoDataUrl} alt="logo" className="h-12 w-12 rounded border border-zinc-600 bg-zinc-700 object-cover" />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    {t("logo.change")}
                  </button>
                  <button
                    onClick={() => {
                      setLogoDataUrl("");
                      setCropImg(null);
                    }}
                    className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    {t("logo.remove")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  {t("logo.upload")}
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
            </div>
            {logoDataUrl && ecLevel !== "Q" && (
              <p className="mt-1.5 text-xs text-amber-400">{t("logo.ecHint")}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.foregroundColor")}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFgColor(v);
                  }}
                  className="h-10 w-10 cursor-pointer rounded border border-zinc-700 bg-transparent"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFgColor(v);
                  }}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.backgroundColor")}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    setBgColor(v);
                  }}
                  className="h-10 w-10 cursor-pointer rounded border border-zinc-700 bg-transparent"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    setBgColor(v);
                  }}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleDownload}
              disabled={!dataUrl}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("buttons.downloadPng")}
            </button>
            <button
              onClick={handleCopyImage}
              disabled={!dataUrl}
              className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("buttons.copyImage")}
            </button>
            <CopyButton text={text} label={t("buttons.copyText")} className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200" />
          </div>
        </div>

        {/* Preview */}
        <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          {dataUrl ? (
            <Image
              src={dataUrl}
              alt={t("title")}
              width={size > 512 ? 512 : size}
              height={size > 512 ? 512 : size}
              className="rounded"
              unoptimized
            />
          ) : (
            <p className="text-zinc-500">{t("previewPlaceholder")}</p>
          )}
        </div>
      </div>

      {/* LOGO 裁剪模态框 */}
      {cropOpen && cropImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setCropOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 text-lg font-semibold text-zinc-100">{t("logo.cropTitle")}</h3>

            <div className="mb-3 flex gap-2">
              {(["square", "circle"] as LogoShape[]).map((ct) => (
                <button
                  key={ct}
                  onClick={() => setCropType(ct)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    cropType === ct
                      ? "bg-blue-600 text-white"
                      : "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {t(`logo.crop${ct === "square" ? "Square" : "Circle"}`)}
                </button>
              ))}
            </div>

            <div
              className={`mx-auto h-80 w-80 touch-none select-none overflow-hidden border-2 border-dashed border-zinc-600 bg-zinc-800 ${
                cropType === "circle" ? "rounded-full" : "rounded-lg"
              }`}
              onPointerDown={(e) => {
                dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y };
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                const d = dragRef.current;
                if (!d) return;
                setOffset({ x: d.ox + (e.clientX - d.sx), y: d.oy + (e.clientY - d.sy) });
              }}
              onPointerUp={() => {
                dragRef.current = null;
              }}
              onPointerCancel={() => {
                dragRef.current = null;
              }}
            >
              <canvas
                ref={previewRef}
                width={CROP_VIEW}
                height={CROP_VIEW}
                className="h-full w-full cursor-grab active:cursor-grabbing"
              />
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-sm text-zinc-400">{t("logo.zoom")}</span>
              <input
                type="range"
                min={0.5}
                max={4}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-10 text-right text-sm text-zinc-400">{Math.round(zoom * 100)}%</span>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setCropOpen(false)}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                {t("logo.cancel")}
              </button>
              <button
                onClick={confirmCrop}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
              >
                {t("logo.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
