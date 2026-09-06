import { ImageResponse } from "next/og";

export const alt = "F.F Real Estate Builder & Developers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#111113";
const GOLD = "#C7A253";
const IVORY = "#F5F1E8";

/** Geometric "F" built from three bars — mirrors `src/components/ui/Logo.tsx`. */
function FBar({ left }: { left: number }) {
  return (
    <div style={{ position: "absolute", left, top: 0, display: "flex" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 12,
          height: 84,
          background: GOLD,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 40,
          height: 12,
          background: GOLD,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 36,
          width: 30,
          height: 12,
          background: GOLD,
        }}
      />
    </div>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "72px 80px",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {/* Monogram in a thin ring */}
        <div
          style={{
            width: 132,
            height: 132,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: `2px solid ${GOLD}`,
          }}
        >
          <div style={{ position: "relative", width: 92, height: 84, display: "flex" }}>
            <FBar left={0} />
            <FBar left={52} />
          </div>
        </div>

        {/* Wordmark */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.05,
              color: IVORY,
              letterSpacing: "-0.01em",
            }}
          >
            F.F Real Estate
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 24,
              letterSpacing: "0.32em",
              color: GOLD,
              fontFamily: "Arial, sans-serif",
            }}
          >
            BUILDER &amp; DEVELOPERS
          </div>
          <div
            style={{
              marginTop: 40,
              width: 96,
              height: 2,
              background: GOLD,
            }}
          />
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              color: "rgba(245,241,232,0.72)",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Property in F.B Area, Dastagir &amp; across Karachi
          </div>
        </div>
      </div>
    ),
    size,
  );
}
