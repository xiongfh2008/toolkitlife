"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { v4 as uuidv4 } from "uuid";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface GuideSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export default function UUIDGeneratorPage() {
  const t = useTranslations("tools.uuid-generator");
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [bulkCount, setBulkCount] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const guideIntro = t.raw("guide.intro") as { title: string; paragraphs: string[] };
  const guideSections = t.raw("guide.sections") as GuideSection[];

  const formatUuid = useCallback(
    (id: string): string => {
      const result = hyphens ? id : id.replace(/-/g, "");
      return uppercase ? result.toUpperCase() : result.toLowerCase();
    },
    [uppercase, hyphens]
  );

  const generateOne = () => {
    setUuids([uuidv4()]);
  };

  const generateBulk = () => {
    const count = Math.min(100, Math.max(1, bulkCount));
    setUuids(Array.from({ length: count }, () => uuidv4()));
  };

  const allFormatted = uuids.map(formatUuid);

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="uuid-generator"
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
        {/* Controls */}
        <div className="flex flex-wrap items-end gap-4">
          <button
            onClick={generateOne}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            {t("buttons.generateOne")}
          </button>

          <div className="flex items-end gap-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.quantity")}</label>
              <input
                type="number"
                min={1}
                max={100}
                value={bulkCount}
                onChange={(e) => setBulkCount(Number(e.target.value))}
                className="w-20 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={generateBulk}
              className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 transition-colors"
            >
              {t("buttons.bulkGenerate")}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="accent-blue-500"
              />
              <span className="text-sm text-zinc-300">{t("labels.uppercase")}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="accent-blue-500"
              />
              <span className="text-sm text-zinc-300">{t("labels.hyphens")}</span>
            </label>
          </div>
        </div>

        {/* UUID list */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-zinc-400">{t("labels.count", { count: allFormatted.length })}</span>
            <CopyButton text={allFormatted.join("\n")} label={t("buttons.copyAll")} />
          </div>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {allFormatted.map((id, i) => (
              <div key={i} className="flex items-center gap-2 rounded bg-zinc-800 px-3 py-2">
                <code className="flex-1 font-mono text-sm text-zinc-200">{id}</code>
                <CopyButton text={id} label={t("buttons.copy")} className="text-xs px-2 py-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
