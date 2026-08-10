"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const activityFactors: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export default function TdeeCalculatorPage() {
  const t = useTranslations("tools.tdee-calculator");
  const [bmr, setBmr] = useState("");
  const [activity, setActivity] = useState("sedentary");
  const [tdee, setTdee] = useState<string | null>(null);

  const calculate = () => {
    const b = parseFloat(bmr);
    if (Number.isNaN(b) || b <= 0) {
      setTdee(null);
      return;
    }

    setTdee(Math.round(b * activityFactors[activity]).toLocaleString());
  };

  const activityLevels = ["sedentary", "light", "moderate", "active", "veryActive"];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="tdee-calculator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.bmr")}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={bmr}
              onChange={(e) => setBmr(e.target.value)}
              placeholder="1800"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.activityLevel")}
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            >
              {activityLevels.map((level) => (
                <option key={level} value={level}>
                  {t(`options.${level}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          {t("buttons.calculate")}
        </button>

        {tdee && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.tdee")}
              </h3>
              <CopyButton text={tdee} className="text-xs px-2 py-1" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{tdee}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
