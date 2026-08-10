"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import JSZip from "jszip";

const MAX_FILES = 100;

interface Item {
  id: number;
  name: string;
  url: string;
  newName?: string;
}

function buildNewName(name: string, prefix: string, index: number, padding: number): string {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
  const num = String(index).padStart(padding, "0");
  return `${prefix}${num}${ext}`;
}

export default function BatchRenamePage() {
  const t = useTranslations("tools.batch-rename");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [items, setItems] = useState<Item[]>([]);
  const [prefix, setPrefix] = useState("image_");
  const [start, setStart] = useState(1);
  const [padding, setPadding] = useState(3);
  const [zipping, setZipping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const addFiles = useCallback((files: FileList | File[]) => {
    setError("");
    setItems((prev) => {
      const next = [...prev];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        if (next.length >= MAX_FILES) break;
        next.push({ id: Date.now() + Math.random(), name: file.name, url: URL.createObjectURL(file) });
      }
      return next;
    });
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const renamed = useCallback(() => {
    return items.map((item, idx) => ({
      ...item,
      newName: buildNewName(item.name, prefix, start + idx, padding),
    }));
  }, [items, prefix, start, padding]);

  const downloadZip = useCallback(async () => {
    if (items.length === 0 || zipping) return;
    setZipping(true);
    setError("");
    try {
      const list = renamed();
      const zip = new JSZip();
      for (const item of list) {
        const blob = await fetch(item.url).then((res) => res.blob());
        zip.file(item.newName ?? item.name, blob);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "renamed-images.zip";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setZipping(false);
    }
  }, [items, zipping, renamed, t]);

  const copyList = async () => {
    const list = renamed();
    const text = list
      .map((item) => `${item.name} → ${item.newName ?? item.name}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const handleNewImage = () => {
    for (const item of items) URL.revokeObjectURL(item.url);
    setItems([]);
    setCopied(false);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const inputCls =
    "rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="batch-rename"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {items.length === 0 ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("br-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">📝</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="br-in"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm text-zinc-400">{t("labels.prefix")}</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className={`${inputCls} w-full`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">{t("labels.start")}</label>
                <input
                  type="number"
                  min={0}
                  value={start}
                  onChange={(e) => setStart(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className={`${inputCls} w-full`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  {t("labels.padding")}: {padding}
                </label>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={padding}
                  onChange={(e) => setPadding(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void downloadZip()}
                disabled={zipping}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {zipping ? t("status.zipping") : t("buttons.downloadZip")}
              </button>
              <button
                onClick={() => void copyList()}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {copied ? t("labels.copied") : t("buttons.copy")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
              <span className="text-xs text-zinc-500">
                {items.length} / {MAX_FILES}
              </span>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div>
              <p className="mb-2 text-sm font-medium text-zinc-300">{t("labels.preview")}</p>
              <div className="max-h-80 space-y-1.5 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                {renamed().map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span className="truncate text-zinc-500">{item.name}</span>
                    <span className="text-zinc-600">→</span>
                    <span className="truncate font-mono text-blue-400">{item.newName}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto shrink-0 text-zinc-600 transition-colors hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
