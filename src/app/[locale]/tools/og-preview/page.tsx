"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function OgPreviewPage() {
  const t = useTranslations("tools.og-preview");
  const [title, setTitle] = useState("ToolkitLife - Free Online Tools");
  const [description, setDescription] = useState(
    "136+ free browser-based tools and calculators for developers, designers, and more."
  );
  const [imageUrl, setImageUrl] = useState("https://www.toolkitlife.com/og-image.png");
  const [siteName, setSiteName] = useState("ToolkitLife");
  const [url, setUrl] = useState("https://www.toolkitlife.com");

  const metaTags = `<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:site_name" content="${siteName}" />
<meta property="og:url" content="${url}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${imageUrl}" />`;

  return (
    <ToolLayout
      title={t("metadata.title")}
      description={t("metadata.description")}
      category={t("metadata.category")}
      slug="og-preview"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.title")}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.description")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.imageUrl")}</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.siteName")}</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">{t("labels.url")}</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div className="pt-2">
            <CopyButton text={metaTags} label={t("buttons.copyMetaTags")} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <p className="mb-3 text-sm font-medium text-zinc-300">{t("preview.facebook")}</p>
            <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
              {imageUrl && (
                <div className="aspect-video w-full bg-zinc-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={title}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
              )}
              <div className="p-3">
                <p className="text-xs uppercase text-zinc-500">{url}</p>
                <p className="font-semibold text-zinc-100">{title}</p>
                <p className="text-sm text-zinc-400 line-clamp-2">{description}</p>
                <p className="mt-1 text-xs text-zinc-500">{siteName}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <p className="mb-3 text-sm font-medium text-zinc-300">{t("preview.twitter")}</p>
            <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
              {imageUrl && (
                <div className="aspect-video w-full bg-zinc-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={title}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
              )}
              <div className="p-3">
                <p className="font-semibold text-zinc-100">{title}</p>
                <p className="text-sm text-zinc-400 line-clamp-2">{description}</p>
                <p className="mt-1 text-xs text-zinc-500">{url}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <p className="mb-2 text-sm font-medium text-zinc-300">{t("labels.metaTags")}</p>
            <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-300">{metaTags}</pre>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
