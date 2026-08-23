"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

type Mode = "byGroups" | "bySize";

export default function GroupRandomizerPage() {
  const t = useTranslations("tools.group-randomizer");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("byGroups");
  const [value, setValue] = useState(2);
  const [groups, setGroups] = useState<string[][]>([]);

  const parseList = () =>
    text
      .split(/\n|,|，|;|；/)
      .map((s) => s.trim())
      .filter(Boolean);

  const group = () => {
    const list = parseList();
    if (list.length === 0) return;
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    if (mode === "byGroups") {
      const n = Math.max(1, Math.min(value, shuffled.length));
      const out: string[][] = Array.from({ length: n }, () => []);
      shuffled.forEach((item, i) => out[i % n].push(item));
      setGroups(out);
    } else {
      const size = Math.max(1, value);
      const out: string[][] = [];
      for (let i = 0; i < shuffled.length; i += size) out.push(shuffled.slice(i, i + size));
      setGroups(out);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="group-randomizer"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.list")}</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder={t("labels.placeholder")}
            className={inputCls}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className={inputCls + " w-auto"}>
            <option value="byGroups">{t("modes.byGroups")}</option>
            <option value="bySize">{t("modes.bySize")}</option>
          </select>
          <input
            type="number"
            min={1}
            max={50}
            value={value}
            onChange={(e) => setValue(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            className="w-20 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={group}
            disabled={parseList().length === 0}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {t("buttons.group")}
          </button>
        </div>
        {groups.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g, i) => (
              <div key={i} className="rounded-lg border border-zinc-800 p-3">
                <p className="mb-2 text-sm font-medium text-blue-400">
                  {t("labels.groupName")} {i + 1}
                </p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  {g.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
