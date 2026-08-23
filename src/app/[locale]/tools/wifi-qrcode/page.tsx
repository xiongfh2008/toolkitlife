"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const ENCRYPTIONS = ["WPA", "WEP", "nopass"] as const;

export default function WifiQrcodePage() {
  const t = useTranslations("tools.wifi-qrcode");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState<(typeof ENCRYPTIONS)[number]>("WPA");
  const [hidden, setHidden] = useState(false);
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!ssid.trim()) {
        setDataUrl("");
        return;
      }
      const escaped = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");
      let content = `WIFI:T:${encryption};S:${escaped(ssid)};`;
      if (encryption !== "nopass") content += `P:${escaped(password)};`;
      if (hidden) content += "H:true;";
      content += ";";
      try {
        const url = await QRCode.toDataURL(content, { width: 512, margin: 1, errorCorrectionLevel: "Q" });
        if (!cancelled) setDataUrl(url);
      } catch {
        if (!cancelled) setDataUrl("");
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [ssid, password, encryption, hidden]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "wifi-qrcode.png";
    a.click();
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none";

  return (
    <ToolLayout
      title={t("title")}
      slug="wifi-qrcode"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.ssid")}</label>
            <input value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="MyWiFi" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.password")}</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.encryption")}</label>
            <select value={encryption} onChange={(e) => setEncryption(e.target.value as (typeof ENCRYPTIONS)[number])} className={inputCls}>
              {ENCRYPTIONS.map((e) => (
                <option key={e} value={e}>
                  {t(`encryptions.${e}`)}
                </option>
              ))}
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} className="accent-blue-500" />
            {t("labels.hidden")}
          </label>
          <button
            onClick={handleDownload}
            disabled={!dataUrl}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
          >
            {t("buttons.download")}
          </button>
        </div>
        <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt={t("title")} className="h-72 w-72 rounded object-contain" />
          ) : (
            <p className="text-sm text-zinc-500">{t("labels.placeholder")}</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
