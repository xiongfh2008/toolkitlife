"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const TEST_SECONDS = 10;

export default function ClickSpeedPage() {
  const t = useTranslations("tools.click-speed");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TEST_SECONDS);
  const [clicks, setClicks] = useState(0);
  const [best, setBest] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clicksRef = useRef(0);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const start = () => {
    setRunning(true);
    setTimeLeft(TEST_SECONDS);
    setClicks(0);
    clicksRef.current = 0;
    let left = TEST_SECONDS;
    intervalRef.current = setInterval(() => {
      left -= 1;
      setTimeLeft(left);
      if (left <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(false);
        setBest((b) => Math.max(b, clicksRef.current / TEST_SECONDS));
      }
    }, 1000);
  };

  const click = () => {
    if (!running) return;
    setClicks((c) => {
      clicksRef.current = c + 1;
      return c + 1;
    });
  };

  const cps = clicks / TEST_SECONDS;

  return (
    <ToolLayout
      title={t("title")}
      slug="click-speed"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-8 text-center">
          <div>
            <p className="text-4xl font-semibold text-zinc-100">{timeLeft}s</p>
            <p className="text-xs text-zinc-400">{t("labels.timeLeft")}</p>
          </div>
          <div>
            <p className="text-4xl font-semibold text-blue-400">{clicks}</p>
            <p className="text-xs text-zinc-400">{t("labels.clicks")}</p>
          </div>
          <div>
            <p className="text-4xl font-semibold text-emerald-400">{cps.toFixed(1)}</p>
            <p className="text-xs text-zinc-400">{t("labels.cps")}</p>
          </div>
        </div>
        <button
          onClick={running ? click : start}
          className={`flex h-56 w-full items-center justify-center rounded-2xl text-xl font-medium text-white transition-colors ${running ? "bg-blue-600 hover:bg-blue-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
        >
          {running ? t("labels.click") : t("buttons.start")}
        </button>
        {!running && clicks > 0 && (
          <p className="text-center text-sm text-zinc-400">
            {t("labels.best")}: {best.toFixed(1)} CPS
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
