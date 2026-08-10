"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const CODE128_PATTERNS = [
  "11011001100", "11001101100", "11001100110", "10010011000", "10010001100",
  "10001001100", "10011001000", "10011000100", "10001100100", "11001001000",
  "11001000100", "11000100100", "10110011100", "10011011100", "10011001110",
  "10111001100", "10011101100", "10011100110", "11001110010", "11001011100",
  "11001001110", "11011100100", "11001110100", "11101101110", "11101001100",
  "11100101100", "11100100110", "11100110010", "11100110100", "11100100101",
  "11100101101", "11101110100", "11100110110", "11010011100", "11010001110",
  "11001001110", "11110101110", "11010010110", "11010100110", "11011010010",
  "11011110100", "11011110010", "11010111010", "11001011010", "11011101110",
  "11001011110", "10111100100", "10011110100", "10011110010", "10111100110",
  "10010111100", "10010011110", "10011101000", "10011100100", "10001110110",
  "11101110110", "10110011110", "10111001110", "11101001110", "11101011100",
  "11100101110", "11100101000", "11100100010", "11100010100", "11100010010",
  "11011100010", "11001110110", "10101111000", "10100011110", "10001011110",
  "10111101000", "10111100010", "11101011010", "11101101010", "11101101100",
  "11101100110", "11101000100", "11101000010", "11100010110", "11101110100",
  "11101110010", "11101100100", "11100100010", "11100010100", "11100010010",
  "11011010000", "11011000010", "11000110110", "10100011000", "10001011000",
  "10001000110", "10100001000", "10001001000", "10011000100", "10010000110",
  "10110000100", "10110010000", "10010010000", "10011011100", "10011010000",
  "10010110000", "11110111010", "11111010110", "11010000100", "11010010000",
  "11010011100", "11000111010",
];

const START_B = 104;
const STOP = 106;

function encodeCode128B(text: string) {
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code < 32 || code > 126) {
      return null;
    }
  }

  const values = [START_B];
  for (const ch of text) {
    values.push(ch.charCodeAt(0) - 32);
  }

  let checksum = START_B;
  for (let i = 1; i < values.length; i++) {
    checksum += i * values[i];
  }
  checksum %= 103;
  values.push(checksum);
  values.push(STOP);

  return values.map((v) => CODE128_PATTERNS[v]).join("");
}

export default function BarcodeGeneratorPage() {
  const t = useTranslations("tools.barcode-generator");
  const [text, setText] = useState("123456789012");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const encoded = useMemo(() => encodeCode128B(text), [text]);
  const error = encoded === null ? t("errors.unsupportedChars") : "";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!encoded) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const barWidth = 2;
    const quietZone = 20;
    const width = encoded.length * barWidth + quietZone * 2;
    const height = 120;
    canvas.width = width;
    canvas.height = height + 24;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let x = quietZone;
    for (let i = 0; i < encoded.length; i++) {
      if (encoded[i] === "1") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(x, 0, barWidth, height);
      }
      x += barWidth;
    }

    ctx.fillStyle = "#000000";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, height + 18);
  }, [encoded, text]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `barcode-${text}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="barcode-generator"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.text")}
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("placeholders.text")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
          <canvas
            ref={canvasRef}
            className="max-w-full rounded border border-zinc-700 bg-white"
          />
        </div>

        <button
          onClick={download}
          disabled={!!error || !text}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("buttons.download")}
        </button>
      </div>
    </ToolLayout>
  );
}
