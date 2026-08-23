"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function HeicPage() {
  const t = useTranslations("tools.heic");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [fileName, setFileName] = useState("converted");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [format, setFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convert = useCallback(
    async (file: File) => {
      setError("");
      setResultUrl(null);
      const isHeic = /\.heic$/i.test(file.name) || file.type === "image/heic";
      if (!isHeic) {
        setError(t("errors.type"));
        return;
      }
      setConverting(true);
      try {
        const { default: heic2any } = await import("heic2any");
        const out = await heic2any({ blob: file, toType: format, quality: 0.9 });
        const blob = Array.isArray(out) ? out[0] : out;
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(URL.createObjectURL(blob));
        setFileName(file.name.replace(/\.heic$/i, "") || "converted");
      } catch (e) {
        console.error(e);
        setError(t("errors.failed"));
      } finally {
        setConverting(false);
      }
    },
    [format, resultUrl, t],
  );

  const handleDownload = () => {
    if (!resultUrl) return;
    const ext = format === "image/jpeg" ? "jpg" : "png";
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${fileName}.${ext}`;
    a.click();
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="heic"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-3xl space-y-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) void convert(f);
          }}
          onDragOver={(e) => e.preventDefault()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
        >
          <div className="mb-4 text-4xl">📱</div>
          <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
          <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".heic,image/heic"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void convert(f);
              e.target.value = "";
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            {t("labels.outputFormat")}
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as typeof format)}
              className="rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
            >
              <option value="image/jpeg">JPG</option>
              <option value="image/png">PNG</option>
            </select>
          </label>
          {converting && <span className="text-sm text-zinc-500">{t("labels.converting")}</span>}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}

        {resultUrl && (
          <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultUrl} alt={fileName} className="mx-auto max-h-96 rounded" />
            <div className="flex justify-end">
              <button onClick={handleDownload} className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}>
                {t("buttons.download")}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
