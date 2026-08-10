"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Mode = "encode" | "decode";

interface GuideSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export default function Base64EncoderPage() {
  const t = useTranslations("tools.base64-encoder");
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const guideIntro = t.raw("guide.intro") as { title: string; paragraphs: string[] };
  const guideSections = t.raw("guide.sections") as GuideSection[];

  const handleConvert = (text: string, m: Mode) => {
    if (!text.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      if (m === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setOutput(decodeURIComponent(escape(atob(text.replace(/\s/g, "")))));
      }
      setError("");
    } catch {
      setError(m === "encode" ? t("labels.errorEncode") : t("labels.errorDecode"));
      setOutput("");
    }
  };

  const handleInputChange = (text: string) => {
    setInput(text);
    setImagePreview("");
    handleConvert(text, mode);
  };

  const handleModeChange = (m: Mode) => {
    setMode(m);
    setImagePreview("");
    handleConvert(input, m);
  };

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (file.type.startsWith("image/")) {
        setImagePreview(dataUrl);
      }
      // Extract base64 portion or show full data URL
      setInput(file.name);
      setOutput(dataUrl);
      setError("");
      setMode("encode");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileRead(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileRead(file);
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="base64-encoder"
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
        {/* Mode toggle */}
        <div className="flex gap-2">
          {(["encode", "decode"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t(`buttons.${m}`)}
            </button>
          ))}
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
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              {mode === "encode" ? t("labels.textToEncode") : t("labels.base64ToDecode")}
            </label>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={mode === "encode" ? t("labels.enterText") : t("labels.pasteBase64")}
              rows={10}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 resize-y"
            />
          </div>

          {/* Output */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">{t("labels.output")}</label>
              {output && <CopyButton text={output} className="text-xs px-2 py-1" />}
            </div>
            <textarea
              value={output}
              readOnly
              rows={10}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-mono text-sm text-zinc-300 outline-none resize-y"
            />
          </div>
        </div>

        {/* File upload */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
          }`}
        >
          <p className="text-sm text-zinc-400">
            {t("labels.uploadText")}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {t("labels.uploadHint")}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-2 text-sm font-medium text-zinc-300">{t("labels.imagePreview")}</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg" />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
