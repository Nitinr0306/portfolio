"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/Segmented";
import { Icon } from "@/components/ui/Icon";
import { useStepper } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const layers = [
  { name: "Rate limiting", detail: "Caps how often a client can call the API.", security: true },
  { name: "Authentication", detail: "JWT access token checked; refresh tokens rotate; lockout after failed logins.", security: true },
  { name: "Authorisation", detail: "Checked against the staff role's permission controls (6 roles, 30 controls).", security: true },
  { name: "Validation", detail: "Standardised request validation and exception handling.", security: false },
  { name: "Controller and service", detail: "1 of 14 controllers, then the business module that owns the rule.", security: false },
  { name: "Data", detail: "PostgreSQL, with the schema versioned by Flyway; Redis alongside.", security: false },
] as const;

type ScenarioId = "ok" | "limit" | "expired" | "permission" | "invalid" | "lockout";

const scenarios: Record<ScenarioId, { label: string; stopAt: number | null; verdict: string }> = {
  ok: {
    label: "Allowed request",
    stopAt: null,
    verdict:
      "A staff member whose role includes the permission updates a membership. Every layer passes and the change is written to PostgreSQL.",
  },
  limit: {
    label: "Too many requests",
    stopAt: 0,
    verdict: "The client has called too often, so rate limiting turns the request away and nothing behind it runs.",
  },
  expired: {
    label: "Expired access token",
    stopAt: 1,
    verdict:
      "The access token has expired. The client presents its refresh token, rotation issues a new token pair and retires the old refresh token, and the request can be retried.",
  },
  permission: {
    label: "Missing permission",
    stopAt: 2,
    verdict:
      "The user is signed in, but their staff role doesn't have the permission control this action needs, so the request stops at authorisation.",
  },
  invalid: {
    label: "Invalid input",
    stopAt: 3,
    verdict: "The payload fails validation and is handled by the API's standardised validation and exception handling.",
  },
  lockout: {
    label: "Repeated failed logins",
    stopAt: 1,
    verdict:
      "Sign-in keeps failing, so the account locks automatically after repeated attempts. This blunts password guessing.",
  },
};

const options = (Object.keys(scenarios) as ScenarioId[]).map((id) => ({ value: id, label: scenarios[id].label }));

export function ManagioRequestExplorer() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("ok");
  const { position, running, run } = useStepper(360);
  const scenario = scenarios[scenarioId];
  const stopIdx = scenario.stopAt ?? Number.POSITIVE_INFINITY;
  const last = Math.min(stopIdx, layers.length - 1);
  const complete = position > last;

  function statusOf(i: number) {
    if (i > stopIdx) return position > stopIdx ? "skip" : "waiting";
    if (i < position) return i === stopIdx ? "flag" : "pass";
    if (i === position) return "active";
    return "waiting";
  }

  function choose(id: ScenarioId) {
    setScenarioId(id);
    run(Math.min(scenarios[id].stopAt ?? Number.POSITIVE_INFINITY, layers.length - 1));
  }

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <Segmented legend="Choose a request" options={options} value={scenarioId} onChange={choose} />
        <button type="button" className="btn btn-quiet self-start" onClick={() => run(last)} disabled={running}>
          Replay
        </button>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8">
        <ol className="space-y-1.5" aria-label="Layers, outermost first">
          {layers.map((l, i) => {
            const status = statusOf(i);
            return (
              <li
                key={l.name}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-3.5 py-3 transition-[background-color,border-color,opacity] duration-200",
                  status === "pass" && "border-line bg-paper",
                  status === "flag" && "border-flag bg-flag-soft",
                  status === "active" && "border-accent bg-accent-soft",
                  status === "waiting" && "border-line bg-paper",
                  status === "skip" && "border-dashed border-line opacity-55",
                )}
                style={{ marginInline: `min(${i * 0.75}rem, ${i * 2}%)` }}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                    status === "pass" && "bg-pass text-paper",
                    status === "flag" && "bg-flag text-paper",
                    status === "active" && "bg-accent text-on-accent",
                    (status === "waiting" || status === "skip") && "border border-line-strong",
                  )}
                >
                  {status === "pass" && <Icon name="check" size={12} strokeWidth={2.4} />}
                  {status === "flag" && <Icon name="close" size={11} strokeWidth={2.4} />}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-small font-medium",
                      status === "flag" ? "text-flag" : l.security ? "text-accent" : "text-ink",
                    )}
                  >
                    {l.name}
                    <span className="sr-only">
                      {status === "pass" ? ": passed" : status === "flag" ? ": stopped here" : status === "skip" ? ": not reached" : ""}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-micro text-ink-2">{l.detail}</span>
                </span>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col justify-between gap-6 lg:border-l lg:border-line lg:pl-8">
          <div aria-live="polite">
            <p className="text-micro text-ink-3">Outcome</p>
            {complete ? (
              <>
                <p
                  className={cn(
                    "mt-1 text-h4 font-semibold tracking-[-0.015em]",
                    scenario.stopAt === null ? "text-pass" : "text-flag",
                  )}
                >
                  {scenario.stopAt === null ? "Request completed" : `Stopped at ${layers[scenario.stopAt]!.name.toLowerCase()}`}
                </p>
                <p className="mt-3 text-small text-ink-2">{scenario.verdict}</p>
              </>
            ) : (
              <p className="mt-1 text-small text-ink-2">Passing the request through each layer…</p>
            )}
          </div>
          <p className="text-micro text-ink-3">
            Simplified view of the request path. Accent marks the security layers.
          </p>
        </div>
      </div>
    </div>
  );
}
