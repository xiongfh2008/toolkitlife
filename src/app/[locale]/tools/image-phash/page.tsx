"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { computePhash, type PhashResult } from "@/lib/image-analysis";

export default function ImagePhashPage() {
  const t = useTranslations("tools.image-phash");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [hash, setHash] = useState<PhashResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setHash(null);
        setCopied(false);
        setError("");
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    loadFile(file);
  };

  const process = useCallback(async () => {
    if (!img || processing) return;
    setProcessing(true);
    setError("");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 32, 32);
      const src = ctx.getImageData(0, 0, 32, 32);
      setHash(computePhash(src));
      setCopied(false);
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setProcessing(false);
    }
  }, [img, processing, t]);

  const copyHash = async () => {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash.hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const handleNewImage = () => {
    setImg(null);
    setHash(null);
    setCopied(false);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-phash"
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
            onClick={() => document.getElementById("phash-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🧬</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="phash-in"
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
                onClick={() => void process()}
                disabled={processing}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing ? t("status.processing") : t("buttons.compute")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt="Original"
                className="max-h-80 rounded border border-zinc-800"
              />
            </div>

            {hash && (
              <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-zinc-300">{t("labels.phash")}</p>
                  <button
                    onClick={() => void copyHash()}
                    className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
                  >
                    {copied ? t("labels.copied") : t("buttons.copy")}
                  </button>
                </div>
                <p className="break-all font-mono text-sm text-blue-400">{hash.hex}</p>
                <div>
                  <p className="mb-1 text-xs text-zinc-500">{t("labels.binary")}</p>
                  <p className="break-all font-mono text-[11px] leading-relaxed text-zinc-400">
                    {hash.bin}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
