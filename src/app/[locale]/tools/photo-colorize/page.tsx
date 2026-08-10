"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import * as ort from "onnxruntime-web";

const MODEL_URL =
  "https://cdn.glitch.me/2046b88b-673a-457f-b1b8-7169ce9bf13a/deoldify-quant.onnx";
const ORT_CDN = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/";
const INPUT_SIZE = 256;

export default function PhotoColorizePage() {
  const t = useTranslations("tools.photo-colorize");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const sessionRef = useRef<ort.InferenceSession | null>(null);
  const resultUrlRef = useRef("");

  const getSession = useCallback(async () => {
    if (sessionRef.current) return sessionRef.current;
    setStatus("loading");
    try {
      ort.env.wasm.wasmPaths = ORT_CDN;
      const session = await ort.InferenceSession.create(MODEL_URL, {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      });
      sessionRef.current = session;
      setStatus("ready");
      return session;
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
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const colorize = useCallback(async () => {
    if (!img || processing) return;
    setProcessing(true);
    setError("");
    try {
      const session = await getSession();

      // Preprocess: resize to 256x256 and convert to CHW float32 (0-255).
      const canvas = document.createElement("canvas");
      canvas.width = INPUT_SIZE;
      canvas.height = INPUT_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no ctx");
      ctx.drawImage(img, 0, 0, INPUT_SIZE, INPUT_SIZE);
      const data = ctx.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE).data;
      const input = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE);
      for (let i = 0; i < INPUT_SIZE * INPUT_SIZE; i++) {
        input[i] = data[i * 4]; // R
        input[INPUT_SIZE * INPUT_SIZE + i] = data[i * 4 + 1]; // G
        input[2 * INPUT_SIZE * INPUT_SIZE + i] = data[i * 4 + 2]; // B
      }
      const tensor = new ort.Tensor("float32", input, [
        1,
        3,
        INPUT_SIZE,
        INPUT_SIZE,
      ]);
      const feeds: Record<string, ort.Tensor> = {};
      feeds[session.inputNames[0]] = tensor;
      const outputs = await session.run(feeds);
      const output = outputs[session.outputNames[0]];
      const outData = output.data as Float32Array;
      const [c, h, w] = output.dims.slice(1, 4);

      // Postprocess: CHW -> RGBA ImageData.
      const imageData = ctx.createImageData(w, h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const oi = (y * w + x) * 4;
          imageData.data[oi] = outData[y * w + x]; // R
          imageData.data[oi + 1] = outData[h * w + y * w + x]; // G
          imageData.data[oi + 2] = outData[2 * h * w + y * w + x]; // B
          imageData.data[oi + 3] = 255;
        }
      }
      void c;

      // Compose the final image at original size.
      const outCanvas = document.createElement("canvas");
      outCanvas.width = img.naturalWidth;
      outCanvas.height = img.naturalHeight;
      const octx = outCanvas.getContext("2d");
      if (!octx) throw new Error("no octx");
      const small = document.createElement("canvas");
      small.width = w;
      small.height = h;
      const sctx = small.getContext("2d");
      if (!sctx) throw new Error("no sctx");
      sctx.putImageData(imageData, 0, 0);
      octx.imageSmoothingEnabled = true;
      octx.drawImage(small, 0, 0, w, h, 0, 0, outCanvas.width, outCanvas.height);

      outCanvas.toBlob((blob) => {
        if (!blob) return;
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
        const url = URL.createObjectURL(blob);
        resultUrlRef.current = url;
        setResult(url);
        setProcessing(false);
      }, "image/png");
    } catch (err) {
      console.error(err);
      setError(t("errors.colorize"));
      setProcessing(false);
    }
  }, [img, processing, getSession, t]);

  const handleNewImage = () => {
    setImg(null);
    setResult("");
    setError("");
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = "colorized.png";
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="photo-colorize"
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
            onClick={() => document.getElementById("pc-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🎨</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="pc-in"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void colorize()}
                disabled={processing || status === "loading"}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing
                  ? t("status.processing")
                  : status === "loading"
                    ? t("status.loading")
                    : t("buttons.colorize")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            {status === "loading" && (
              <p className="text-sm text-zinc-400">{t("status.modelNote")}</p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-500">{t("errors.model")}</p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}

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
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result}
                      alt="Result"
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
