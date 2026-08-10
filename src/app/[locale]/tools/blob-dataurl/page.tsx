"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function BlobDataurlPage() {
  const t = useTranslations("tools.blob-dataurl");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [blobUrl, setBlobUrl] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");
  const blobUrlRef = useRef("");

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrlResult = reader.result as string;
      const blob = new Blob([file], { type: file.type });
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setFileName(file.name);
        setBlobUrl(url);
        setDataUrl(dataUrlResult);
        setError("");
      };
      image.src = dataUrlResult;
    };
    reader.onerror = () => {
      setError(t("errors.process"));
    };
    reader.readAsDataURL(file);
  }, [t]);

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

  const handleNewImage = () => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    blobUrlRef.current = "";
    setImg(null);
    setFileName("");
    setBlobUrl("");
    setDataUrl("");
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="blob-dataurl"
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
            onClick={() => document.getElementById("bd-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">🔗</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="bd-in"
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
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
              <span className="text-xs text-zinc-500">{fileName}</span>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-300">{t("labels.blobUrl")}</p>
                {blobUrl && <CopyButton text={blobUrl} className="text-xs px-2 py-1" />}
              </div>
              <div className="overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <code className="break-all font-mono text-xs text-blue-400">{blobUrl}</code>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-300">{t("labels.dataUrl")}</p>
                {dataUrl && <CopyButton text={dataUrl} className="text-xs px-2 py-1" />}
              </div>
              <div className="max-h-48 overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <code className="break-all font-mono text-xs text-emerald-400">{dataUrl}</code>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-300">{t("labels.preview")}</p>
              <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt="Preview" className="mx-auto max-h-72 rounded" />
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
