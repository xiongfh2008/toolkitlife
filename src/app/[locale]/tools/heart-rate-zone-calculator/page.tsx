"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const ZONES = [
  { key: "zone1", min: 0.5, max: 0.6 },
  { key: "zone2", min: 0.6, max: 0.7 },
  { key: "zone3", min: 0.7, max: 0.8 },
  { key: "zone4", min: 0.8, max: 0.9 },
  { key: "zone5", min: 0.9, max: 1.0 },
];

export default function HeartRateZoneCalculatorPage() {
  const t = useTranslations("tools.heart-rate-zone-calculator");
  const [age, setAge] = useState("30");
  const [resting, setResting] = useState("60");

  const result = useMemo(() => {
    const a = parseFloat(age);
    const r = parseFloat(resting);

    if (Number.isNaN(a) || Number.isNaN(r) || a <= 0 || r <= 0 || r >= 220 - a) {
      return null;
    }

    const maxHeartRate = 220 - a;
    const reserve = maxHeartRate - r;

    const zones = ZONES.map((zone) => ({
      key: zone.key,
      min: Math.round(reserve * zone.min + r),
      max: Math.round(reserve * zone.max + r),
    }));

    return { maxHeartRate, zones };
  }, [age, resting]);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="heart-rate-zone-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.age")}
            </label>
            <input
              type="number"
              min="1"
              max="120"
              step="1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.restingHeartRate")}
            </label>
            <input
              type="number"
              min="30"
              max="220"
              step="1"
              value={resting}
              onChange={(e) => setResting(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-sm text-zinc-400">{t("labels.maxHeartRate")}</p>
              <p className="text-3xl font-bold text-blue-400">
                {result.maxHeartRate} {t("labels.bpm")}
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900 text-zinc-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t("labels.zone")}</th>
                    <th className="px-4 py-3 font-medium">{t("labels.range")}</th>
                    <th className="px-4 py-3 font-medium">{t("labels.bpm")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-800/50">
                  {result.zones.map((zone) => (
                    <tr key={zone.key}>
                      <td className="px-4 py-3 font-medium text-zinc-200">
                        {t(`options.${zone.key}`)}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {`${Math.round(zone.min / result.maxHeartRate * 100)}% - ${Math.round(zone.max / result.maxHeartRate * 100)}%`}
                      </td>
                      <td className="px-4 py-3 text-zinc-200">
                        {zone.min} - {zone.max}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
