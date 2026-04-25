import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const confusion = searchParams.get("confusion") || "What are you confused about?";
  const explanation = searchParams.get("explanation") || "";

  const shortExplanation = explanation.length > 200
    ? explanation.slice(0, 200) + "..."
    : explanation;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: "linear-gradient(135deg, #FFFBF5 0%, #FFF3E8 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: Logo + badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "28px", fontWeight: 700 }}>
            <span style={{ color: "#1A1A1A" }}>Now</span>
            <span style={{ color: "#E8722A" }}>I</span>
            <span style={{ color: "#1A1A1A" }}>Get</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "999px",
              background: "rgba(232, 114, 42, 0.1)",
              fontSize: "16px",
              color: "#6B5B4E",
            }}
          >
            Finally understand anything
          </div>
        </div>

        {/* Middle: Confusion */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1, justifyContent: "center" }}>
          <div
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#1A1A1A",
              lineHeight: 1.3,
              maxWidth: "900px",
            }}
          >
            &ldquo;{confusion.length > 120 ? confusion.slice(0, 120) + "..." : confusion}&rdquo;
          </div>
          {shortExplanation && (
            <div
              style={{
                fontSize: "20px",
                color: "#6B5B4E",
                lineHeight: 1.6,
                maxWidth: "900px",
              }}
            >
              {shortExplanation}
            </div>
          )}
        </div>

        {/* Bottom: CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "18px", color: "#6B5B4E" }}>
            nowiget.vercel.app
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              borderRadius: "12px",
              background: "#E8722A",
              color: "white",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Get Clarity →
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
