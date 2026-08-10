"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function SimpleInterestCalculatorPage() {
  const t = useTranslations("tools.simple-interest-calculator");
  const [principal, setPrincipal] = useState("1000");
  const [rate, setRate] = useState("5");
  const [time, setTime] = useState("3");

  const p = parseFloat(principal);
  const r = parseFloat(rate);
  const years = parseFloat(time);

  const valid =
    !Number.isNaN(p) && !Number.isNaN(r) && !Number.isNaN(years) && years >= 0;

  const interest = valid ? (p * r * years) / 100 : 0;
  const total = valid ? p + interest : 0;

  const fmt = (v: number) =>
    v.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="simple-interest-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
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
              placeholder="1000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.rate")}
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
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
              min="0"
              step="0.5"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="3"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {valid && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.interest")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-blue-400">
                    {fmt(interest)}
                  </p>
                  <CopyButton text={fmt(interest)} className="text-xs px-2 py-1" />
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.total")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-blue-400">
                    {fmt(total)}
                  </p>
                  <CopyButton text={fmt(total)} className="text-xs px-2 py-1" />
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-500">
              {t("labels.formula", { principal: fmt(p), rate: r, time: years, interest: fmt(interest) })}
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
