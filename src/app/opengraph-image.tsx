import { ImageResponse } from "next/og";
import { lifecycle } from "@/content/lifecycle";
import { profile } from "@/content/profile";
import { site } from "@/lib/site";

export const alt = `${profile.name}: ${site.headline}`;
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
          background: "#f5f6f8",
          color: "#141a26",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 600 }}>
          <Mark />
          {profile.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 78, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02, maxWidth: 900 }}>
            {site.headline}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#475063" }}>
            {`${profile.positioning}. Java, Spring Boot, Next.js.`}
          </div>
        </div>
        <Rail />
      </div>
    ),
    size,
  );
}

function Mark() {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: "#141a26",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      <div style={{ width: 7, height: 7, borderRadius: 7, background: "#f5f6f8" }} />
      <div style={{ width: 7, height: 7, borderRadius: 7, background: "#f5f6f8" }} />
      <div style={{ width: 9, height: 9, borderRadius: 9, background: "#8e9dff" }} />
    </div>
  );
}

function Rail() {
  return (
    <div style={{ display: "flex", position: "relative", width: "100%" }}>
      <div
        style={{ position: "absolute", top: 7, left: 8, right: 150, height: 2, background: "#c5cbd6", display: "flex" }}
      />
      {lifecycle.map((stage, i) => (
        <div key={stage.id} style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 16,
              background: i === lifecycle.length - 1 ? "#2a3bd6" : "#f5f6f8",
              border: `2px solid ${i === lifecycle.length - 1 ? "#2a3bd6" : "#7e8697"}`,
            }}
          />
          <div style={{ fontSize: 20, color: "#475063" }}>{stage.verb}</div>
        </div>
      ))}
    </div>
  );
}
