import { ImageResponse } from "next/og";

export const runtime = "edge";

const ACCENT = "#3b82f6";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawTitle = (searchParams.get("title") ?? "").trim().slice(0, 80);
  const type = searchParams.get("type") ?? "tool";

  // satori cannot render CJK glyphs without a dedicated font; fall back to a
  // brand graphic for non-ASCII titles so no tofu boxes appear on the image.
  const isAscii = /^[\x20-\x7E]*$/.test(rawTitle);
  const title = isAscii && rawTitle ? rawTitle : null;

  const badge =
    type === "blog"
      ? "BLOG & GUIDES"
      : type === "home"
        ? "FREE ONLINE TOOLS"
        : "FREE ONLINE TOOL";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#09090b",
          color: "#fafafa",
          padding: "72px 84px",
          position: "relative",
        }}
      >
        {/* decorative accent */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 480,
            height: 480,
            borderRadius: 240,
            background: "radial-gradient(circle, rgba(59,130,246,0.35), rgba(59,130,246,0))",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -120,
            width: 420,
            height: 420,
            borderRadius: 210,
            background: "radial-gradient(circle, rgba(168,85,247,0.22), rgba(168,85,247,0))",
          }}
        />

        {/* top brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                backgroundColor: ACCENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              T
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>
              TOOLKITLIFE
            </div>
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#a1a1aa",
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid #27272a",
            }}
          >
            toolkitlife.com
          </div>
        </div>

        {/* main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 960,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 4,
              color: "#60a5fa",
              marginBottom: 24,
            }}
          >
            {badge}
          </div>
          {title ? (
            <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.12 }}>
              {title}
            </div>
          ) : (
            <div
              style={{
                fontSize: 58,
                fontWeight: 700,
                lineHeight: 1.12,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>Free Online Tools</span>
              <span>&amp; Calculators</span>
            </div>
          )}
          <div
            style={{
              marginTop: 26,
              fontSize: 26,
              color: "#a1a1aa",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span>No signup</span>
            <span style={{ color: "#3f3f46" }}>·</span>
            <span>No data upload</span>
            <span style={{ color: "#3f3f46" }}>·</span>
            <span>Works in your browser</span>
          </div>
        </div>

        {/* bottom strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 21,
            color: "#71717a",
            position: "relative",
          }}
        >
          <span>100% Free</span>
          <span style={{ color: "#3f3f46" }}>·</span>
          <span>Privacy-first</span>
          <span style={{ color: "#3f3f46" }}>·</span>
          <span>136+ Tools &amp; Calculators</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
