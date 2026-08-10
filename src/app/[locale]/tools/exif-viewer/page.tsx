"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface ExifData {
  fileName: string;
  fileType: string;
  fileSize: string;
  width: number | null;
  height: number | null;
  orientation: number | null;
  dateTaken: string | null;
  make: string | null;
  model: string | null;
  gps: { lat: number; lng: number } | null;
  tags: Record<string, string | number>;
}

const TAG_NAMES: Record<number, string> = {
  0x010f: "Make",
  0x0110: "Model",
  0x0112: "Orientation",
  0x011a: "XResolution",
  0x011b: "YResolution",
  0x0128: "ResolutionUnit",
  0x0131: "Software",
  0x0132: "DateTime",
  0x0213: "YCbCrPositioning",
  0x8298: "Copyright",
  0x8769: "ExifIFDPointer",
  0x8825: "GPSInfoIFDPointer",
  0x829a: "ExposureTime",
  0x829d: "FNumber",
  0x8822: "ExposureProgram",
  0x8827: "ISOSpeedRatings",
  0x9000: "ExifVersion",
  0x9003: "DateTimeOriginal",
  0x9004: "DateTimeDigitized",
  0x9201: "ShutterSpeedValue",
  0x9202: "ApertureValue",
  0x9204: "ExposureBiasValue",
  0x9205: "MaxApertureValue",
  0x9207: "MeteringMode",
  0x9208: "LightSource",
  0x9209: "Flash",
  0x920a: "FocalLength",
  0xa001: "ColorSpace",
  0xa002: "PixelXDimension",
  0xa003: "PixelYDimension",
};

export default function ExifViewerPage() {
  const t = useTranslations("tools.exif-viewer");
  const [data, setData] = useState<ExifData | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const readUint16 = (view: DataView, offset: number, little: boolean) =>
    view.getUint16(offset, little);

  const readUint32 = (view: DataView, offset: number, little: boolean) =>
    view.getUint32(offset, little);

  const readString = (
    buffer: ArrayBuffer,
    offset: number,
    length: number
  ): string => {
    const bytes = new Uint8Array(buffer, offset, length);
    let str = "";
    for (let i = 0; i < bytes.length; i += 1) {
      if (bytes[i] === 0) break;
      str += String.fromCharCode(bytes[i]);
    }
    return str;
  };

  const parseIfd = (
    buffer: ArrayBuffer,
    view: DataView,
    start: number,
    little: boolean,
    tagMap: Record<number, string | number>
  ) => {
    const count = readUint16(view, start, little);
    const ifdStart = start + 2;

    for (let i = 0; i < count; i += 1) {
      const entry = ifdStart + i * 12;
      const tag = readUint16(view, entry, little);
      const type = readUint16(view, entry + 2, little);
      const numValues = readUint32(view, entry + 4, little);
      const valueOffset = readUint32(view, entry + 8, little);

      let value: string | number = valueOffset;

      const valueSize =
        type === 1 || type === 2 ? 1 : type === 3 ? 2 : type === 4 ? 4 : 8;
      const totalSize = numValues * valueSize;
      const offset = totalSize > 4 ? valueOffset : entry + 8;

      try {
        if (type === 2) {
          value = readString(buffer, offset, numValues);
        } else if (type === 3) {
          value = readUint16(view, offset, little);
        } else if (type === 4 || type === 7) {
          value = readUint32(view, offset, little);
        } else if (type === 5) {
          const num = readUint32(view, offset, little);
          const den = readUint32(view, offset + 4, little);
          value = den !== 0 ? num / den : 0;
        } else if (type === 10) {
          const num = readUint32(view, offset, little);
          const den = readUint32(view, offset + 4, little);
          value = den !== 0 ? num / den : 0;
        }
      } catch {
        value = valueOffset;
      }

      tagMap[tag] = value;
    }

    return readUint32(view, ifdStart + count * 12, little);
  };

  const parseDimensions = (buffer: ArrayBuffer) => {
    const view = new DataView(buffer);
    let width: number | null = null;
    let height: number | null = null;

    for (let i = 0; i < buffer.byteLength - 1; i += 1) {
      if (view.getUint8(i) === 0xff) {
        const marker = view.getUint8(i + 1);
        if (
          marker === 0xc0 ||
          marker === 0xc1 ||
          marker === 0xc2 ||
          marker === 0xc3
        ) {
          height = view.getUint16(i + 5, false);
          width = view.getUint16(i + 7, false);
          break;
        }
      }
    }

    return { width, height };
  };

  const parseExif = async (file: File): Promise<ExifData> => {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);
    const tags: Record<string, string | number> = {};
    let orientation: number | null = null;
    let dateTaken: string | null = null;
    let make: string | null = null;
    let model: string | null = null;
    let gps: { lat: number; lng: number } | null = null;

    const { width, height } = parseDimensions(buffer);

    for (let i = 0; i < buffer.byteLength - 1; i += 1) {
      if (view.getUint8(i) === 0xff && view.getUint8(i + 1) === 0xe1) {
        const exifStart = i + 4;
        const header = readString(buffer, exifStart, 6);
        if (header !== "Exif\0\0") continue;

        const tiffStart = exifStart + 6;
        const little = view.getUint16(tiffStart, false) === 0x4949;
        const ifdOffset = readUint32(view, tiffStart + 4, little);

        const ifd0: Record<number, string | number> = {};
        parseIfd(buffer, view, tiffStart + ifdOffset, little, ifd0);

        for (const [key, value] of Object.entries(ifd0)) {
          const tagNum = parseInt(key, 10);
          const name = TAG_NAMES[tagNum] || `0x${tagNum.toString(16).padStart(4, "0")}`;
          tags[name] = value;

          if (tagNum === 0x0112) orientation = parseInt(String(value), 10);
          if (tagNum === 0x0132) dateTaken = String(value);
          if (tagNum === 0x010f) make = String(value);
          if (tagNum === 0x0110) model = String(value);
        }

        if (ifd0[0x8769]) {
          const exifIfd: Record<number, string | number> = {};
          parseIfd(
            buffer,
            view,
            tiffStart + parseInt(String(ifd0[0x8769]), 10),
            little,
            exifIfd
          );
          for (const [key, value] of Object.entries(exifIfd)) {
            const tagNum = parseInt(key, 10);
            const name = TAG_NAMES[tagNum] || `0x${tagNum.toString(16).padStart(4, "0")}`;
            tags[name] = value;
            if (tagNum === 0x9003 && !dateTaken) dateTaken = String(value);
          }
        }

        if (ifd0[0x8825]) {
          const gpsIfd: Record<number, string | number> = {};
          parseIfd(
            buffer,
            view,
            tiffStart + parseInt(String(ifd0[0x8825]), 10),
            little,
            gpsIfd
          );

          const latRef = gpsIfd[0x0001];
          const latDeg = Number(gpsIfd[0x0002] || 0);
          const latMin = Number(gpsIfd[0x0003] || 0);
          const latSec = Number(gpsIfd[0x0004] || 0);
          const lngRef = gpsIfd[0x0003];
          const lngDeg = Number(gpsIfd[0x0004] || 0);
          const lngMin = Number(gpsIfd[0x0005] || 0);
          const lngSec = Number(gpsIfd[0x0006] || 0);

          if (latRef && lngRef) {
            let lat = latDeg + latMin / 60 + latSec / 3600;
            let lng = lngDeg + lngMin / 60 + lngSec / 3600;
            if (latRef === "S") lat = -lat;
            if (lngRef === "W") lng = -lng;
            gps = { lat, lng };
          }
        }

        break;
      }
    }

    return {
      fileName: file.name,
      fileType: file.type || "image/jpeg",
      fileSize: `${(file.size / 1024).toFixed(2)} KB`,
      width,
      height,
      orientation,
      dateTaken,
      make,
      model,
      gps,
      tags,
    };
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const result = await parseExif(file);
      setData(result);

      const url = URL.createObjectURL(file);
      setPreview(url);
    } catch {
      setData({
        fileName: file.name,
        fileType: file.type || "image/jpeg",
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        width: null,
        height: null,
        orientation: null,
        dateTaken: null,
        make: null,
        model: null,
        gps: null,
        tags: {},
      });
      setPreview(URL.createObjectURL(file));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="exif-viewer"
    >
      <div className="max-w-3xl space-y-4">
        <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900 p-6 text-center">
          <input
            type="file"
            accept="image/jpeg,image/jpg"
            onChange={handleFile}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-500"
          />
          <p className="mt-2 text-xs text-zinc-500">{t("labels.hint")}</p>
        </div>

        {loading && <p className="text-sm text-zinc-400">{t("labels.loading")}</p>}

        {data && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt={data.fileName}
                className="max-h-64 rounded-lg border border-zinc-700 object-contain"
              />
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">{t("labels.fileName")}</p>
                <p className="text-sm text-zinc-200">{data.fileName}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.fileType")}</p>
                <p className="text-sm text-zinc-200">{data.fileType}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.fileSize")}</p>
                <p className="text-sm text-zinc-200">{data.fileSize}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.dimensions")}</p>
                <p className="text-sm text-zinc-200">
                  {data.width && data.height
                    ? `${data.width} x ${data.height}`
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.orientation")}</p>
                <p className="text-sm text-zinc-200">
                  {data.orientation ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.dateTaken")}</p>
                <p className="text-sm text-zinc-200">
                  {data.dateTaken ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t("labels.camera")}</p>
                <p className="text-sm text-zinc-200">
                  {data.make && data.model
                    ? `${data.make} ${data.model}`
                    : data.make || data.model || "—"}
                </p>
              </div>
              {data.gps && (
                <div>
                  <p className="text-sm text-zinc-400">{t("labels.gps")}</p>
                  <p className="text-sm text-zinc-200">
                    {data.gps.lat.toFixed(6)}, {data.gps.lng.toFixed(6)}
                  </p>
                </div>
              )}
            </div>

            {Object.keys(data.tags).length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-300">
                  {t("labels.exifTags")}
                </p>
                <div className="max-h-64 overflow-auto rounded-lg border border-zinc-800">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(data.tags).map(([key, value]) => (
                        <tr key={key} className="border-b border-zinc-800 last:border-0">
                          <td className="px-4 py-2 text-zinc-400">{key}</td>
                          <td className="px-4 py-2 text-zinc-200">{String(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
