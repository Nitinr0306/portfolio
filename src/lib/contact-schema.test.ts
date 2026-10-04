import { describe, expect, it } from "vitest";
import { contactSchema, formatMessage, toFieldErrors } from "./contact-schema";

const base = {
  name: "Asha Rao",
  email: "asha@example.com",
  message: "We are hiring a backend engineer for our payments team.",
  startedAt: 1,
};

describe("contact schema", () => {
  it("accepts a complete hiring enquiry", () => {
    const r = contactSchema.safeParse({ ...base, intent: "hiring", company: "Acme" });
    expect(r.success).toBe(true);
  });

  it("requires a company for hiring enquiries", () => {
    const r = contactSchema.safeParse({ ...base, intent: "hiring" });
    expect(r.success).toBe(false);
    if (!r.success) expect(toFieldErrors(r.error).company).toMatch(/company/i);
  });

  it("requires project type and timeline for project enquiries", () => {
    const r = contactSchema.safeParse({ ...base, intent: "project" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = toFieldErrors(r.error);
      expect(errors.projectType).toBeDefined();
      expect(errors.timeline).toBeDefined();
    }
  });

  it("rejects malformed email and too-short messages", () => {
    const r = contactSchema.safeParse({ ...base, intent: "other", email: "nope", message: "hi" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = toFieldErrors(r.error);
      expect(errors.email).toBeDefined();
      expect(errors.message).toBeDefined();
    }
  });

  it("normalises empty optional fields to undefined", () => {
    const r = contactSchema.parse({ ...base, intent: "other", company: "  ", role: "" });
    expect(r.company).toBeUndefined();
    expect(r.role).toBeUndefined();
  });

  it("formats a readable email", () => {
    const data = contactSchema.parse({
      ...base,
      intent: "project",
      projectType: "SaaS platform",
      timeline: "Flexible",
    });
    const { subject, body } = formatMessage(data);
    expect(subject).toContain("Project enquiry");
    expect(body).toContain("Project type: SaaS platform");
    expect(body).toContain(base.message);
  });
});
