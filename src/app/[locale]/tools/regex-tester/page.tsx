"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface MatchInfo {
  match: string;
  index: number;
  groups: string[];
}

const commonPatterns = [
  { key: "email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
  { key: "url", pattern: "https?://[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+" },
  { key: "phone", pattern: "\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,3}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}" },
  { key: "ipv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
  { key: "date", pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])" },
  { key: "hexColor", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b" },
];

export default function RegexTesterPage() {
  const t = useTranslations("tools.regex-tester");
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false });
  const [testString, setTestString] = useState("");
  const [showReplace, setShowReplace] = useState(false);
  const [replacement, setReplacement] = useState("");

  const flagDescriptions = t.raw("labels.flagDescriptions") as Record<string, string>;
  const patternNames = t.raw("commonPatterns") as Record<string, string>;

  const flagString = Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join("");

  const { matches, error, highlightedHtml, replaceResult } = useMemo(() => {
    if (!pattern) return { matches: [] as MatchInfo[], error: "", highlightedHtml: "", replaceResult: "" };
    try {
      const regex = new RegExp(pattern, flagString);
      const matchList: MatchInfo[] = [];
      let match: RegExpExecArray | null;

      if (flags.g) {
        while ((match = regex.exec(testString)) !== null) {
          matchList.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match[0].length === 0) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          matchList.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      let html = "";
      let lastIndex = 0;
      let colorToggle = false;
      const sortedMatches = [...matchList].sort((a, b) => a.index - b.index);
      for (const m of sortedMatches) {
        const before = testString.slice(lastIndex, m.index);
        html += escapeHtml(before);
        const cls = colorToggle ? "regex-match-alt" : "regex-match";
        html += `<span class="${cls}">${escapeHtml(m.match)}</span>`;
        lastIndex = m.index + m.match.length;
        colorToggle = !colorToggle;
      }
      html += escapeHtml(testString.slice(lastIndex));

      let rr = "";
      if (showReplace && replacement !== undefined) {
        try {
          rr = testString.replace(new RegExp(pattern, flagString), replacement);
        } catch {
          rr = "";
        }
      }

      return { matches: matchList, error: "", highlightedHtml: html, replaceResult: rr };
    } catch (e: unknown) {
      return {
        matches: [] as MatchInfo[],
        error: e instanceof Error ? e.message : t("labels.errorFallback"),
        highlightedHtml: "",
        replaceResult: "",
      };
    }
  }, [pattern, flagString, testString, flags.g, showReplace, replacement, t]);

  function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  const howToUseSteps = t.raw("guide.howToUse.steps") as string[];
  const tipsItems = t.raw("guide.tips.items") as string[];
  const useCaseItems = t.raw("guide.useCases.items") as string[];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="regex-tester"
      keywords={t.raw("metadata.keywords") as string[]}
      guide={
        <>
          <h2>{t("guide.introduction.title")}</h2>
          <p>{t("guide.introduction.p1")}</p>
          <p>{t("guide.introduction.p2")}</p>

          <h3>{t("guide.howToUse.title")}</h3>
          <ul>
            {howToUseSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>

          <h3>{t("guide.flags.title")}</h3>
          <p>{t("guide.flags.body")}</p>

          <h3>{t("guide.tips.title")}</h3>
          <ul>
            {tipsItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3>{t("guide.useCases.title")}</h3>
          <ul>
            {useCaseItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      }
      faqs={t.raw("faqs") as FAQ[]}
      relatedTools={t.raw("relatedTools") as RelatedTool[]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Pattern */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.pattern")}</label>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder={t("labels.patternPlaceholder")}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
              <span className="text-zinc-500">/{flagString}</span>
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap items-center gap-3">
            {(["g", "i", "m", "s", "u"] as const).map((f) => (
              <label key={f} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags[f]}
                  onChange={(e) => setFlags((prev) => ({ ...prev, [f]: e.target.checked }))}
                  className="accent-blue-500"
                />
                <span className="text-sm text-zinc-300 font-mono">{f}</span>
                <span className="text-xs text-zinc-500">({flagDescriptions[f]})</span>
              </label>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Test string */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.testString")}</label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              rows={6}
              placeholder={t("labels.testStringPlaceholder")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
            />
          </div>

          {/* Highlighted result */}
          {highlightedHtml && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.highlightedMatches")}</label>
              <div
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 whitespace-pre-wrap break-all"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            </div>
          )}

          {/* Replace mode */}
          <div>
            <button
              onClick={() => setShowReplace(!showReplace)}
              className="mb-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showReplace ? t("labels.replaceMode.hide") : t("labels.replaceMode.show")}
            </button>
            {showReplace && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={replacement}
                  onChange={(e) => setReplacement(e.target.value)}
                  placeholder={t("labels.replaceMode.placeholder")}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500"
                />
                {replaceResult && (
                  <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-zinc-400">{t("labels.replaceMode.result")}</label>
                      <CopyButton text={replaceResult} label={t("labels.replaceMode.copy")} className="text-xs px-2 py-0.5" />
                    </div>
                    <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap">{replaceResult}</pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Matches list */}
          {matches.length > 0 && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="mb-2 text-sm font-semibold text-zinc-300">
                {t("labels.matchesTitle", { count: matches.length })}
              </h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {matches.map((m, i) => (
                  <div key={i} className="rounded bg-zinc-800 px-3 py-2 text-sm">
                    <span className="text-zinc-400">#{i + 1}</span>{" "}
                    <code className="text-blue-300">&quot;{m.match}&quot;</code>{" "}
                    <span className="text-zinc-500">{t("labels.matchIndex", { index: m.index })}</span>
                    {m.groups.length > 0 && (
                      <div className="mt-1 text-xs text-zinc-500">
                        {t("labels.matchGroups")}{" "}
                        {m.groups.map((g, gi) => (
                          <span key={gi} className="mr-2">
                            ${gi + 1}=&quot;<span className="text-purple-300">{g}</span>&quot;
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - common patterns */}
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-3 text-sm font-semibold text-zinc-300">{t("labels.commonPatternsTitle")}</h3>
            <div className="space-y-2">
              {commonPatterns.map((cp) => (
                <button
                  key={cp.key}
                  onClick={() => setPattern(cp.pattern)}
                  className="w-full rounded bg-zinc-800 px-3 py-2 text-left transition-colors hover:bg-zinc-700"
                >
                  <div className="text-sm font-medium text-zinc-300">{patternNames[cp.key]}</div>
                  <code className="text-xs text-zinc-500 break-all">{cp.pattern}</code>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
