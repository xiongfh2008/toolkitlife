"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import JSZip from "jszip";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

interface ExtractedImage {
  name: string;
  blobUrl: string;
  size: number;
}

const IMG_EXTS = /\.(png|jpe?g|gif|webp|bmp|svg|tiff?|ico|emf|wmf)$/i;

function guessExt(bytes: Uint8Array): string {
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return "png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "jpg";
  if (bytes[0] === 0x47 && bytes[1] === 0x49) return "gif";
  if (bytes[0] === 0x52 && bytes[1] === 0x49) return "webp";
  if (bytes[0] === 0x42 && bytes[1] === 0x4d) return "bmp";
  return "bin";
}

/**
 * Shared extractor for images stored inside OOXML archives
 * (Excel: xl/media/*, PowerPoint: ppt/media/*). Runs fully client-side.
 */
export default function ArchiveImageExtractor({
  slug,
  mediaFolder,
  accept,
  dropIcon,
}: {
  slug: string;
  mediaFolder: string;
  accept: string;
  dropIcon: string;
}) {
  const t = useTranslations(`tools.${slug}`);
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [fileName, setFileName] = useState("archive");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const extract = useCallback(
    async (file: File) => {
      setError("");
      setImages([]);
      setProcessing(true);
      try {
        const zip = await JSZip.loadAsync(file);
        const entries = Object.values(zip.files).filter(
          (f) => !f.dir && f.name.startsWith(`${mediaFolder}/`),
        );
        const out: ExtractedImage[] = [];
        for (const entry of entries) {
          const bytes = await entry.async("uint8array");
          if (bytes.length === 0) continue;
          const base = entry.name.split("/").pop() ?? "image";
          const hasExt = IMG_EXTS.test(base);
          const ext = hasExt ? base.split(".").pop()! : guessExt(bytes);
          if (!hasExt && ext === "bin") continue;
          const name = `${base.replace(/\.[^.]+$/, "")}.${ext}`;
          const blob = new Blob([new Uint8Array(bytes)], { type: `image/${ext === "jpg" ? "jpeg" : ext}` });
          out.push({ name, blobUrl: URL.createObjectURL(blob), size: blob.size });
        }
        if (out.length === 0) {
          setError(t("errors.empty"));
          return;
        }
        setImages(out);
        setFileName(file.name.replace(/\.[^.]+$/, ""));
      } catch (e) {
        console.error(e);
        setError(t("errors.invalid"));
      } finally {
        setProcessing(false);
      }
    },
    [mediaFolder, t],
  );

  const downloadAll = async () => {
    if (images.length === 0) return;
    const zip = new JSZip();
    for (const img of images) {
      const res = await fetch(img.blobUrl);
      const blob = await res.blob();
      zip.file(img.name, blob);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}-images.zip`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug={slug}
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        <div
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) void extract(f);
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById(`${slug}-in`)?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
        >
          <div className="mb-4 text-4xl">{dropIcon}</div>
          <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
          <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
          <input
            id={`${slug}-in`}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void extract(f);
              e.target.value = "";
            }}
          />
        </div>

        {processing && <p className="text-sm text-zinc-500">{t("labels.processing")}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {images.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-300">
                {t("labels.count", { count: images.length })}
              </p>
              <button onClick={() => void downloadAll()} className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}>
                {t("buttons.downloadAll")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.blobUrl} alt={img.name} className="h-32 w-full object-contain" />
                  <div className="px-2 py-1.5">
                    <p className="truncate text-xs text-zinc-500" title={img.name}>
                      {img.name}
                    </p>
                    <a
                      href={img.blobUrl}
                      download={img.name}
                      className="mt-1 block w-full rounded bg-zinc-800 px-2 py-1 text-center text-xs text-zinc-300 hover:bg-blue-600 hover:text-white"
                    >
                      {t("buttons.download")}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
