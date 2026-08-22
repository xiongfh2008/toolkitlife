"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// International Morse code: letters A-Z and digits 0-9.
const CHAR_TO_MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
  H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
  O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
  V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
};

const MORSE_TO_CHAR: Record<string, string> = Object.fromEntries(
  Object.entries(CHAR_TO_MORSE).map(([k, v]) => [v, k])
);

const MORSE_RE = /^[.\-\s/]+$/;

type Mode = "encode" | "decode";

export default function MorseCodePage() {
  const t = useTranslations("tools.morse-code");
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = (text: string, m: Mode) => {
    if (!text.trim()) {
      setOutput("");
      return;
    }
    if (m === "encode") {
      const letters = text
        .toUpperCase()
        .split(" ")
        .map((word) =>
          word
            .split("")
            .map((ch) => CHAR_TO_MORSE[ch] ?? "")
            .filter(Boolean)
            .join(" ")
        )
        .filter(Boolean)
        .join(" / ");
      setOutput(letters);
    } else {
      if (!MORSE_RE.test(text.trim())) {
        setOutput(t("labels.invalidMorse"));
        return;
      }
      const decoded = text
        .trim()
        .split(/\s*\/\s*/)
        .map((word) =>
          word
            .split(/\s+/)
            .map((code) => MORSE_TO_CHAR[code] ?? "?")
            .join("")
        )
        .join(" ");
      setOutput(decoded);
    }
  };

  const handleModeChange = (m: Mode) => {
    setMode(m);
    convert(input, m);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="morse-code"
    >
      <div className="space-y-4">
        {/* Mode toggle */}
        <div className="flex gap-2">
          {(["encode", "decode"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`buttons.${m}`)}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Input */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {mode === "encode" ? t("labels.textToEncode") : t("labels.morseToDecode")}
            </label>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                convert(e.target.value, mode);
              }}
              placeholder={mode === "encode" ? t("labels.enterText") : t("labels.enterMorse")}
              rows={10}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
            />
          </div>

          {/* Output */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.output")}</label>
              {output && <CopyButton text={output} className="text-xs px-2 py-1" />}
            </div>
            <textarea
              value={output}
              readOnly
              rows={10}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-300 outline-none resize-y"
            />
          </div>
        </div>

        <p className="text-xs text-zinc-500">{t("labels.hint")}</p>
      </div>
    </ToolLayout>
  );
}
