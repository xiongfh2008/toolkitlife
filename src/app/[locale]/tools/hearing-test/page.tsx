"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const FREQS = [125, 250, 500, 1000, 2000, 4000, 8000, 12000, 16000];

function playTone(freq: number) {
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return;
  const ctx = new Ctor();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.5, ctx.currentTime + 0.9);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 1.2);
  osc.onended = () => void ctx.close();
}

export default function HearingTestPage() {
  const t = useTranslations("tools.hearing-test");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [playing, setPlaying] = useState<number | null>(null);

  const answer = (freq: number, heard: boolean) => {
    setAnswers((a) => ({ ...a, [freq]: heard }));
  };

  const play = (freq: number) => {
    setPlaying(freq);
    playTone(freq);
    setTimeout(() => setPlaying(null), 1300);
  };

  const heard = Object.entries(answers)
    .filter(([, v]) => v)
    .map(([k]) => Number(k));
  const maxHeard = heard.length > 0 ? Math.max(...heard) : 0;

  return (
    <ToolLayout
      title={t("title")}
      slug="hearing-test"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          {FREQS.map((freq) => (
            <div key={freq} className="flex items-center gap-3 rounded-lg border border-zinc-800 px-3 py-2">
              <button
                onClick={() => play(freq)}
                className="w-28 rounded-md bg-zinc-800 px-3 py-1.5 text-sm text-blue-300 hover:bg-zinc-700"
              >
                {playing === freq ? "♪" : `${freq} Hz`}
              </button>
              <div className="flex flex-1 justify-end gap-2">
                <button
                  onClick={() => answer(freq, true)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${answers[freq] === true ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                >
                  {t("buttons.heard")}
                </button>
                <button
                  onClick={() => answer(freq, false)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${answers[freq] === false ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                >
                  {t("buttons.notHeard")}
                </button>
              </div>
            </div>
          ))}
        </div>
        {maxHeard > 0 && (
          <div className="rounded-lg border border-zinc-800 p-4 text-center">
            <p className="text-3xl font-semibold text-blue-400">{maxHeard} Hz</p>
            <p className="mt-1 text-sm text-zinc-400">{t("labels.range")}</p>
          </div>
        )}
        <p className="text-xs text-zinc-600">{t("labels.hint")}</p>
      </div>
    </ToolLayout>
  );
}
