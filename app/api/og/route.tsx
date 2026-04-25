import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const confusion = searchParams.get("confusion") || "What are you confused about?";
  const explanation = searchParams.get("explanation") || "";

  const shortConfusion = confusion.length > 120 ? confusion.slice(0, 120) + "..." : confusion;
  const shortExplanation = explanation.length > 180 ? explanation.slice(0, 180) + "..." : explanation;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: "linear-gradient(135deg, #FFFBF5 0%, #FFF3E8 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: "28px", fontWeight: 700 }}>
            <span style={{ color: "#1A1A1A" }}>Now</span>
            <span style={{ color: "#E8722A" }}>I</span>
            <span style={{ color: "#1A1A1A" }}>Get</span>
          </div>
          <div
            style={{
              display: "flex",
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

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1, justifyContent: "center", paddingTop: "20px", paddingBottom: "20px" }}>
          <div
            style={{
              fontSize: "38px",
              fontWeight: 800,
              color: "#1A1A1A",
              lineHeight: 1.3,
            }}
          >
            {`"${shortConfusion}"`}
          </div>
          {shortExplanation && (
            <div
              style={{
                fontSize: "20px",
                color: "#6B5B4E",
                lineHeight: 1.6,
              }}
            >
              {shortExplanation}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "18px", color: "#6B5B4E" }}>
            nowiget.vercel.app
          </div>
          <div
            style={{
              display: "flex",
              padding: "12px 28px",
              borderRadius: "12px",
              background: "#E8722A",
              color: "white",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Get Clarity
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
