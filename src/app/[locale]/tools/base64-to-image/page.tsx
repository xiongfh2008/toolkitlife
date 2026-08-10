"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type ImageFormat = "png" | "jpeg" | "gif" | "webp" | "svg";

interface GuideSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

const MIME_BY_FORMAT: Record<ImageFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
};

const EXT_BY_FORMAT: Record<ImageFormat, string> = {
  png: "png",
  jpeg: "jpg",
  gif: "gif",
  webp: "webp",
  svg: "svg",
};

const DATA_URL_RE = /^data:image\/([a-zA-Z0-9.+-]+)(?:;[^,]*)?;base64,/;

function detectFormat(base64: string): ImageFormat | null {
  const mime = base64.match(DATA_URL_RE);
  if (mime) {
    const ext = mime[1].toLowerCase();
    if (ext === "jpg" || ext === "jpeg") return "jpeg";
    if (ext === "svg" || ext === "svg+xml") return "svg";
    if (ext === "png" || ext === "gif" || ext === "webp") return ext as ImageFormat;
    return null;
  }
  const s = base64.replace(/\s/g, "");
  if (/^\/9j/.test(s)) return "jpeg";
  if (/^iVBOR/.test(s)) return "png";
  if (/^R0lGOD/.test(s)) return "gif";
  if (/^UklGR/.test(s)) return "webp";
  if (/^PHN2Zy/.test(s)) return "svg";
  return null;
}

function decodeSize(base64: string): number {
  const s = base64.replace(/\s/g, "");
  const padding = s.endsWith("==") ? 2 : s.endsWith("=") ? 1 : 0;
  return Math.floor((s.length * 3) / 4) - padding;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function Base64ToImagePage() {
  const t = useTranslations("tools.base64-to-image");

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const guideIntro = t.raw("guide.intro") as { title: string; paragraphs: string[] };
  const guideSections = t.raw("guide.sections") as GuideSection[];

  const [input, setInput] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [format, setFormat] = useState<ImageFormat | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [downloadName, setDownloadName] = useState("base64-image");

  const handleChange = (value: string) => {
    setInput(value);
    setError("");
    setImageSrc("");
    setFormat(null);
    setSize(null);

    const trimmed = value.trim();
    if (!trimmed) return;

    const prefixMatch = trimmed.match(DATA_URL_RE);
    const rawBase64 = prefixMatch
      ? trimmed.replace(DATA_URL_RE, "").replace(/\s/g, "")
      : trimmed.replace(/\s/g, "");

    if (!rawBase64 || !/^[A-Za-z0-9+/]*={0,2}$/.test(rawBase64)) {
      setError(t("labels.invalidBase64"));
      return;
    }

    const detected = detectFormat(rawBase64);
    if (!detected) {
      setError(t("labels.notImage"));
      return;
    }

    const src = prefixMatch
      ? trimmed.replace(/\s/g, "")
      : `data:${MIME_BY_FORMAT[detected]};base64,${rawBase64}`;

    setImageSrc(src);
    setFormat(detected);
    setSize(decodeSize(rawBase64));
    setDownloadName(`base64-image.${EXT_BY_FORMAT[detected]}`);
  };

  const handleClear = () => {
    setInput("");
    setError("");
    setImageSrc("");
    setFormat(null);
    setSize(null);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="base64-to-image"
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
      <div className="space-y-4">
        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Input */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {t("labels.pasteBase64")}
          </label>
          <textarea
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={t("labels.placeholder")}
            rows={8}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
          />
          <p className="mt-2 text-xs text-zinc-500">{t("labels.hint")}</p>
        </div>

        {/* Empty state */}
        {!imageSrc && !error && (
          <p className="text-sm text-zinc-500">{t("labels.noData")}</p>
        )}

        {/* Preview */}
        {imageSrc && (
          <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-sm font-medium text-zinc-300">{t("labels.preview")}</h3>
            <div className="flex items-center justify-center rounded-lg bg-zinc-950 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt="Base64 image preview" className="max-h-80 max-w-full rounded-lg" />
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-400">
              <span>
                <span className="text-zinc-500">{t("labels.format")}: </span>
                {format?.toUpperCase()}
              </span>
              {size !== null && (
                <span>
                  <span className="text-zinc-500">{t("labels.size")}: </span>
                  {formatSize(size)}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={imageSrc}
                download={downloadName}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              >
                {t("buttons.download")}
              </a>
              <CopyButton text={imageSrc} label={t("buttons.copyDataUrl")} />
              <button
                onClick={handleClear}
                className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700"
              >
                {t("buttons.clear")}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
