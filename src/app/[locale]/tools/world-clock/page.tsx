"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const CITIES: { key: string; name: string; tz: string }[] = [
  { key: "london", name: "London", tz: "Europe/London" },
  { key: "new_york", name: "New York", tz: "America/New_York" },
  { key: "los_angeles", name: "Los Angeles", tz: "America/Los_Angeles" },
  { key: "toronto", name: "Toronto", tz: "America/Toronto" },
  { key: "sao_paulo", name: "São Paulo", tz: "America/Sao_Paulo" },
  { key: "berlin", name: "Berlin", tz: "Europe/Berlin" },
  { key: "paris", name: "Paris", tz: "Europe/Paris" },
  { key: "moscow", name: "Moscow", tz: "Europe/Moscow" },
  { key: "dubai", name: "Dubai", tz: "Asia/Dubai" },
  { key: "mumbai", name: "Mumbai", tz: "Asia/Kolkata" },
  { key: "singapore", name: "Singapore", tz: "Asia/Singapore" },
  { key: "beijing", name: "Beijing", tz: "Asia/Shanghai" },
  { key: "tokyo", name: "Tokyo", tz: "Asia/Tokyo" },
  { key: "seoul", name: "Seoul", tz: "Asia/Seoul" },
  { key: "sydney", name: "Sydney", tz: "Australia/Sydney" },
  { key: "auckland", name: "Auckland", tz: "Pacific/Auckland" },
];

export default function WorldClockPage() {
  const t = useTranslations("tools.world-clock");
  const locale = useLocale();
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <ToolLayout
      title={t("title")}
      slug="world-clock"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CITIES.map((c) => (
          <div key={c.tz} className="rounded-lg border border-zinc-800 p-4">
            <p className="text-sm font-medium text-zinc-300">{t(`cities.${c.key}`)}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-blue-400">
              {new Intl.DateTimeFormat(locale, {
                timeZone: c.tz,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }).format(now)}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {new Intl.DateTimeFormat(locale, {
                timeZone: c.tz,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                weekday: "short",
              }).format(now)}
            </p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
