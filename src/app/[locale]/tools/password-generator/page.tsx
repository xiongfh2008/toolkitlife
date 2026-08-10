"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = "0O1lI";

function generatePassword(
  length: number,
  opts: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean; excludeAmbiguous: boolean }
): string {
  let chars = "";
  if (opts.upper) chars += UPPER;
  if (opts.lower) chars += LOWER;
  if (opts.numbers) chars += NUMBERS;
  if (opts.symbols) chars += SYMBOLS;
  if (opts.excludeAmbiguous) {
    chars = chars.split("").filter((c) => !AMBIGUOUS.includes(c)).join("");
  }
  if (!chars) return "";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (v) => chars[v % chars.length]).join("");
}

type StrengthKey = "none" | "weak" | "fair" | "strong" | "veryStrong";

function getStrength(pw: string): { score: number; color: string; key: StrengthKey } {
  if (!pw) return { score: 0, color: "bg-zinc-700", key: "none" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 20) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (score <= 2) return { score: 1, color: "bg-red-500", key: "weak" };
  if (score <= 3) return { score: 2, color: "bg-yellow-500", key: "fair" };
  if (score <= 4) return { score: 3, color: "bg-blue-500", key: "strong" };
  return { score: 4, color: "bg-green-500", key: "veryStrong" };
}

export default function PasswordGeneratorPage() {
  const t = useTranslations("tools.password-generator");

  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState(() =>
    generatePassword(16, { upper: true, lower: true, numbers: true, symbols: true, excludeAmbiguous: false })
  );
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([]);
  const [bulkCount, setBulkCount] = useState(5);

  const gen = useCallback(() => {
    const pw = generatePassword(length, { upper, lower, numbers, symbols, excludeAmbiguous });
    setPassword(pw);
    setBulkPasswords([]);
  }, [length, upper, lower, numbers, symbols, excludeAmbiguous]);

  const genBulk = () => {
    const pws = Array.from({ length: bulkCount }, () =>
      generatePassword(length, { upper, lower, numbers, symbols, excludeAmbiguous })
    );
    setBulkPasswords(pws);
  };

  const strength = getStrength(password);

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="password-generator"
      faqs={t.raw("faqs") as FAQ[]}
      relatedTools={t.raw("relatedTools") as RelatedTool[]}
      keywords={t.raw("keywords") as string[]}
      guide={
        <>
          <h2>{t("guide.whatIs.title")}</h2>
          {(t.raw("guide.whatIs.body") as string[]).map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}

          <h3>{t("guide.howTo.title")}</h3>
          <p dangerouslySetInnerHTML={{ __html: t("guide.howTo.intro") }} />
          <ul>
            {(t.raw("guide.howTo.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t("guide.strength.title")}</h3>
          <p dangerouslySetInnerHTML={{ __html: t("guide.strength.body") }} />

          <h3>{t("guide.bulk.title")}</h3>
          <p dangerouslySetInnerHTML={{ __html: t("guide.bulk.body") }} />

          <h3>{t("guide.tips.title")}</h3>
          <ul>
            {(t.raw("guide.tips.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t("guide.useCases.title")}</h3>
          <ul>
            {(t.raw("guide.useCases.items") as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Generated password */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center gap-3">
            <code className="flex-1 break-all rounded-lg bg-zinc-800 px-4 py-3 font-mono text-lg text-zinc-100">
              {password || t("placeholder")}
            </code>
            <CopyButton text={password} label={t("buttons.copy")} />
            <button onClick={gen} className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors">
              {t("buttons.regenerate")}
            </button>
          </div>

          {/* Strength meter */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-400">{t("strength.label")}</span>
              <span className="text-xs text-zinc-400">{t(`strength.${strength.key}`)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-800">
              <div
                className={`h-2 rounded-full transition-all ${strength.color}`}
                style={{ width: `${(strength.score / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              {t("labels.length", { length })}
            </label>
            <input
              type="range"
              min={4}
              max={128}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            {([
              { key: "upper" as const, checked: upper, set: setUpper },
              { key: "lower" as const, checked: lower, set: setLower },
              { key: "numbers" as const, checked: numbers, set: setNumbers },
              { key: "symbols" as const, checked: symbols, set: setSymbols },
              { key: "excludeAmbiguous" as const, checked: excludeAmbiguous, set: setExcludeAmbiguous },
            ] as const).map((opt) => (
              <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={(e) => opt.set(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className="text-sm text-zinc-300">{t(`options.${opt.key}`)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bulk generate */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm font-medium text-zinc-300">{t("bulk.title")}</h3>
            <select
              value={bulkCount}
              onChange={(e) => setBulkCount(Number(e.target.value))}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <button
              onClick={genBulk}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              {t("bulk.generate")}
            </button>
            {bulkPasswords.length > 0 && (
              <CopyButton text={bulkPasswords.join("\n")} label={t("bulk.copyAll")} />
            )}
          </div>
          {bulkPasswords.length > 0 && (
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {bulkPasswords.map((pw, i) => (
                <div key={i} className="flex items-center gap-2 rounded bg-zinc-800 px-3 py-1.5">
                  <code className="flex-1 break-all text-xs font-mono text-zinc-300">{pw}</code>
                  <CopyButton text={pw} label={t("buttons.copy")} className="text-xs px-2 py-1" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
