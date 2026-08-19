"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface ModifierGroup {
  key: string;
  prefixes: string[];
  suffixes: string[];
}

const MODIFIERS: ModifierGroup[] = [
  { key: "general", prefixes: [], suffixes: [] },
  { key: "howTo", prefixes: ["how to", "how do i"], suffixes: ["tutorial", "guide", "for beginners"] },
  { key: "best", prefixes: ["best", "top", "best rated"], suffixes: ["reviews", "comparison", "for beginners"] },
  { key: "buy", prefixes: ["buy", "cheap", "affordable"], suffixes: ["price", "for sale", "near me"] },
  { key: "reviews", prefixes: ["best", "top"], suffixes: ["reviews", "review", "ratings", "alternatives"] },
  { key: "nearMe", prefixes: [], suffixes: ["near me", "nearby", "in my area"] },
  { key: "question", prefixes: ["what is", "how to", "why is"], suffixes: ["?", "meaning", "benefits"] },
];

const COUNTRY_SUFFIXES: Record<string, string[]> = {
  US: ["in usa", "in america"],
  UK: ["in uk", "in england"],
  IN: ["in india"],
  AU: ["in australia"],
  CA: ["in canada"],
};

export default function LongTailKeywordsPage() {
  const t = useTranslations("tools.long-tail-keywords");
  const [seed, setSeed] = useState("");
  const [country, setCountry] = useState<string>("");
  const [category, setCategory] = useState("general");
  const [generated, setGenerated] = useState(false);

  const results = useMemo(() => {
    if (!generated) return [];
    const base = seed.trim().toLowerCase();
    if (!base) return [];
    const group = MODIFIERS.find((m) => m.key === category) ?? MODIFIERS[0];
    const set = new Set<string>([base]);
    for (const p of group.prefixes) {
      set.add(`${p} ${base}`);
      set.add(`${p} ${base} ${group.suffixes[0] ?? ""}`.replace(/\s+/g, " ").trim());
    }
    for (const s of group.suffixes) {
      if (s) set.add(`${base} ${s}`);
    }
    const countryList = country ? COUNTRY_SUFFIXES[country] ?? [] : [];
    for (const c of countryList) {
      set.add(`${base} ${c}`);
      if (group.suffixes[0]) set.add(`${base} ${group.suffixes[0]} ${c}`);
    }
    // Common long-tail patterns
    set.add(`best ${base} for beginners`);
    set.add(`top ${base} ${new Date().getFullYear()}`);
    set.add(`${base} for beginners`);
    set.add(`${base} tools`);
    set.add(`${base} examples`);
    set.add(`what is ${base}`);
    return Array.from(set).slice(0, 60);
  }, [seed, country, category, generated]);

  const text = results.join("\n");

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="long-tail-keywords"
    >
      <div className="max-w-3xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.seed")}
          </label>
          <input
            type="text"
            value={seed}
            onChange={(e) => {
              setSeed(e.target.value);
              setGenerated(false);
            }}
            placeholder={t("placeholders.seed")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.country")}
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="">{t("options.global")}</option>
              <option value="US">{t("options.us")}</option>
              <option value="UK">{t("options.uk")}</option>
              <option value="IN">{t("options.in")}</option>
              <option value="AU">{t("options.au")}</option>
              <option value="CA">{t("options.ca")}</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.category")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            >
              {MODIFIERS.map((m) => (
                <option key={m.key} value={m.key}>
                  {t(`options.${m.key}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => setGenerated(true)}
          disabled={!seed.trim()}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("buttons.generate")}
        </button>

        {results.length > 0 && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.results")} ({results.length})
              </h3>
              <div className="flex gap-2">
                <CopyButton text={text} className="text-xs px-2 py-1" />
              </div>
            </div>
            <ul className="max-h-96 space-y-1.5 overflow-y-auto">
              {results.map((kw) => (
                <li
                  key={kw}
                  className="flex items-center justify-between rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-200"
                >
                  <span>{kw}</span>
                  <CopyButton
                    text={kw}
                    label={t("buttons.copy")}
                    copiedLabel={t("buttons.copied")}
                    className="text-xs px-2 py-1"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
