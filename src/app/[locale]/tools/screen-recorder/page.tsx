"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type RecordingSource = "screen" | "camera";

export default function ScreenRecorderPage() {
  const t = useTranslations("tools.screen-recorder");
  const [source, setSource] = useState<RecordingSource>("screen");
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [includeAudio, setIncludeAudio] = useState(true);
  const [includeMic, setIncludeMic] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [fileFormat, setFileFormat] = useState<"mp4" | "webm">("mp4");

  // Prefer MP4 where possible, but avoid the H.264 (avc1) hardware encoder:
  // Chrome's MP4 MediaRecorder is known to produce corrupted/glitchy output
  // when recording screen content (especially with audio or odd dimensions).
  // VP9 inside an MP4 container keeps the .mp4 file while using the stable
  // encoder that WebM uses. Odd-sized captures skip MP4 entirely because H.264
  // requires macroblock-aligned dimensions.
  function pickMimeType(width: number, height: number): string {
    const aligned = width % 2 === 0 && height % 2 === 0;
    const candidates = aligned
      ? [
          "video/mp4;codecs=vp9,opus",
          "video/mp4;codecs=avc1",
          "video/mp4",
          "video/webm;codecs=vp9,opus",
          "video/webm;codecs=vp8,opus",
          "video/webm",
        ]
      : [
          "video/webm;codecs=vp9,opus",
          "video/webm;codecs=vp8,opus",
          "video/webm",
        ];
    return (
      candidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? "video/webm"
    );
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const startRecording = useCallback(async () => {
    setError(null);
    setRecordedUrl(null);
    setRecordedBlob(null);
    chunksRef.current = [];

    try {
      let stream: MediaStream;

      if (source === "screen") {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 30 },
          audio: includeAudio,
        });
      } else {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1920, height: 1080, frameRate: 30 },
          audio: includeAudio,
        });
      }

      // Add microphone if requested
      if (includeMic && source === "screen") {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStream.getAudioTracks().forEach((track) => stream.addTrack(track));
        } catch {
          // Mic not available, continue without
        }
      }

      streamRef.current = stream;

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }

      const videoTrack = stream.getVideoTracks()[0];
      const trackSettings = videoTrack.getSettings();
      const mimeType = pickMimeType(
        trackSettings.width ?? 0,
        trackSettings.height ?? 0
      );
      setFileFormat(mimeType.startsWith("video/mp4") ? "mp4" : "webm");

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setRecordedBlob(blob);
        setRecording(false);
        setPaused(false);
        if (timerRef.current) clearInterval(timerRef.current);

        stream.getTracks().forEach((t) => t.stop());
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
        }
      };

      // Stop recording if user stops screen share
      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorderRef.current?.state !== "inactive") {
          mediaRecorderRef.current?.stop();
        }
      };

      recorder.start(1000);
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        setError(t("errors.permissionDenied"));
      } else {
        setError(t("errors.startFailed"));
      }
    }
  }, [source, includeAudio, includeMic, t]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop();
    }
  }, []);

  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return;
    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    } else if (mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setPaused(false);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    }
  }, []);

  const download = useCallback(() => {
    if (!recordedBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(recordedBlob);
    a.download = `recording-${Date.now()}.${fileFormat}`;
    a.click();
  }, [recordedBlob]);

  return (
    <ToolLayout
      title={t("title")}
      slug="screen-recorder"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-6">
        {/* Source selection */}
        {!recording && !recordedUrl && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={() => setSource("screen")}
                className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  source === "screen"
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {t("source.screen")}
              </button>
              <button
                onClick={() => setSource("camera")}
                className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  source === "camera"
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {t("source.camera")}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAudio}
                  onChange={(e) => setIncludeAudio(e.target.checked)}
                  className="accent-blue-500"
                />
                {t("audio.system")}
              </label>
              {source === "screen" && (
                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMic}
                    onChange={(e) => setIncludeMic(e.target.checked)}
                    className="accent-blue-500"
                  />
                  {t("audio.microphone")}
                </label>
              )}
            </div>
          </div>
        )}

        {/* Preview / Recording */}
        {recording && (
          <div className="space-y-4">
            <video
              ref={videoPreviewRef}
              muted
              playsInline
              className="w-full rounded-lg bg-black aspect-video"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${paused ? "bg-yellow-500" : "bg-red-500 animate-pulse"}`} />
                  <span className="text-sm font-mono text-zinc-300">
                    {paused ? t("recording.paused") : t("recording.recording")} {formatTime(duration)}
                  </span>
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={togglePause}
                  className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-sm font-medium text-zinc-200 transition-colors"
                >
                  {paused ? t("buttons.resume") : t("buttons.pause")}
                </button>
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-medium text-white transition-colors"
                >
                  {t("buttons.stop")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recorded result */}
        {recordedUrl && (
          <div className="space-y-4">
            <video
              src={recordedUrl}
              controls
              playsInline
              className="w-full rounded-lg bg-black aspect-video"
            />
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-400">
                {t("result.duration", { time: formatTime(duration) })}
                {recordedBlob &&
                  ` | ${fileFormat.toUpperCase()} | ${t("result.size", {
                    size: (recordedBlob.size / (1024 * 1024)).toFixed(1),
                  })}`}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setRecordedUrl(null); setRecordedBlob(null); setDuration(0); }}
                  className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-sm font-medium text-zinc-200 transition-colors"
                >
                  {t("buttons.newRecording")}
                </button>
                <button
                  onClick={download}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white transition-colors"
                >
                  {t("buttons.download")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Start button */}
        {!recording && !recordedUrl && (
          <button
            onClick={startRecording}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-colors"
          >
            {t("buttons.start")}
          </button>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}
      </div>
    </ToolLayout>
  );
}
