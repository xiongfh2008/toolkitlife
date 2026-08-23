"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const CITIES: { name: string; tz: string }[] = [
  { name: "London", tz: "Europe/London" },
  { name: "New York", tz: "America/New_York" },
  { name: "Los Angeles", tz: "America/Los_Angeles" },
  { name: "Toronto", tz: "America/Toronto" },
  { name: "Sao Paulo", tz: "America/Sao_Paulo" },
  { name: "Berlin", tz: "Europe/Berlin" },
  { name: "Paris", tz: "Europe/Paris" },
  { name: "Moscow", tz: "Europe/Moscow" },
  { name: "Dubai", tz: "Asia/Dubai" },
  { name: "Mumbai", tz: "Asia/Kolkata" },
  { name: "Singapore", tz: "Asia/Singapore" },
  { name: "Beijing", tz: "Asia/Shanghai" },
  { name: "Tokyo", tz: "Asia/Tokyo" },
  { name: "Seoul", tz: "Asia/Seoul" },
  { name: "Sydney", tz: "Australia/Sydney" },
  { name: "Auckland", tz: "Pacific/Auckland" },
];

export default function WorldClockPage() {
  const t = useTranslations("tools.world-clock");
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
            <p className="text-sm font-medium text-zinc-300">{c.name}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-blue-400">
              {new Intl.DateTimeFormat([], {
                timeZone: c.tz,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }).format(now)}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {new Intl.DateTimeFormat([], {
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
