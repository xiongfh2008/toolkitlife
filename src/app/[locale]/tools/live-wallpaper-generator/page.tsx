"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import type { SceneKind } from "@/lib/live-wallpaper-scenes";

// UI-only presets (kept here so three.js is never statically imported by the page)
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

const DURATIONS = [5, 10, 20];
const FPS_OPTIONS = [30, 60];

type Lib = {
  scenes: typeof import("@/lib/live-wallpaper-scenes");
  exportMod: typeof import("@/lib/live-wallpaper-export");
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LiveWallpaperGeneratorPage() {
  const t = useTranslations("tools.live-wallpaper-generator");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [kind, setKind] = useState<SceneKind>("galaxy");
  const [paletteIdx, setPaletteIdx] = useState<number>(0); // PALETTES.length = custom
  const [customColors, setCustomColors] = useState<string[]>(["#0b1026", "#2b3a8f", "#7b5cff", "#38d3d3"]);
  const [seed, setSeed] = useState("nebula");
  const [sizeKey, setSizeKey] = useState(0);
  const [customW, setCustomW] = useState(1920);
  const [customH, setCustomH] = useState(1080);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [duration, setDuration] = useState(10);
  const [fps, setFps] = useState(30);

  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<"mp4" | "webm" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const libRef = useRef<Lib | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [libReady, setLibReady] = useState(false);

  const colors = paletteIdx === PALETTES.length ? customColors : PALETTES[paletteIdx].colors;
  const preset = SIZE_PRESETS[sizeKey];
  const W = isCustomSize ? Math.min(7680, Math.max(64, customW || 0)) : preset.w;
  const H = isCustomSize ? Math.min(7680, Math.max(64, customH || 0)) : preset.h;

  // Preview dimensions: long edge ~640px
  const { pw, ph } = useMemo(() => {
    const scale = Math.min(1, 640 / Math.max(W, H));
    return { pw: Math.round(W * scale), ph: Math.round(H * scale) };
  }, [W, H]);

  // Lazy-load three.js + export pipeline
  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      import("@/lib/live-wallpaper-scenes"),
      import("@/lib/live-wallpaper-export"),
    ]).then(([scenes, exportMod]) => {
      if (cancelled) return;
      libRef.current = { scenes, exportMod };
      setLibReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Preview loop. Torn down while exporting (frees GPU) and rebuilt after.
  useEffect(() => {
    const lib = libRef.current;
    const canvas = canvasRef.current;
    if (!lib || !canvas || exporting) return;
    canvas.width = pw;
    canvas.height = ph;
    const renderer = lib.scenes.createRenderer(canvas, pw, ph, Math.min(window.devicePixelRatio || 1, 2));
    const live = lib.scenes.buildScene(kind, { seed, colors, loopSeconds: duration, aspect: W / H });
    const t0 = performance.now();
    renderer.setAnimationLoop(() => {
      live.update(((performance.now() - t0) / 1000) % duration);
      renderer.render(live.scene, live.camera);
    });
    return () => {
      renderer.setAnimationLoop(null);
      live.dispose();
      // No forceContextLoss here: StrictMode remounts reuse the same canvas,
      // and a force-lost context cannot be re-acquired by the next renderer.
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libReady, exporting, kind, colors, seed, duration, pw, ph]);

  const randomize = () => {
    setSeed(Math.random().toString(36).slice(2, 10));
  };

  const handleExport = async () => {
    const lib = libRef.current;
    if (!lib || exporting) return;
    setExporting(true);
    setProgress(0);
    setMode(null);
    setError(null);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    let lastSet = 0;
    try {
      const res = await lib.exportMod.exportVideo(
        { kind, seed, colors, width: W, height: H, seconds: duration, fps },
        {
          signal: ctrl.signal,
          onProgress: (f) => {
            const now = performance.now();
            if (now - lastSet > 100) {
              lastSet = now;
              setProgress(f);
            }
          },
          onMode: (m) => setMode(m),
        }
      );
      setProgress(1);
      downloadBlob(res.blob, `live-wallpaper-${seed}-${W}x${H}.${res.ext}`);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        setError(err instanceof Error ? err.message : String(err));
      }
    } finally {
      abortRef.current = null;
      setExporting(false);
    }
  };

  const handlePoster = async () => {
    const lib = libRef.current;
    if (!lib || exporting) return;
    setError(null);
    try {
      const blob = await lib.exportMod.renderPoster({
        kind,
        seed,
        colors,
        width: W,
        height: H,
        seconds: duration,
        fps,
      });
      downloadBlob(blob, `live-wallpaper-${seed}-${W}x${H}.png`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";
  const kindLabel = { desktop: t("labels.desktop"), phone: t("labels.phone"), tablet: t("labels.tablet") };

  return (
    <ToolLayout
      title={t("title")}
      slug="live-wallpaper-generator"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <label className="text-sm text-zinc-300">
          {t("labels.scene")}
          <div className="mt-1 grid grid-cols-4 gap-2">
            {(["galaxy", "waves", "geometry", "nebula", "globe", "tunnel", "aurora", "fireflies", "snow", "matrix", "grid", "rain"] as SceneKind[]).map((s) => (
              <button
                key={s}
                onClick={() => setKind(s)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  kind === s
                    ? "border-blue-500 bg-blue-600/20 text-blue-400"
                    : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {t(`labels.${s}`)}
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
          <label className="text-sm text-zinc-300">
            {t("labels.duration")}
            <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={inputCls}>
              {DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {d} {t("labels.seconds")}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-zinc-300">
            {t("labels.fps")}
            <select value={fps} onChange={(e) => setFps(Number(e.target.value))} className={inputCls}>
              {FPS_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f} fps
                </option>
              ))}
            </select>
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
        {isCustomSize && (W % 2 !== 0 || H % 2 !== 0) && (
          <p className="text-xs text-amber-400">{t("labels.oddHint")}</p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exporting
              ? `${t("labels.exporting")} ${Math.round(progress * 100)}%`
              : `${t("buttons.exportVideo")} (${mode ?? "MP4"} · ${W}×${H})`}
          </button>
          {exporting && (
            <button
              onClick={() => abortRef.current?.abort()}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:border-red-500"
            >
              {t("labels.cancel")}
            </button>
          )}
          <button
            onClick={handlePoster}
            disabled={exporting}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("buttons.poster")} (PNG · {W}×{H})
          </button>
        </div>
        {exporting && (
          <div className="h-1.5 w-full overflow-hidden rounded bg-zinc-800">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress * 100}%` }} />
          </div>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-center overflow-auto rounded-lg">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
      </div>
    </ToolLayout>
  );
}
