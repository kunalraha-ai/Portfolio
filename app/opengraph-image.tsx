import { ImageResponse } from "next/og";

export const alt = "Kunal Raha, AI Systems Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#070a0d",
        color: "#f1ede3",
        padding: "72px",
        border: "1px solid #302b24",
      }}
    >
      <div style={{ display: "flex", color: "#c69a5b", fontSize: 24, letterSpacing: 5 }}>
        KUNAL RAHA
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", fontSize: 78, lineHeight: 1.05, maxWidth: 950 }}>
          Autonomous systems, built for the real world.
        </div>
        <div style={{ display: "flex", color: "#a7aaa7", fontSize: 27 }}>
          AI systems engineer and builder of OmniProcure
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#777b78", fontSize: 20 }}>
        <span>Python / Golang / React</span>
        <span>github.com/kunalraha-ai</span>
      </div>
    </div>,
    size,
  );
}
