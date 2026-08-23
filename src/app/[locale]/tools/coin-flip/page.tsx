"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function CoinFlipPage() {
  const t = useTranslations("tools.coin-flip");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [heads, setHeads] = useState(0);
  const [tails, setTails] = useState(0);
  const [flipping, setFlipping] = useState(false);

  const flip = () => {
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const r: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
      setResult(r);
      if (r === "heads") setHeads((h) => h + 1);
      else setTails((h) => h + 1);
      setFlipping(false);
    }, 500);
  };

  const reset = () => {
    setResult(null);
    setHeads(0);
    setTails(0);
  };

  const total = heads + tails;

  return (
    <ToolLayout
      title={t("title")}
      slug="coin-flip"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="flex flex-col items-center gap-6 py-4">
        <div className={`flex h-40 w-40 items-center justify-center rounded-full border-4 text-5xl transition-transform ${flipping ? "animate-spin" : ""} ${result === "heads" ? "border-yellow-500 text-yellow-400" : result === "tails" ? "border-zinc-400 text-zinc-200" : "border-zinc-700 text-zinc-500"}`}>
          {flipping ? "?" : result ? t(`labels.${result}`) : t("labels.result")}
        </div>
        <div className="flex gap-3">
          <button
            onClick={flip}
            disabled={flipping}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {t("buttons.flip")}
          </button>
          <button onClick={reset} className="rounded-lg border border-zinc-700 px-6 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500">
            {t("buttons.reset")}
          </button>
        </div>
        {total > 0 && (
          <div className="grid w-full max-w-sm grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-zinc-800 p-3">
              <p className="text-2xl font-semibold text-yellow-400">{heads}</p>
              <p className="text-xs text-zinc-400">{t("labels.headsCount")}</p>
            </div>
            <div className="rounded-lg border border-zinc-800 p-3">
              <p className="text-2xl font-semibold text-zinc-200">{tails}</p>
              <p className="text-xs text-zinc-400">{t("labels.tailsCount")}</p>
            </div>
            <div className="rounded-lg border border-zinc-800 p-3">
              <p className="text-2xl font-semibold text-zinc-200">{total}</p>
              <p className="text-xs text-zinc-400">{t("labels.total")}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
