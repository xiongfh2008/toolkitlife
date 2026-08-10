"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function MetaTagGeneratorPage() {
  const t = useTranslations("tools.meta-tag-generator");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [url, setUrl] = useState("");

  const output = useMemo(() => {
    const lines: string[] = [];
    if (title) lines.push(`<title>${escapeHtml(title)}</title>`);
    if (description)
      lines.push(
        `<meta name="description" content="${escapeHtml(description)}">`
      );
    if (title) lines.push(`<meta property="og:title" content="${escapeHtml(title)}">`);
    if (description)
      lines.push(
        `<meta property="og:description" content="${escapeHtml(description)}">`
      );
    if (url) lines.push(`<meta property="og:url" content="${escapeHtml(url)}">`);
    if (siteName)
      lines.push(
        `<meta property="og:site_name" content="${escapeHtml(siteName)}">`
      );
    if (imageUrl)
      lines.push(`<meta property="og:image" content="${escapeHtml(imageUrl)}">`);
    lines.push(`<meta property="og:type" content="website">`);
    lines.push(`<meta name="twitter:card" content="summary_large_image">`);
    if (title)
      lines.push(`<meta name="twitter:title" content="${escapeHtml(title)}">`);
    if (description)
      lines.push(
        `<meta name="twitter:description" content="${escapeHtml(description)}">`
      );
    if (imageUrl)
      lines.push(
        `<meta name="twitter:image" content="${escapeHtml(imageUrl)}">`
      );
    if (url) lines.push(`<link rel="canonical" href="${escapeHtml(url)}">`);
    return lines.join("\n");
  }, [title, description, imageUrl, siteName, url]);

  const clear = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setSiteName("");
    setUrl("");
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="meta-tag-generator"
    >
      <div className="max-w-3xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.title")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Page title"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.siteName")}
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="My Site"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.description")}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of the page"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.url")}
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {t("labels.imageUrl")}
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {output && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">
                {t("labels.output")}
              </h3>
              <div className="flex gap-2">
                <CopyButton text={output} className="text-xs px-2 py-1" />
                <button
                  onClick={clear}
                  className="rounded-lg bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  {t("buttons.clear")}
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={output}
              rows={12}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-mono text-zinc-300 outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
