"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function minifyJs(input: string): string {
  let out = "";
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    const next = input[i + 1];

    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      out += quote;
      i++;
      while (i < input.length) {
        const ch = input[i];
        out += ch;
        if (ch === "\\" && i + 1 < input.length) {
          out += input[i + 1];
          i += 2;
          continue;
        }
        if (ch === quote) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }

    if (c === "/" && next === "/") {
      while (i < input.length && input[i] !== "\n") i++;
      out += " ";
      continue;
    }

    if (c === "/" && next === "*") {
      i += 2;
      while (i < input.length && !(input[i] === "*" && input[i + 1] === "/")) i++;
      i += 2;
      out += " ";
      continue;
    }

    if (c === "/" && next !== undefined) {
      const prev = out.trimEnd().slice(-1);
      const looksLikeRegex = /[=(,:\[!&|?;{}]/.test(prev) || prev === "";
      if (looksLikeRegex) {
        out += "/";
        i++;
        while (i < input.length) {
          const ch = input[i];
          out += ch;
          if (ch === "\\" && i + 1 < input.length) {
            out += input[i + 1];
            i += 2;
            continue;
          }
          if (ch === "/") {
            i++;
            while (i < input.length && /[gimsuy]/.test(input[i])) {
              out += input[i];
              i++;
            }
            break;
          }
          if (ch === "[") {
            i++;
            while (i < input.length && input[i] !== "]") {
              const rch = input[i];
              out += rch;
              if (rch === "\\" && i + 1 < input.length) {
                out += input[i + 1];
                i += 2;
              } else {
                i++;
              }
            }
            if (i < input.length) {
              out += "]";
              i++;
            }
            continue;
          }
          i++;
        }
        continue;
      }
    }

    if (/\s/.test(c)) {
      out += " ";
      while (i < input.length && /\s/.test(input[i])) i++;
      continue;
    }

    out += c;
    i++;
  }
  return out.replace(/\s+/g, " ").trim();
}

export default function JsMinifierPage() {
  const t = useTranslations("tools.js-minifier");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [saved, setSaved] = useState(0);

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setSaved(0);
      return;
    }
    const result = minifyJs(input);
    setOutput(result);
    setSaved(Math.max(0, input.length - result.length));
  }, [input]);

  const clear = () => {
    setInput("");
    setOutput("");
    setSaved(0);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="js-minifier"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={minify} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
            {t("buttons.minify")}
          </button>
          <button onClick={clear} className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-700 transition-colors">
            {t("buttons.clear")}
          </button>
          {saved > 0 && (
            <span className="text-sm text-green-400">
              {t("labels.saved", { bytes: saved })}
            </span>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.input")}</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("labels.inputPlaceholder")}
              rows={20}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
              spellCheck={false}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.output")}</label>
              {output && <CopyButton text={output} className="text-xs px-2 py-1" />}
            </div>
            <textarea
              value={output}
              readOnly
              rows={20}
              placeholder={t("labels.outputPlaceholder")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-300 placeholder-zinc-500 outline-none resize-y"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
