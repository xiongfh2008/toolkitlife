"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const MAX_FILES = 40;

interface Item {
  id: number;
  name: string;
  url: string;
  image: HTMLImageElement | null;
}

export default function CssSpriteGeneratorPage() {
  const t = useTranslations("tools.css-sprite-generator");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [items, setItems] = useState<Item[]>([]);
  const [layout, setLayout] = useState<"horizontal" | "vertical" | "grid">("horizontal");
  const [gap, setGap] = useState(0);
  const [ready, setReady] = useState(false);
  const [css, setCss] = useState("");
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const spriteRef = useRef<HTMLCanvasElement>(null);
  const resultUrlRef = useRef("");

  const addFiles = useCallback((files: FileList | File[]) => {
    setError("");
    setReady(false);
    setCss("");
    setItems((prev) => {
      const next = [...prev];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        if (next.length >= MAX_FILES) break;
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.src = url;
        next.push({ id: Date.now() + Math.random(), name: file.name, url, image });
      }
      return next;
    });
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setReady(false);
    setCss("");
  };

  const process = useCallback(async () => {
    if (items.length === 0 || processing) return;
    setProcessing(true);
    setError("");
    try {
      await Promise.all(
        items.map(
          (item) =>
            new Promise<void>((resolve, reject) => {
              if (item.image && item.image.complete) {
                resolve();
                return;
              }
              item.image!.onload = () => resolve();
              item.image!.onerror = () => reject(new Error("load failed"));
            })
        )
      );

      const imgs = items.map((i) => i.image!);
      const widths = imgs.map((im) => im.naturalWidth);
      const heights = imgs.map((im) => im.naturalHeight);
      const n = imgs.length;
      const g = Math.max(0, gap);

      let totalW: number;
      let totalH: number;
      const positions: Array<{ x: number; y: number }> = [];

      if (layout === "horizontal") {
        totalW = widths.reduce((a, b) => a + b, 0) + g * (n - 1);
        totalH = Math.max(...heights);
        let x = 0;
        for (let i = 0; i < n; i++) {
          positions.push({ x, y: 0 });
          x += widths[i] + g;
        }
      } else if (layout === "vertical") {
        totalH = heights.reduce((a, b) => a + b, 0) + g * (n - 1);
        totalW = Math.max(...widths);
        let y = 0;
        for (let i = 0; i < n; i++) {
          positions.push({ x: 0, y });
          y += heights[i] + g;
        }
      } else {
        const perRow = Math.max(1, Math.ceil(Math.sqrt(n)));
        const rows = Math.ceil(n / perRow);
        const cellW = Math.max(...widths);
        const cellH = Math.max(...heights);
        totalW = perRow * cellW + g * (perRow - 1);
        totalH = rows * cellH + g * (rows - 1);
        for (let i = 0; i < n; i++) {
          const col = i % perRow;
          const row = Math.floor(i / perRow);
          positions.push({ x: col * (cellW + g), y: row * (cellH + g) });
        }
      }

      const canvas = spriteRef.current;
      if (!canvas) return;
      canvas.width = totalW;
      canvas.height = totalH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, totalW, totalH);
      for (let i = 0; i < n; i++) {
        ctx.drawImage(imgs[i], positions[i].x, positions[i].y);
      }

      const cssLines = items.map((item, i) => {
        const im = imgs[i];
        return `.icon-${i} {\n  width: ${im.naturalWidth}px;\n  height: ${im.naturalHeight}px;\n  background: url("sprite.png") -${positions[i].x}px -${positions[i].y}px no-repeat;\n}`;
      });
      setCss(cssLines.join("\n"));
      setCopied(false);
      setReady(true);

      canvas.toBlob((blob) => {
        if (!blob) return;
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
        resultUrlRef.current = URL.createObjectURL(blob);
      }, "image/png");
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setProcessing(false);
    }
  }, [items, processing, layout, gap, t]);

  const downloadSprite = () => {
    if (!resultUrlRef.current) return;
    const a = document.createElement("a");
    a.href = resultUrlRef.current;
    a.download = "sprite.png";
    a.click();
  };

  const copyCss = async () => {
    if (!css) return;
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const handleNewImage = () => {
    for (const item of items) URL.revokeObjectURL(item.url);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
    setItems([]);
    setReady(false);
    setCss("");
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="css-sprite-generator"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {items.length === 0 ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("sprite-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🧩</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="sprite-in"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <label className="mb-1 block text-sm text-zinc-400">{t("labels.layout")}</label>
                <div className="flex flex-wrap gap-2">
                  {(["horizontal", "vertical", "grid"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLayout(l)}
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                        layout === l
                          ? "border-blue-600 bg-blue-600/10 text-blue-600"
                          : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-blue-500/40"
                      }`}
                    >
                      {t(`labels.layout${l.charAt(0).toUpperCase() + l.slice(1)}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  {t("labels.gap")}: {gap}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={gap}
                  onChange={(e) => setGap(parseInt(e.target.value, 10))}
                  className="w-44 accent-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void process()}
                disabled={processing}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing ? t("status.processing") : t("buttons.generate")}
              </button>
              <button
                onClick={downloadSprite}
                disabled={!ready}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.download")}
              </button>
              <button
                onClick={() => void copyCss()}
                disabled={!css}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {copied ? t("labels.copied") : t("buttons.copy")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
              <span className="text-xs text-zinc-500">
                {items.length} / {MAX_FILES}
              </span>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="space-y-2">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-xs"
                >
                  <span className="w-12 text-zinc-500">icon-{i}</span>
                  <span className="truncate text-zinc-300">{item.name}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto text-zinc-600 transition-colors hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {ready && (
              <div className="space-y-3">
                <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                  <canvas ref={spriteRef} className="max-w-full" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-300">{t("labels.cssCode")}</p>
                  <pre className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-emerald-400">
                    {css}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
