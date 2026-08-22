import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Canonical domain: non-www -> www (matches sitemap/robots host)
      {
        source: "/:path*",
        has: [{ type: "host", value: "toolkitlife.com" }],
        destination: "https://www.toolkitlife.com/:path*",
        permanent: true,
      },
      // Slug alignment: online variants -> local canonical slugs
      { source: "/:locale/tools/image-format-converter", destination: "/:locale/tools/convert", permanent: true },
      { source: "/:locale/tools/unix-timestamp-converter", destination: "/:locale/tools/timestamp-converter", permanent: true },
      { source: "/:locale/tools/url-encoder-decoder", destination: "/:locale/tools/url-encoder", permanent: true },
      { source: "/:locale/tools/cron-expression-generator", destination: "/:locale/tools/cron-generator", permanent: true },
      { source: "/:locale/tools/exif-data-viewer", destination: "/:locale/tools/exif-viewer", permanent: true },
      { source: "/:locale/tools/noise-texture-generator", destination: "/:locale/tools/noise-generator", permanent: true },
      { source: "/:locale/tools/open-graph-preview", destination: "/:locale/tools/og-preview", permanent: true },
      { source: "/:locale/tools/image-filter-effects", destination: "/:locale/tools/image-filters", permanent: true },
      { source: "/:locale/tools/obbba-tax-savings-calculator", destination: "/:locale/tools/obbba-tax-calculator", permanent: true },
      { source: "/:locale/tools/pregnancy-due-date-calculator", destination: "/:locale/tools/pregnancy-calculator", permanent: true },
      { source: "/:locale/tools/image-to-text-ocr", destination: "/:locale/tools/image-to-text", permanent: true },
      { source: "/:locale/tools/digital-signature-creator", destination: "/:locale/tools/digital-signature", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Cross-Origin Isolation: enables SharedArrayBuffer → WASM multi-threading
        // + SIMD + WebGPU in ONNX Runtime Web (MI-GAN ~5x faster).
        // credentialless keeps third-party no-cors resources (CDNs) working.
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
