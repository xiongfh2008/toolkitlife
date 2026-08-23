"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout, { FAQ, RelatedTool } from "@/components/ToolLayout";

const MAX_DIM = 3000;

// Standard PNG CRC-32 (zlib polynomial).
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

const crc32 = (bytes: Uint8Array) => {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
};

// Rewrite a PNG's pHYs chunk so print software reads the requested DPI.
const setPngDpi = async (blob: Blob, dpi: number): Promise<Blob> => {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  const view = new DataView(buf);
  let offset = 8;
  let physOffset = -1;
  let ihdrEnd = -1;
  while (offset < bytes.length) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
    if (type === "IHDR") ihdrEnd = offset + 12 + length;
    if (type === "pHYs") {
      physOffset = offset;
      break;
    }
    offset += 12 + length;
  }
  const ppm = Math.round(dpi * 39.3701);
  const data = new Uint8Array(9);
  new DataView(data.buffer).setUint32(0, ppm);
  new DataView(data.buffer).setUint32(4, ppm);
  data[8] = 1;
  const typeAndData = new Uint8Array(13);
  typeAndData.set([0x70, 0x48, 0x59, 0x73]); // "pHYs"
  typeAndData.set(data, 4);
  const crc = crc32(typeAndData);
  const crcBytes = new Uint8Array(4);
  new DataView(crcBytes.buffer).setUint32(0, crc);

  if (physOffset >= 0) {
    bytes.set(data, physOffset + 8);
    bytes.set(crcBytes, physOffset + 12 + 9);
    return new Blob([bytes], { type: "image/png" });
  }
  if (ihdrEnd < 0) return blob;
  const head = bytes.slice(0, ihdrEnd);
  const tail = bytes.slice(ihdrEnd);
  const lengthBytes = new Uint8Array(4);
  new DataView(lengthBytes.buffer).setUint32(0, 9);
  const chunk = new Uint8Array([...lengthBytes, ...typeAndData, ...crcBytes]);
  const merged = new Uint8Array(head.length + chunk.length + tail.length);
  merged.set(head, 0);
  merged.set(chunk, head.length);
  merged.set(tail, head.length + chunk.length);
  return new Blob([merged], { type: "image/png" });
};

export default function ImageDpiPage() {
  const t = useTranslations("tools.image-dpi");
  const faqs = t.raw("faqs") as FAQ[];
  const relatedTools = t.raw("relatedTools") as RelatedTool[];
  const keywords = t.raw("keywords") as string[];

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [dpi, setDpi] = useState(300);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => setImg(image);
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    loadFile(file);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, [img]);

  const handleNewImage = () => setImg(null);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const out = await setPngDpi(blob, Math.min(Math.max(dpi, 1), 2400));
      const url = URL.createObjectURL(out);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image-${dpi}dpi.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, "image/png");
  };

  const btn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ToolLayout
      title={t("title")}
      slug="image-dpi"
      category={t("category")}
      description={t("description")}
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
    >
      <div className="max-w-4xl space-y-4">
        {!img ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("dpi-in")?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-600 p-16 text-center transition-colors hover:border-zinc-500"
          >
            <div className="mb-4 text-4xl">📏</div>
            <p className="font-medium text-zinc-300">{t("upload.drop")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("upload.formats")}</p>
            <input id="dpi-in" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownload}
                className={`${btn} bg-blue-600 text-white hover:bg-blue-500`}
              >
                {t("buttons.download")}
              </button>
              <button
                onClick={handleNewImage}
                className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
              >
                {t("buttons.newImage")}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-zinc-300">{t("labels.dpi")}</label>
              <input
                type="number"
                min={1}
                max={2400}
                value={dpi}
                onChange={(e) => setDpi(Number(e.target.value))}
                className="w-28 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
              />
              <span className="text-sm text-zinc-500">{t("labels.note")}</span>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <canvas ref={canvasRef} className="w-full" />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
