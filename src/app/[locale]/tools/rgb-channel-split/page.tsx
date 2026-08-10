"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { splitChannels } from "@/lib/image-analysis";

const MAX_DIM = 2500;

export default function RgbChannelSplitPage() {
  const t = useTranslations("tools.rgb-channel-split");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [processing, setProcessing] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const redRef = useRef<HTMLCanvasElement>(null);
  const greenRef = useRef<HTMLCanvasElement>(null);
  const blueRef = useRef<HTMLCanvasElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setReady(false);
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
      const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const src = document.createElement("canvas");
      src.width = w;
      src.height = h;
      const sctx = src.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;
      sctx.drawImage(img, 0, 0, w, h);
      const imageData = sctx.getImageData(0, 0, w, h);
      const { red, green, blue } = splitChannels(imageData);

      const targets: Array<[HTMLCanvasElement | null, ImageData]> = [
        [redRef.current, red],
        [greenRef.current, green],
        [blueRef.current, blue],
      ];
      for (const [canvas, data] of targets) {
        if (!canvas) continue;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.putImageData(data, 0, 0);
      }
      setReady(true);
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setProcessing(false);
    }
  }, [img, processing, t]);

  const downloadCanvas = (canvas: HTMLCanvasElement | null, channel: string) => {
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `channel-${channel}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, "image/png");
  };

  const handleNewImage = () => {
    setImg(null);
    setReady(false);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const channelCard = (
    label: string,
    canvas: React.RefObject<HTMLCanvasElement | null>,
    color: string,
    channel: string
  ) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color }}>
          {label}
        </p>
        {ready && (
          <button
            onClick={() => downloadCanvas(canvas.current, channel)}
            className="text-xs text-zinc-400 transition-colors hover:text-blue-500"
          >
            {t("buttons.download")}
          </button>
        )}
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
        <canvas ref={canvas} className="w-full" />
      </div>
    </div>
  );

  return (
    <ToolLayout
      title={t("title")}
      slug="rgb-channel-split"
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
            onClick={() => document.getElementById("rgb-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🔴</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="rgb-in"
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
                {processing ? t("status.processing") : t("buttons.split")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-300">{t("labels.original")}</p>
                <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt="Original" className="w-full" />
                </div>
              </div>
              {channelCard(t("labels.red"), redRef, "#ef4444", "red")}
              {channelCard(t("labels.green"), greenRef, "#22c55e", "green")}
              {channelCard(t("labels.blue"), blueRef, "#3b82f6", "blue")}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
