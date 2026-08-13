"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import multiavatar from "@multiavatar/multiavatar/esm";

const DEFAULT_SEED = "Tony Stark";
const PNG_SIZE = 512;

export default function MultiavatarAvatarGenerator() {
  const t = useTranslations("tools.multiavatar-avatar-generator");

  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];
  const guideSteps = t.raw("guide.steps") as string[];

  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [sansEnv, setSansEnv] = useState(false);
  const [avatarSvg, setAvatarSvg] = useState("");

  // Regenerate whenever the seed or the background toggle changes.
  // Multiavatar is a pure client-side deterministic generator (identicon).
  useEffect(() => {
    if (!seed.trim()) return;
    setAvatarSvg(multiavatar(seed, sansEnv));
  }, [seed, sansEnv]);

  const shuffle = useCallback(() => {
    setSeed(Math.random().toString(36).slice(2, 10));
  }, []);

  const downloadSvg = useCallback(() => {
    if (!avatarSvg) return;
    const blob = new Blob([avatarSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `multiavatar-${seed.replace(/\W+/g, "-") || "avatar"}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [avatarSvg, seed]);

  const downloadPng = useCallback(() => {
    if (!avatarSvg) return;
    // Give the SVG an explicit size so it rasterizes correctly onto canvas.
    const sized = avatarSvg.replace(
      "<svg ",
      `<svg width="${PNG_SIZE}" height="${PNG_SIZE}" `
    );
    const blob = new Blob([sized], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = PNG_SIZE;
      canvas.height = PNG_SIZE;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(img, 0, 0, PNG_SIZE, PNG_SIZE);
      canvas.toBlob((b) => {
        if (!b) return;
        const pngUrl = URL.createObjectURL(b);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `multiavatar-${seed.replace(/\W+/g, "-") || "avatar"}.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [avatarSvg, seed]);

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors";

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      category={t("category")}
      slug="multiavatar-avatar-generator"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
      guide={
        <div className="space-y-4 text-sm text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-100">
            {t("guide.heading")}
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            {guideSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      }
    >
      <div className="grid gap-8 sm:grid-cols-[260px_1fr]">
        {/* Preview + actions */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-56 w-56 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800/50">
            {avatarSvg ? (
              <div
                className="h-48 w-48"
                // Multiavatar output is a static SVG assembled from built-in
                // shapes — the seed string never appears in the markup.
                dangerouslySetInnerHTML={{ __html: avatarSvg }}
              />
            ) : (
              <p className="text-sm text-zinc-500">{t("ui.loading")}</p>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={shuffle}
              className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
            >
              {t("ui.shuffle")}
            </button>
            <button
              onClick={downloadSvg}
              className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
            >
              {t("ui.downloadSvg")}
            </button>
            <button
              onClick={downloadPng}
              className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
            >
              {t("ui.downloadPng")}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-5">
          <div>
            <label
              htmlFor="avatar-seed"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              {t("ui.seedLabel")}
            </label>
            <input
              id="avatar-seed"
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder={t("ui.placeholder")}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-base text-zinc-100 placeholder-zinc-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
            <p className="mt-2 text-xs text-zinc-500">{t("ui.hint")}</p>
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={sansEnv}
              onChange={(e) => setSansEnv(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 accent-blue-600"
            />
            {t("ui.sansEnv")}
          </label>
        </div>
      </div>
    </ToolLayout>
  );
}
