"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const SAMPLE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Viewer Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; background: #f4f4f5; }
    h1 { color: #2563eb; }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a live preview of your HTML code.</p>
</body>
</html>`;

export default function HtmlViewerPage() {
  const t = useTranslations("tools.html-viewer");
  const [html, setHtml] = useState(SAMPLE);
  const [mode, setMode] = useState<"preview" | "source">("preview");

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="html-viewer"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-zinc-300">{t("labels.html")}</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={20}
            spellCheck={false}
            className={`${inputCls} font-mono text-xs`}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setHtml("");
              }}
              className="rounded-lg px-4 py-2 text-sm font-medium bg-zinc-700 hover:bg-zinc-600 text-white transition-colors"
            >
              {t("buttons.clear")}
            </button>
            <CopyButton text={html} label={t("buttons.copy")} />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 p-1">
            {(["preview", "source"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  mode === m ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {t(`tabs.${m}`)}
              </button>
            ))}
          </div>
          {mode === "preview" ? (
            <iframe
              title={t("tabs.preview")}
              srcDoc={html}
              sandbox="allow-same-origin"
              className="h-[520px] w-full rounded-lg border border-zinc-700 bg-white"
            />
          ) : (
            <pre className="h-[520px] overflow-auto rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-xs leading-relaxed text-emerald-300">
              {html}
            </pre>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
