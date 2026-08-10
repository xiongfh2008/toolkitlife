"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type HashAlgo = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" | "MD5";

async function digest(algo: HashAlgo, text: string): Promise<string> {
  if (algo === "MD5") {
    return md5(text);
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Small inline MD5 implementation for convenience.
function md5(input: string): string {
  const utf8 = unescape(encodeURIComponent(input));
  const msg: number[] = [];
  for (let i = 0; i < utf8.length; i++) {
    msg.push(utf8.charCodeAt(i));
  }
  const K: number[] = [];
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
  }
  const r: number[] = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];

  function rotateLeft(lValue: number, iShiftBits: number): number {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function addUnsigned(lX: number, lY: number): number {
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return lResult ^ lX8 ^ lY8;
  }

  const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
  const len = msg.length;
  const padLen = (len + 9) % 64 <= 56 ? 64 - ((len + 9) % 64) : 128 - ((len + 9) % 64);
  const padded = msg.concat([0x80], new Array(padLen).fill(0));
  const bitLenHi = Math.floor(len * 8 / 4294967296);
  const bitLenLo = (len * 8) >>> 0;
  for (let i = 0; i < 4; i++) {
    padded.push((bitLenLo >>> (i * 8)) & 0xff);
  }
  for (let i = 0; i < 4; i++) {
    padded.push((bitLenHi >>> (i * 8)) & 0xff);
  }

  for (let i = 0; i < padded.length; i += 64) {
    const w: number[] = new Array(16).fill(0);
    for (let j = 0; j < 64; j += 4) {
      w[j >> 2] = padded[i + j] | (padded[i + j + 1] << 8) | (padded[i + j + 2] << 16) | (padded[i + j + 3] << 24);
    }
    let [a, b, c, d] = H;
    for (let j = 0; j < 64; j++) {
      let f: number, g: number;
      if (j < 16) {
        f = (b & c) | (~b & d);
        g = j;
      } else if (j < 32) {
        f = (d & b) | (~d & c);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = b ^ c ^ d;
        g = (3 * j + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * j) % 16;
      }
      const temp = d;
      d = c;
      c = b;
      b = addUnsigned(b, rotateLeft(addUnsigned(addUnsigned(a, f), addUnsigned(K[j], w[g])), r[j]));
      a = temp;
    }
    H[0] = addUnsigned(H[0], a);
    H[1] = addUnsigned(H[1], b);
    H[2] = addUnsigned(H[2], c);
    H[3] = addUnsigned(H[3], d);
  }

  return H.map((h) => {
    const bytes = [(h >>> 0) & 0xff, (h >>> 8) & 0xff, (h >>> 16) & 0xff, (h >>> 24) & 0xff];
    return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  }).join("");
}

export default function HashGeneratorPage() {
  const t = useTranslations("tools.hash-generator");
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState<HashAlgo>("SHA-256");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const generate = useCallback(async () => {
    if (!input) {
      setOutput("");
      setError(t("labels.empty"));
      return;
    }
    try {
      const hash = await digest(algo, input);
      setOutput(hash);
      setError("");
    } catch {
      setError(t("labels.error"));
      setOutput("");
    }
  }, [input, algo, t]);

  const handleInputChange = (text: string) => {
    setInput(text);
    if (!text) {
      setOutput("");
      setError("");
    }
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="hash-generator"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-zinc-400">{t("labels.algorithm")}</label>
            <select
              value={algo}
              onChange={(e) => setAlgo(e.target.value as HashAlgo)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              <option value="MD5">MD5</option>
              <option value="SHA-1">SHA-1</option>
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-384">SHA-384</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>
          <button onClick={generate} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
            {t("buttons.generate")}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.input")}</label>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={t("labels.inputPlaceholder")}
              rows={12}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
              spellCheck={false}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.output")}</label>
              {output && <CopyButton text={output} className="text-xs px-2 py-1" />}
            </div>
            <div className="min-h-[300px] overflow-auto rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              {output ? (
                <p className="break-all font-mono text-sm text-zinc-300">{output}</p>
              ) : (
                <p className="text-zinc-500 text-sm">{t("labels.outputPlaceholder")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
