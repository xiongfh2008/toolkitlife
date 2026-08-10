"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());
  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

export default function TimestampConverterPage() {
  const t = useTranslations("tools.timestamp-converter");
  const [timestamp, setTimestamp] = useState<string>(() => String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");
  const [datetime, setDatetime] = useState<string>("");
  const [error, setError] = useState("");
  const [current, setCurrent] = useState<number>(() => Date.now());

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  useEffect(() => {
    const id = setInterval(() => setCurrent(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const convertToDate = useCallback((ts: string) => {
    const trimmed = ts.trim();
    if (!trimmed) {
      setError(t("labels.empty"));
      setDatetime("");
      return;
    }
    const num = Number(trimmed);
    if (isNaN(num)) {
      setError(t("labels.invalid"));
      setDatetime("");
      return;
    }
    const ms = unit === "seconds" ? num * 1000 : num;
    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      setError(t("labels.invalid"));
      setDatetime("");
      return;
    }
    setDatetime(toLocalInputValue(date));
    setError("");
  }, [unit, t]);

  const convertToTimestamp = useCallback(() => {
    if (!datetime) {
      setError(t("labels.empty"));
      setTimestamp("");
      return;
    }
    const date = new Date(datetime);
    if (isNaN(date.getTime())) {
      setError(t("labels.invalid"));
      setTimestamp("");
      return;
    }
    const value = unit === "seconds" ? Math.floor(date.getTime() / 1000) : date.getTime();
    setTimestamp(String(value));
    setError("");
  }, [datetime, unit, t]);

  const useCurrent = () => {
    const now = Date.now();
    if (unit === "seconds") {
      setTimestamp(String(Math.floor(now / 1000)));
    } else {
      setTimestamp(String(now));
    }
    setDatetime(toLocalInputValue(new Date(now)));
    setError("");
  };

  const handleTimestampChange = (value: string) => {
    setTimestamp(value);
    convertToDate(value);
  };

  const localDate = timestamp
    ? new Date(unit === "seconds" ? Number(timestamp) * 1000 : Number(timestamp))
    : null;
  const isValid = localDate && !isNaN(localDate.getTime());

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="timestamp-converter"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
          <p className="text-sm text-zinc-400">
            {t("labels.current")}: <span className="font-mono text-zinc-100">{Math.floor(current / 1000)}</span> {t("labels.seconds")} / <span className="font-mono text-zinc-100">{current}</span> {t("labels.milliseconds")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm text-zinc-400">{t("labels.unit")}</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as "seconds" | "milliseconds")}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-zinc-100 outline-none focus:border-blue-500"
          >
            <option value="seconds">{t("options.seconds")}</option>
            <option value="milliseconds">{t("options.milliseconds")}</option>
          </select>
          <button onClick={useCurrent} className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors">
            {t("buttons.now")}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.timestamp")}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={timestamp}
                onChange={(e) => handleTimestampChange(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                spellCheck={false}
              />
              {timestamp && <CopyButton text={timestamp} className="text-xs px-2 py-1" />}
            </div>
            <button onClick={() => convertToDate(timestamp)} className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
              {t("buttons.toDate")}
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.datetime")}</label>
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
            <button onClick={convertToTimestamp} className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
              {t("buttons.toTimestamp")}
            </button>
          </div>
        </div>

        {isValid && localDate && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <label className="mb-1 block text-xs font-medium text-zinc-400 uppercase">{t("labels.local")}</label>
              <p className="font-mono text-sm text-zinc-100">{localDate.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <label className="mb-1 block text-xs font-medium text-zinc-400 uppercase">{t("labels.utc")}</label>
              <p className="font-mono text-sm text-zinc-100">{localDate.toUTCString()}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
