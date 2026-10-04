import { contactSchema, formatMessage, toFieldErrors } from "@/lib/contact-schema";

/**
 * Contact form endpoint.
 * Defences, cheapest first: same-origin check → body size cap → honeypot →
 * per-IP rate limit → schema validation → minimum fill time. Delivery goes through
 * Resend's REST API; without credentials it answers 503 and the client falls back
 * to a pre-filled email.
 */

const MAX_BODY = 20_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 2500;

// In-memory, so it is per server instance. Enough to stop casual abuse; swap for a
// shared store (e.g. Redis) if the site ever runs on many instances.
const hits = new Map<string, number[]>();

function allow(key: string, now: number): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return json({ ok: false, code: "forbidden" }, 403);
    } catch {
      return json({ ok: false, code: "forbidden" }, 403);
    }
  }

  // Refuse oversized bodies before reading them into memory, then check again in
  // case the header was missing or wrong.
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY) return json({ ok: false, code: "too_large" }, 413);
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ ok: false, code: "too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, code: "invalid_json" }, 400);
  }

  // Honeypot filled in: accept quietly so the bot learns nothing.
  if (typeof body === "object" && body !== null && "website" in body && (body as { website?: unknown }).website) {
    return json({ ok: true });
  }

  const now = Date.now();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  if (!allow(ip, now)) return json({ ok: false, code: "rate_limited" }, 429);

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, code: "invalid", errors: toFieldErrors(parsed.error) }, 400);

  // Submitted faster than a person can type: treat as a bot, again without saying so.
  if (now - parsed.data.startedAt < MIN_FILL_MS) return json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return json({ ok: false, code: "not_configured" }, 503);

  const { subject, body: text } = formatMessage(parsed.data);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: parsed.data.email, subject: `[Portfolio] ${subject}`, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("contact: delivery failed", res.status, await res.text().catch(() => ""));
      return json({ ok: false, code: "send_failed" }, 502);
    }
  } catch (error) {
    console.error("contact: delivery error", error);
    return json({ ok: false, code: "send_failed" }, 502);
  }

  return json({ ok: true });
}
