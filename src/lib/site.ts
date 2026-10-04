import { profile } from "@/content/profile";

/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL in production; on Vercel the production
 * domain is picked up automatically if it isn't set.
 */
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000")
).replace(/\/$/, "");

export const site = {
  title: `${profile.name}, backend-focused full-stack engineer`,
  description:
    "Dunna Nitin is a backend-focused full-stack engineer working in Java, Spring Boot and Next.js. Case studies, résumé and a way to start a project.",
  headline: "I build software from the schema to the deploy.",
};

export const nav = [
  { href: "/#work", label: "Work" },
  { href: "/build", label: "Build with me" },
  { href: "/resume", label: "Résumé" },
  { href: "/contact", label: "Contact" },
] as const;
