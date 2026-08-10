"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import * as ort from "onnxruntime-web";

const MODEL_URL =
  "https://huggingface.co/webnn/mobilenet-v2/resolve/main/onnx/mobilenetv2-10_fp16.onnx";
const LABELS_URL =
  "https://cdn.jsdelivr.net/gh/pytorch/hub@master/imagenet_classes.txt";
const ORT_CDN = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/";
const INPUT_SIZE = 224;
const TOP_K = 5;

interface Prediction {
  label: string;
  probability: number;
}

export default function ImageClassifyPage() {
  const t = useTranslations("tools.image-classify");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [processing, setProcessing] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [error, setError] = useState("");

  const sessionRef = useRef<ort.InferenceSession | null>(null);
  const labelsRef = useRef<string[] | null>(null);

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

  const getLabels = useCallback(async () => {
    if (labelsRef.current) return labelsRef.current;
    try {
      const res = await fetch(LABELS_URL);
      const text = await res.text();
      labelsRef.current = text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    } catch {
      labelsRef.current = [];
    }
    return labelsRef.current;
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setPredictions([]);
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
        setPredictions([]);
        setError("");
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const classify = useCallback(async () => {
    if (!img || processing) return;
    setProcessing(true);
    setError("");
    setPredictions([]);
    try {
      const [session, labels] = await Promise.all([getSession(), getLabels()]);

      // Preprocess: resize to 224x224, RGB -> CHW, normalized /255.
      const canvas = document.createElement("canvas");
      canvas.width = INPUT_SIZE;
      canvas.height = INPUT_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no ctx");
      ctx.drawImage(img, 0, 0, INPUT_SIZE, INPUT_SIZE);
      const data = ctx.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE).data;
      const input = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE);
      for (let i = 0; i < INPUT_SIZE * INPUT_SIZE; i++) {
        input[i] = data[i * 4] / 255;
        input[INPUT_SIZE * INPUT_SIZE + i] = data[i * 4 + 1] / 255;
        input[2 * INPUT_SIZE * INPUT_SIZE + i] = data[i * 4 + 2] / 255;
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
      const logits = Array.from(
        outputs[session.outputNames[0]].data as Float32Array
      );

      // Softmax.
      const max = Math.max(...logits);
      const exp = logits.map((v) => Math.exp(v - max));
      const sum = exp.reduce((a, b) => a + b, 0);
      const probs = exp.map((v) => v / sum);

      // Top K.
      const indexed = probs
        .map((p, i) => ({ p, i }))
        .sort((a, b) => b.p - a.p)
        .slice(0, TOP_K);
      const results: Prediction[] = indexed.map(({ p, i }) => ({
        label:
          labels[i] ?? t("labels.class", { index: i }),
        probability: p,
      }));
      setPredictions(results);
    } catch (err) {
      console.error(err);
      setError(t("errors.classify"));
    } finally {
      setProcessing(false);
    }
  }, [img, processing, getSession, getLabels, t]);

  const handleNewImage = () => {
    setImg(null);
    setPredictions([]);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-classify"
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
            onClick={() => document.getElementById("icls-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🏷️</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="icls-in"
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
                onClick={() => void classify()}
                disabled={processing || status === "loading"}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing
                  ? t("status.processing")
                  : status === "loading"
                    ? t("status.loading")
                    : t("buttons.classify")}
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

            <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt="Original"
                className="max-h-96 w-auto max-w-full rounded border border-zinc-800"
              />
            </div>

            {predictions.length > 0 && (
              <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-sm font-medium text-zinc-300">
                  {t("labels.topPredictions")}
                </p>
                {predictions.map((p, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize text-zinc-200">
                        {i + 1}. {p.label}
                      </span>
                      <span className="font-mono text-zinc-400">
                        {(p.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${Math.min(100, p.probability * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
