"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import JSZip from "jszip";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

interface Item {
  text: string;
  dataUrl: string;
}

export default function QrcodeBatchPage() {
  const t = useTranslations("tools.qrcode-batch");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [text, setText] = useState("https://example.com\nhttps://toolkitlife.com");
  const [items, setItems] = useState<Item[]>([]);
  const [size, setSize] = useState(256);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const generate = useCallback(async () => {
    setError("");
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;
    setProcessing(true);
    try {
      const list: Item[] = [];
      for (const line of lines) {
        const dataUrl = await QRCode.toDataURL(line, { width: size, margin: 1, errorCorrectionLevel: "M" });
        list.push({ text: line, dataUrl });
      }
      setItems(list);
    } catch (e) {
      console.error(e);
      setError(t("errors.failed"));
    } finally {
      setProcessing(false);
    }
  }, [text, size, t]);

  const downloadOne = (item: Item) => {
    const name = item.text.replace(/[^a-z0-9]+/gi, "-").slice(0, 40) || "qr";
    const a = document.createElement("a");
    a.href = item.dataUrl;
    a.download = `${name}.png`;
    a.click();
  };

  const downloadAll = async () => {
    if (items.length === 0) return;
    const zip = new JSZip();
    items.forEach((item, i) => {
      const name = item.text.replace(/[^a-z0-9]+/gi, "-").slice(0, 40) || `qr-${i + 1}`;
      zip.file(`${name}.png`, item.dataUrl.split(",")[1], { base64: true });
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcodes.zip";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="qrcode-batch"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.list")}</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-zinc-500">{t("labels.hint")}</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.size")} · {size}px</label>
              <input type="range" min={128} max={1024} step={64} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <button onClick={() => void generate()} disabled={processing} className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}>
              {processing ? t("buttons.processing") : t("buttons.generate")}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        {items.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-300">
                {t("labels.count", { count: items.length })}
              </p>
              <button onClick={() => void downloadAll()} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>
                {t("buttons.downloadAll")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((item, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.dataUrl} alt={`QR ${i + 1}`} className="w-full" />
                  <div className="px-2 py-1.5">
                    <p className="truncate text-xs text-zinc-500" title={item.text}>
                      {i + 1}. {item.text}
                    </p>
                    <button onClick={() => downloadOne(item)} className="mt-1 w-full rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-blue-600 hover:text-white">
                      {t("buttons.download")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
