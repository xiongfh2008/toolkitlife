"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

// ---------- Seeded PRNG ----------
function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- Data ----------
const PALETTES: { colors: string[] }[] = [
  { colors: ["#020617", "#1e3a8a", "#3b82f6", "#93c5fd"] },
  { colors: ["#0b1026", "#2b3a8f", "#7b5cff", "#38d3d3"] },
  { colors: ["#2b0f3a", "#7a2a8f", "#ff5e62", "#ffc371"] },
  { colors: ["#012433", "#02667d", "#00a5b5", "#8ee3ef"] },
  { colors: ["#0b2318", "#1d5c3a", "#4caf7d", "#c8e6a0"] },
  { colors: ["#3d1140", "#c934a5", "#ff8bd1", "#ffe3f5"] },
  { colors: ["#1a0b09", "#7c2d12", "#ea580c", "#fbbf24"] },
  { colors: ["#4a1d3f", "#a83c7d", "#f2a2c8", "#fde8ef"] },
  { colors: ["#2f2013", "#a16207", "#d6a756", "#f5e6c8"] },
  { colors: ["#052e2b", "#0f766e", "#2dd4bf", "#a7f3d0"] },
  { colors: ["#111827", "#374151", "#9ca3af", "#e5e7eb"] },
  { colors: ["#1e1b4b", "#6d28d9", "#a78bfa", "#ede9fe"] },
];

const SIZE_PRESETS: { w: number; h: number; kind: "desktop" | "phone" | "tablet" }[] = [
  { w: 1920, h: 1080, kind: "desktop" },
  { w: 2560, h: 1440, kind: "desktop" },
  { w: 3840, h: 2160, kind: "desktop" },
  { w: 1170, h: 2532, kind: "phone" },
  { w: 1080, h: 2400, kind: "phone" },
  { w: 1440, h: 3200, kind: "phone" },
  { w: 2048, h: 2732, kind: "tablet" },
];

type Style = "mesh" | "aurora";

// ---------- Renderers ----------
function hexToRgba(hex: string, alpha: number): string {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function makeGrainPattern(ctx: CanvasRenderingContext2D, rand: () => number): CanvasPattern | null {
  const tile = document.createElement("canvas");
  tile.width = 160;
  tile.height = 160;
  const tctx = tile.getContext("2d");
  if (!tctx) return null;
  const img = tctx.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(rand() * 255);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  tctx.putImageData(img, 0, 0);
  return ctx.createPattern(tile, "repeat");
}

function drawAurora(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  colors: string[],
  rand: () => number,
  grain: boolean
) {
  const c = (i: number) => colors[i % colors.length];

  // Base gradient
  const base = ctx.createLinearGradient(0, 0, W * 0.3, H);
  base.addColorStop(0, c(0));
  base.addColorStop(1, c(1));
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // Large soft glows
  for (let i = 0; i < 3; i++) {
    const gx = W * (0.15 + rand() * 0.7);
    const gy = H * (0.15 + rand() * 0.7);
    const r = Math.max(W, H) * (0.45 + rand() * 0.35);
    const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
    glow.addColorStop(0, hexToRgba(c(2 + i), 0.32));
    glow.addColorStop(1, hexToRgba(c(2 + i), 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
  }

  // Ribbon bands
  for (let i = 0; i < 5; i++) {
    const leftY = H * (0.15 + rand() * 0.7);
    const rightY = H * (0.15 + rand() * 0.7);
    const thickness = H * (0.08 + rand() * 0.2);
    const c1y = leftY + (rand() - 0.5) * H * 0.6;
    const c2y = rightY + (rand() - 0.5) * H * 0.6;
    ctx.beginPath();
    ctx.moveTo(0, leftY);
    ctx.bezierCurveTo(W * 0.33, c1y, W * 0.66, c2y, W, rightY);
    ctx.bezierCurveTo(W * 0.66, c2y + thickness, W * 0.33, c1y + thickness, 0, leftY + thickness);
    ctx.closePath();
    ctx.fillStyle = hexToRgba(c(i + 2), 0.3 + rand() * 0.2);
    ctx.fill();
  }

  // Vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.3)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // Grain overlay
  if (grain) {
    const pattern = makeGrainPattern(ctx, rand);
    if (pattern) {
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }
}

// Lazy-loaded mesh gradient module (shared cache across renders)
let meshLib: Promise<typeof import("easy-mesh-gradient")> | null = null;
const loadMesh = () => (meshLib ??= import("easy-mesh-gradient"));

export default function WallpaperGeneratorPage() {
  const t = useTranslations("tools.wallpaper-generator");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [style, setStyle] = useState<Style>("mesh");
  const [paletteIdx, setPaletteIdx] = useState<number>(0); // PALETTES.length = custom
  const [customColors, setCustomColors] = useState<string[]>(["#0b1026", "#2b3a8f", "#7b5cff", "#38d3d3"]);
  const [seed, setSeed] = useState("aurora");
  const [sizeKey, setSizeKey] = useState(0);
  const [customW, setCustomW] = useState(1920);
  const [customH, setCustomH] = useState(1080);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [grain, setGrain] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderToken = useRef(0);

  const colors = paletteIdx === PALETTES.length ? customColors : PALETTES[paletteIdx].colors;
  const preset = SIZE_PRESETS[sizeKey];
  const W = isCustomSize ? Math.min(7680, Math.max(64, customW || 0)) : preset.w;
  const H = isCustomSize ? Math.min(7680, Math.max(64, customH || 0)) : preset.h;

  // Preview dimensions: long edge ~640px
  const { pw, ph } = useMemo(() => {
    const scale = Math.min(1, 640 / Math.max(W, H));
    return { pw: Math.round(W * scale), ph: Math.round(H * scale) };
  }, [W, H]);

  const renderTo = async (canvas: HTMLCanvasElement, w: number, h: number, isStale?: () => boolean) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (style === "mesh") {
      const lib = await loadMesh();
      if (isStale?.()) return;
      const rand = mulberry32(hashSeed(seed));
      const points = colors.map((hex) => {
        const hsl = lib.hexToHsl(hex) ?? { h: 220, s: 0.7, l: 0.5 };
        return {
          x: 0.1 + rand() * 0.8,
          y: 0.1 + rand() * 0.8,
          h: hsl.h,
          s: hsl.s,
          l: hsl.l,
          scale: 0.8 + rand(),
        };
      });
      lib.renderMeshGradient(ctx, {
        points,
        width: w,
        height: h,
        grain: grain ? { density: 0.5, intensity: 0.12 } : undefined,
      });
    } else {
      drawAurora(ctx, w, h, colors, mulberry32(hashSeed(seed)), grain);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = pw;
    canvas.height = ph;
    const token = ++renderToken.current;
    void renderTo(canvas, pw, ph, () => token !== renderToken.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style, colors, seed, grain, pw, ph]);

  const download = async () => {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    await renderTo(c, W, H);
    const blob = await new Promise<Blob | null>((res) => c.toBlob(res, "image/png"));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallpaper-${seed}-${W}x${H}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const randomize = () => {
    setSeed(Math.random().toString(36).slice(2, 10));
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";
  const kindLabel = { desktop: t("labels.desktop"), phone: t("labels.phone"), tablet: t("labels.tablet") };

  return (
    <ToolLayout
      title={t("title")}
      slug="wallpaper-generator"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-zinc-300">
            {t("labels.style")}
            <div className="mt-1 grid grid-cols-2 gap-2">
              {(["mesh", "aurora"] as Style[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    style === s
                      ? "border-blue-500 bg-blue-600/20 text-blue-400"
                      : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500"
                  }`}
                >
                  {s === "mesh" ? t("labels.mesh") : t("labels.aurora")}
                </button>
              ))}
            </div>
          </label>
          <label className="text-sm text-zinc-300">
            {t("labels.palette")}
            <div className="mt-1 flex flex-wrap gap-2">
              {PALETTES.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setPaletteIdx(i)}
                  aria-label={`palette ${i + 1}`}
                  className={`flex h-8 w-12 overflow-hidden rounded border ${
                    paletteIdx === i ? "border-blue-500" : "border-zinc-700"
                  }`}
                >
                  {p.colors.map((c) => (
                    <span key={c} className="h-full flex-1" style={{ backgroundColor: c }} />
                  ))}
                </button>
              ))}
              <button
                onClick={() => setPaletteIdx(PALETTES.length)}
                className={`rounded border px-2 text-xs ${
                  paletteIdx === PALETTES.length ? "border-blue-500 text-blue-400" : "border-zinc-700 text-zinc-300"
                }`}
              >
                {t("labels.custom")}
              </button>
            </div>
          </label>
        </div>

        {paletteIdx === PALETTES.length && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {customColors.map((c, i) => (
              <label key={i} className="text-sm text-zinc-300">
                {t("labels.color")} {i + 1}
                <input
                  type="color"
                  value={c}
                  onChange={(e) =>
                    setCustomColors((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))
                  }
                  className="mt-1 h-9 w-full cursor-pointer rounded border border-zinc-700 bg-zinc-800"
                />
              </label>
            ))}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm text-zinc-300">
            {t("labels.seed")}
            <div className="mt-1 flex gap-2">
              <input value={seed} onChange={(e) => setSeed(e.target.value)} className={inputCls} />
              <button
                onClick={randomize}
                title={t("labels.randomize")}
                className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-300 hover:border-blue-500"
              >
                🎲
              </button>
            </div>
          </label>
          <label className="text-sm text-zinc-300">
            {t("labels.size")}
            <select
              value={isCustomSize ? "custom" : String(sizeKey)}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setIsCustomSize(true);
                } else {
                  setIsCustomSize(false);
                  setSizeKey(Number(e.target.value));
                }
              }}
              className={inputCls}
            >
              {SIZE_PRESETS.map((p, i) => (
                <option key={i} value={i}>
                  {p.w} × {p.h} · {kindLabel[p.kind]}
                </option>
              ))}
              <option value="custom">{t("labels.customSize")}</option>
            </select>
          </label>
          <label className="flex items-end gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={grain}
              onChange={(e) => setGrain(e.target.checked)}
              className="h-4 w-4 accent-blue-500"
            />
            {t("labels.grain")}
          </label>
        </div>

        {isCustomSize && (
          <div className="grid grid-cols-2 gap-3 sm:w-64">
            <label className="text-sm text-zinc-300">
              {t("labels.width")}
              <input
                type="number"
                min={64}
                max={7680}
                value={customW}
                onChange={(e) => setCustomW(Number(e.target.value))}
                className={inputCls}
              />
            </label>
            <label className="text-sm text-zinc-300">
              {t("labels.height")}
              <input
                type="number"
                min={64}
                max={7680}
                value={customH}
                onChange={(e) => setCustomH(Number(e.target.value))}
                className={inputCls}
              />
            </label>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={download}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            {t("buttons.download")} (PNG · {W}×{H})
          </button>
        </div>
        <div className="flex justify-center overflow-auto rounded-lg">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
      </div>
    </ToolLayout>
  );
}
