"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

export default function AdsenseCalculatorPage() {
  const t = useTranslations("tools.adsense-calculator");
  const [pageviews, setPageviews] = useState("10000");
  const [adsPerPage, setAdsPerPage] = useState("2");
  const [ctr, setCtr] = useState("1");
  const [cpc, setCpc] = useState("0.5");

  const num = (s: string, fallback = 0) => {
    const n = parseFloat(s);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };

  const pv = num(pageviews);
  const a = num(adsPerPage);
  const c = num(ctr) / 100;
  const cp = num(cpc);

  const daily = pv * a * c * cp;
  const monthly = daily * 30;
  const yearly = daily * 365;

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  const cards = [
    { key: "daily", value: fmt(daily) },
    { key: "monthly", value: fmt(monthly) },
    { key: "yearly", value: fmt(yearly) },
  ];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="adsense-calculator"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.dailyPageviews")}</label>
            <input
              type="number"
              min="0"
              value={pageviews}
              onChange={(e) => setPageviews(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.adsPerPage")}</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={adsPerPage}
              onChange={(e) => setAdsPerPage(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.ctr")}</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={ctr}
              onChange={(e) => setCtr(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.cpc")}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cpc}
              onChange={(e) => setCpc(e.target.value)}
              className={inputCls}
            />
          </div>
          <p className="text-xs text-zinc-500">{t("messages.disclaimer")}</p>
        </div>
        <div className="space-y-4">
          {cards.map((card) => (
            <div
              key={card.key}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4"
            >
              <div className="text-sm text-zinc-400">{t(`labels.${card.key}`)}</div>
              <div className="mt-1 text-2xl font-bold text-emerald-400">{card.value}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
