"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

interface Crop {
  id: string;
  canvas: HTMLCanvasElement;
}

type DetectorStatus = "idle" | "loading" | "ready" | "error";

export default function FaceCropPage() {
  const t = useTranslations("tools.face-crop");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<DetectorStatus>("idle");
  const [processing, setProcessing] = useState(false);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [padding, setPadding] = useState(50);
  const [error, setError] = useState("");

  const detectorRef = useRef<FaceDetector | null>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);

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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setCrops([]);
        setError("");
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setCrops([]);
        setError("");
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const detectAndCrop = useCallback(async () => {
    if (!img || processing) return;
    setProcessing(true);
    setError("");
    try {
      const detector = await getDetector();
      const res = detector.detect(img);
      const boxes = res.detections
        .map((d) => d.boundingBox)
        .filter((b): b is NonNullable<typeof b> => Boolean(b));
      if (boxes.length === 0) {
        setError(t("errors.noFace"));
        setCrops([]);
        return;
      }

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const padRatio = padding / 100;

      // Draw the original image with bounding boxes on the preview canvas.
      const preview = previewRef.current;
      if (preview) {
        preview.width = iw;
        preview.height = ih;
        const ctx = preview.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          ctx.strokeStyle = "#22c55e";
          ctx.lineWidth = Math.max(2, Math.min(iw, ih) / 300);
          for (const b of boxes) {
            ctx.strokeRect(b.originX, b.originY, b.width, b.height);
          }
        }
      }

      const list: Crop[] = [];
      for (const b of boxes) {
        const cx = b.originX + b.width / 2;
        const cy = b.originY + b.height / 2;
        const size = Math.max(b.width, b.height) * (1 + padRatio);
        let sx = Math.floor(cx - size / 2);
        let sy = Math.floor(cy - size / 2);
        let sw = Math.floor(size);
        let sh = Math.floor(size);
        if (sx < 0) sx = 0;
        if (sy < 0) sy = 0;
        if (sx + sw > iw) sw = iw - sx;
        if (sy + sh > ih) sh = ih - sy;

        const canvas = document.createElement("canvas");
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
        list.push({ id: `${Date.now()}-${Math.random()}`, canvas });
      }
      setCrops(list);
    } catch (err) {
      console.error(err);
      setError(t("errors.detect"));
    } finally {
      setProcessing(false);
    }
  }, [img, processing, getDetector, padding, t]);

  const downloadOne = useCallback((crop: Crop, index: number) => {
    crop.canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `face-${index + 1}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, "image/png");
  }, []);

  const downloadAll = useCallback(async () => {
    if (crops.length === 0) return;
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (let i = 0; i < crops.length; i++) {
      const blob: Blob = await new Promise((resolve, reject) => {
        crops[i].canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
          "image/png"
        );
      });
      zip.file(`face-${i + 1}.png`, blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "face-crops.zip";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, [crops]);

  const handleNewImage = () => {
    setImg(null);
    setCrops([]);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="face-crop"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {!img ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("fc-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">📷</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="fc-in"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-zinc-400">
                {t("labels.padding")}: {padding}%
              </label>
              <input
                type="range"
                min={0}
                max={150}
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value, 10))}
                className="w-full max-w-xs accent-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void detectAndCrop()}
                disabled={processing || status === "loading"}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing
                  ? t("status.processing")
                  : status === "loading"
                    ? t("status.loading")
                    : t("buttons.crop")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            {status === "error" && (
              <p className="text-sm text-red-500">{t("errors.model")}</p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <canvas
                ref={previewRef}
                className="max-w-full rounded border border-zinc-800"
              />
            </div>

            {crops.length > 0 && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-zinc-300">
                    {t("labels.found", { count: crops.length })}
                  </p>
                  <button
                    onClick={() => void downloadAll()}
                    className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
                  >
                    {t("buttons.downloadAll")}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {crops.map((crop, i) => (
                    <div
                      key={crop.id}
                      className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                    >
                      <div className="flex items-center justify-center bg-zinc-950 p-2">
                        <canvas
                          width={crop.canvas.width}
                          height={crop.canvas.height}
                          className="max-h-48 w-auto max-w-full"
                          ref={(el) => {
                            if (el) {
                              const ctx = el.getContext("2d");
                              if (ctx) ctx.drawImage(crop.canvas, 0, 0);
                            }
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between p-2">
                        <span className="text-xs text-zinc-400">
                          {t("labels.face")} {i + 1}
                        </span>
                        <button
                          onClick={() => downloadOne(crop, i)}
                          className="rounded bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700"
                        >
                          {t("buttons.download")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
