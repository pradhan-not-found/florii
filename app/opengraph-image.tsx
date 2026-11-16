import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "florii — hand-painted flowers for React";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #cfeeff 0%, #e6f6ff 55%, #f4fbff 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          padding: "60px 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 20px",
            borderRadius: "999px",
            background: "#ffffff",
            fontSize: "20px",
            fontWeight: 600,
            color: "#131316",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            marginBottom: "32px",
          }}
        >
          🌸 React Botanical Components
        </div>
        <h1
          style={{
            fontSize: "76px",
            fontWeight: 700,
            color: "#0b0f1a",
            letterSpacing: "-0.05em",
            margin: "0 0 20px 0",
            lineHeight: 1.05,
          }}
        >
          make the web bloom.
        </h1>
        <p
          style={{
            fontSize: "28px",
            color: "#44444d",
            maxWidth: "840px",
            lineHeight: 1.5,
            margin: "0 0 44px 0",
          }}
        >
          28+ hand-painted flowers and decorations for React.
          Sway, bloom, recolor, and wear your brand.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: "22px",
            fontWeight: 600,
            color: "#ffffff",
            background: "#0b0f1a",
            padding: "16px 36px",
            borderRadius: "999px",
            boxShadow: "0 10px 30px rgba(11,15,26,0.3)",
          }}
        >
          npm i florii@latest
        </div>
      </div>
    ),
    { ...size }
  );
}
