"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface WordStat {
  word: string;
  count: number;
  density: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'’\- ]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export default function KeywordDensityPage() {
  const t = useTranslations("tools.keyword-density");
  const [content, setContent] = useState("");
  const [minLength, setMinLength] = useState(3);
  const [topN, setTopN] = useState(10);
  const [analyzed, setAnalyzed] = useState(false);

  const stats = useMemo(() => {
    const words = tokenize(content);
    const totalWords = words.length;
    const freq = new Map<string, number>();
    for (const w of words) {
      if (w.length < minLength) continue;
      freq.set(w, (freq.get(w) ?? 0) + 1);
    }
    const entries: WordStat[] = [...freq.entries()]
      .map(([word, count]) => ({
        word,
        count,
        density: totalWords ? (count / totalWords) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count || b.word.localeCompare(a.word))
      .slice(0, topN);
    return { totalWords, uniqueWords: freq.size, entries };
  }, [content, minLength, topN]);

  const maxCount = stats.entries[0]?.count ?? 1;

  const csv = useMemo(() => {
    const header = `${t("csv.word")},${t("csv.count")},${t("csv.density")}`;
    const rows = stats.entries.map(
      (e) => `${e.word},${e.count},${e.density.toFixed(2)}%`
    );
    return [header, ...rows].join("\n");
  }, [stats.entries, t]);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="keyword-density"
    >
      <div className="max-w-4xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.content")}
          </label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setAnalyzed(false);
            }}
            placeholder={t("placeholders.content")}
            rows={10}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.minLength")}
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={minLength}
              onChange={(e) =>
                setMinLength(
                  Math.max(1, Math.min(20, Number(e.target.value) || 1))
                )
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.showTop")}
            </label>
            <select
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            >
              <option value={10}>{t("options.top10")}</option>
              <option value={20}>{t("options.top20")}</option>
              <option value={50}>{t("options.top50")}</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setAnalyzed(true)}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            {t("buttons.analyze")}
          </button>
          <button
            onClick={() => {
              setContent("");
              setAnalyzed(false);
            }}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
          >
            {t("buttons.clear")}
          </button>
        </div>

        {analyzed && content.trim() && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-zinc-800 p-3">
                <div className="text-2xl font-semibold text-zinc-100">
                  {stats.totalWords}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {t("labels.totalWords")}
                </div>
              </div>
              <div className="rounded-lg bg-zinc-800 p-3">
                <div className="text-2xl font-semibold text-zinc-100">
                  {stats.uniqueWords}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {t("labels.uniqueWords")}
                </div>
              </div>
              <div className="rounded-lg bg-zinc-800 p-3">
                <div className="text-2xl font-semibold text-zinc-100">
                  {stats.entries[0] ? `${stats.entries[0].density.toFixed(1)}%` : "—"}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {t("labels.topDensity")}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.results")}
              </h3>
              <CopyButton text={csv} className="text-xs px-2 py-1" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-left text-xs uppercase tracking-wide text-zinc-500">
                    <th className="py-2 pr-4 font-medium">#</th>
                    <th className="py-2 pr-4 font-medium">{t("labels.word")}</th>
                    <th className="py-2 pr-4 font-medium">{t("labels.count")}</th>
                    <th className="py-2 font-medium">{t("labels.density")}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.entries.map((e, i) => (
                    <tr
                      key={e.word}
                      className="border-b border-zinc-800 text-zinc-300"
                    >
                      <td className="py-2 pr-4 text-zinc-500">{i + 1}</td>
                      <td className="py-2 pr-4 font-medium text-zinc-100">
                        {e.word}
                      </td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8">{e.count}</span>
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-700">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{
                                width: `${Math.max(4, (e.count / maxCount) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2">{e.density.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {analyzed && !content.trim() && (
          <p className="text-sm text-zinc-500">{t("messages.empty")}</p>
        )}
      </div>
    </ToolLayout>
  );
}
