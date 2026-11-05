import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
      // Locale-less deep links used to 404: the proxy matcher only runs
      // next-intl for /(zh|en|ja|ko|ru)/… paths, so /tools/x, /blog/…, /about,
      // /privacy, /terms never reached the i18n redirect. Send them to the
      // default locale (matches the "x-default" hreflang). Static assets
      // (/llms.txt, /sitemap.xml, /api/*…) are NOT matched here and keep
      // working untouched. See docs/seo-audit-baseline.md §3.4.
      { source: "/tools/:path*", destination: "/en/tools/:path*", permanent: true },
      { source: "/blog/:path*", destination: "/en/blog/:path*", permanent: true },
      { source: "/about", destination: "/en/about", permanent: true },
      { source: "/privacy", destination: "/en/privacy", permanent: true },
      { source: "/terms", destination: "/en/terms", permanent: true },
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
