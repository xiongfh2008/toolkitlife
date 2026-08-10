"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

type DetectorStatus = "idle" | "loading" | "ready" | "error";

export default function FaceBlurPage() {
  const t = useTranslations("tools.face-blur");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<DetectorStatus>("idle");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState("");
  const [faceCount, setFaceCount] = useState(0);
  const [blurStrength, setBlurStrength] = useState(25);
  const [error, setError] = useState("");

  const detectorRef = useRef<FaceDetector | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultUrlRef = useRef("");

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
        setResult("");
        setError("");
        setFaceCount(0);
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
        setResult("");
        setError("");
        setFaceCount(0);
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const drawBlurredFaces = useCallback(
    async (image: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = Math.min(image.naturalWidth, 4096);
      const h = Math.min(image.naturalHeight, 4096);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Keep a pristine copy of the image as the blur source.
      const src = document.createElement("canvas");
      src.width = w;
      src.height = h;
      const sctx = src.getContext("2d");
      if (!sctx) return;
      sctx.drawImage(image, 0, 0, w, h);
      ctx.drawImage(src, 0, 0);

      const detector = await getDetector();
      const res = detector.detect(canvas);
      const boxes = res.detections
        .map((d) => d.boundingBox)
        .filter((b): b is NonNullable<typeof b> => Boolean(b));

      for (const box of boxes) {
        const x = box.originX;
        const y = box.originY;
        const bw = box.width;
        const bh = box.height;
        const blur = Math.max(6, (Math.min(bw, bh) * blurStrength) / 100);
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, bw, bh);
        ctx.clip();
        ctx.filter = `blur(${blur}px)`;
        ctx.drawImage(src, x, y, bw, bh, x, y, bw, bh);
        ctx.restore();
      }
      setFaceCount(boxes.length);

      canvas.toBlob((blob) => {
        if (!blob) return;
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
        const url = URL.createObjectURL(blob);
        resultUrlRef.current = url;
        setResult(url);
      }, "image/png");
    },
    [getDetector, blurStrength]
  );

  const handleBlur = useCallback(async () => {
    if (!img || processing) return;
    setProcessing(true);
    setError("");
    try {
      await drawBlurredFaces(img);
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setProcessing(false);
    }
  }, [img, processing, drawBlurredFaces, t]);

  const handleNewImage = () => {
    setImg(null);
    setResult("");
    setError("");
    setFaceCount(0);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = "face-blurred.png";
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="face-blur"
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
            onClick={() => document.getElementById("fb-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🙈</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="fb-in"
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
                {t("labels.blurStrength")}: {blurStrength}%
              </label>
              <input
                type="range"
                min={5}
                max={100}
                value={blurStrength}
                onChange={(e) => setBlurStrength(parseInt(e.target.value, 10))}
                className="w-full max-w-xs accent-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void handleBlur()}
                disabled={processing || status === "loading"}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing
                  ? t("status.processing")
                  : status === "loading"
                    ? t("status.loading")
                    : t("buttons.blur")}
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
            {faceCount > 0 && (
              <p className="text-sm text-zinc-400">
                {t("labels.facesBlurred", { count: faceCount })}
              </p>
            )}

            {!result && (
              <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt="Original"
                  className="max-w-full rounded border border-zinc-800"
                />
              </div>
            )}

            {result && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-300">
                    {t("labels.original")} / {t("labels.result")}
                  </p>
                  <button
                    onClick={handleDownload}
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
                  <div className="overflow-hidden rounded-lg border border-zinc-800">
                    <canvas
                      ref={canvasRef}
                      className="w-full"
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
