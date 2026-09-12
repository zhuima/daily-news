import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#01847E",
          color: "#f6f5f2",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 8, opacity: 0.75 }}>
          TRACK SCAN
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 600, lineHeight: 1.1 }}>
            {SITE_NAME}
          </div>
          <div style={{ marginTop: 24, fontSize: 28, maxWidth: 820, opacity: 0.9 }}>
            {SITE_TAGLINE}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 20,
            borderTop: "1px solid rgba(246,245,242,0.35)",
            paddingTop: 28,
          }}
        >
          <span>微信读书关键词归档</span>
          <span>·</span>
          <span>公众号 · 直链 · 深链阅读</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
