"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";
import { computePhash, hammingDistance, similarityPercent } from "@/lib/image-analysis";

const MAX_IMAGES = 20;
const THRESHOLD = 12;

interface Item {
  id: number;
  name: string;
  size: number;
  url: string;
  hash: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function DuplicateFinderPage() {
  const t = useTranslations("tools.duplicate-finder");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [items, setItems] = useState<Item[]>([]);
  const [groups, setGroups] = useState<Item[][]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setGroups([]);
      setError("");
      setItems((prev) => {
        const next = [...prev];
        for (const file of Array.from(files)) {
          if (!file.type.startsWith("image/")) continue;
          if (next.length >= MAX_IMAGES) break;
          const url = URL.createObjectURL(file);
          next.push({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            url,
            hash: "",
          });
        }
        return next;
      });
    },
    []
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setGroups([]);
  };

  const hashOfItem = (item: Item): Promise<string> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 32;
          canvas.height = 32;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) throw new Error("no ctx");
          ctx.drawImage(image, 0, 0, 32, 32);
          const src = ctx.getImageData(0, 0, 32, 32);
          resolve(computePhash(src).hex);
        } catch (err) {
          reject(err);
        }
      };
      image.onerror = () => reject(new Error("load failed"));
      image.src = item.url;
    });

  const findDuplicates = useCallback(async () => {
    if (items.length < 2 || processing) return;
    setProcessing(true);
    setError("");
    try {
      const hashed: Item[] = [];
      for (const item of items) {
        const hash = await hashOfItem(item);
        hashed.push({ ...item, hash });
      }
      const result: Item[][] = [];
      for (const item of hashed) {
        let placed = false;
        for (const group of result) {
          const close = group.some(
            (m) => hammingDistance(m.hash, item.hash) <= THRESHOLD
          );
          if (close) {
            group.push(item);
            placed = true;
            break;
          }
        }
        if (!placed) result.push([item]);
      }
      setGroups(result.filter((g) => g.length >= 2));
    } catch (err) {
      console.error(err);
      setError(t("errors.process"));
    } finally {
      setProcessing(false);
    }
  }, [items, processing, t]);

  const handleNewImage = () => {
    for (const item of items) URL.revokeObjectURL(item.url);
    setItems([]);
    setGroups([]);
    setError("");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="duplicate-finder"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {items.length === 0 ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("dup-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">👯</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input
              id="dup-in"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void findDuplicates()}
                disabled={processing || items.length < 2}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {processing ? t("status.scanning") : t("buttons.find")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
              <span className="text-xs text-zinc-500">
                {items.length} / {MAX_IMAGES}
              </span>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div>
              <p className="mb-2 text-sm font-medium text-zinc-300">{t("labels.uploaded")}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-24 w-full object-cover"
                    />
                    <div className="px-2 py-1.5">
                      <p className="truncate text-[11px] text-zinc-400">{item.name}</p>
                      <p className="text-[10px] text-zinc-600">{formatSize(item.size)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-zinc-950/80 text-xs text-zinc-300 hover:bg-red-600/80 group-hover:flex"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {processing && (
              <p className="text-sm text-zinc-400">{t("status.scanning")}</p>
            )}

            {!processing && groups.length === 0 && items.length > 0 && (
              <p className="text-sm text-emerald-400">{t("labels.none")}</p>
            )}

            {groups.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-zinc-300">
                  {t("labels.groups", { count: groups.length })}
                </p>
                {groups.map((group, gi) => (
                  <div
                    key={gi}
                    className="space-y-2 rounded-lg border border-amber-700/40 bg-amber-950/10 p-3"
                  >
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                      {group.map((item) => {
                        const sim =
                          item === group[0]
                            ? 100
                            : similarityPercent(item.hash, group[0].hash);
                        return (
                          <div
                            key={item.id}
                            className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.url}
                              alt={item.name}
                              className="h-20 w-full object-cover"
                            />
                            <div className="px-2 py-1.5">
                              <p className="truncate text-[11px] text-zinc-400">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-amber-400">
                                {t("labels.similarity")}: {sim}%
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
