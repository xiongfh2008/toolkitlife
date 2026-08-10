"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";
import jsQR, { QRCode } from "jsqr";

export default function QrCodeReaderPage() {
  const t = useTranslations("tools.qr-code-reader");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [imgUrl, setImgUrl] = useState("");
  const [result, setResult] = useState<QRCode | null>(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const urlRef = useRef("");

  const decode = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setError("");
      setResult(null);
      setProcessing(true);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(file);
      urlRef.current = url;
      setImgUrl(url);

      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          setProcessing(false);
          return;
        }
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setProcessing(false);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        try {
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });
          setResult(code);
          if (code) drawOverlay(ctx, code);
          else setError(t("result.notFound"));
        } catch (err) {
          console.error(err);
          setError(t("errors.decode"));
        } finally {
          setProcessing(false);
        }
      };
      img.onerror = () => {
        setProcessing(false);
        setError(t("errors.load"));
      };
      img.src = url;
    },
    [t]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) decode(file);
    e.target.value = "";
  };

  const reset = () => {
    setImgUrl("");
    setResult(null);
    setError("");
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = "";
  };

  const isUrl = result ? /^https?:\/\//i.test(result.data) : false;

  return (
    <ToolLayout
      title={t("title")}
      slug="qr-code-reader"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        {/* Upload area */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()
          }
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) decode(file);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
            dragging
              ? "border-blue-600 bg-blue-600/10"
              : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
          }`}
        >
          <span className="text-4xl">{t("upload.icon")}</span>
          <span className="text-sm text-zinc-400">{t("upload.drop")}</span>
          <span className="text-xs text-zinc-500">{t("upload.formats")}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInput}
          />
        </div>

        {processing && (
          <p className="text-center text-sm text-zinc-400">
            {t("status.processing")}
          </p>
        )}

        {imgUrl && (
          <div className="space-y-4">
            <div className="flex justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <canvas
                ref={canvasRef}
                className="max-h-[420px] max-w-full"
              />
            </div>

            {error && <p className="text-center text-sm text-red-500">{error}</p>}

            {result && (
              <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-400">
                    {t("result.detected")}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {t("result.version", { version: result.version })}
                  </span>
                </div>
                <div className="break-all rounded-lg border border-zinc-700 bg-zinc-950 p-3 font-mono text-sm text-zinc-100">
                  {result.data}
                </div>
                {isUrl && (
                  <a
                    href={result.data}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm text-blue-400 hover:underline"
                  >
                    {result.data}
                  </a>
                )}
                <div className="flex flex-wrap gap-2">
                  <CopyButton text={result.data} />
                  <button
                    onClick={reset}
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    {t("buttons.clear")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function drawOverlay(ctx: CanvasRenderingContext2D, code: QRCode) {
  const pts = code.location;
  const corners = [
    pts.topLeftCorner,
    pts.topRightCorner,
    pts.bottomRightCorner,
    pts.bottomLeftCorner,
  ];
  ctx.lineWidth = Math.max(3, ctx.canvas.width / 300);
  ctx.strokeStyle = "#22c55e";
  ctx.beginPath();
  corners.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.stroke();
}
