"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { computePeaks, decodeAudioFile, drawWaveform, formatTime } from "@/lib/audio";

function getAudioContext(): AudioContext {
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) throw new Error("Web Audio API is not supported");
  return new Ctor();
}

export default function AudioPlayerPage() {
  const t = useTranslations("tools.audio-player");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [fileName, setFileName] = useState("");
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [duration, setDuration] = useState(0);
  const [sampleRate, setSampleRate] = useState(0);
  const [channels, setChannels] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const stopPlayback = useCallback(() => {
    sourceRef.current?.stop();
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    ctxRef.current?.close();
    ctxRef.current = null;
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      sourceRef.current?.stop();
      sourceRef.current?.disconnect();
      sourceRef.current = null;
      ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  const loadFile = useCallback(
    async (f: File) => {
      if (!f.type.startsWith("audio/")) return;
      stopPlayback();
      setError("");
      try {
        const buf = await decodeAudioFile(f);
        setFileName(f.name);
        setBuffer(buf);
        setPeaks(computePeaks(buf.getChannelData(0), 1200));
        setDuration(buf.duration);
        setSampleRate(buf.sampleRate);
        setChannels(buf.numberOfChannels);
      } catch {
        setError(t("errors.decode"));
      }
    },
    [stopPlayback, t]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void loadFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) void loadFile(f);
  };

  const togglePlay = () => {
    if (!buffer) return;
    if (isPlaying) {
      stopPlayback();
      return;
    }
    try {
      const ctx = getAudioContext();
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);
      src.onended = () => setIsPlaying(false);
      src.start();
      ctxRef.current = ctx;
      sourceRef.current = src;
      setIsPlaying(true);
    } catch {
      setError(t("errors.decode"));
    }
  };

  useEffect(() => {
    if (canvasRef.current && peaks.length > 0) {
      drawWaveform(canvasRef.current, peaks);
    }
  }, [peaks, fileName]);

  return (
    <ToolLayout
      title={t("title")}
      slug="audio-player"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-6">
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 px-6 py-10 text-center transition-colors hover:border-blue-500"
        >
          <input type="file" accept="audio/*" onChange={handleChange} className="hidden" />
          <span className="text-3xl">🎧</span>
          <span className="mt-2 text-sm text-zinc-300">{t("upload.drop")}</span>
          <span className="mt-1 text-xs text-zinc-500">{t("upload.formats")}</span>
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {buffer && (
          <div className="space-y-4">
            <canvas ref={canvasRef} className="h-32 w-full rounded-lg" />
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              <span className="max-w-[200px] truncate font-medium text-zinc-200">{fileName}</span>
              <span>
                {t("labels.duration")}: {formatTime(duration)}
              </span>
              <span>
                {t("labels.sampleRate")}: {sampleRate} Hz
              </span>
              <span>
                {t("labels.channels")}: {channels}
              </span>
            </div>
            <button
              onClick={togglePlay}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              {isPlaying ? t("buttons.pause") : t("buttons.play")}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
