"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface GuideSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export default function WordCounterPage() {
  const t = useTranslations("tools.word-counter");
  const [text, setText] = useState("");

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const guideIntro = t.raw("guide.intro") as { title: string; paragraphs: string[] };
  const guideSections = t.raw("guide.sections") as GuideSection[];

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const wordCount = words.length;
    const charCount = text.length;
    const charNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || (text.trim() ? 1 : 0);
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Word frequency
    const freq: Record<string, number> = {};
    words.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9'-]/g, "");
      if (clean && clean.length > 1) {
        freq[clean] = (freq[clean] || 0) + 1;
      }
    });
    const topWords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return { wordCount, charCount, charNoSpaces, sentences, paragraphs, readingTime, topWords };
  }, [text]);

  const statsList = [
    { label: t("labels.words"), value: stats.wordCount },
    { label: t("labels.characters"), value: stats.charCount },
    { label: t("labels.charactersNoSpaces"), value: stats.charNoSpaces },
    { label: t("labels.sentences"), value: stats.sentences },
    { label: t("labels.paragraphs"), value: stats.paragraphs },
  ];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="word-counter"
      keywords={keywords}
      relatedTools={relatedTools}
      faqs={faqs}
      guide={
        <>
          <h2>{guideIntro.title}</h2>
          {guideIntro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {guideSections.map((section, i) => (
            <section key={i}>
              <h3>{section.title}</h3>
              {section.paragraphs?.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {section.items && (
                <ul>
                  {section.items.map((item, k) => (
                    <li key={k}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Text input */}
        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">{t("labels.enterText")}</label>
            {text && <CopyButton text={text} className="text-xs px-2 py-1" />}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("labels.placeholder")}
            rows={16}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
          />
        </div>

        {/* Stats sidebar */}
        <div className="space-y-4">
          {/* Counts */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-3 text-sm font-semibold text-zinc-300">{t("labels.statistics")}</h3>
            <div className="space-y-2">
              {statsList.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">{s.label}</span>
                  <span className="font-mono text-sm font-medium text-zinc-200">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reading time */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-1 text-sm font-semibold text-zinc-300">{t("labels.readingTime")}</h3>
            <p className="text-2xl font-bold text-blue-400">
              {stats.wordCount === 0 ? "0" : stats.readingTime} {t("labels.min")}
            </p>
            <p className="text-xs text-zinc-500">{t("labels.readingTimeHint")}</p>
          </div>

          {/* Word frequency */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-3 text-sm font-semibold text-zinc-300">{t("labels.topWords")}</h3>
            {stats.topWords.length === 0 ? (
              <p className="text-xs text-zinc-500">{t("labels.topWordsHint")}</p>
            ) : (
              <div className="space-y-1.5">
                {stats.topWords.map(([word, count]) => (
                  <div key={word} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-zinc-300">{word}</span>
                        <span className="text-xs text-zinc-500">{count}</span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-zinc-800">
                        <div
                          className="h-1 rounded-full bg-blue-500"
                          style={{
                            width: `${(count / (stats.topWords[0]?.[1] || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
