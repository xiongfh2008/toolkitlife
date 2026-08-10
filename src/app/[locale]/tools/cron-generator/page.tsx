"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type CronField = "minute" | "hour" | "day" | "month" | "weekday";

const FIELD_RANGES: Record<CronField, { min: number; max: number }> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  day: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  weekday: { min: 0, max: 6 },
};

const PRESETS: Record<string, string> = {
  "* * * * *": "Every minute",
  "0 * * * *": "Every hour",
  "0 0 * * *": "Every day at midnight",
  "0 0 * * 0": "Every Sunday",
  "0 0 1 * *": "Every month",
  "0 0 1 1 *": "Every year",
};

function describeCron(parts: string[]): string {
  const [minute, hour, day, month, weekday] = parts;
  const key = `${minute} ${hour} ${day} ${month} ${weekday}`;
  if (PRESETS[key]) return PRESETS[key];

  const desc: string[] = [];
  if (minute === "*" && hour === "*") desc.push("Every minute");
  else if (minute === "0" && hour === "*") desc.push("Every hour");
  else if (minute === "0" && hour === "0") desc.push("At midnight");
  else desc.push(`At ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`);

  if (day !== "*") desc.push(`on day ${day} of the month`);
  if (month !== "*") desc.push(`in month ${month}`);
  if (weekday !== "*") {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    desc.push(`on ${days[parseInt(weekday, 10)]}`);
  }
  return desc.join(" ") + ".";
}

function getNextRuns(parts: string[], count = 5): Date[] {
  const [minute, hour, day, month, weekday] = parts;
  const runs: Date[] = [];
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
  const max = new Date(now.getFullYear() + 2, 11, 31, 23, 59);
  const check = new Date(start);

  const matches = (value: string, dateValue: number) => value === "*" || parseInt(value, 10) === dateValue;

  while (runs.length < count && check <= max) {
    if (
      matches(minute, check.getMinutes()) &&
      matches(hour, check.getHours()) &&
      matches(day, check.getDate()) &&
      matches(month, check.getMonth() + 1) &&
      matches(weekday, check.getDay())
    ) {
      if (check > now) runs.push(new Date(check));
    }
    check.setMinutes(check.getMinutes() + 1);
  }
  return runs;
}

export default function CronGeneratorPage() {
  const t = useTranslations("tools.cron-generator");
  const [values, setValues] = useState<Record<CronField, string>>({
    minute: "0",
    hour: "0",
    day: "*",
    month: "*",
    weekday: "*",
  });

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const expression = `${values.minute} ${values.hour} ${values.day} ${values.month} ${values.weekday}`;
  const description = describeCron(expression.split(" "));
  const nextRuns = getNextRuns(expression.split(" "));

  const setField = useCallback((field: CronField, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const applyPreset = (preset: string) => {
    const parts = preset.split(" ");
    setValues({
      minute: parts[0],
      hour: parts[1],
      day: parts[2],
      month: parts[3],
      weekday: parts[4],
    });
  };

  const validateField = (field: CronField, value: string): boolean => {
    if (value === "*") return true;
    const num = parseInt(value, 10);
    const { min, max } = FIELD_RANGES[field];
    return !isNaN(num) && num >= min && num <= max && value === String(num);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="cron-generator"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(FIELD_RANGES) as CronField[]).map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium text-zinc-300 capitalize">
                {t(`labels.${field}`)}
              </label>
              <input
                type="text"
                value={values[field]}
                onChange={(e) => setField(field, e.target.value)}
                className={`w-full rounded-lg border bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 ${
                  validateField(field, values[field]) ? "border-zinc-700" : "border-red-700"
                }`}
                spellCheck={false}
              />
              <p className="mt-1 text-xs text-zinc-500">
                {t(`hints.${field}`, { min: FIELD_RANGES[field].min, max: FIELD_RANGES[field].max })}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">{t("labels.expression")}</label>
            <CopyButton text={expression} className="text-xs px-2 py-1" />
          </div>
          <code className="block rounded-lg bg-zinc-900 p-3 font-mono text-sm text-blue-400">
            {expression}
          </code>
          <p className="mt-2 text-sm text-zinc-400">{description}</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">{t("labels.presets")}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PRESETS).map(([preset, label]) => (
              <button
                key={preset}
                onClick={() => applyPreset(preset)}
                className="rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:border-blue-500/40 hover:text-blue-400 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">{t("labels.nextRuns")}</label>
          <ul className="space-y-1 rounded-lg border border-zinc-700 bg-zinc-800 p-4">
            {nextRuns.length > 0 ? (
              nextRuns.map((run, i) => (
                <li key={i} className="text-sm text-zinc-300 font-mono">
                  {run.toLocaleString()}
                </li>
              ))
            ) : (
              <li className="text-sm text-zinc-500">{t("labels.noRuns")}</li>
            )}
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
