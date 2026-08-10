"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function ImageToBase64Page() {
  const t = useTranslations("tools.image-to-base64");
  const inputRef = useRef<HTMLInputElement>(null);
  const [base64, setBase64] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const processFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t("errors.invalidImage"));
      setBase64("");
      setFileName("");
      setFileSize("");
      return;
    }

    setError("");
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + " KB");

    const reader = new FileReader();
    reader.onload = (e) => {
      setBase64((e.target?.result as string) || "");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const clear = () => {
    setBase64("");
    setFileName("");
    setFileSize("");
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="image-to-base64"
    >
      <div className="max-w-3xl space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => processFile(e.target.files?.[0])}
          className="hidden"
        />

        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            dragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
          }`}
        >
          <p className="text-lg text-zinc-300">{t("labels.dropImage")}</p>
          <p className="mt-1 text-sm text-zinc-500">{t("labels.orClick")}</p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {fileName && (
          <div className="text-sm text-zinc-400">
            <p>
              {t("labels.fileName")}: {fileName}
            </p>
            <p>
              {t("labels.fileSize")}: {fileSize}
            </p>
          </div>
        )}

        {base64 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="mb-2 text-sm font-medium text-zinc-300">
                {t("labels.preview")}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={base64}
                alt={fileName}
                className="max-h-48 rounded-lg object-contain"
              />
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-300">
                  {t("labels.output")}
                </h3>
                <div className="flex gap-2">
                  <CopyButton text={base64} className="text-xs px-2 py-1" />
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
                value={base64}
                rows={6}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs text-zinc-300 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
