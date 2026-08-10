"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function InterestCalculatorPage() {
  const t = useTranslations("tools.interest-calculator");
  const [mode, setMode] = useState<"simple" | "compound">("simple");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("12");
  const [result, setResult] = useState<{
    interest: string;
    total: string;
  } | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const years = parseFloat(time);
    const n = parseInt(frequency, 10);

    if (
      Number.isNaN(p) ||
      Number.isNaN(r) ||
      Number.isNaN(years) ||
      p < 0 ||
      years <= 0 ||
      n <= 0
    ) {
      setResult(null);
      return;
    }

    let total = p;
    if (mode === "simple") {
      total = p * (1 + (r / 100) * years);
    } else {
      total = p * Math.pow(1 + r / 100 / n, n * years);
    }
    const interest = total - p;

    const fmt = (v: number) =>
      v.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });

    setResult({
      interest: fmt(interest),
      total: fmt(total),
    });
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="interest-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.mode")}
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as "simple" | "compound")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="simple">{t("options.simple")}</option>
              <option value="compound">{t("options.compound")}</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.principal")}
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="10000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.annualRate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="5"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.time")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="10"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          {mode === "compound" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.frequency")}
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="1">{t("options.annually")}</option>
                <option value="2">{t("options.semiannually")}</option>
                <option value="4">{t("options.quarterly")}</option>
                <option value="12">{t("options.monthly")}</option>
                <option value="365">{t("options.daily")}</option>
              </select>
            </div>
          )}
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
              <h3 className="text-sm font-medium text-zinc-300">{t("labels.interestEarned")}</h3>
              <CopyButton text={result.interest} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{result.interest}</p>
            <div>
              <p className="text-sm text-zinc-400">{t("labels.totalAmount")}</p>
              <p className="text-xl font-semibold text-zinc-200">{result.total}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
