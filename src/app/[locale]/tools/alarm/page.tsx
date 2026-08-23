"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

function beep() {
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return;
  const ctx = new Ctor();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.6, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.8);
  osc.onended = () => void ctx.close();
}

export default function AlarmPage() {
  const t = useTranslations("tools.alarm");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [time, setTime] = useState("08:00");
  const [minutes, setMinutes] = useState(5);
  const [target, setTarget] = useState<number | null>(null);
  const [ringing, setRinging] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
      setTarget((target) => {
        if (target !== null && Date.now() >= target) {
          setRinging(true);
          return null;
        }
        return target;
      });
    }, 500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const setByTime = () => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
    setTarget(d.getTime());
    setRinging(false);
  };

  const setByMinutes = () => {
    setTarget(Date.now() + Math.max(1, minutes) * 60 * 1000);
    setRinging(false);
  };

  const stop = () => {
    setRinging(false);
    setTarget(null);
  };

  const remaining = target !== null ? Math.max(0, Math.ceil((target - now) / 1000)) : 0;

  const inputCls =
    "rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="alarm"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        <div className={`rounded-xl border p-6 text-center ${ringing ? "animate-pulse border-red-500 bg-red-600/10" : "border-zinc-800"}`}>
          {ringing ? (
            <>
              <p className="text-3xl font-bold text-red-400">⏰</p>
              <p className="mt-2 text-xl font-semibold text-zinc-100">{t("labels.ringing")}</p>
            </>
          ) : target !== null ? (
            <>
              <p className="text-4xl font-semibold text-blue-400">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}</p>
              <p className="mt-1 text-sm text-zinc-400">{t("labels.countdown")}</p>
            </>
          ) : (
            <p className="text-lg text-zinc-500">{t("labels.placeholder")}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
          <button onClick={setByTime} disabled={ringing} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50">
            {t("buttons.setTime")}
          </button>
          <span className="text-zinc-600">|</span>
          <input
            type="number"
            min={1}
            max={1440}
            value={minutes}
            onChange={(e) => setMinutes(Math.max(1, Math.min(1440, Number(e.target.value) || 1)))}
            className={inputCls + " w-20"}
          />
          <button onClick={setByMinutes} disabled={ringing} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50">
            {t("buttons.setMinutes")}
          </button>
          <button onClick={stop} className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500">
            {t("buttons.stop")}
          </button>
        </div>

        <button
          onClick={beep}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:border-zinc-500"
        >
          {t("buttons.testSound")}
        </button>
      </div>
    </ToolLayout>
  );
}
