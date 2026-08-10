"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const toolbarOrder = [
  "bold",
  "italic",
  "h1",
  "h2",
  "h3",
  "link",
  "image",
  "code",
  "codeBlock",
  "unorderedList",
  "orderedList",
] as const;

export default function MarkdownPreviewPage() {
  const t = useTranslations("tools.markdown-preview");
  const defaultMarkdown = t("defaultMarkdown");
  const [markdown, setMarkdown] = useState(defaultMarkdown);

  const toolbar = t.raw("toolbar") as Record<
    (typeof toolbarOrder)[number],
    { label: string; title: string; before: string; after: string; placeholder: string }
  >;
  const cheatSheet = t.raw("cheatSheet") as { syntax: string; desc: string }[];

  const insertText = useCallback(
    (before: string, after: string, placeholder: string) => {
      const textarea = document.getElementById("md-editor") as HTMLTextAreaElement;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = markdown.substring(start, end);
      const text = selected || placeholder;
      const newText = markdown.substring(0, start) + before + text + after + markdown.substring(end);
      setMarkdown(newText);
      setTimeout(() => {
        textarea.focus();
        const newPos = start + before.length + text.length;
        textarea.setSelectionRange(start + before.length, newPos);
      }, 0);
    },
    [markdown]
  );

  const exportHtml = () => {
    const previewEl = document.getElementById("md-preview");
    if (!previewEl) return;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Markdown Export</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
code { background: #f4f4f5; padding: 2px 6px; border-radius: 4px; font-size: 0.875em; }
pre { background: #f4f4f5; padding: 1rem; border-radius: 8px; overflow-x: auto; }
pre code { background: none; padding: 0; }
blockquote { border-left: 3px solid #3b82f6; padding-left: 1rem; color: #6b7280; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #e5e7eb; padding: 0.5rem; text-align: left; }
th { background: #f9fafb; }
img { max-width: 100%; }
</style>
</head>
<body>
${previewEl.innerHTML}
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-export.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const howToUseSteps = t.raw("guide.howToUse.steps") as string[];
  const tipsItems = t.raw("guide.tips.items") as string[];
  const useCaseItems = t.raw("guide.useCases.items") as string[];

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="markdown-preview"
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

          <h3>{t("guide.supportedFeatures.title")}</h3>
          <p>{t("guide.supportedFeatures.body")}</p>

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
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1.5">
          {toolbarOrder.map((key) => {
            const action = toolbar[key];
            return (
              <button
                key={key}
                onClick={() => insertText(action.before, action.after, action.placeholder)}
                title={action.title}
                className="rounded px-2 py-1 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
              >
                {action.label}
              </button>
            );
          })}
          <div className="ml-auto flex gap-2">
            <button
              onClick={exportHtml}
              className="rounded-lg bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              {t("labels.exportHtml")}
            </button>
            <CopyButton text={markdown} label={t("labels.copyMd")} className="text-xs px-2 py-1" />
          </div>
        </div>

        {/* Split pane */}
        <div className="grid gap-4 lg:grid-cols-2" style={{ minHeight: "500px" }}>
          {/* Editor */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">{t("labels.editor")}</label>
            <textarea
              id="md-editor"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-none"
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">{t("labels.preview")}</label>
            <div
              id="md-preview"
              className="markdown-preview flex-1 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800 px-6 py-4 text-zinc-200"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Cheat sheet */}
        <details className="rounded-lg border border-zinc-800 bg-zinc-900">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-zinc-300 hover:text-zinc-100">
            {t("labels.cheatSheetTitle")}
          </summary>
          <div className="grid gap-2 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
            {cheatSheet.map((item) => (
              <div key={item.syntax} className="flex items-center gap-2 rounded bg-zinc-800 px-3 py-2">
                <code className="text-xs text-blue-300">{item.syntax}</code>
                <span className="text-xs text-zinc-500">{item.desc}</span>
              </div>
            ))}
          </div>
        </details>
      </div>
    </ToolLayout>
  );
}
