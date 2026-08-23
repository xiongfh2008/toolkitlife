/**
 * Shared audio helpers for client-side tools: WAV encoding, file decoding
 * and waveform drawing. All functions are pure client-side (no server work).
 */

/** Encodes interleaved channel data into a 16-bit PCM WAV Blob. */
export function encodeWav(channels: Float32Array[], sampleRate: number): Blob {
  const numChannels = Math.max(1, channels.length);
  const length = channels[0].length;
  const buffer = new ArrayBuffer(44 + length * numChannels * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + length * numChannels * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true); // byte rate
  view.setUint16(32, numChannels * 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, "data");
  view.setUint32(40, length * numChannels * 2, true);

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([buffer], { type: "audio/wav" });
}

/** Decodes an audio file into an AudioBuffer using the browser's codecs. */
export async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) throw new Error("Web Audio API is not supported in this browser");
  const ctx = new Ctor();
  try {
    const buf = await file.arrayBuffer();
    return await ctx.decodeAudioData(buf);
  } finally {
    void ctx.close();
  }
}

/** Down-samples a channel into `samples` peak values for waveform rendering. */
export function computePeaks(channel: Float32Array, samples: number): number[] {
  const peaks: number[] = [];
  const step = Math.max(1, Math.floor(channel.length / samples));
  for (let i = 0; i < samples; i++) {
    const start = i * step;
    const end = Math.min(channel.length, start + step);
    let max = 0;
    for (let j = start; j < end; j++) {
      const v = Math.abs(channel[j]);
      if (v > max) max = v;
    }
    peaks.push(max);
  }
  return peaks;
}

export interface WaveformDrawOptions {
  /** Fraction of the full width that the selection covers (cutter). */
  selectionStart?: number;
  selectionEnd?: number;
  color?: string;
  selectionColor?: string;
}

/** Draws a peak-based waveform onto a canvas (auto scales for DPR). */
export function drawWaveform(
  canvas: HTMLCanvasElement,
  peaks: number[],
  opts: WaveformDrawOptions = {}
) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "rgba(63, 63, 70, 0.35)"; // zinc-700 at low alpha
  ctx.fillRect(0, 0, w, h);

  const base = opts.color ?? "rgb(59, 130, 246)"; // blue-500
  const sel = opts.selectionColor ?? "rgb(16, 185, 129)"; // emerald-500
  const selStart = Math.max(0, opts.selectionStart ?? 0);
  const selEnd = Math.min(1, opts.selectionEnd ?? 1);
  const n = peaks.length;
  const barW = w / n;
  const mid = h / 2;

  for (let i = 0; i < n; i++) {
    const x = i * barW;
    const ratio = i / n;
    const inSel = ratio >= selStart && ratio <= selEnd;
    ctx.fillStyle = inSel ? sel : base;
    const hgt = Math.max(1, peaks[i] * h * 0.92);
    ctx.fillRect(x, mid - hgt / 2, Math.max(1, barW - 1), hgt);
  }
}

/** Formats seconds as m:ss (or h:mm:ss when >= 1 hour). */
export function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const s = Math.floor(sec);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}
