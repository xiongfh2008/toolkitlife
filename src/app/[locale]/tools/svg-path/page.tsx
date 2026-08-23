"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function SvgPathPage() {
  const t = useTranslations("tools.svg-path");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [d, setD] = useState("M50,150 C50,50 150,50 150,150 S250,250 250,150");
  const [stroke, setStroke] = useState("#4f46e5");
  const [fill, setFill] = useState("#ffffff");
  const [sw, setSw] = useState(3);

  const svg = useMemo(
    () => `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <path d="${d.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>
</svg>`,
    [d, stroke, fill, sw],
  );

  const dataUrl = useMemo(
    () => `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`,
    [svg],
  );

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "path.svg";
    a.click();
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="svg-path"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.pathD")}</label>
            <textarea
              value={d}
              onChange={(e) => setD(e.target.value)}
              rows={4}
              spellCheck={false}
              className={`${inputCls} font-mono`}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.stroke")}</label>
              <input type="color" value={stroke} onChange={(e) => setStroke(e.target.value)} className="h-10 w-full cursor-pointer rounded border border-zinc-700 bg-transparent" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.fill")}</label>
              <input type="color" value={fill} onChange={(e) => setFill(e.target.value)} className="h-10 w-full cursor-pointer rounded border border-zinc-700 bg-transparent" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.width")}</label>
              <input type="number" min={0} max={20} value={sw} onChange={(e) => setSw(Number(e.target.value) || 0)} className={inputCls} />
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            {t("buttons.download")}
          </button>
        </div>
        <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUrl} alt={t("labels.preview")} className="max-h-[420px] w-full object-contain" />
        </div>
      </div>
    </ToolLayout>
  );
}
