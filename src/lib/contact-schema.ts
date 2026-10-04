import { z } from "zod";

/**
 * One schema for the contact form, shared by the browser (instant feedback) and the
 * route handler (the check that actually counts).
 */

export const intents = ["hiring", "project", "other"] as const;
export type Intent = (typeof intents)[number];

export const intentLabels: Record<Intent, string> = {
  hiring: "Hiring for a role",
  project: "Building a product",
  other: "Something else",
};

export const projectTypes = [
  "Web application",
  "Backend and APIs",
  "SaaS platform",
  "Document or image processing",
  "Not sure yet",
] as const;

export const timelines = ["As soon as possible", "Within 1–3 months", "In 3+ months", "Flexible"] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .optional()
    .transform((v) => (v ? v : undefined));

export const contactSchema = z
  .object({
    intent: z.enum(intents),
    name: z
      .string()
      .trim()
      .min(2, "Enter your name.")
      .max(100, "Keep your name under 100 characters."),
    email: z
      .string()
      .trim()
      .max(200, "Keep the email under 200 characters.")
      .pipe(z.email("Enter an email address like name@company.com.")),
    company: optionalText(120),
    role: optionalText(120),
    projectType: z.enum(projectTypes).optional(),
    timeline: z.enum(timelines).optional(),
    message: z
      .string()
      .trim()
      .min(20, "Add a little more detail — at least 20 characters.")
      .max(5000, "Keep the message under 5,000 characters."),
    /** Honeypot. Real visitors never see this field. */
    website: z.string().max(0).optional(),
    /** Epoch ms when the form was first rendered; very fast submits are bots. */
    startedAt: z.number().int().nonnegative(),
  })
  .superRefine((data, ctx) => {
    if (data.intent === "hiring" && !data.company) {
      ctx.addIssue({ code: "custom", path: ["company"], message: "Enter the company you're hiring for." });
    }
    if (data.intent === "project") {
      if (!data.projectType) {
        ctx.addIssue({ code: "custom", path: ["projectType"], message: "Choose the closest project type." });
      }
      if (!data.timeline) {
        ctx.addIssue({ code: "custom", path: ["timeline"], message: "Choose a rough timeline." });
      }
    }
  });

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

/** Flatten zod issues to one message per field (the first one wins). */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ContactInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** Plain-text email body, also used for the mailto fallback. */
export function formatMessage(data: ContactData): { subject: string; body: string } {
  const lines = [
    `From: ${data.name} <${data.email}>`,
    `Reason: ${intentLabels[data.intent]}`,
    data.company && `Company: ${data.company}`,
    data.role && `Role: ${data.role}`,
    data.projectType && `Project type: ${data.projectType}`,
    data.timeline && `Timeline: ${data.timeline}`,
    "",
    data.message,
  ].filter((line): line is string => typeof line === "string");

  const subjectPrefix =
    data.intent === "hiring" ? `Role at ${data.company}` : data.intent === "project" ? "Project enquiry" : "Hello";

  return { subject: `${subjectPrefix} · ${data.name}`, body: lines.join("\n") };
}
