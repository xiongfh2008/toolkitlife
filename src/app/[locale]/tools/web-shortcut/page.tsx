"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

export default function WebShortcutPage() {
  const t = useTranslations("tools.web-shortcut");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const linkRef = useRef<HTMLAnchorElement>(null);

  const download = () => {
    let cleanUrl = url.trim();
    if (!cleanUrl) return;
    if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = `https://${cleanUrl}`;
    const shortcutName = name.trim() || cleanUrl.replace(/^https?:\/\//i, "").split("/")[0] || "shortcut";
    const lines = ["[InternetShortcut]", `URL=${cleanUrl}`];
    if (icon.trim()) {
      if (!/^https?:\/\//i.test(icon.trim())) {
        lines.push(`IconFile=${icon.trim()}`);
      } else {
        lines.push(`IconFile=${icon.trim()}`, `IconIndex=0`);
      }
    }
    const blob = new Blob([lines.join("\r\n") + "\r\n"], { type: "application/internet-shortcut" });
    const objectUrl = URL.createObjectURL(blob);
    const a = linkRef.current;
    if (a) {
      a.href = objectUrl;
      a.download = `${shortcutName}.url`;
      a.click();
    }
    URL.revokeObjectURL(objectUrl);
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="web-shortcut"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm text-zinc-400">{t("labels.name")}</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("labels.namePlaceholder")} className={inputCls} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-zinc-400">{t("labels.url")}</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className={inputCls} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-zinc-400">{t("labels.icon")}</label>
          <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder={t("labels.iconPlaceholder")} className={inputCls} />
        </div>
        <button onClick={download} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500">
          {t("buttons.download")}
        </button>
        <a ref={linkRef} className="hidden" />
      </div>
    </ToolLayout>
  );
}
