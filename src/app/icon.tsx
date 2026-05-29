import { ImageResponse } from "next/og";

// Generated favicon — a signal-red tile with a dark "D", so the tab mark reads
// as the brand instead of a default globe.
export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#c8392a",
          color: "#0a0c12",
          fontSize: 24,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        D
      </div>
    ),
    { ...size },
  );
}
