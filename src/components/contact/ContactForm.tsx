"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Segmented } from "@/components/ui/Segmented";
import { Icon } from "@/components/ui/Icon";
import {
  contactSchema,
  formatMessage,
  intentLabels,
  intents,
  projectTypes,
  timelines,
  toFieldErrors,
  type ContactInput,
  type FieldErrors,
  type Intent,
} from "@/lib/contact-schema";
import { cn } from "@/lib/cn";

type Values = {
  name: string;
  email: string;
  company: string;
  role: string;
  projectType: string;
  timeline: string;
  message: string;
  website: string;
};

type FieldName = keyof Values;

const empty: Values = {
  name: "",
  email: "",
  company: "",
  role: "",
  projectType: "",
  timeline: "",
  message: "",
  website: "",
};

const DRAFT_KEY = "contact-draft";

/** Which fields each reason for writing needs, in order. */
const fieldsFor: Record<Intent, FieldName[]> = {
  hiring: ["name", "email", "company", "role", "message"],
  project: ["name", "email", "company", "projectType", "timeline", "message"],
  other: ["name", "email", "message"],
};

const copy: Record<Intent, { message: string; messageHint: string; email: string; company: string; companyOptional: boolean }> = {
  hiring: {
    message: "About the role",
    messageHint: "Team, stack, location or remote, and anything else that helps.",
    email: "Work email",
    company: "Company",
    companyOptional: false,
  },
  project: {
    message: "What do you want to build?",
    messageHint: "What it should do, who it's for, and anything that already exists.",
    email: "Email",
    company: "Company",
    companyOptional: true,
  },
  other: {
    message: "Message",
    messageHint: "",
    email: "Email",
    company: "Company",
    companyOptional: true,
  },
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent"; email: string }
  | { kind: "fallback"; mailto: string }
  | { kind: "error"; message: string; mailto?: string };

export function ContactForm({ initialIntent, email }: { initialIntent: Intent; email: string }) {
  const [intent, setIntent] = useState<Intent>(initialIntent);
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const restored = useRef(false);

  // Start the bot timer and restore an unsent draft from this tab.
  useEffect(() => {
    startedAt.current = Date.now();
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Partial<Values>;
        // sessionStorage only exists in the browser, so the draft can only be applied after
        // hydration; reading it during render would make server and client markup disagree.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValues((v) => ({ ...v, ...draft, website: "" }));
      }
    } catch {
      /* no storage, no draft */
    }
    restored.current = true;
  }, []);

  // Keep the draft as the visitor types, so navigating away doesn't lose it.
  useEffect(() => {
    if (!restored.current) return;
    try {
      const { website: _honeypot, ...draft } = values;
      void _honeypot;
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [values]);

  // The submit button disappears on success, so hand focus to the confirmation.
  useEffect(() => {
    if (status.kind === "sent") sentRef.current?.focus();
  }, [status.kind]);

  const fields = fieldsFor[intent];
  const text = copy[intent];

  function payload(v: Values = values): ContactInput {
    const pick = (name: FieldName) => (fields.includes(name) ? v[name] : "");
    return {
      intent,
      name: v.name,
      email: v.email,
      company: pick("company") || undefined,
      role: pick("role") || undefined,
      projectType: (pick("projectType") || undefined) as ContactInput["projectType"],
      timeline: (pick("timeline") || undefined) as ContactInput["timeline"],
      message: v.message,
      website: v.website || undefined,
      startedAt: startedAt.current,
    };
  }

  function errorFor(name: FieldName, v: Values) {
    const result = contactSchema.safeParse(payload(v));
    return result.success ? undefined : toFieldErrors(result.error)[name as keyof FieldErrors];
  }

  function update(name: FieldName, value: string) {
    const next = { ...values, [name]: value };
    setValues(next);
    // Clear an error the moment the input becomes valid; never add one while typing.
    if (errors[name as keyof FieldErrors] && !errorFor(name, next)) {
      setErrors((e) => ({ ...e, [name]: undefined }));
    }
  }

  function blur(name: FieldName) {
    if (!values[name]) return; // don't scold an untouched, empty field
    setErrors((e) => ({ ...e, [name]: errorFor(name, values) }));
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = contactSchema.safeParse(payload());
    if (!result.success) {
      const all = toFieldErrors(result.error);
      setErrors(all);
      const first = fields.find((f) => all[f as keyof FieldErrors]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const { subject, body } = formatMessage(result.data);
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus({ kind: "submitting" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const data = (await res.json().catch(() => ({}))) as { code?: string; errors?: FieldErrors };

      if (res.ok) {
        setStatus({ kind: "sent", email: result.data.email });
        setValues(empty);
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
        return;
      }
      if (res.status === 503 && data.code === "not_configured") {
        setStatus({ kind: "fallback", mailto });
        return;
      }
      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setStatus({ kind: "idle" });
        return;
      }
      if (res.status === 429) {
        setStatus({
          kind: "error",
          message: "Several messages were just sent from this connection. Wait a few minutes, or send it by email instead.",
          mailto,
        });
        return;
      }
      setStatus({ kind: "error", message: "The message didn't go through. Your text is still here.", mailto });
    } catch {
      setStatus({
        kind: "error",
        message: "Couldn't reach the server. Check your connection and try again; your text is still here.",
        mailto,
      });
    }
  }

  if (status.kind === "sent") {
    return (
      <div ref={sentRef} tabIndex={-1} className="panel p-6 outline-none sm:p-8" role="status">
        <span className="grid size-10 place-items-center rounded-full bg-pass-soft text-pass">
          <Icon name="check" size={20} />
        </span>
        <h2 className="mt-5 text-h3">Message sent</h2>
        <p className="mt-2 text-ink-2">
          Thanks. I&rsquo;ll reply to <span className="font-medium text-ink">{status.email}</span>.
        </p>
        <button type="button" className="btn btn-secondary mt-6" onClick={() => setStatus({ kind: "idle" })}>
          Write another message
        </button>
      </div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form ref={formRef} noValidate onSubmit={submit} className="panel p-5 sm:p-8" aria-describedby="form-note">
      <Segmented
        legend="What's this about?"
        legendVisible
        options={intents.map((i) => ({ value: i, label: intentLabels[i] }))}
        value={intent}
        onChange={(i) => {
          setIntent(i);
          setErrors({});
        }}
      />

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" error={errors.name}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            className="field-control"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => blur("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            required
          />
        </Field>
        <Field label={text.email} name="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="field-control"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => blur("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
        </Field>

        {fields.includes("company") && (
          <Field label={text.company} optional={text.companyOptional} name="company" error={errors.company}>
            <input
              id="company"
              name="company"
              autoComplete="organization"
              className="field-control"
              value={values.company}
              onChange={(e) => update("company", e.target.value)}
              onBlur={() => blur("company")}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? "company-error" : undefined}
              required={!text.companyOptional}
            />
          </Field>
        )}
        {fields.includes("role") && (
          <Field label="Role" optional name="role" error={errors.role}>
            <input
              id="role"
              name="role"
              autoComplete="organization-title"
              placeholder="e.g. Backend engineer"
              className="field-control"
              value={values.role}
              onChange={(e) => update("role", e.target.value)}
              onBlur={() => blur("role")}
              aria-invalid={Boolean(errors.role)}
              aria-describedby={errors.role ? "role-error" : undefined}
            />
          </Field>
        )}
        {fields.includes("projectType") && (
          <Field label="Project type" name="projectType" error={errors.projectType}>
            <select
              id="projectType"
              name="projectType"
              className="field-control"
              value={values.projectType}
              onChange={(e) => update("projectType", e.target.value)}
              onBlur={() => blur("projectType")}
              aria-invalid={Boolean(errors.projectType)}
              aria-describedby={errors.projectType ? "projectType-error" : undefined}
              required
            >
              <option value="" disabled>
                Choose one
              </option>
              {projectTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        )}
        {fields.includes("timeline") && (
          <Field label="Timeline" name="timeline" error={errors.timeline}>
            <select
              id="timeline"
              name="timeline"
              className="field-control"
              value={values.timeline}
              onChange={(e) => update("timeline", e.target.value)}
              onBlur={() => blur("timeline")}
              aria-invalid={Boolean(errors.timeline)}
              aria-describedby={errors.timeline ? "timeline-error" : undefined}
              required
            >
              <option value="" disabled>
                Choose one
              </option>
              {timelines.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        )}

        <div className="sm:col-span-2">
          <Field label={text.message} hint={text.messageHint} name="message" error={errors.message}>
            <textarea
              id="message"
              name="message"
              rows={6}
              className="field-control min-h-36 resize-y"
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              onBlur={() => blur("message")}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={[text.messageHint && "message-hint", errors.message && "message-error"].filter(Boolean).join(" ") || undefined}
              required
            />
          </Field>
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive tech, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))}
        />
      </div>

      {(status.kind === "error" || status.kind === "fallback") && (
        <div
          role="alert"
          className={cn(
            "mt-6 rounded-lg px-4 py-3 text-small",
            status.kind === "error" ? "bg-flag-soft text-ink" : "bg-accent-soft text-ink",
          )}
        >
          {status.kind === "fallback" ? (
            <p>
              Your message is ready to go.{" "}
              <a href={status.mailto} className="link font-medium">
                Send it from your email app
              </a>
              ; everything you wrote is already filled in.
            </p>
          ) : (
            <p>
              {status.message}{" "}
              {status.mailto && (
                <a href={status.mailto} className="link font-medium">
                  Send it by email instead
                </a>
              )}
            </p>
          )}
        </div>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-note" className="text-micro text-ink-3">
          Your details are only used to reply to you.
        </p>
        <button type="submit" className="btn btn-primary min-w-40" disabled={submitting} aria-busy={submitting}>
          {submitting ? (
            <>
              <Icon name="spinner" size={16} className="animate-spin" />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  hint,
  optional,
  error,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}
        {optional && <span className="field-hint"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="field-hint -mt-1 mb-2">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${name}-error`} className="field-error flex items-start gap-1.5">
          <Icon name="alert" size={14} className="mt-[2px] shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
