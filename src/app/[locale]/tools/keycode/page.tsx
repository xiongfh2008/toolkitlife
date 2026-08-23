"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

interface KeyInfo {
  key: string;
  code: string;
  keyCode: number;
  location: string;
}

export default function KeycodePage() {
  const t = useTranslations("tools.keycode");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [info, setInfo] = useState<KeyInfo | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setInfo({
        key: e.key === " " ? "Space" : e.key,
        code: e.code,
        keyCode: e.keyCode,
        location: String(e.location),
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const cards: { label: string; value: string }[] = info
    ? [
        { label: t("labels.key"), value: info.key },
        { label: t("labels.code"), value: info.code },
        { label: "KeyCode", value: String(info.keyCode) },
        { label: t("labels.location"), value: info.location },
      ]
    : [];

  return (
    <ToolLayout
      title={t("title")}
      slug="keycode"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-6">
        <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 text-sm text-zinc-500">
          {info ? (
            <span className="text-6xl font-bold text-zinc-100">{info.key.length > 3 ? info.key.slice(0, 3) : info.key}</span>
          ) : (
            t("labels.pressAny")
          )}
        </div>
        {info && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cards.map((c) => (
              <div key={c.label} className="rounded-lg border border-zinc-800 p-4 text-center">
                <p className="break-all text-xl font-semibold text-blue-400">{c.value}</p>
                <p className="mt-1 text-xs text-zinc-400">{c.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
