import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/build", "/resume", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const work = projects.map((p) => ({
    url: `${siteUrl}/work/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: p.tier === "flagship" ? 0.9 : 0.6,
  }));
  return [...pages, ...work];
}
