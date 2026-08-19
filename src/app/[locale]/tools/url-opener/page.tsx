"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface UrlState {
  url: string;
  status: "pending" | "opened" | "blocked";
}

export default function UrlOpenerPage() {
  const t = useTranslations("tools.url-opener");
  const [input, setInput] = useState("");
  const [items, setItems] = useState<UrlState[]>([]);
  const [message, setMessage] = useState("");

  const normalize = (raw: string) => {
    let u = raw.trim();
    if (!u) return "";
    if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
    return u;
  };

  const parseUrls = () => {
    const urls = input
      .split(/\r?\n|,\s*/)
      .map(normalize)
      .filter(Boolean);
    const seen = new Set<string>();
    return urls.filter((u) => (seen.has(u) ? false : (seen.add(u), true)));
  };

  const openAll = () => {
    const urls = parseUrls();
    if (urls.length === 0) {
      setMessage(t("messages.empty"));
      return;
    }
    setMessage("");
    const openedWindow = window.open("about:blank", "_blank");
    if (!openedWindow) {
      setItems(urls.map((url) => ({ url, status: "blocked" })));
      setMessage(t("messages.popupBlocked"));
      return;
    }
    openedWindow.close();
    const states: UrlState[] = urls.map((url) => ({ url, status: "pending" }));
    urls.forEach((url, i) => {
      const win = window.open(url, "_blank");
      states[i].status = win ? "opened" : "blocked";
    });
    setItems(states);
    if (states.some((s) => s.status === "blocked")) setMessage(t("messages.popupBlocked"));
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="url-opener"
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.urls")}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder={t("placeholders.urls")}
            className={inputCls}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openAll}
            className="rounded-lg px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            {t("buttons.open")}
          </button>
          <button
            onClick={() => {
              setInput("");
              setItems([]);
              setMessage("");
            }}
            className="rounded-lg px-4 py-2 text-sm font-medium bg-zinc-700 hover:bg-zinc-600 text-white transition-colors"
          >
            {t("buttons.clear")}
          </button>
          {message && <span className="text-sm text-amber-400">{message}</span>}
        </div>
        {items.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-zinc-700">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2 text-sm last:border-b-0"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-blue-400 hover:underline"
                >
                  {item.url}
                </a>
                <span
                  className={
                    item.status === "opened"
                      ? "shrink-0 text-emerald-400"
                      : item.status === "blocked"
                        ? "shrink-0 text-red-400"
                        : "shrink-0 text-zinc-500"
                  }
                >
                  {item.status === "opened"
                    ? t("status.opened")
                    : item.status === "blocked"
                      ? t("status.blocked")
                      : t("status.pending")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
