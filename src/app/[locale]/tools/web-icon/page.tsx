"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function WebIconPage() {
  const t = useTranslations("tools.web-icon");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [domain, setDomain] = useState("toolkitlife.com");
  const [lookup, setLookup] = useState("toolkitlife.com");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = () => {
    const d = domain.trim().toLowerCase();
    if (!d) return;
    setLookup(d);
    setLoaded(false);
    setError("");
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/favicon?domain=${encodeURIComponent(lookup)}`);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${lookup}-icon.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch {
      setError(t("errors.failed"));
    }
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="web-icon"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-2xl space-y-4">
        <div className="flex gap-2">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            placeholder="example.com"
            className={inputCls}
          />
          <button onClick={handleFetch} className={`${btn} shrink-0 bg-blue-600 text-white hover:bg-blue-500`}>
            {t("buttons.fetch")}
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {lookup && (
          <div className="flex items-center gap-6 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/favicon?domain=${encodeURIComponent(lookup)}`}
              alt={lookup}
              onLoad={() => setLoaded(true)}
              onError={() => setError(t("errors.failed"))}
              className="h-24 w-24 rounded border border-zinc-700 bg-white p-1 object-contain"
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-200">{lookup}</p>
              <p className="text-sm text-zinc-500">{t("labels.size")}: 256 × 256 px</p>
              <button onClick={() => void handleDownload()} disabled={!loaded} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>
                {t("buttons.download")}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
