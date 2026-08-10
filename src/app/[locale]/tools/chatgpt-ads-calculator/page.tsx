"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function ChatgptAdsCalculatorPage() {
  const t = useTranslations("tools.chatgpt-ads-calculator");
  const [dailyBudget, setDailyBudget] = useState("");
  const [cpm, setCpm] = useState("8");
  const [ctr, setCtr] = useState("1");
  const [campaignDays, setCampaignDays] = useState("30");
  const [result, setResult] = useState<{
    impressions: string;
    clicks: string;
    totalSpend: string;
    cpc: string;
  } | null>(null);

  const calculate = () => {
    const budget = parseFloat(dailyBudget);
    const cpmValue = parseFloat(cpm);
    const ctrValue = parseFloat(ctr);
    const days = parseFloat(campaignDays);

    if (
      Number.isNaN(budget) ||
      Number.isNaN(cpmValue) ||
      Number.isNaN(ctrValue) ||
      Number.isNaN(days) ||
      budget <= 0 ||
      cpmValue <= 0 ||
      ctrValue < 0 ||
      days <= 0
    ) {
      setResult(null);
      return;
    }

    const totalSpend = budget * days;
    const impressions = (totalSpend / cpmValue) * 1000;
    const clicks = impressions * (ctrValue / 100);
    const cpc = clicks > 0 ? totalSpend / clicks : 0;

    const fmtCurrency = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });

    setResult({
      impressions: Math.round(impressions).toLocaleString(),
      clicks: Math.round(clicks).toLocaleString(),
      totalSpend: fmtCurrency(totalSpend),
      cpc: fmtCurrency(cpc),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="chatgpt-ads-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.dailyBudget")}
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(e.target.value)}
              placeholder="100"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.cpm")}
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={cpm}
              onChange={(e) => setCpm(e.target.value)}
              placeholder="8"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.ctr")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={ctr}
              onChange={(e) => setCtr(e.target.value)}
              placeholder="1"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.campaignDays")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={campaignDays}
              onChange={(e) => setCampaignDays(e.target.value)}
              placeholder="30"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.calculate")}
        </button>

        {result && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.totalSpend")}</h3>
              <CopyButton text={result.totalSpend} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.totalSpend}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.impressions")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.impressions}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.clicks")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.clicks}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.cpc")}</p>
                <p className="text-xl font-semibold text-zinc-200">{result.cpc}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
