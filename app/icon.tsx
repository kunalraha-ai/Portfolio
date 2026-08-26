import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: "#c69a5b",
        color: "#171109",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      KR
    </div>,
    size,
  );
}
