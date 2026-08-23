"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function OnlineClockPage() {
  const t = useTranslations("tools.online-clock");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString([], { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  const unix = Math.floor(now.getTime() / 1000);

  return (
    <ToolLayout
      title={t("title")}
      slug="online-clock"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-6 py-4">
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 text-center">
          <p className="text-5xl font-bold tabular-nums text-blue-400 sm:text-6xl">{timeStr}</p>
          <p className="mt-3 text-lg text-zinc-300">{dateStr}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 p-4 text-center">
            <p className="break-all text-xl font-semibold text-emerald-400">{unix}</p>
            <p className="mt-1 text-xs text-zinc-400">{t("labels.unix")}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 p-4 text-center">
            <p className="text-xl font-semibold text-zinc-200">{now.toISOString()}</p>
            <p className="mt-1 text-xs text-zinc-400">{t("labels.iso")}</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
