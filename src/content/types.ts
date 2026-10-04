/**
 * Content model. Everything the site claims lives in /src/content and is typed here,
 * so updating the portfolio means editing data, not components.
 *
 * Rule for editing: every statement must be backed by the résumé (or something you
 * can show). Optional fields exist so missing information is simply not rendered,
 * never filled with placeholders.
 */

export type ExternalLink = {
  label: string;
  href: string;
};

export type Metric = {
  value: string;
  label: string;
  /** Qualifier that keeps the number honest, e.g. "vs. a raw Tesseract baseline". */
  context?: string;
};

export type Feature = {
  title: string;
  body: string;
};

export type Decision = {
  title: string;
  body: string;
};

export type StackLayer = {
  layer: string;
  items: string[];
};

export type ProjectSlug = "medvision-ai" | "managio" | "dice-tournament";

export type Project = {
  slug: ProjectSlug;
  name: string;
  /** What kind of product this is, in plain words. */
  kind: string;
  period: string;
  ongoing?: boolean;
  /** Flagship projects get the full case-study treatment on the home page. */
  tier: "flagship" | "foundation";
  /** One sentence. Used in meta descriptions, social cards and the case-study header. */
  summary: string;
  /** One short line each, for the home page: problem, approach, outcome. */
  brief: { problem: string; approach: string; outcome: string };
  /** Full versions for the case study. */
  problem: string;
  approach: string;
  metrics: Metric[];
  /** What I was responsible for, taken from the résumé's own verbs. */
  ownership: string[];
  features: Feature[];
  decisions: Decision[];
  stack: StackLayer[];
  /** Short bullets for the résumé view. */
  resumeBullets: string[];
  repo: string;
  /** Add when a public deployment exists. */
  liveUrl?: string;
  /** Prompt used in the "build something like this" call to action. */
  similarWork: string;
};

export type LifecycleStage = {
  id: string;
  verb: string;
  tools: string[];
  proof: { project: ProjectSlug; note: string; anchor?: string }[];
};
