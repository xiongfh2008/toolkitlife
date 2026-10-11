"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";
import { generate, type CodeLang } from "@/lib/json-to-code";

interface JsonToCodeClientProps {
  slug: string;
  lang: CodeLang;
  example: string;
  /** Go tool: expose the package-name option. */
  showPackageName?: boolean;
}

export default function JsonToCodeClient({
  slug,
  lang,
  example,
  showPackageName = false,
}: JsonToCodeClientProps) {
  const t = useTranslations(`tools.${slug}`);
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [input, setInput] = useState("");
  const [rootName, setRootName] = useState("");
  const [packageName, setPackageName] = useState("main");

  // Live conversion — re-runs on every keystroke; pure string building, no eval.
  const { code, error } = useMemo(() => {
    if (!input.trim()) return { code: "", error: "" };
    const result = generate(input, rootName.trim() || "Root", lang, packageName.trim() || "main");
    if (result.error) {
      const detail = result.detail ? `: ${result.detail}` : "";
      return { code: "", error: `${t("labels.errorInvalidJson")}${detail}` };
    }
    return { code: result.code, error: "" };
  }, [input, rootName, packageName, lang, t]);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug={slug}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {/* Options + actions */}
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor={`${slug}-root`} className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.rootName")}
            </label>
            <input
              id={`${slug}-root`}
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              placeholder={t("labels.rootNamePlaceholder")}
              className="w-44 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          {showPackageName && (
            <div>
              <label htmlFor={`${slug}-pkg`} className="mb-1 block text-sm font-medium text-zinc-300">
                {t("labels.packageName")}
              </label>
              <input
                id={`${slug}-pkg`}
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="main"
                className="w-44 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setInput(example)}
              className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors"
            >
              {t("labels.loadExample")}
            </button>
            <button
              onClick={() => setInput("")}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              {t("labels.clear")}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-400 break-words">
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label htmlFor={`${slug}-input`} className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.input")}
            </label>
            <textarea
              id={`${slug}-input`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("labels.inputPlaceholder")}
              rows={16}
              spellCheck={false}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-300">{t("labels.output")}</label>
              {code && (
                <CopyButton text={code} label={t("buttons.copy")} copiedLabel={t("buttons.copied")} />
              )}
            </div>
            <pre
              className={`min-h-[16.5rem] h-full overflow-auto rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 font-mono text-xs whitespace-pre ${
                code ? "text-zinc-100" : "text-zinc-600"
              }`}
            >
              {code || t("labels.outputPlaceholder")}
            </pre>
          </div>
        </div>

        <p className="text-xs text-zinc-500">{t("labels.privacy")}</p>
      </div>
    </ToolLayout>
  );
}
