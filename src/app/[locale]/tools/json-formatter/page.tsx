"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "json-number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "json-key";
        } else {
          cls = "json-string";
        }
      } else if (/true|false/.test(match)) {
        cls = "json-boolean";
      } else if (/null/.test(match)) {
        cls = "json-null";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

type IndentType = "2" | "4" | "tab";

interface GuideSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export default function JSONFormatterPage() {
  const t = useTranslations("tools.json-formatter");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [highlighted, setHighlighted] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState<IndentType>("2");

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const guideIntro = t.raw("guide.intro") as { title: string; paragraphs: string[] };
  const guideSections = t.raw("guide.sections") as GuideSection[];

  const getIndent = useCallback((): string | number => {
    switch (indent) {
      case "2": return 2;
      case "4": return 4;
      case "tab": return "\t";
    }
  }, [indent]);

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, getIndent());
      setOutput(formatted);
      setHighlighted(syntaxHighlight(formatted));
      setError("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t("labels.errorFallback");
      setError(msg);
      setOutput("");
      setHighlighted("");
    }
  }, [input, t, getIndent]);

  const minify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const mini = JSON.stringify(parsed);
      setOutput(mini);
      setHighlighted(syntaxHighlight(mini));
      setError("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t("labels.errorFallback");
      setError(msg);
      setOutput("");
      setHighlighted("");
    }
  }, [input, t]);

  const validate = useCallback(() => {
    try {
      JSON.parse(input);
      setError("");
      setOutput("Valid JSON!");
      setHighlighted("<span class='json-boolean'>Valid JSON!</span>");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t("labels.errorFallback");
      setError(msg);
    }
  }, [input, t]);

  const clear = () => {
    setInput("");
    setOutput("");
    setHighlighted("");
    setError("");
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="json-formatter"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
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
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={format} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
            {t("buttons.format")}
          </button>
          <button onClick={minify} className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors">
            {t("buttons.minify")}
          </button>
          <button onClick={validate} className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors">
            {t("buttons.validate")}
          </button>
          <button onClick={clear} className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-700 transition-colors">
            {t("buttons.clear")}
          </button>
          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm text-zinc-400">{t("labels.indent")}</label>
            <select
              value={indent}
              onChange={(e) => setIndent(e.target.value as IndentType)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-zinc-100 outline-none focus:border-blue-500"
            >
              <option value="2">{t("options.indent2")}</option>
              <option value="4">{t("options.indent4")}</option>
              <option value="tab">{t("options.indentTab")}</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Input */}
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

          {/* Output */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.output")}</label>
              {output && <CopyButton text={output} className="text-xs px-2 py-1" />}
            </div>
            <div className="min-h-[480px] overflow-auto rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              {highlighted ? (
                <pre
                  className="whitespace-pre-wrap font-mono text-sm"
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
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
