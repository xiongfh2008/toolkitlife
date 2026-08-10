"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { Detection, FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

interface ProcessedImage {
  id: string;
  name: string;
  imageUrl: string;
  canvas: HTMLCanvasElement;
  faceCount: number;
}

type DetectorStatus = "idle" | "loading" | "ready" | "error";

export default function FaceDetectorPage() {
  const t = useTranslations("tools.face-detector");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [status, setStatus] = useState<DetectorStatus>("idle");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const detectorRef = useRef<FaceDetector | null>(null);
  const urlRefs = useRef<string[]>([]);

  const getDetector = useCallback(async () => {
    if (detectorRef.current) return detectorRef.current;
    setStatus("loading");
    try {
      const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
      const detector = await FaceDetector.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL },
        runningMode: "IMAGE",
        minDetectionConfidence: 0.5,
      });
      detectorRef.current = detector;
      setStatus("ready");
      return detector;
    } catch (err) {
      console.error(err);
      setStatus("error");
      throw err;
    }
  }, []);

  const addFiles = useCallback(
    async (files: File[]) => {
      const list = files.filter((f) => f.type.startsWith("image/"));
      if (list.length === 0) return;
      setError("");
      setProcessing(true);
      try {
        const detector = await getDetector();
        const newImages: ProcessedImage[] = [];
        for (const file of list) {
          const url = URL.createObjectURL(file);
          urlRefs.current.push(url);
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = url;
          });
          const canvas = document.createElement("canvas");
          canvas.width = Math.min(img.naturalWidth, 4096);
          canvas.height = Math.min(img.naturalHeight, 4096);
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          const scaleX = canvas.width / img.naturalWidth;
          const scaleY = canvas.height / img.naturalHeight;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const res = detector.detect(canvas);
          for (const det of res.detections) {
            drawDetection(ctx, det, scaleX, scaleY);
          }
          newImages.push({
            id: `${Date.now()}-${Math.random()}`,
            name: file.name.replace(/\.[^.]+$/, ""),
            imageUrl: url,
            canvas,
            faceCount: res.detections.length,
          });
        }
        setImages((prev) => [...prev, ...newImages]);
      } catch (err) {
        console.error(err);
        setError(t("errors.detect"));
      } finally {
        setProcessing(false);
      }
    },
    [getDetector, t]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) void addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const downloadOne = useCallback((image: ProcessedImage) => {
    image.canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${image.name}-faces.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, "image/png");
  }, []);

  const downloadAll = useCallback(async () => {
    if (images.length === 0) return;
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (const image of images) {
      const blob: Blob = await new Promise((resolve, reject) => {
        image.canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
      });
      zip.file(`${image.name}-faces.png`, blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "face-detection-results.zip";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, [images]);

  const totalFaces = images.reduce((sum, img) => sum + img.faceCount, 0);

  return (
    <ToolLayout
      title={t("title")}
      slug="face-detector"
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
            if (e.dataTransfer.files?.length)
              void addFiles(Array.from(e.dataTransfer.files));
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
            multiple
            className="hidden"
            onChange={handleInput}
          />
        </div>

        {status === "loading" && (
          <p className="text-center text-sm text-zinc-400">
            {t("status.loading")}
          </p>
        )}
        {status === "error" && (
          <p className="text-center text-sm text-red-500">{t("errors.model")}</p>
        )}
        {processing && (
          <p className="text-center text-sm text-zinc-400">{t("status.processing")}</p>
        )}
        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        {images.length > 0 && (
          <>
            {/* Info bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <span className="text-sm text-zinc-300">
                {t("info.summary", { images: images.length, faces: totalFaces })}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => void downloadAll()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                  {t("buttons.downloadAll")}
                </button>
                <button
                  onClick={() => setImages([])}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  {t("buttons.clear")}
                </button>
              </div>
            </div>

            {/* Result grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                >
                  <div className="flex items-center justify-center bg-zinc-950 p-2">
                    <canvas
                      width={image.canvas.width}
                      height={image.canvas.height}
                      className="max-h-64 w-auto max-w-full"
                      ref={(el) => {
                        if (el) {
                          const ctx = el.getContext("2d");
                          if (ctx) ctx.drawImage(image.canvas, 0, 0);
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs text-zinc-300">{image.name}</p>
                      <p className="text-[11px] text-zinc-500">
                        {t("info.facesInImage", { count: image.faceCount })}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        onClick={() => downloadOne(image)}
                        className="rounded bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700"
                      >
                        {t("buttons.download")}
                      </button>
                      <button
                        onClick={() => removeImage(image.id)}
                        aria-label={t("buttons.remove")}
                        className="rounded bg-red-900/50 px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-900"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

function drawDetection(
  ctx: CanvasRenderingContext2D,
  det: Detection,
  scaleX: number,
  scaleY: number
) {
  const box = det.boundingBox;
  if (!box) return;
  const score = det.categories[0]?.score ?? 0;
  const x = box.originX * scaleX;
  const y = box.originY * scaleY;
  const w = box.width * scaleX;
  const h = box.height * scaleY;

  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = Math.max(2, Math.min(w, h) / 40);
  ctx.strokeRect(x, y, w, h);

  // Confidence label
  ctx.font = `${Math.max(12, ctx.lineWidth * 2.6)}px sans-serif`;
  ctx.fillStyle = "rgba(34, 197, 94, 0.9)";
  const label = `${Math.round(score * 100)}%`;
  const tw = ctx.measureText(label).width;
  const ly = y - ctx.lineWidth - 4;
  ctx.fillRect(x, ly, tw + 8, Math.max(14, ctx.lineWidth * 2.6) + 6);
  ctx.fillStyle = "#052e16";
  ctx.fillText(label, x + 4, ly + Math.max(14, ctx.lineWidth * 2.6));

  // Keypoints (eyes, ears, nose, mouth corners)
  ctx.fillStyle = "#3b82f6";
  for (const kp of det.keypoints) {
    const kx = kp.x * scaleX;
    const ky = kp.y * scaleY;
    ctx.beginPath();
    ctx.arc(kx, ky, Math.max(2, ctx.lineWidth * 0.6), 0, Math.PI * 2);
    ctx.fill();
  }
}
