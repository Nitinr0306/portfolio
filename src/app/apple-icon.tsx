import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the same three-station rail as the favicon and header mark. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#141a26",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: 40, right: 40, top: 88, height: 6, background: "#f5f6f8", display: "flex" }} />
        <div style={{ position: "absolute", left: 32, top: 77, width: 28, height: 28, borderRadius: 28, background: "#f5f6f8" }} />
        <div style={{ position: "absolute", left: 76, top: 77, width: 28, height: 28, borderRadius: 28, background: "#f5f6f8" }} />
        <div style={{ position: "absolute", left: 116, top: 71, width: 40, height: 40, borderRadius: 40, background: "#8e9dff" }} />
      </div>
    ),
    size,
  );
}
