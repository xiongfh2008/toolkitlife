"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const MAX_DIM = 3000;
const SIZES = [16, 32, 48, 64, 128, 256, 512];

export default function IconSizeGeneratorPage() {
  const t = useTranslations("tools.icon-size-generator");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [selected, setSelected] = useState<number[]>(SIZES);
  const [icons, setIcons] = useState<{ size: number; url: string }[]>([]);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => setImg(image);
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

  const generate = useCallback(() => {
    if (!img) return;
    const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
    const iw = Math.round(img.naturalWidth * scale);
    const ih = Math.round(img.naturalHeight * scale);
    const list = selected.map((size) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.clearRect(0, 0, size, size);
      // Cover-fit the image into the square.
      const s = Math.max(size / iw, size / ih);
      const dw = iw * s;
      const dh = ih * s;
      ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
      return { size, url: canvas.toDataURL("image/png") };
    });
    setIcons(list.filter(Boolean) as { size: number; url: string }[]);
  }, [img, selected]);

  useEffect(() => {
    if (img) generate();
  }, [img, generate]);

  const handleNewImage = () => {
    setImg(null);
    setIcons([]);
  };

  const handleDownload = (url: string, size: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `icon-${size}px.png`;
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="icon-size-generator"
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
            onClick={() => document.getElementById("icon-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">📱</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input id="icon-in" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.sizes")}</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <label
                    key={s}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ${selected.includes(s) ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300"}`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(s)}
                      onChange={(e) =>
                        setSelected(e.target.checked ? [...selected, s].sort((a, b) => a - b) : selected.filter((x) => x !== s))
                      }
                      className="hidden"
                    />
                    {s}px
                  </label>
                ))}
              </div>
            </div>

            {icons.length > 0 && (
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                {icons.map(({ size, url }) => (
                  <div key={size} className="flex flex-col items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`${size}px`} width={Math.min(size, 96)} height={Math.min(size, 96)} />
                    <span className="text-xs text-zinc-500">{size}px</span>
                    <button
                      onClick={() => handleDownload(url, size)}
                      className="w-full bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-blue-600 hover:text-white"
                    >
                      {t("buttons.download")}
                    </button>
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
