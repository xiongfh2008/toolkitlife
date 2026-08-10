"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const CHECKERBOARD = {
  backgroundImage:
    "linear-gradient(45deg, #27272a 25%, transparent 25%), linear-gradient(-45deg, #27272a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #27272a 75%), linear-gradient(-45deg, transparent 75%, #27272a 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
};

type Mode = "ai" | "color";
type ColorView = "result" | "compare";

interface RGB {
  r: number;
  g: number;
  b: number;
}

function formatSize(bytes: number): string {
  if (!bytes) return "0 KB";
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(2)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function BackgroundRemoverPage() {
  const t = useTranslations("tools.background-remover");
  const [mode, setMode] = useState<Mode>("ai");

  // Shared upload state
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [imgSize, setImgSize] = useState(0);

  // AI mode state
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiResult, setAiResult] = useState("");
  const [aiError, setAiError] = useState("");

  // Color mode state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<HTMLCanvasElement>(null);
  const [pickedColors, setPickedColors] = useState<RGB[]>([]);
  const [phase, setPhase] = useState<"pick" | "result">("pick");
  const [removing, setRemoving] = useState(false);
  const [tolerance, setTolerance] = useState(30);
  const [feather, setFeather] = useState(5);
  const [view, setView] = useState<ColorView>("result");
  const [comparePos, setComparePos] = useState(50);
  const [colorResultUrl, setColorResultUrl] = useState("");
  const colorResultUrlRef = useRef("");
  const [resultSize, setResultSize] = useState(0);

  const loadImage = useCallback(
    (file: File, cb: (img: HTMLImageElement) => void) => {
      setImgSize(file.size);
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => cb(image);
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadImage(file, (image) => {
      setImg(image);
      setAiResult("");
      setPickedColors([]);
      setPhase("pick");
      setView("result");
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    loadImage(file, (image) => {
      setImg(image);
      setAiResult("");
      setPickedColors([]);
      setPhase("pick");
      setView("result");
    });
  };

  const handleNewImage = () => {
    setImg(null);
    setAiResult("");
    setPickedColors([]);
    setPhase("pick");
    setView("result");
    if (colorResultUrlRef.current) URL.revokeObjectURL(colorResultUrlRef.current);
    colorResultUrlRef.current = "";
    setColorResultUrl("");
  };

  // ---- AI mode ----
  const handleAiRemove = async () => {
    if (!img || aiProcessing) return;
    setAiProcessing(true);
    setAiProgress(0);
    setAiError("");
    try {
      setAiProgress(3);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { removeBackground }: any = await import("@imgly/background-removal");
      const blob: Blob = await removeBackground(img.src, {
        model: "isnet_fp16",
        device: "cpu",
        output: { format: "image/png" },
        progress: (key: string, current: number, total: number) => {
          const pct = total > 0 ? Math.round((current / total) * 97) : 0;
          setAiProgress(Math.max(pct, 3));
        },
      });
      if (aiResult) URL.revokeObjectURL(aiResult);
      setAiResult(URL.createObjectURL(blob));
      setAiProgress(100);
    } catch (err) {
      console.error(err);
      setAiError(t("status.aiError"));
    } finally {
      setAiProcessing(false);
    }
  };

  // ---- Color mode ----
  // Keep a pristine copy of the original for picking colors after processing.
  useEffect(() => {
    if (!img || mode !== "color") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    // store original
    const orig = originalRef.current;
    if (orig) {
      orig.width = img.naturalWidth;
      orig.height = img.naturalHeight;
      const octx = orig.getContext("2d");
      if (octx) {
        octx.clearRect(0, 0, orig.width, orig.height);
        octx.drawImage(img, 0, 0);
      }
    }
    setPickedColors([]);
    setPhase("pick");
    if (colorResultUrlRef.current) URL.revokeObjectURL(colorResultUrlRef.current);
    colorResultUrlRef.current = "";
    setColorResultUrl("");
  }, [img, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || phase !== "pick" || removing) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(
      ((e.clientX - rect.left) * canvas.width) / rect.width
    );
    const y = Math.floor(
      ((e.clientY - rect.top) * canvas.height) / rect.height
    );
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const px = ctx.getImageData(
      Math.min(Math.max(x, 0), canvas.width - 1),
      Math.min(Math.max(y, 0), canvas.height - 1),
      1,
      1
    ).data;
    setPickedColors((prev) => {
      const exists = prev.some(
        (c) => c.r === px[0] && c.g === px[1] && c.b === px[2]
      );
      if (exists) return prev;
      return [...prev, { r: px[0], g: px[1], b: px[2] }];
    });
  };

  const applyColorRemoval = useCallback(() => {
    const orig = originalRef.current;
    if (!orig) return;
    const octx = orig.getContext("2d");
    if (!octx) return;
    const imageData = octx.getImageData(0, 0, orig.width, orig.height);
    const data = imageData.data;
    if (pickedColors.length > 0) {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        let minDistance = Infinity;
        for (const pc of pickedColors) {
          const distance = Math.sqrt(
            Math.pow(r - pc.r, 2) + Math.pow(g - pc.g, 2) + Math.pow(b - pc.b, 2)
          );
          if (distance < minDistance) minDistance = distance;
        }
        if (minDistance <= tolerance) {
          data[i + 3] = 0;
        } else if (feather > 0 && minDistance <= tolerance + feather) {
          const ratio = (minDistance - tolerance) / feather;
          data[i + 3] = Math.round(data[i + 3] * ratio);
        }
      }
    }
    // Render onto the visible canvas (result view) if present.
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = orig.width;
      canvas.height = orig.height;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.putImageData(imageData, 0, 0);
    }
    // Always export a PNG so download/compare work in any view.
    const out = document.createElement("canvas");
    out.width = orig.width;
    out.height = orig.height;
    const octx2 = out.getContext("2d");
    if (!octx2) return;
    octx2.putImageData(imageData, 0, 0);
    out.toBlob((blob) => {
      if (!blob) return;
      if (colorResultUrlRef.current) URL.revokeObjectURL(colorResultUrlRef.current);
      const url = URL.createObjectURL(blob);
      colorResultUrlRef.current = url;
      setColorResultUrl(url);
      setResultSize(blob.size);
    }, "image/png");
  }, [pickedColors, tolerance, feather]);

  useEffect(() => {
    if (phase !== "result" || pickedColors.length === 0 || !img) return;
    setRemoving(true);
    const id = setTimeout(() => {
      applyColorRemoval();
      setRemoving(false);
    }, 150);
    return () => clearTimeout(id);
  }, [phase, pickedColors, tolerance, feather, img, applyColorRemoval]);

  // Restore the original image onto the visible canvas when picking again.
  useEffect(() => {
    if (!img || mode !== "color" || phase !== "pick") return;
    setRemoving(false);
    const canvas = canvasRef.current;
    const orig = originalRef.current;
    if (!canvas || !orig) return;
    canvas.width = orig.width;
    canvas.height = orig.height;
    const ctx = canvas.getContext("2d");
    const octx = orig.getContext("2d");
    if (!ctx || !octx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(orig, 0, 0);
  }, [img, mode, phase]);

  // Re-sync the processed result onto the canvas when switching back to the
  // result view (the canvas element is re-mounted after the compare view or
  // after the removing state toggles).
  useEffect(() => {
    if (view !== "result" || pickedColors.length === 0 || !img || removing) return;
    applyColorRemoval();
  }, [view, pickedColors, img, applyColorRemoval, removing]);

  const handleRepick = () => {
    setPhase("pick");
  };

  const handleClearColors = () => {
    setPickedColors([]);
    setPhase("pick");
    setView("result");
    if (colorResultUrlRef.current) URL.revokeObjectURL(colorResultUrlRef.current);
    colorResultUrlRef.current = "";
    setColorResultUrl("");
  };

  const handleColorDownload = () => {
    if (!colorResultUrl) return;
    const link = document.createElement("a");
    link.download = "background-removed.png";
    link.href = colorResultUrl;
    link.click();
  };

  const handleAiDownload = () => {
    if (!aiResult) return;
    const link = document.createElement("a");
    link.download = "background-removed.png";
    link.href = aiResult;
    link.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const checkerStyle = {
    ...CHECKERBOARD,
    background: "#18181b",
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="background-remover"
    >
      <div className="max-w-4xl space-y-4">
        {/* Mode switch */}
        <div className="flex rounded-lg border border-zinc-700 p-1 bg-zinc-900">
          <button
            onClick={() => setMode("ai")}
            className={`flex-1 rounded-md px-2 py-2 text-xs sm:text-sm font-medium transition-colors ${
              mode === "ai" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t("modes.ai")}
          </button>
          <button
            onClick={() => setMode("color")}
            className={`flex-1 rounded-md px-2 py-2 text-xs sm:text-sm font-medium transition-colors ${
              mode === "color" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t("modes.color")}
          </button>
        </div>

        {!img ? (
          /* Shared upload area — icon/text changes with mode */
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("bgrm-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">{mode === "ai" ? "✂️" : "🎨"}</div>
            <p className="font-medium text-zinc-300">{t("labels.dropPrompt")}</p>
            <p className="mt-1 text-sm text-zinc-500">PNG · JPG · WebP · BMP</p>
            <p className="mt-2 text-sm text-zinc-500">{t(`modeHints.${mode}`)}</p>
            <input
              id="bgrm-in"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : mode === "ai" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAiRemove}
                disabled={aiProcessing}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {aiProcessing ? t("labels.removing") : t("labels.removeBackground")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("labels.newImage")}
              </button>
            </div>

            {!aiResult && (
              <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={t("labels.original")}
                  className="max-w-full rounded border border-zinc-800"
                />
              </div>
            )}

            {aiProcessing && (
              <div>
                <p className="mb-1 text-sm text-zinc-400">
                  {aiProgress < 3
                    ? t("status.aiLoading")
                    : t("status.aiProcessing", { progress: aiProgress })}
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${aiProgress}%` }}
                  />
                </div>
              </div>
            )}

            {aiError && (
              <div className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-300">
                {aiError}
              </div>
            )}

            {aiResult && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-300">
                    {t("labels.original")} / {t("labels.result")}
                  </p>
                  <button
                    onClick={handleAiDownload}
                    className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                  >
                    {t("buttons.download")}
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt="Original"
                      className="w-full rounded-lg border border-zinc-800"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-zinc-800" style={checkerStyle}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={aiResult}
                      alt="Result"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Color mode — click-to-pick (multiple colors) */
          <div className="space-y-4">
            {/* Off-screen canvas that holds a pristine copy of the original image */}
            <canvas ref={originalRef} className="hidden" />
            {phase === "pick" ? (
              <div className="space-y-3">
                <p className="text-sm text-blue-400">{t("labels.pickHint")}</p>
                <div
                  className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4"
                  style={checkerStyle}
                >
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="max-w-full cursor-crosshair border border-zinc-800"
                  />
                </div>

                {pickedColors.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-zinc-400">
                      {t("labels.pickedCount", { count: pickedColors.length })}
                    </span>
                    {pickedColors.map((c, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 py-1 pl-2 pr-1 text-xs text-zinc-300"
                      >
                        <span
                          className="inline-block h-4 w-4 rounded border border-zinc-600"
                          style={{ backgroundColor: `rgb(${c.r},${c.g},${c.b})` }}
                        />
                        <span className="font-mono">
                          {c.r},{c.g},{c.b}
                        </span>
                        <button
                          onClick={() =>
                            setPickedColors((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            )
                          }
                          className="rounded-full p-1 leading-none text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                          title={t("labels.removeColor")}
                          aria-label={t("labels.removeColor")}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setPhase("result")}
                    disabled={pickedColors.length === 0}
                    className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                  >
                    {t("labels.finish")}
                  </button>
                  {pickedColors.length > 0 && (
                    <button
                      onClick={handleClearColors}
                      className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                    >
                      {t("labels.clearColors")}
                    </button>
                  )}
                  <button
                    onClick={handleNewImage}
                    className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                  >
                    {t("labels.newImage")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300">
                    <span className="text-zinc-400">
                      {t("labels.pickedCount", { count: pickedColors.length })}
                    </span>
                    <span className="flex items-center gap-1">
                      {pickedColors.slice(0, 5).map((c, i) => (
                        <span
                          key={i}
                          className="inline-block h-4 w-4 rounded border border-zinc-600"
                          style={{ backgroundColor: `rgb(${c.r},${c.g},${c.b})` }}
                        />
                      ))}
                      {pickedColors.length > 5 && (
                        <span className="text-xs text-zinc-500">
                          +{pickedColors.length - 5}
                        </span>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={handleRepick}
                    className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                  >
                    {t("labels.repickColor")}
                  </button>
                  <button
                    onClick={handleClearColors}
                    className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                  >
                    {t("labels.clearColors")}
                  </button>
                  <button
                    onClick={handleNewImage}
                    className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                  >
                    {t("labels.newImage")}
                  </button>
                </div>

                {removing ? (
                  <p className="text-sm text-blue-400">{t("status.removingColor")}</p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-300">
                          {t("labels.tolerance")}: {tolerance}
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={80}
                          step={1}
                          value={tolerance}
                          onChange={(e) => setTolerance(parseInt(e.target.value, 10))}
                          className="w-full accent-blue-500"
                        />
                        <p className="mt-1 text-xs text-zinc-500">{t("labels.toleranceHint")}</p>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-300">
                          {t("labels.feather")}: {feather}
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={30}
                          step={1}
                          value={feather}
                          onChange={(e) => setFeather(parseInt(e.target.value, 10))}
                          className="w-full accent-blue-500"
                        />
                        <p className="mt-1 text-xs text-zinc-500">{t("labels.featherHint")}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex rounded-lg border border-zinc-700 p-0.5 bg-zinc-900">
                        <button
                          onClick={() => setView("result")}
                          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                            view === "result"
                              ? "bg-blue-600 text-white"
                              : "text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {t("labels.resultView")}
                        </button>
                        <button
                          onClick={() => setView("compare")}
                          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                            view === "compare"
                              ? "bg-blue-600 text-white"
                              : "text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {t("labels.compareView")}
                        </button>
                      </div>
                      <button
                        onClick={handleColorDownload}
                        className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                      >
                        {t("buttons.download")}
                      </button>
                    </div>

                    {view === "result" ? (
                      <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4" style={checkerStyle}>
                        <canvas
                          ref={canvasRef}
                          className="max-w-full border border-zinc-800"
                        />
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-lg border border-zinc-800" style={checkerStyle}>
                        <div
                          className="relative mx-auto w-full"
                          style={{
                            aspectRatio: `${img.naturalWidth} / ${img.naturalHeight}`,
                            maxHeight: "70vh",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.src}
                            alt="Original"
                            className="absolute inset-0 h-full w-full object-contain"
                          />
                          {colorResultUrl && (
                            <div
                              className="absolute inset-0"
                              style={{ clipPath: `inset(0 0 0 ${comparePos}%)` }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={colorResultUrl}
                                alt="Result"
                                className="h-full w-full object-contain"
                              />
                            </div>
                          )}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-white/80"
                            style={{ left: `${comparePos}%` }}
                          />
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={comparePos}
                            onChange={(e) => setComparePos(parseInt(e.target.value, 10))}
                            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                            aria-label={t("labels.compareView")}
                          />
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-zinc-500">
                      {t("labels.originalSize", { size: formatSize(imgSize) })} →{" "}
                      {t("labels.resultSize", { size: formatSize(resultSize) })}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
