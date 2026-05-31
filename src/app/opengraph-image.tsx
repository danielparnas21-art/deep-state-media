import { ImageResponse } from "next/og";

// Branded social-share card (Open Graph / Twitter). Rendered to a PNG at build
// time so links to the site look intentional in any feed — dark field, navy
// glow + signal-red ember, the wordmark with "MEDIA" in red, and the tagline.
export const runtime = "edge";
export const alt = "Deep State Media — The truth has a side now.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#06070d",
          color: "#eef2fb",
          padding: "76px 84px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* ambient navy glow */}
        <div
          style={{
            position: "absolute",
            top: -260,
            left: 220,
            width: 900,
            height: 900,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle, rgba(28,60,107,0.55), rgba(6,7,13,0) 60%)",
          }}
        />
        {/* signal-red ember */}
        <div
          style={{
            position: "absolute",
            bottom: -220,
            right: -120,
            width: 640,
            height: 640,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle, rgba(200,57,42,0.30), rgba(6,7,13,0) 62%)",
          }}
        />

        {/* kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#9fb2d6",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 9999,
              backgroundColor: "#c8392a",
              display: "flex",
            }}
          />
          <div style={{ display: "flex" }}>
            Independent · Both sides · Est. 2026
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 170,
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: -4,
              textTransform: "uppercase",
            }}
          >
            Deep State
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 170,
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: -4,
              textTransform: "uppercase",
              color: "#c8392a",
            }}
          >
            Media
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              fontSize: 44,
              color: "#aab8d6",
            }}
          >
            The truth has a side now.
          </div>
        </div>

        {/* footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#7f8db0",
          }}
        >
          <div style={{ display: "flex" }}>deepstatemedia.co</div>
          <div style={{ display: "flex" }}>The investigations both parties bury</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
