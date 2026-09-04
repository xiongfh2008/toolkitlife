"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { inpaintWithMigan } from "@/lib/migan";
import {
  decodeMask,
  encodeImage,
  ensureSamSessions,
  type EncodeResult,
  type SamPoint,
} from "@/lib/sam";

const MAX_WORK = 4096; // working + export resolution cap (longest edge)
const MAX_DISP = 1024; // display canvas (also the SAM encode input space)
const MASK_FLOOR = 0.12; // probability below this is never selected
const MASK_FULL = 0.4; // probability at which the erase mask is fully opaque

/** Grow the white mask region by a few px (GPU blur + re-threshold). SAM cuts
 * the mask exactly at its estimated boundary, so the object's anti-aliased
 * edge pixels fall just outside it — without dilation they survive inpainting
 * as a faint halo. */
function dilateMask(mask: ImageData, r: number): ImageData {
  const src = document.createElement("canvas");
  src.width = mask.width;
  src.height = mask.height;
  src.getContext("2d")!.putImageData(mask, 0, 0);
  const dst = document.createElement("canvas");
  dst.width = mask.width;
  dst.height = mask.height;
  const dctx = dst.getContext("2d")!;
  dctx.filter = `blur(${r}px)`;
  dctx.drawImage(src, 0, 0);
  const out = dctx.getImageData(0, 0, mask.width, mask.height);
  for (let i = 3; i < out.data.length; i += 4) {
    const a = out.data[i];
    out.data[i] = a >= 48 ? 255 : Math.min(255, a * 4);
  }
  return out;
}

type Busy = null | "analyze" | "decode" | "erase";

export default function AiObjectEraserPage() {
  const t = useTranslations("tools.ai-object-eraser");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [work, setWork] = useState<ImageData | null>(null); // current edited image
  const [disp, setDisp] = useState({ w: 0, h: 0 }); // display canvas size
  const [origUrl, setOrigUrl] = useState(""); // untouched copy preview
  const [resultUrl, setResultUrl] = useState(""); // current result preview
  const [erasedCount, setErasedCount] = useState(0);
  const [analyzed, setAnalyzed] = useState(false);
  const [busy, setBusy] = useState<Busy>(null);
  const [pct, setPct] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const [points, setPoints] = useState<SamPoint[]>([]);
  const [lastMask, setLastMask] = useState<Float32Array | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const baseRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const encRef = useRef<EncodeResult["embedding"] | null>(null);
  const pristineRef = useRef<ImageData | null>(null);

  // ── helpers ──
  const toPngUrl = useCallback((img: ImageData): Promise<string> => {
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    c.getContext("2d")!.putImageData(img, 0, 0);
    return new Promise((resolve) =>
      c.toBlob((b) => resolve(b ? URL.createObjectURL(b) : ""), "image/png")
    );
  }, []);

  const syncBaseCanvas = useCallback(() => {
    const cv = baseRef.current;
    if (!cv || !work) return;
    const { w, h } = disp;
    if (cv.width !== w) cv.width = w;
    if (cv.height !== h) cv.height = h;
    const ctx = cv.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const src = document.createElement("canvas");
    src.width = work.width;
    src.height = work.height;
    src.getContext("2d")!.putImageData(work, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(src, 0, 0, w, h);
  }, [work, disp]);

  const drawOverlay = useCallback(() => {
    const ov = overlayRef.current;
    if (!ov || !work) return;
    const { w, h } = disp;
    if (ov.width !== w) ov.width = w;
    if (ov.height !== h) ov.height = h;
    const octx = ov.getContext("2d")!;
    octx.clearRect(0, 0, w, h);

    // selection mask → magenta overlay with a soft edge
    if (lastMask) {
      const img = octx.createImageData(w, h);
      const px = img.data;
      for (let i = 0; i < w * h; i++) {
        const v = lastMask[i];
        const a =
          v < MASK_FLOOR
            ? 0
            : Math.min(0.55, ((v - MASK_FLOOR) / (MASK_FULL - MASK_FLOOR)) * 0.55);
        if (a > 0) {
          px[i * 4] = 255;
          px[i * 4 + 1] = 0;
          px[i * 4 + 2] = 255;
          px[i * 4 + 3] = Math.round(a * 255);
        }
      }
      octx.putImageData(img, 0, 0);
    }

    // prompt points (green = object, red = background)
    const dotR = Math.max(4, Math.round(w / 130));
    for (const p of points) {
      octx.beginPath();
      octx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
      octx.fillStyle = p.label ? "#22c55e" : "#ef4444";
      octx.fill();
      octx.lineWidth = 2;
      octx.strokeStyle = "#fff";
      octx.stroke();
    }
  }, [work, disp, lastMask, points]);

  // refresh canvases on every work image / selection change
  useEffect(() => {
    syncBaseCanvas();
    drawOverlay();
  }, [syncBaseCanvas, drawOverlay]);

  // produce a fresh result preview URL after every erase
  useEffect(() => {
    if (!work) return;
    let alive = true;
    void toPngUrl(work).then((u) => {
      if (!alive) return;
      setResultUrl((prev) => {
        if (prev && prev !== u) URL.revokeObjectURL(prev);
        return u;
      });
    });
    return () => {
      alive = false;
    };
  }, [work, toPngUrl]);

  const resetAll = () => {
    setOrigUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    pristineRef.current = null;
    encRef.current = null;
    setWork(null);
    setDisp({ w: 0, h: 0 });
    setErasedCount(0);
    setAnalyzed(false);
    setBusy(null);
    setPct(null);
    setErr("");
    setPoints([]);
    setLastMask(null);
  };

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(
        1,
        MAX_WORK / Math.max(img.naturalWidth, img.naturalHeight)
      );
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h);

      const dScale = Math.min(1, MAX_DISP / Math.max(w, h));
      const dw = Math.max(1, Math.round(w * dScale));
      const dh = Math.max(1, Math.round(h * dScale));

      resetAll();
      pristineRef.current = new ImageData(
        new Uint8ClampedArray(data.data),
        w,
        h
      );
      void toPngUrl(pristineRef.current).then((u) => setOrigUrl(u));
      setWork(data);
      setDisp({ w: dw, h: dh });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setErr(t("errors.read"));
    };
    img.src = url;
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) processFile(file);
  };

  // ── model download + encode ──
  const analyze = async () => {
    if (!work || busy) return;
    setBusy("analyze");
    setPct(0);
    setErr("");
    try {
      // encoder ~109 MB, decoder ~9 MB — streamed with progress, IDB-cached
      const encShare = 108773912 / (108773912 + 8761128);
      await ensureSamSessions((kind, done, total) => {
        const frac =
          total > 0
            ? kind === "encoder"
              ? (done / total) * encShare
              : encShare + (done / total) * (1 - encShare)
            : 0;
        setPct(Math.min(99, Math.round(frac * 100)));
      });
      setPct(null); // switch status text to "encoding…"
      const cv = baseRef.current;
      if (!cv) throw new Error("canvas not ready");
      const enc = await encodeImage(cv);
      encRef.current = enc.embedding;
      setAnalyzed(true);
      setPoints([]);
      setLastMask(null);
    } catch (ex) {
      console.error(ex);
      setErr(t("errors.analyze"));
    } finally {
      setBusy(null);
      setPct(null);
    }
  };

  // ── click → decode mask ──
  const onCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!analyzed || busy || !work) return;
    const ov = overlayRef.current;
    if (!ov) return;
    const rect = ov.getBoundingClientRect();
    const x = Math.min(
      disp.w - 1,
      Math.max(0, Math.round(((e.clientX - rect.left) / rect.width) * disp.w))
    );
    const y = Math.min(
      disp.h - 1,
      Math.max(0, Math.round(((e.clientY - rect.top) / rect.height) * disp.h))
    );
    const label: 0 | 1 = e.shiftKey ? 0 : 1;
    const next = [...points, { x, y, label }];
    setPoints(next);
    setBusy("decode");
    setErr("");
    try {
      if (!encRef.current) throw new Error("not analyzed");
      const res = await decodeMask(encRef.current, next, disp.w, disp.h, true);
      setLastMask(res.mask);
    } catch (ex) {
      console.error(ex);
      setErr(t("errors.decode"));
    } finally {
      setBusy(null);
    }
  };

  // ── erase selection with MI-GAN ──
  const erase = async () => {
    if (!work || !lastMask || busy) {
      setErr(t("errors.noPoints"));
      return;
    }
    setBusy("erase");
    setPct(0);
    setErr("");
    try {
      const { w: dw, h: dh } = disp;
      const cw = work.width;
      const ch = work.height;
      if (!encRef.current) throw new Error("not analyzed");
      // decode the mask at full working resolution straight from the encoder
      // embedding (bilinear-smooth edges) instead of nearest-neighbour
      // upsampling the display-space mask
      const { mask: prob } = await decodeMask(
        encRef.current,
        points.map((p) => ({
          x: (p.x * cw) / dw,
          y: (p.y * ch) / dh,
          label: p.label,
        })),
        cw,
        ch,
        true
      );
      // probability map → white RGBA mask (already full resolution)
      const mask = new ImageData(cw, ch);
      {
        const a = mask.data;
        for (let i = 0; i < cw * ch; i++) {
          const v = prob[i];
          const j = i * 4;
          a[j] = 255;
          a[j + 1] = 255;
          a[j + 2] = 255;
          a[j + 3] =
            v < MASK_FLOOR
              ? 0
              : Math.min(
                  255,
                  Math.round(((v - MASK_FLOOR) / (MASK_FULL - MASK_FLOOR)) * 255)
                );
        }
      }
      // grow the mask a few px so it covers anti-aliased boundary pixels
      const dilated = dilateMask(
        mask,
        Math.max(2, Math.round(Math.min(cw, ch) / 300))
      );
      const out = await inpaintWithMigan(work, dilated, (stage, p) => {
        setPct(stage === "model" ? Math.round(p * 30) : Math.round(30 + p * 70));
      });
      setWork(out);
      setErasedCount((c) => c + 1);
      setPoints([]);
      setLastMask(null);
    } catch (ex) {
      console.error(ex);
      setErr(t("errors.erase"));
    } finally {
      setBusy(null);
      setPct(null);
    }
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const statusText = (() => {
    if (busy === "analyze")
      return pct != null ? t("status.downloading", { pct }) : t("status.encoding");
    if (busy === "erase")
      return pct != null ? t("status.erasing", { pct }) : t("status.erasingPrep");
    if (busy === "decode") return t("status.decoding");
    if (!work) return "";
    if (!analyzed) return t("status.pendingAnalyze");
    return points.length ? t("status.segmentHint") : t("status.segmentStart");
  })();

  return (
    <ToolLayout
      title={t("title")}
      slug="ai-object-eraser"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {!work ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🪄</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* model / analyze bar */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex flex-wrap items-center gap-3">
                {!analyzed ? (
                  <button
                    onClick={() => void analyze()}
                    disabled={busy !== null}
                    className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                  >
                    {t("buttons.analyze")}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-500/30">
                    ✓ {t("status.analyzed")}
                  </span>
                )}
                <button
                  onClick={resetAll}
                  disabled={busy !== null}
                  className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                >
                  {t("buttons.newImage")}
                </button>
                {analyzed && (
                  <button
                    onClick={() => {
                      setPoints([]);
                      setLastMask(null);
                    }}
                    disabled={busy !== null || (!points.length && !lastMask)}
                    className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                  >
                    {t("buttons.clearPoints")}
                  </button>
                )}
              </div>

              {!analyzed && (
                <p className="mt-3 text-xs text-zinc-500">{t("modelNote")}</p>
              )}

              {(busy === "analyze" || busy === "erase") && (
                <div className="mt-3">
                  <div className="mb-1 text-xs text-zinc-400">{statusText}</div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={
                        pct == null
                          ? "h-full w-1/3 animate-pulse rounded-full bg-blue-600"
                          : "h-full rounded-full bg-blue-600 transition-all duration-300"
                      }
                      style={pct != null ? { width: `${pct}%` } : undefined}
                    />
                  </div>
                </div>
              )}
            </div>

            {err && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm font-medium text-red-600">
                {err}
              </div>
            )}

            {/* interactive stage */}
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                <span>{statusText}</span>
                <span>
                  {t("labels.fgPoint")} <span className="text-green-500">●</span>{" "}
                  {t("labels.bgPoint")} <span className="text-red-500">●</span> ·{" "}
                  {t("labels.shiftHint")}
                </span>
              </div>
              <div className="inline-block rounded-lg border border-zinc-800 bg-zinc-900 p-1">
                <div className="relative max-w-full">
                  <canvas ref={baseRef} className="block max-h-[70vh] w-auto max-w-full" />
                  <canvas
                    ref={overlayRef}
                    className="absolute inset-0 h-full w-full"
                    style={{
                      pointerEvents: analyzed && busy == null ? "auto" : "none",
                      cursor: analyzed && busy == null ? "crosshair" : "default",
                    }}
                    onClick={(e) => void onCanvasClick(e)}
                  />
                </div>
              </div>
            </div>

            {/* erase action */}
            {analyzed && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => void erase()}
                  disabled={busy !== null || !points.length}
                  className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                >
                  {t("buttons.erase")}
                </button>
              </div>
            )}

            {/* before / after */}
            {erasedCount > 0 && origUrl && resultUrl && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-300">
                    {t("labels.original")} / {t("labels.result")}
                  </p>
                  <button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = resultUrl;
                      a.download = "object-erased.png";
                      a.click();
                    }}
                    className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                  >
                    {t("buttons.download")}
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={origUrl}
                      alt={t("labels.original")}
                      className="w-full rounded-lg border border-zinc-800"
                    />
                  </div>
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resultUrl}
                      alt={t("labels.result")}
                      className="w-full rounded-lg border border-zinc-800"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
