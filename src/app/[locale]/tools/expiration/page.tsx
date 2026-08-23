"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function ExpirationPage() {
  const t = useTranslations("tools.expiration");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [producedAt, setProducedAt] = useState("2026-01-01");
  const [days, setDays] = useState(180);
  const [result, setResult] = useState<{ expired: string; left: number; expiredAt: string } | null>(null);

  const calculate = () => {
    const start = new Date(producedAt);
    if (isNaN(start.getTime()) || days <= 0) return;
    const expiredAt = new Date(start.getTime() + days * 86400000);
    const left = Math.ceil((expiredAt.getTime() - Date.now()) / 86400000);
    setResult({
      expiredAt: expiredAt.toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" }),
      left,
      expired: expiredAt < new Date() ? "yes" : "no",
    });
  };

  const inputCls =
    "rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="expiration"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-zinc-400">{t("labels.producedAt")}</label>
          <input type="date" value={producedAt} onChange={(e) => setProducedAt(e.target.value)} className={inputCls} />
          <label className="text-sm text-zinc-400">{t("labels.shelfLife")}</label>
          <input
            type="number"
            value={days}
            min={1}
            onChange={(e) => setDays(Number(e.target.value) || 0)}
            className={inputCls + " w-24"}
          />
          <span className="text-sm text-zinc-400">{t("labels.days")}</span>
          <button onClick={calculate} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500">
            {t("buttons.calculate")}
          </button>
        </div>
        {result && (
          <div className="space-y-3">
            <div className={`rounded-lg border p-4 ${result.expired === "yes" ? "border-red-900 bg-red-950/40" : "border-zinc-800"}`}>
              <p className="text-sm text-zinc-400">{t("labels.expiresAt")}</p>
              <p className={`mt-1 text-xl font-semibold ${result.expired === "yes" ? "text-red-400" : "text-emerald-400"}`}>
                {result.expiredAt}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 p-4">
              <p className="text-sm text-zinc-400">{t("labels.daysLeft")}</p>
              <p className={`mt-1 text-xl font-semibold ${result.left < 0 ? "text-red-400" : "text-blue-400"}`}>
                {result.left < 0 ? t("labels.expiredDays", { count: Math.abs(result.left) }) : `${result.left} ${t("labels.days")}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
