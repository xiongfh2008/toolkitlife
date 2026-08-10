"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const TRANSFORMERS_CDN =
  "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.mjs";
const MODEL_ID = "Xenova/vit-gpt2-image-captioning";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pipelineRef: any = null;

export default function ImageCaptionPage() {
  const t = useTranslations("tools.image-caption");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [processing, setProcessing] = useState(false);
  const [caption, setCaption] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [modelNote, setModelNote] = useState("");

  const objectUrlRef = useRef("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    const image = new Image();
    image.onload = () => {
      setImg(image);
      setCaption("");
      setError("");
    };
    image.src = url;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    const image = new Image();
    image.onload = () => {
      setImg(image);
      setCaption("");
      setError("");
    };
    image.src = url;
  };

  const getCaptioner = useCallback(async () => {
    if (pipelineRef) return pipelineRef;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = await import(TRANSFORMERS_CDN as string);
    mod.env.allowLocalModels = false;
    pipelineRef = await mod.pipeline("image-to-text", MODEL_ID);
    return pipelineRef;
  }, []);

  const generate = useCallback(async () => {
    if (!img || processing) return;
    setProcessing(true);
    setCaption("");
    setError("");
    try {
      setModelNote(t("status.modelNote"));
      const captioner = await getCaptioner();
      const output = await captioner(img.src, { max_new_tokens: 40 });
      const text = output?.[0]?.generated_text ?? "";
      setCaption(String(text).trim());
      setModelNote("");
    } catch (err) {
      console.error(err);
      setError(t("errors.generate"));
      setModelNote("");
    } finally {
      setProcessing(false);
    }
  }, [img, processing, getCaptioner, t]);

  const handleNewImage = () => {
    setImg(null);
    setCaption("");
    setError("");
    setModelNote("");
  };

  const copyCaption = async () => {
    if (!caption) return;
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-caption"
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
            onClick={() => document.getElementById("icap-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">💬</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="icap-in"
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
                onClick={() => void generate()}
                disabled={processing}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing ? t("status.processing") : t("buttons.generate")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            {modelNote && (
              <p className="text-sm text-zinc-400">{modelNote}</p>
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

            {caption && (
              <div className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-300">
                    {t("labels.result")}
                  </p>
                  <button
                    onClick={() => void copyCaption()}
                    className="rounded bg-zinc-800 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700"
                  >
                    {copied ? t("labels.copied") : t("buttons.copy")}
                  </button>
                </div>
                <p className="text-lg italic text-zinc-100">“{caption}”</p>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
