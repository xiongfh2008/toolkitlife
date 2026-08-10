"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

interface Voice {
  voice: SpeechSynthesisVoice;
  label: string;
}

export default function TextToSpeechPage() {
  const t = useTranslations("tools.text-to-speech");
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  useEffect(() => {
    const loadVoices = () => {
      const available = speechSynthesis.getVoices();
      const mapped = available.map((v) => ({
        voice: v,
        label: `${v.name} (${v.lang})`,
      }));
      setVoices(mapped);
      if (mapped.length > 0 && !selectedVoice) {
        const english = mapped.find((v) => v.voice.lang.startsWith("en") && v.voice.default);
        setSelectedVoice((english || mapped[0]).voice.name);
      }
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => { speechSynthesis.onvoiceschanged = null; };
  }, [selectedVoice]);

  const speak = useCallback(() => {
    if (!text.trim()) return;
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.voice.name === selectedVoice);
    if (voice) utterance.voice = voice.voice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => { setSpeaking(true); setPaused(false); };
    utterance.onend = () => { setSpeaking(false); setPaused(false); };
    utterance.onerror = () => { setSpeaking(false); setPaused(false); };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [text, selectedVoice, voices, rate, pitch]);

  const pause = useCallback(() => {
    speechSynthesis.pause();
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    speechSynthesis.resume();
    setPaused(false);
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }, []);

  const readingMinutes = Math.ceil(text.split(/\s+/).filter(Boolean).length / 150);

  return (
    <ToolLayout
      title={t("title")}
      slug="text-to-speech"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder")}
          rows={8}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none resize-y"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">{t("labels.voice")}</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
            >
              {voices.map((v) => (
                <option key={v.voice.name} value={v.voice.name}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              {t("labels.speed", { rate: rate.toFixed(1) })}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              {t("labels.pitch", { pitch: pitch.toFixed(1) })}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {!speaking ? (
            <button
              onClick={speak}
              disabled={!text.trim()}
              className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors"
            >
              {t("buttons.speak")}
            </button>
          ) : (
            <>
              <button
                onClick={paused ? resume : pause}
                className="flex-1 py-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-semibold transition-colors"
              >
                {paused ? t("buttons.resume") : t("buttons.pause")}
              </button>
              <button
                onClick={stop}
                className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors"
              >
                {t("buttons.stop")}
              </button>
            </>
          )}
        </div>

        <p className="text-xs text-zinc-500 text-center">
          {t("stats", { count: text.length, minutes: readingMinutes })}
        </p>
      </div>
    </ToolLayout>
  );
}
