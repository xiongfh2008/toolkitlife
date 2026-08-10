"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

interface Prediction {
  className: string;
  probability: number;
}

interface Verdict {
  nsfw: boolean;
  score: number;
}

export default function NsfwDetectionPage() {
  const t = useTranslations("tools.nsfw-detection");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [processing, setProcessing] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [error, setError] = useState("");

  const modelRef = useRef<{ classify: (img: HTMLImageElement) => Promise<Prediction[]> } | null>(null);

  const getModel = useCallback(async () => {
    if (modelRef.current) return modelRef.current;
    setStatus("loading");
    try {
      // Ensure TensorFlow.js is registered before loading the NSFW model.
      await import("@tensorflow/tfjs");
      const nsfwjs = await import("nsfwjs");
      const model = await nsfwjs.load();
      modelRef.current = model;
      setStatus("ready");
      return model;
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
        setPredictions([]);
        setVerdict(null);
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
        setVerdict(null);
        setError("");
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const detect = useCallback(async () => {
    if (!img || processing) return;
    setProcessing(true);
    setError("");
    setPredictions([]);
    setVerdict(null);
    try {
      const model = await getModel();
      const results = await model.classify(img);
      setPredictions(results);
      const score = results
        .filter((p) => p.className === "Porn" || p.className === "Hentai" || p.className === "Sexy")
        .reduce((sum, p) => sum + p.probability, 0);
      setVerdict({ nsfw: score >= 0.5, score });
    } catch (err) {
      console.error(err);
      setError(t("errors.detect"));
    } finally {
      setProcessing(false);
    }
  }, [img, processing, getModel, t]);

  const handleNewImage = () => {
    setImg(null);
    setPredictions([]);
    setVerdict(null);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const classNameLabel = (name: string) => t(`classes.${name.toLowerCase()}`);

  return (
    <ToolLayout
      title={t("title")}
      slug="nsfw-detection"
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
            onClick={() => document.getElementById("nsfw-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🛡️</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="nsfw-in"
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
                onClick={() => void detect()}
                disabled={processing || status === "loading"}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing
                  ? t("status.processing")
                  : status === "loading"
                    ? t("status.loading")
                    : t("buttons.detect")}
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

            {verdict && (
              <div
                className={`rounded-lg border p-4 ${
                  verdict.nsfw
                    ? "border-red-800 bg-red-900/30"
                    : "border-green-800 bg-green-900/30"
                }`}
              >
                <p
                  className={`text-lg font-semibold ${
                    verdict.nsfw ? "text-red-300" : "text-green-300"
                  }`}
                >
                  {verdict.nsfw ? t("verdict.nsfw") : t("verdict.safe")}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {t("verdict.score", {
                    score: (verdict.score * 100).toFixed(1),
                  })}
                </p>
              </div>
            )}

            {predictions.length > 0 && (
              <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-sm font-medium text-zinc-300">
                  {t("labels.classes")}
                </p>
                {predictions.map((p, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize text-zinc-200">
                        {classNameLabel(p.className)}
                      </span>
                      <span className="font-mono text-zinc-400">
                        {(p.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          p.className === "Neutral" || p.className === "Drawing"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                        style={{
                          width: `${Math.min(100, p.probability * 100)}%`,
                        }}
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
