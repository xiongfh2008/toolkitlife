"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import { ALL_EMOJI, EMOJI_ALIASES, EMOJI_CATEGORIES } from "@/data/emojis";

export default function EmojiPickerPage() {
  const t = useTranslations("tools.emoji-picker");
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [copied, setCopied] = useState("");

  const categories = useMemo(
    () => [
      { key: "all", emojis: ALL_EMOJI },
      ...EMOJI_CATEGORIES,
    ],
    []
  );

  const query = search.trim().toLowerCase();

  const visible = useMemo(() => {
    const pool = categories.find((c) => c.key === activeCat)?.emojis ?? ALL_EMOJI;
    if (!query) return pool;
    // Match against the emoji character itself, English aliases, or category
    // keywords (localized).
    const direct = pool.filter((e) => e.includes(search.trim()));
    const aliasMatch = Object.entries(EMOJI_ALIASES)
      .filter(([k]) => k.includes(query) || query.includes(k))
      .flatMap(([, v]) => v);
    const catKeys = EMOJI_CATEGORIES.filter((c) =>
      t(`labels.categories.${c.key}`).toLowerCase().includes(query)
    ).flatMap((c) => c.emojis);
    return Array.from(new Set([...direct, ...aliasMatch, ...catKeys])).filter(
      (e) => pool.includes(e)
    );
  }, [categories, activeCat, query, search, t]);

  const copyEmoji = async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopied(emoji);
      setTimeout(() => setCopied(""), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="emoji-picker"
    >
      <div className="max-w-4xl space-y-4">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("labels.searchPlaceholder")}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-base text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                activeCat === c.key
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {t(`labels.categories.${c.key}`)}
            </button>
          ))}
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <div className="grid grid-cols-4 gap-1 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {visible.map((emoji, i) => (
              <button
                key={`${emoji}-${i}`}
                onClick={() => copyEmoji(emoji)}
                title={t("labels.copy")}
                className="flex aspect-square items-center justify-center rounded-lg text-3xl transition-colors hover:bg-zinc-800 sm:text-4xl"
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-zinc-500">
            {t("labels.noResults")}
          </p>
        )}

        <p className="text-center text-xs text-zinc-500">
          {t("labels.count", { count: visible.length })} ·{" "}
          {copied ? t("labels.copied") : t("labels.clickToCopy")}
        </p>
      </div>
    </ToolLayout>
  );
}
