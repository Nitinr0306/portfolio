import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { getProject, projects } from "@/content/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `Case study by ${profile.name}`;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function CaseStudyImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  const name = project?.name ?? profile.name;
  const kind = project?.kind ?? "Case study";
  const metrics = project?.metrics.slice(0, 3) ?? [];

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
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#475063" }}>
          <span>Case study</span>
          <span>{profile.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 30, color: "#5f687b" }}>{kind}</div>
          <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{name}</div>
        </div>
        <div style={{ display: "flex", gap: 56, borderTop: "2px solid #dce0e7", paddingTop: 28 }}>
          {metrics.map((m) => (
            <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 320 }}>
              <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: -2, color: "#2a3bd6" }}>{m.value}</span>
              <span style={{ fontSize: 22, color: "#475063" }}>{m.label}</span>
              {/* The qualifier travels with the number, always. */}
              {m.context && <span style={{ fontSize: 18, color: "#5f687b" }}>{m.context}</span>}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
