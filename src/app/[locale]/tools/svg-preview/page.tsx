"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const svgToDataUrl = (code: string) =>
  `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(code)))}`;

export default function SvgPreviewPage() {
  const t = useTranslations("tools.svg-preview");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [code, setCode] = useState(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect x="10" y="10" width="180" height="180" rx="20" fill="#4f46e5"/>
  <circle cx="100" cy="100" r="60" fill="#ffffff" opacity="0.9"/>
  <text x="100" y="112" text-anchor="middle" font-size="32" font-family="sans-serif" fill="#4f46e5">SVG</text>
</svg>`);

  const preview = useMemo(() => {
    try {
      return svgToDataUrl(code);
    } catch {
      return "";
    }
  }, [code]);

  const handleDownload = () => {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = "preview.svg";
    a.click();
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="svg-preview"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.code")}</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={16}
            spellCheck={false}
            className={`${inputCls} font-mono`}
          />
          <button
            onClick={handleDownload}
            disabled={!preview}
            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
          >
            {t("buttons.download")}
          </button>
        </div>
        <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={t("labels.preview")} className="max-h-[480px] w-full object-contain" />
          ) : (
            <p className="text-sm text-red-400">{t("errors.invalid")}</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
