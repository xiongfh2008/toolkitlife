"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export default function CopyButton({ text, label, copiedLabel, className = "" }: CopyButtonProps) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        copied
          ? "bg-green-600 text-white"
          : "bg-blue-600 hover:bg-blue-500 text-white"
      } ${className}`}
    >
      {copied ? (copiedLabel ?? t("copied")) : (label ?? t("copy"))}
    </button>
  );
}
